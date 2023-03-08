/**
 *
 * @file fn-utils
 *
 * Defines functional utility functions
 *
 */

export function filterObjKeys(obj, predicate) {
    if (typeof obj !== 'object') {
        throw new TypeError('Expected obj to be object');
    }

    const result = {};
    
    Object.keys(obj)
        .filter(predicate)
        .forEach(k => {
            result[k] = obj[k];
        });
    
    return result;
}

export function splitObj(obj, keyPredicate) {
    const negPred = k => !keyPredicate(k);

    return [filterObjKeys(obj, keyPredicate), filterObjKeys(obj, negPred)];
}

export function applyObjValues(obj, fn) {
    Object.values(obj).forEach(fn);
}

export function applyObjValuesByPred(obj, keyPredicate, applyFns) {
    splitObj(obj, keyPredicate)
        .forEach((objSplit, splitId) => {
            applyObjValues(objSplit, applyFns[splitId]);
        });
}

