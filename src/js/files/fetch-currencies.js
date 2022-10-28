import $ from "jquery";
import { throwIfNotANumber, throwIfNotAString } from "./exchanger/model/util.js";

import { currencyFactors } from "../config/currencies.js";

/**
 * An array containing cryptocurrency info
 * 
 * **id** - currency identifier
 * 
 * **name** - human-readable currency name
 * 
 * **short** - short currency name
 */
export const cryptocurrencies = [
  { id: "bitcoin", name: "Bitcoin", short: "BTC" },
  { id: "ethereum", name: "Ethereum", short: "ETH" },
  { id: "binancecoin", name: "Binance coin", short: "BNB" },
  { id: "solana", name: "Solana", short: "SOL" },
  { id: "atomic-token", name: "Atom", short: "ATOM" },
  { id: "terra-luna", name: "Terra luna", short: "LUNC" },
  { id: "polkadot", name: "Polkadot", short: "DOT" },
  { id: "matic-network", name: "Matic", short: "MATIC" },
  { id: "near", name: "Near", short: "NEAR" },
  { id: "cardano", name: "Cardano", short: "ADA" },
  { id: "ethereum-classic", name: "Ethereum Classic", short: "ETC" },
  { id: "1tronic", name: "Tronix", short: "TRX" },
  { id: "doge-token", name: "Doge Token", short: "DOGE" },
  { id: "litentry", name: "Litentry", short: "LIT" },
  { id: "trust-wallet-token", name: "Trust Wallet Token", short: "TWT" },
  { id: "shiba-inu", name: "Shiba Inu", short: "SHIB" },
  { id: "avalanche-2", name: "Avalanche", short: "AVA" },
  { id: "pancakeswap-token", name: "Pancake Swap", short: "CAKE" },
];

const idsParam = "ids=" + cryptocurrencies.map(c => c.id).join(",");
const vsCurrenciesParam = "vs_currencies=usd";

const url = `https://api.coingecko.com/api/v3/simple/price?${idsParam}&${vsCurrenciesParam}`;

export const settings = {
   "async": true,
   "scrossDomain": true,
   "url": url,
   "method": "GET",
   "headers": {}
}

/**
 * Finds a factor for cryptocurrency to control its price.
 * @param {{ id: string }} crypto A cryptocurrency object with defined id.
 * @returns A non-negative number.
 */
export function findCurrencyFactor(crypto) {
  if (typeof crypto !== 'object') {
    throw new TypeError(`Expected crypto to be an object. Got ${typeof crypto}`);
  }

  if (!('id' in crypto)) {
    throw new TypeError('Expected crypto.id to be defined');
  }

  throwIfNotAString(crypto.id);
  
  const factorObj = currencyFactors.filter(c => c.id === crypto.id)[0];

  if (typeof factorObj === 'object' &&
            'factor' in factorObj &&
            typeof factorObj.factor === 'number') {

    const { factor } = factorObj;

    if (factor < 0) {
      throw new Error(`Expected factor to be non-negative. Got factor ${factor} for cryptoId ${crypto.id}`);
    }

    return factor;
  }

  return 1;
}

/**
 * Loads the cryptocurrency data from API.
 * @returns A Promise containing either an **Array** of currency data or **string** with error.
 */
export async function loadCryptos() {
  return new Promise((res, rej) => {

    $.ajax(settings).done(response => {
      // Resolve Promise with result
      res(cryptocurrencies.map(crypto => {
        const { usd } = response[crypto.id];

        throwIfNotANumber(usd);

        const price = usd * findCurrencyFactor(crypto);

        throwIfNotANumber(price);

        return {
          ...crypto,
          price,
        };
      }));
    })
    .fail(xhr => {

      // Reject if request failed.
      rej(`Failed to load cryptocurrencies. Status: ${xhr.status} - ${xhr.statusText}`);
    });
  });
}

/**
 * Formats a number to fixed precision if needed.
 * 
 * Precision is `8` digits after period. And is applied to `x < 1e-4`
 * 
 * @param {number | string} x A number to format. Can be either number of string.
 * @returns A **string** containing formatted number.
 */
export function preCheck(x) {
  if (typeof x === 'string' || x instanceof String) {
    x = parseFloat(x);
  }

  if (x < 1e-4) return x.toFixed(8);
  
  return x.toString();
}