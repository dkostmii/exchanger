import { loadCryptos } from "../fetch-currencies.js";
import { minAmountUsdt, usdt } from './model/usdt.js';

import storageConfig from "../storageConfig.js";

import { exFormId } from "./views/util.js";

import { throwIfNotACurrency, createCurrencyPairs } from "./model/util.js";

// Models
import CurrencyModel from './model/currency.js';
import YouSendReceiveModel from './model/send-receive.js';
import YouSendModel from './model/you-send.js';
import YouReceiveModel from "./model/you-receive.js";

// Views
import CurrencyView from './views/currency.js';


export async function exchangerPageLoad() {
  const cryptos = await loadCryptos();

  if (!Array.isArray(cryptos)) {
    throw new Error('Unable to load cryptocurrencies.');
  }

  cryptos.push(usdt);

  const { localStorage } = window;

  const { sendCrypto: sendCryptoKey, receiveCrypto: receiveCryptoKey } = storageConfig.tokenNames;

  const requestedCryptos = {
    sendCryptoId: localStorage.getItem(sendCryptoKey),
    receiveCryptoId: localStorage.getItem(receiveCryptoKey)
  };

  let sendCrypto = cryptos.filter(c => c.id === usdt.id)[0];
  let receiveCrypto = cryptos.filter(c => c.id === 'bitcoin')[0];

  if (requestedCryptos.sendCryptoId !== null) {
    sendCrypto = cryptos.filter(c => c.id === requestedCryptos.sendCryptoId)[0];
    receiveCrypto = cryptos.filter(c => c.id === usdt.id)[0];
  }

  if (requestedCryptos.receiveCryptoId !== null) {
    receiveCrypto = cryptos.filter(c => c.id === requestedCryptos.receiveCryptoId)[0];
    sendCrypto = cryptos.filter(c => c.id === usdt.id)[0];
  }

  if (requestedCryptos.sendCryptoId !== null && requestedCryptos.sendCryptoId === requestedCryptos.receiveCryptoId) {
    if (receiveCrypto.sendCryptoId === usdt.id) {
      sendCrypto = cryptos.filter(c => c.id === usdt.id)[0];
      receiveCrypto = cryptos.filter(c => c.id === 'bitcoin')[0];
    }

    receiveCrypto = cryptos.filter(c => c.id === requestedCryptos.sendCryptoId)[0];
    sendCrypto = cryptos.filter(c => c.id === usdt.id)[0];
  }

  localStorage.removeItem(sendCryptoKey);
  localStorage.removeItem(receiveCryptoKey);

  throwIfNotACurrency(sendCrypto);
  throwIfNotACurrency(receiveCrypto);

  const youSendModel = new YouSendModel(sendCrypto, minAmountUsdt / sendCrypto.price, cryptos);

  const receiveAmount = youSendModel.amount * youSendModel.currency.price / receiveCrypto.price;

  const youReceiveModel = new YouReceiveModel(
    receiveCrypto,
    receiveAmount,
    cryptos
  );

  const youSendReceiveModel = new YouSendReceiveModel(youSendModel, youReceiveModel, cryptos);

  const currencyModel = new CurrencyModel(
    [sendCrypto, receiveCrypto],
    youSendReceiveModel, createCurrencyPairs(cryptos));

  const formElement = document.querySelector(exFormId);

  new CurrencyView(currencyModel, formElement);
}
