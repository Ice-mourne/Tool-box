"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleIDB = exports.persistentFetch = exports.customJsonStringify = exports.numArrToString = exports.numStringToArr = exports.cleanObject = void 0;
const lodash_1 = __importDefault(require("lodash"));
function cleanObject(dirtyObject, allowMutations = false) {
    const obj = allowMutations ? lodash_1.default.cloneDeep(dirtyObject) : dirtyObject;
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
            // Deleting properties from array makes them undefined this will remove undefined values from array
            if (Array.isArray(obj))
                obj = lodash_1.default.pull(obj, undefined);
        }
        return obj;
    };
    return remover(obj);
}
exports.cleanObject = cleanObject;
function numStringToArr(str) {
    return str.split(',').flatMap((num) => {
        const number = Number(num);
        if (number)
            return number;
        return [];
    });
}
exports.numStringToArr = numStringToArr;
function numArrToString(array) {
    if (array === undefined)
        return '';
    return array.join(', ');
}
exports.numArrToString = numArrToString;
function customJsonStringify(object, properties, spaces = 1) {
    const string = JSON.stringify(object, undefined, spaces);
    const regex = new RegExp(`"${properties.join('|')}"\\s*:\\s*\\[([^]+?)\\]`, 'g');
    const matches = string.match(regex); // /"(stat|multiplier|weaponTypes)": \[[^]+?\]/g
    if (matches === null)
        return string;
    const newString = matches.reduce((acc, match) => {
        acc = acc.replace(match, match.replaceAll('\n', '').replace(/  +/g, ' '));
        return acc;
    }, string);
    return newString;
}
exports.customJsonStringify = customJsonStringify;
async function persistentFetch(url, numberOfTries, data = undefined, r = 0) {
    const resp = await fetch(url, data);
    if (resp.status === 200)
        return resp.json();
    if (r >= numberOfTries)
        return;
    return persistentFetch(url, numberOfTries, data, r + 1);
}
exports.persistentFetch = persistentFetch;
async function simpleIDB(name, key, payload) {
    return await new Promise((resolve) => {
        const request = window.indexedDB.open(`${name}_db`);
        request.onerror = (e) => {
            console.error('IDB error');
            console.error(e);
        };
        request.onupgradeneeded = () => {
            const db = request.result;
            db.createObjectStore(`${name}_store`);
        };
        if (payload) {
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(`${name}_store`, 'readwrite');
                const store = transaction.objectStore(`${name}_store`);
                store.put(payload, key);
            };
        }
        else {
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(`${name}_store`, 'readwrite');
                const store = transaction.objectStore(`${name}_store`);
                const data = store.get(key);
                data.onsuccess = () => {
                    resolve(data.result);
                };
            };
        }
    });
}
exports.simpleIDB = simpleIDB;
