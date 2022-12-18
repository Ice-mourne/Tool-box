import _ from 'lodash'

export function cleanObject<T>(dirtyObject: object | Array<T>, allowMutations = false): T {
   const obj = allowMutations ? _.cloneDeep(dirtyObject) : dirtyObject
   const remover = (obj: any) => {
      for (const key in obj) {
         // Remove null, undefined, NaN from array
         if (Array.isArray(obj[key])) {
            obj[key] = _.pull(obj[key], undefined, null, NaN)
         }
         // remove null undefined
         if (_.isNil(obj[key])) delete obj[key]
         // Remove NaN values
         if (Number.isNaN(obj[key])) delete obj[key]
         // If values is not object continue
         if (!obj[key] || typeof obj[key] !== 'object') continue
         remover(obj[key])
         // Remove empty objects, arrays, maps and sets
         if (_.isEmpty(obj[key])) delete obj[key]
         // Deleting properties from array makes them undefined this will remove undefined values from array
         if (Array.isArray(obj)) obj = _.pull(obj, undefined)
      }
      return obj
   }
   return remover(obj)
}

export function numStringToArr(str: string): number[] {
   return str.split(',').flatMap((num) => {
      const number = Number(num)
      if (number) return number
      return []
   })
}

export function numArrToString(array: number[] | undefined): string {
   if (array === undefined) return ''
   return array.join(', ')
}

export function customJsonStringify(object: object, properties: string[], spaces = 1) {
   const string = JSON.stringify(object, undefined, spaces)
   const regex = new RegExp(`"${properties.join('|')}"\\s*:\\s*\\[([^]+?)\\]`, 'g')

   const matches = string.match(regex) // /"(stat|multiplier|weaponTypes)": \[[^]+?\]/g
   if (matches === null) return string

   const newString = matches.reduce((acc, match) => {
      acc = acc.replace(match, match.replaceAll('\n', '').replace(/  +/g, ' '))
      return acc
   }, string)

   return newString
}

export async function persistentFetch(
   url: RequestInfo | URL,
   numberOfTries: number,
   data: RequestInit | undefined = undefined,
   r: number = 0
): Promise<any> {
   const resp = await fetch(url, data)
   if (resp.status === 200) return resp.json()
   if (r >= numberOfTries) return
   return persistentFetch(url, numberOfTries, data, r + 1)
}

export async function simpleIDB(name: string, key: string, payload?: any) {
   return await new Promise((resolve) => {
      const request = window.indexedDB.open(`${name}_db`)

      request.onerror = (e) => {
         console.error('IDB error')
         console.error(e)
      }

      request.onupgradeneeded = () => {
         const db = request.result
         db.createObjectStore(`${name}_store`)
      }

      if (payload) {
         request.onsuccess = () => {
            const db = request.result
            const transaction = db.transaction(`${name}_store`, 'readwrite')
            const store = transaction.objectStore(`${name}_store`)
            store.put(payload, key)
         }
      } else {
         request.onsuccess = () => {
            const db = request.result
            const transaction = db.transaction(`${name}_store`, 'readwrite')
            const store = transaction.objectStore(`${name}_store`)
            const data = store.get(key)

            data.onsuccess = () => {
               resolve(data.result)
            }
         }
      }
   })
}
