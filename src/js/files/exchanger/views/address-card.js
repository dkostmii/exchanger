import SendReceiveModel from '../model/send-receive.js';
import { exFormId, ElementNotFoundError, enableElement, disableElement } from './util.js';
import { usdt } from '../../../config/usdt.js';
import { filterObjKeys, applyObjValuesByPred } from './fn-util.js';

class AddressCardView {
    constructor(sendReceiveModel, formElement) {
        if (!(sendReceiveModel instanceof SendReceiveModel)) {
            throw new TypeError('Expected sendReceiveModel to be SendReceiveModel');
        }

        this.model = sendReceiveModel;
        
        if (!(formElement instanceof Element)) {
            throw new ElementNotFoundError(exFormId);
        }
        
        this.wrapperElements = [
            "card",
            "address",
            "copy-address",
            "copy-ua-card",
            "copy-usd-card"
        ].reduce((accObj, className) => {
            const wrapperEl = formElement.querySelector(`.${className}`);

            if (!(wrapperEl instanceof Element)) {
                throw new ElementNotFoundError(`.${className}`);
            }
            
            accObj[className] = wrapperEl;

            return accObj;
        }, {});

        const copyTagStr = 'copy-';
        const switchElementsFns = [enableElement, disableElement];

        const { youSendModel, youReceiveModel } = sendReceiveModel; 

        let useCopyUaCard = false;

        const switchCopyCardAction = () => {
            useCopyUaCard = !useCopyUaCard;
        };

        const sendModelUpdateListener = currency => {
            const copyWrapperElements = filterObjKeys(this.wrapperElements, k => k.startsWith(copyTagStr));

            if (currency.id === usdt.id) {
                // Sending USDT via card number
                // Inject here element to select between UA and USD card

                const copyCardKey = useCopyUaCard ? 'copy-ua-card' : 'copy-usd-card';
                applyObjValuesByPred(copyWrapperElements, k => k === copyCardKey, switchElementsFns);
            } else {
                // Sending crypto via wallet address

                const copyAddressKey = 'copy-address';
                applyObjValuesByPred(copyWrapperElements, k => k === copyAddressKey, switchElementsFns);
            }
        };

        const receiveModelUpdateListener = currency => {
            const justWrapperElements = filterObjKeys(this.wrapperElements, k => !k.startsWith(copyTagStr));

            if (currency.id === usdt.id) {
                // Receiving USDT via card number

                const cardKey = 'card';

                applyObjValuesByPred(justWrapperElements, k => k === cardKey, switchElementsFns);

            } else {
                const addressKey = 'address';
                
                applyObjValuesByPred(justWrapperElements, k => k === addressKey, switchElementsFns);
            }
        };

        youSendModel.addEventListener("updateCurrency", sendModelUpdateListener);

        youReceiveModel.addEventListener("updateCurrency", receiveModelUpdateListener);

        const switchCopyCardElements = formElement.querySelectorAll('.field-wrapper > .field-label .link[data-action="switch-copy-card"]');

        [...switchCopyCardElements].forEach(el => {
            el.addEventListener('click', () => {
                switchCopyCardAction();
                sendModelUpdateListener(youSendModel.currency);
            });
        });

        sendModelUpdateListener(youSendModel.currency);
        receiveModelUpdateListener(youReceiveModel.currency);
    }
}

export default AddressCardView;
