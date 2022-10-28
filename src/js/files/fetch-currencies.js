import $ from "jquery";
import { throwIfNotANumber } from "./exchanger/model/util.js";

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

export async function loadCryptos() {
  return new Promise((res, rej) => {

    $.ajax(settings).done(response => {
      // Resolve Promise with result
      res(cryptocurrencies.map(crypto => {
        const { usd } = response[crypto.id];

        let price = usd;

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

export function preCheck(x) {
  if (typeof x === 'string' || x instanceof String) {
    x = parseFloat(x);
  }

  const preCheckLength = 8;

  if (x > 0 && (x < 1e-4 || x.toString().length > preCheckLength + 2)) return x.toFixed(preCheckLength);
  
  return x.toString();
}