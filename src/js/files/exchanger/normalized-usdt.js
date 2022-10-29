import { usdt } from '../../config/usdt.js';

/**
 * A currency object.
 * 
 * @typedef {Object} currency
 * @property {string} id A currency identifier
 * @property {string} name A human-readable currency name
 * @property {string} short A short currency name
 * @property {number} price A price of cryptocurrency in USD or USDT.
 */

/**
 * A normalized USDT currency object.
 * 
 * **Price should be strictly equal to 1. Do not change it!**
 * 
 * It is needed to keep `minAmountUsdt` unchanged, while changing the price in {@link usdt} object.
 * 
 * For example, if you do not use this object in exchanger, then for `minAmountUsdt = 150`,
 * 
 * exchanger will display 300 USDT, which is not true.
 * 
 * @constant normUsdt
 * @type {currency}
 */
const normUsdt = { ...usdt, price: 1 };

export default normUsdt;
