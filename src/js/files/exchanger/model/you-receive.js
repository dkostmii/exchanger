import {
  throwIfNotACurrency,
  throwIfNotArrayOfCurrencies,
  throwIfNotAFunction,
  throwIfNotANumber,
  throwIfNotAString,
  UnknownEventError
} from './util.js';

import { minAmountUsdt } from './usdt.js';

class YouReceive {
  constructor(currency, amount, allCurrencies) {
    throwIfNotACurrency(currency);
    throwIfNotANumber(amount);
    throwIfNotArrayOfCurrencies(allCurrencies);

    this.crypto = currency;
    this.value = amount * this.crypto.price;
    this.cryptos = allCurrencies;

    this.currencyUpdateListeners = [];
    this.amountUpdateListeners = [];
    this.allCurrenciesUpdateListeners = [];
  }

  addEventListener(event, callback) {
    throwIfNotAString(event);
    throwIfNotAFunction(callback);

    switch (event) {
      case 'updateCurrency':
        this.currencyUpdateListeners.push(callback);
        break;
      case 'updateAmount':
        this.amountUpdateListeners.push(callback);
        break;
      case 'updateAllCurrencies':
        this.allCurrenciesUpdateListeners.push(callback);
        break;
      default:
        throw new UnknownEventError(event);
    }
  }

  removeEventListener(event, callback) {
    throwIfNotAString(event);
    throwIfNotAFunction(callback);

    let targetArr = null;

    switch (event) {
      case 'updateCurrency':
        targetArr = this.currencyUpdateListeners;
        break;
      case 'updateAmount':
        targetArr = this.amountUpdateListeners;
        break;
      case 'updateAllCurrencies':
        targetArr = this.allCurrenciesUpdateListeners;
        break;
      default:
        throw new UnknownEventError(event);
    }

    if (!Array.isArray(targetArr)) {
      throw new Error('Unexpected error. No array of listeners matched.');
    }

    const idx = targetArr.indexOf(callback);

    if (idx === -1) {
      throw new Error('Model does not have provided listener added.');
    }

    targetArr.splice(idx, 1);
  }

  get currency() {
    return this.crypto;
  }

  get amount() {
    return this.value / this.currency.price;
  }

  get amountUsdt() {
    return this.value;
  }

  get minAmount() {
    return minAmountUsdt / this.currency.price;
  }

  get allCurrencies() {
    return this.cryptos.filter(c => c.id !== this.currency.id);
  }

  set currency(currency) {
    throwIfNotACurrency(currency);
    
    if (currency.id !== this.crypto.id) {
      this.crypto = currency;

      this.currencyUpdateListeners.forEach(callback => callback(this.crypto));
    }
  }

  set amount(amount) {
    throwIfNotANumber(amount);

    if (this.amount !== amount) {
      this.value = amount * this.currency.price;
      this.amountUpdateListeners.forEach(callback => callback({
        amount: this.amount,
        amountUsdt: this.amountUsdt,
      }));
    }
  }

  set amountUsdt(amountUsdt) {
    throwIfNotANumber(amountUsdt);

    if (this.amountUsdt !== amountUsdt) {
      this.value = amountUsdt;
      this.amountUpdateListeners.forEach(callback => callback({
        amount: this.amount,
        amountUsdt: this.amountUsdt,
      }));
    }
  }

  set allCurrencies(allCurrencies) {
    throwIfNotArrayOfCurrencies(allCurrencies);

    this.cryptos = allCurrencies;

    if (!this.cryptos.some(c => this.currency.id === c.id)) {
      // Fallback to default currency
      // if if current currency is not in the new array
      this.currency = this.cryptos[0];      
    }

    this.allCurrenciesUpdateListeners.forEach(callback => callback(this.cryptos));
  }
}

export default YouReceive;