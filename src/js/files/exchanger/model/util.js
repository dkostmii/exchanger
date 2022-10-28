/**
 * If true, assumes that empty array is not valid array for some type.
 * This might cause errors to be thrown (in throwIfNot() clauses).
 */
const requireNonEmptyArray = true;

function isCurrency(currency) {
  return (
    typeof currency === 'object' &&
    'id' in currency && typeof currency.id === 'string' &&
    'name' in currency && typeof currency.name === 'string' &&
    'short' in currency && typeof currency.short === 'string' &&
    'price' in currency && typeof currency.price === 'number' 
  );
}

function isArrayOfCurrencies(currencies) {
  if (requireNonEmptyArray) {
    return (
      Array.isArray(currencies) &&
      currencies.length > 0 &&
      currencies.every(c => isCurrency(c))
    );
  }

  return Array.isArray(currencies) && currencies.every(c => isCurrency(c));
}

function isArrayOfCurrencyPairs(currencyPairs) {
  if (requireNonEmptyArray) {
    return (
      Array.isArray(currencyPairs) &&
      currencyPairs.length > 0 &&
      currencyPairs.every(pair => isCurrencyPair(pair))
    );
  }

  return Array.isArray(currencyPairs) && currencyPairs.every(pair => isCurrencyPair(pair));
}

function isCurrencyPair(currencyPair) {
  return (
    isArrayOfCurrencies(currencyPair) &&
    currencyPair.length === 2
  );
}

function throwIfNot(obj, pred, message) {
  if (!(typeof message === 'string' || message instanceof String)) {
    throw new TypeError('Expected message to be string.');
  }

  if (!(pred instanceof Function)) {
    throw new TypeError('Expected pred to be a Function.');
  }

  if (pred(obj) !== true) {
    throw new Error(message);
  }
}

export function throwIfNotACurrency(currency) {
  throwIfNot(currency, isCurrency, 'Expected currency to be a currency.');
}

export function throwIfNotArrayOfCurrencies(currencies) {
  throwIfNot(
    currencies,
    arr => isArrayOfCurrencies(arr),
    'Expected currencies to be array of currencies.'
  );
}

export function throwIfNotPairOfCurrencies(currencyPair) {
  throwIfNot(
    currencyPair,
    arr => isCurrencyPair(arr),
    'Expected currencyPair to be a pair of currencies (length = 2).'
  );
}

export function throwIfNotArrayOfCurrencyPairs(currencyPairs) {
  throwIfNot(
    currencyPairs,
    arr => isArrayOfCurrencyPairs(arr),
    'Expected currencyPairs to be Array with currency pairs.'
  );
}

export function throwIfNotANumber(number) {
  throwIfNot(number,
    number => {
      return typeof number === 'number' && !Number.isNaN(number)
    }, `Expected number to be a number. Got: ${typeof number} with value ${number}`);
}

export function throwIfNotAString(string) {
  throwIfNot(string,
    string => {
      return typeof string === 'string' || string instanceof String
    }, 'Expected string to be a string.');
}

export function throwIfNotAFunction(fun) {
  throwIfNot(fun,
    f => f instanceof Function, 'Expected fun to be a Function.');
}

export class UnknownEventError extends TypeError {
  constructor(eventName) {
    super(`Unknown Event: ${eventName}`);
    this.name = 'Unknown Event Error';
  }
}

export function createCurrencyPairs(currencies) {
  throwIfNotArrayOfCurrencies(currencies);

  const pairsArr = [];

  for (let i = 0; i < currencies.length; i += 1) {
    for (let j = 0; j < currencies.length; j += 1) {
      if (currencies[i].id !== currencies[j].id) {
        pairsArr.push([ currencies[i], currencies[j] ]);
      }
    }
  }

  throwIfNotArrayOfCurrencyPairs(pairsArr);

  return pairsArr;
}