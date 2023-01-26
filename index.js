"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedObject = exports.fetchBungieManifest = exports.SimpleIndexedDB = exports.persistentFetch = exports.customJsonStringify = exports.numArrToString = exports.numStringToArr = exports.cleanObject = void 0;
const lodash_1 = __importDefault(require("lodash"));
/**
 ** Removes null, undefined, NaN, empty (objects, arrays, maps and or sets) from object or array
 ** Empty (...) means if any of specified in brackets is empty
 * @param { object | Array<T> } dirtyObject Object or Array to clean
 * @param { boolean } allowMutations Can object be mutated default false
 * @returns { T } Same object or array without null, undefined, NaN, empty (objects, arrays, maps and or sets)
 */
function cleanObject(dirtyObject, allowMutations = false) {
    const obj = allowMutations ? dirtyObject : lodash_1.default.cloneDeep(dirtyObject);
    const remover = (obj) => {
        for (const key in obj) {
            // Remove null, undefined, NaN from array
            if (Array.isArray(obj[key])) {
                obj[key] = lodash_1.default.pull(obj[key], undefined, null, NaN);
            }
            // remove null undefined
            if (lodash_1.default.isNil(obj[key]))
                delete obj[key];
            // Remove NaN values
            if (Number.isNaN(obj[key]))
                delete obj[key];
            // If values is not object continue
            if (!obj[key] || typeof obj[key] !== 'object')
                continue;
            remover(obj[key]);
            // Remove empty objects, arrays, maps and sets
            if (lodash_1.default.isEmpty(obj[key]))
                delete obj[key];
        }
        // Deleting properties from array makes them undefined this will remove undefined values from array
        if (Array.isArray(obj))
            return lodash_1.default.pull(obj, undefined);
        return obj;
    };
    return remover(obj);
}
exports.cleanObject = cleanObject;
/**
 * @param { string } str String with numbers separated by comma
 * @returns { number[] } Array of numbers
 */
function numStringToArr(str) {
    return str.split(',').flatMap((num) => {
        const number = Number(num);
        if (number)
            return number;
        return [];
    });
}
exports.numStringToArr = numStringToArr;
/**
 * @param { number[] } array Array of numbers
 * @returns { string } String with numbers separated by comma
 */
function numArrToString(array) {
    if (array === undefined)
        return '';
    return array.join(', ');
}
exports.numArrToString = numArrToString;
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
function customJsonStringify(object, properties, spaces = 1) {
    const string = JSON.stringify(object, undefined, spaces);
    const regex = new RegExp(`"(${properties.join('|')})"\\s*:\\s*\\[([^]+?)\\]`, 'g');
    const matches = string.match(regex);
    if (matches === null)
        return string;
    const newString = matches.reduce((acc, match) => {
        acc = acc.replace(match, match.replaceAll('\n', '').replace(/  +/g, ' '));
        return acc;
    }, string);
    return newString;
}
exports.customJsonStringify = customJsonStringify;
/**
 * @param { RequestInfo | URL } url URL to fetch
 * @param { number } numberOfTries Number of tries to fetch
 * @param { RequestInit } data Data to send
 * @returns { Promise<any> } Fetched data in JSON format
 * @error { error } If error it will return object with error property
 */
async function persistentFetch(url, numberOfTries, data = undefined) {
    try {
        const resp = await fetch(url, data);
        return resp.json();
    }
    catch (error) {
        if (numberOfTries === 0)
            return { error };
        return persistentFetch(url, numberOfTries - 1, data);
    }
}
exports.persistentFetch = persistentFetch;
/**
 * @param { string } name Name of the database
 * @param { string } key Key to store data under
 * @param payload Data to store
 * @returns Stored data
 */
class SimpleIndexedDB {
    dbName;
    storeName;
    constructor(dbName, storeName) {
        this.dbName = dbName;
        this.storeName = storeName;
    }
    async set(key, data) {
        const request = window.indexedDB.open(this.dbName);
        request.onupgradeneeded = () => {
            const db = request.result;
            db.createObjectStore(this.storeName);
        };
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            store.put(data, key);
        };
    }
    async get(key) {
        return new Promise((resolve) => {
            const request = window.indexedDB.open(this.dbName);
            let data;
            request.onupgradeneeded = () => {
                const db = request.result;
                db.createObjectStore(this.storeName);
            };
            request.onsuccess = async () => {
                const db = request.result;
                const transaction = db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                data = store.get(key);
                data.onsuccess = () => {
                    resolve(data.result);
                };
            };
        });
    }
    async delete() {
        const request = window.indexedDB.open(this.dbName);
        request.onsuccess = () => {
            const db = request.result;
            db.deleteObjectStore(this.storeName);
        };
    }
}
exports.SimpleIndexedDB = SimpleIndexedDB;
async function fetchBungieManifest(locations, language = 'en', useIndexedDB = false) {
    const json = await persistentFetch('https://www.bungie.net/Platform/Destiny2/Manifest/', 3);
    const manifest = json.Response.jsonWorldComponentContentPaths[language];
    const manifestVersion = json.Response.version;
    let bongoData = {};
    const fetchBongo = async (location) => {
        const fixedLocation = `Destiny${lodash_1.default.upperFirst(location)}Definition`;
        return persistentFetch(`https://www.bungie.net${manifest[fixedLocation]}?corsFix`, 3);
    };
    if (useIndexedDB) {
        const db = new SimpleIndexedDB('bungie', 'manifest');
        const cachedVersion = await db.get('version');
        if (cachedVersion === manifestVersion)
            db.delete();
        locations.forEach(async (location) => {
            const dbResponse = db.get(`${location}-${language}`);
            if (dbResponse) {
                bongoData[location] = dbResponse;
                return;
            }
            const response = fetchBongo(location);
            db.set(`${location}-${language}`, await response);
            bongoData[location] = response;
        });
    }
    else {
        locations.forEach((location) => {
            const response = fetchBongo(location);
            bongoData[location] = response;
        });
    }
    return Object.entries(bongoData).reduce(async (acc, [key, value]) => {
        acc[key] = await value;
        return acc;
    }, {});
}
exports.fetchBungieManifest = fetchBungieManifest;
class TypedObject {
    static entries(obj) {
        return Object.entries(obj);
    }
    static keys(obj) {
        return Object.keys(obj);
    }
}
exports.TypedObject = TypedObject;
