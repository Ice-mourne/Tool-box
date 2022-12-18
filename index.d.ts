/**
 ** Removes null, undefined, NaN, empty (objects, arrays, maps and or sets) from object or array
 ** Empty (...) means if any of specified in brackets is empty
 * @param dirtyObject Object or Array to clean
 * @param allowMutations Are you allow to mutate original object
 * @returns Same object or array without null, undefined, NaN, empty (objects, arrays, maps and or sets)
 */
export function cleanObject<T>(dirtyObject: object | Array<T>, allowMutations: boolean): T

/**
 * @param str String with numbers separated by comma
 * @returns Array of numbers
 */
export function numStringToArr(str: string): number[]

/**
 * @param array Array of numbers
 * @returns String with numbers separated by comma
 */
export function numArrToString(array: number[] | undefined): string

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
export function customJsonStringify(object: object, properties: string[], spaces?: number): string

/**
 * @param url URL to fetch
 * @param numberOfTries Number of tries to fetch
 * @param data Data to send
 * @param r Recursive variable
 * @returns Fetched data
 */
export function persistentFetch(url: RequestInfo | URL, numberOfTries: number, data?: RequestInit | undefined, r?: number): Promise<any>

/**
 * @param name Name of the database
 * @param key Key to store data under
 * @param payload Data to store
 * @returns Stored data
 */
export function simpleIDB(name: string, key: string, payload?: any): Promise<unknown>