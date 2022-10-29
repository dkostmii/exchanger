/**
 * An object containing factor of specified cryptocurrency price.
 * 
 * {@link currencyFactor.id} - currency identifier.
 * 
 * You can find this in `cryptocurrencies` array in `fetch-currencies.js` file.
 * 
 * {@link currencyFactor.factor } - a number which multiplies a price.
 * 
 * For example, `factor: 0.5` halves the price and `factor: 2` doubles.
 * 
 * **Must be non-negative.**
 * 
 * @typedef {{ id: string, factor: number }} currencyFactor
 */

/**
 * An array containing {@link currencyFactor cryptocurrency price factors}.
 * 
 * @constant currencyFactors
 * @type {currencyFactor[]}
 */
export const currencyFactors = [
  //{ id: 'bitcoin', factor: 0.2 }
];