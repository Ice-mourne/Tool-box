import { get, set } from 'idb-keyval'
import _ from 'lodash'
import { Bungie, Language, Manifest } from '../bungieTypes/manifest.js'
import { DeepReadonly } from '../types/deepReadonly.js'
import { persistentFetch } from './persistentFetch.js'

type Locations = keyof Manifest

export async function fetchBungieManifest<T extends keyof Manifest>(
  locations: T[],
  language: Language = 'en',
  useIndexedDB: boolean = false
): Promise<{ [key in keyof Pick<Required<DeepReadonly<Manifest>>, T>]: Manifest[key] }> {
  const json: Bungie = await persistentFetch('https://www.bungie.net/Platform/Destiny2/Manifest/', 3)
  const manifest = json.Response.jsonWorldComponentContentPaths[language]
  const manifestVersion = json.Response.version

  let bongoData = {} as { [key in Locations]: any }

  const fetchBongo = async (location: Locations) => {
    const fixedLocation = `Destiny${_.upperFirst(location)}Definition` as Locations
    return persistentFetch(`https://www.bungie.net${manifest[fixedLocation]}?corsFix`, 3)
  }

  if (useIndexedDB) {
    const cachedVersion = await get<string>('version')

    if (cachedVersion === undefined || cachedVersion !== manifestVersion) {
      locations.forEach(async (location) => {
        const response = fetchBongo(location)
        set(`${location}-${language}`, await response)
        bongoData[location] = response
      })
      set('version', manifestVersion)
      bongoData.version = manifestVersion
    } else {
      locations.forEach(async (location) => {
        const dbResponse = await get(`${location}-${language}`)
        if (dbResponse) {
          bongoData[location] = dbResponse
          return
        }
        const response = fetchBongo(location)
        set(`${location}-${language}`, await response)
        bongoData[location] = response
      })
      bongoData.version = cachedVersion
    }
  } else {
    locations.forEach((location) => {
      const response = fetchBongo(location)
      bongoData[location] = response
    })
  }

  const newBongoData = {} as Manifest

  for (const k in bongoData) {
    const key = k as Locations
    newBongoData[key] = await bongoData[key]
  }

  return newBongoData
}
