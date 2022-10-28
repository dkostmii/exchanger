/**
 * Contains tokenNames for browser's `localStorage`.
 * 
 * Those are used between redirection from **Home** page to **Exchanger** page
 * to select required cryptocurrency after clicking Change, Sell or Buy button.
 * 
 * See also `changeSellBuyToExchangeRedirect()` definition.
 */
const storageConfig = {
  tokenNames: {
    sendCrypto: 'sendCrypto',
    receiveCrypto: 'receiveCrypto',
  }
};

export default storageConfig;