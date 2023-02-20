type StringifyProperties = 'stat' | 'multiplier' | 'weaponTypes' | 'classNames'
/**
 ** Instead of regular stringify this one doesn't add new lines to specified arrays
 ** Basically normal stringify would make
 ** [
 **   1,
 **   2,
 **   3
 ** ]
 ** This will make
 ** [1, 2, 3]
 */
export function customJsonStringify(object: object, properties: StringifyProperties[] | string[], spaces = 1) {
  const string = JSON.stringify(object, undefined, spaces)
  const regex = new RegExp(`"(${properties.join('|')})"\\s*:\\s*\\[([^]+?)\\]`, 'g')

  const matches = string.match(regex)
  if (matches === null) return string

  const newString = matches.reduce((acc, match) => {
    acc = acc.replace(match, match.replaceAll('\n', '').replace(/  +/g, ' '))
    return acc
  }, string)

  return newString
}
