import {
  throwIfNotPairOfCurrencies,
  throwIfNotArrayOfCurrencyPairs,
  throwIfNotAFunction,
  throwIfNotAString,
  UnknownEventError,
  throwIfNotACurrency
} from './util.js';

import YouSendReceiveModel from './send-receive.js';

class Currency {
  constructor(currencyPair, youSendReceiveModel, allCurrencyPairs) {
    throwIfNotPairOfCurrencies(currencyPair);

    if (!(youSendReceiveModel instanceof YouSendReceiveModel)) {
      throw new TypeError('Expected youSendReceiveModel to be YouSendReceiveModel');
    }

    throwIfNotArrayOfCurrencyPairs(allCurrencyPairs);

    this.pair = currencyPair;
    this.youSendReceiveModel = youSendReceiveModel;
    this.cryptoPairs = allCurrencyPairs;

    this.currencyPairUpdateListeners = [];
    this.allCurrencyPairsUpdateListeners = [];

    // Init
    this.updateCurrencyPairDownstream();

    // Bind scope to listeners
    this.swapListener = this.swapListener.bind(this);
    this.youSendUpdateCurrencyListener = this.youSendUpdateCurrencyListener.bind(this);
    this.youReceiveUpdateCurrencyListener = this.youReceiveUpdateCurrencyListener.bind(this);

    // Update (from child models)

    this.youSendReceiveModel.addEventListener('swap', this.swapListener);

    this.attachListeners();
  }

  attachListeners() {
    this.youSendReceiveModel.youSendModel
      .addEventListener('updateCurrency', this.youSendUpdateCurrencyListener);

    this.youSendReceiveModel.youReceiveModel
      .addEventListener('updateCurrency', this.youReceiveUpdateCurrencyListener);
  }

  detachListeners() {
    this.youSendReceiveModel.youSendModel
      .removeEventListener('updateCurrency', this.youSendUpdateCurrencyListener);

    this.youSendReceiveModel.youReceiveModel
      .removeEventListener('updateCurrency', this.youReceiveUpdateCurrencyListener);
  }

  refreshListeners() {
    this.detachListeners();
    this.attachListeners();
  }

  // Listeners
  swapListener([sendCurrency, receiveCurrency]) {
    throwIfNotACurrency(sendCurrency);
    throwIfNotACurrency(receiveCurrency);

    this.detachListeners();

    this.currencyPair = [sendCurrency, receiveCurrency];

    throwIfNotPairOfCurrencies(this.currencyPair);

    this.attachListeners();
  }

  youSendUpdateCurrencyListener(currency) {
    throwIfNotACurrency(currency);

    const [_, receiveCurrency] = this.currencyPair;
    
    this.currencyPair = [currency, receiveCurrency];

    throwIfNotPairOfCurrencies(this.currencyPair);
  }

  youReceiveUpdateCurrencyListener(currency) {
    throwIfNotACurrency(currency);

    const [sendCurrency] = this.currencyPair;

    this.currencyPair = [sendCurrency, currency];

    throwIfNotPairOfCurrencies(this.currencyPair);
  }

  addEventListener(event, callback) {
    throwIfNotAString(event);
    throwIfNotAFunction(callback);

    switch (event) {
      case 'updateCurrencyPair':
        this.currencyPairUpdateListeners.push(callback);
        break;
      case 'updateAllCurrencyPairs':
        this.allCurrencyPairsUpdateListeners.push(callback);
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
      case 'updateCurrencyPair':
        targetArr = this.currencyPairUpdateListeners;
        break;
      case 'updateAllCurrencyPairs':
        targetArr = this.allCurrencyPairsUpdateListeners;
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

  /**
   * Updates currencies in all child models
   */
  updateCurrencyPairDownstream() {
    const [ sendCurrency, receiveCurrency ] = this.currencyPair;

    const youSendModel = this.youSendReceiveModel.youSendModel;
    const youReceiveModel = this.youSendReceiveModel.youReceiveModel;

    const [sendAmountUsdt, receiveAmountUsdt] = [
      youSendModel.amountUsdt,
      youReceiveModel.amountUsdt
    ];

    youSendModel.currency = sendCurrency;
    youReceiveModel.currency = receiveCurrency;

    youSendModel.amountUsdt = sendAmountUsdt;
    youReceiveModel.amountUsdt = receiveAmountUsdt;
  }

  get currencyPair() {
    return this.pair;
  }

  get allCurrencyPairs() {
    return this.cryptoPairs;
  }

  set currencyPair(currencyPair) {
    throwIfNotPairOfCurrencies(currencyPair);

    this.pair = currencyPair;
    this.updateCurrencyPairDownstream();
    this.currencyPairUpdateListeners.forEach(callback => callback(this.pair));
  }

  set allCurrencyPairs(allCurrencyPairs) {
    throwIfNotArrayOfCurrencyPairs(allCurrencyPairs);

    // Check for non-existing this.currencyPair here

    this.cryptoPairs = allCurrencyPairs;
    this.allCurrencyPairsUpdateListeners.forEach(callback => callback(this.cryptoPairs));
  }
}

export default Currency;