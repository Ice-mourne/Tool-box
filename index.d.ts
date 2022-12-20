import { Manifest } from './bungieInterfaces/manifest';
/**
 ** Removes null, undefined, NaN, empty (objects, arrays, maps and or sets) from object or array
 ** Empty (...) means if any of specified in brackets is empty
 * @param { object | Array<T> } dirtyObject Object or Array to clean
 * @param { boolean } allowMutations Are you allow to mutate original object
 * @returns { T } Same object or array without null, undefined, NaN, empty (objects, arrays, maps and or sets)
 */
export declare function cleanObject<T>(dirtyObject: object | Array<T>, allowMutations?: boolean): T;
/**
 * @param { string } str String with numbers separated by comma
 * @returns { number[] } Array of numbers
 */
export declare function numStringToArr(str: string): number[];
/**
 * @param { number[] } array Array of numbers
 * @returns { string } String with numbers separated by comma
 */
export declare function numArrToString(array: number[] | undefined): string;
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
export declare function customJsonStringify(object: object, properties: string[], spaces?: number): string;
/**
 * @param { RequestInfo | URL } url URL to fetch
 * @param { number } numberOfTries Number of tries to fetch
 * @param { RequestInit } data Data to send
 * @returns { Promise<any> } Fetched data in JSON format
 */
export declare function persistentFetch(url: RequestInfo | URL, numberOfTries: number, data?: RequestInit | undefined, r?: number): Promise<any>;
/**
 * @param { string } name Name of the database
 * @param { string } key Key to store data under
 * @param payload Data to store
 * @returns Stored data
 */
export declare function simpleIDB(name: string, key: string, payload?: any): Promise<unknown>;
type Locations = keyof Manifest;
export declare function fetchBungieManifest(locations: Locations[], language?: string): Promise<Manifest>;
export {};
