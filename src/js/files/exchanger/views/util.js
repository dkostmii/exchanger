import { throwIfNotACurrency, throwIfNotPairOfCurrencies, throwIfNotAString } from "../model/util.js";
import YouSendModel from '../model/you-send.js';
import YouReceiveModel from "../model/you-receive.js";

import { minAmountUsdt } from "../../../config/usdt.js";

import $ from 'jquery';

export const exFormId = '#ex-form';

export const separator = ' | ';

export function htmlEncode(text) {
  throwIfNotAString(text);

  return $('<div />').text(text).html();
}

export function htmlDecode(html) {
  throwIfNotAString(html);

  return $('<div />').html(html).text();
}

export function getCurrencyPairName(currencyPair) {
  throwIfNotPairOfCurrencies(currencyPair);

  const [sendCurrency, receiveCurrency] = currencyPair;

  return `${sendCurrency.name}${separator}${receiveCurrency.name}`;
}

export function getCurrencyAttention(currencyPair) {
  throwIfNotPairOfCurrencies(currencyPair);

  const [ sendCurrency, receiveCurrency ] = currencyPair;

  const { short: sendShort, price: sendPrice } = sendCurrency;
  const { short: receiveShort, price: receivePrice } = receiveCurrency;

  return `Minimum ${preCheckInput(minAmountUsdt / sendPrice)} ${sendShort} (${preCheckInput(minAmountUsdt / receivePrice)} ${receiveShort})`;
}

export function getFieldText(youSendModel, youReceiveModel) {
  if (!(youSendModel instanceof YouSendModel)) {
    throw new TypeError('Expected youSendModel to be YouSendModel.');
  }

  if (!(youReceiveModel instanceof YouReceiveModel)) {
    throw new TypeError('Expected youReceiveModel to be YouReceiveModel.');
  }
  
  const { currency: youSendCrypto, amount: youSendAmount } = youSendModel;
  const { currency: youReceiveCrypto, amount: youReceiveAmount } = youReceiveModel;

  return `Send <span >${preCheckInput(youSendAmount)} ${youSendCrypto.short}</span> to this address/card and we will send you <span>${preCheckInput(youReceiveAmount)} ${youReceiveCrypto.short}.</span> Then click the button <span>“I send”</span>`
}

export class ElementNotFoundError extends Error {
  constructor(elementName) {
    super(`Unable to locate ${elementName} element.`);
    this.name = 'Element Not Found Error';
  }
}

export function getCurrencyTitle(currency) {
  throwIfNotACurrency(currency);

  return `${currency.name}${separator}${currency.short}`;
}

export function getCurrencyResultValue(model) {
  if (!(model instanceof YouSendModel || model instanceof YouReceiveModel)) {
    throw new TypeError('Expected model to be either YouSendModel or YouReceiveModel.');
  }

  return `${preCheckInput(model.amount)}${separator}${model.currency.short}`;
}

function replaceMultipleOfCharWithFirst(text, char) {
  if (!(typeof text === 'string' || text instanceof String)) {
    throw new TypeError('Expected text to be a string.');
  }

  if (!(typeof char === 'string' || char instanceof String)) {
    throw new TypeError('Expected char to be a string.');
  }

  let count = 0;
  let result = [];

  for (let i = 0; i < text.length; i += 1) {
    if (text[i] === char) {
      count += 1;

      if (count === 1) {
        result.push(text[i]);
      }
    } else {
      result.push(text[i]);
    }
  }

  return result.join('');
}

export function sanitizeNumberInput(input) {
  if (!(input instanceof HTMLInputElement)) {
    throw new TypeError('Expected input to be HTMLInputElement');
  }

  if (input.type === 'number') {
    const comman = /,/g;
    const pattern = /[^0-9\.]/g;
  
    input.value = input.value.replace(comman, '.');
    input.value = input.value.replace(pattern, '');
    input.value = replaceMultipleOfCharWithFirst(input.value, '.');
  }
}

export function replaceTrailingPeriods(input) {
  if (!(input instanceof HTMLInputElement)) {
    throw new TypeError('Expected input to be HTMLInputElement');
  }

  if (input.type === 'number') {
    const leadingPeriod = /^\./g;
    input.value = input.value.replace(leadingPeriod, '0.');
  
    const trailingPeriod = /\.$/g;
    input.value = input.value.replace(trailingPeriod, '.0');
  }
}

export function emptyNumberInputCheck(input) {
  if (!(input instanceof HTMLInputElement)) {
    throw new TypeError('Expected input to be HTMLInputElement');
  }

  if (input.type === 'number') {
    input.type = 'text';

    if (input.value.length === 0) {
      input.value = '0';
    }
  
    input.type = 'number';
  }
}

/**
 * `preCheckInput()` function for the **Exchanger** views. Do not confuse with `preCheck()` from `fetch-currencies.js`, which is for **Popular currencies** section at **Home page**.
 * @param {Number | string} value A number to pre check before displaying.
 * @returns {string} A string containing formatted number.
 */
export function preCheckInput(x) {
  if (typeof x === 'string' || x instanceof String) {
    x = parseFloat(x);
  }

  const preCheckLength = 8;

  const whole = Math.floor(x);
  const fr = x - whole;
  x = fr + whole;

  if (x > 0 && (x.toString().length > preCheckLength + 1) || (whole === 0 && fr < 1e-4)) return x.toFixed(preCheckLength);

  return x.toString();
}