// Подключение функционала "Чертогов Фрилансера"
import {
   isMobile
} from "./functions.js";
// Подключение списка активных модулей
import {
   flsModules
} from "./modules.js";

import { ElementNotFoundError } from "./exchanger/views/util.js";

import { settings, cryptocurrencies as cryptos, preCheck } from './fetch-currencies.js';

import $ from "jquery";

import storageConfig from "./storageConfig.js";

const cryptocurrencies = document.getElementsByClassName("colum__price");

const cIds = cryptos.map(c => c.id);

// Integrity check
[...cryptocurrencies].forEach(cryptoEl => {
   if (!cIds.includes(cryptoEl.id)) {
      throw new Error(`Unknown cryptocurrency: ${cryptoEl.id}. Add it to cryptocurrencies array in fetch-currencies.js.`);
   }
});

$.ajax(settings).done(function (response) {
   [...cryptocurrencies].forEach((cryptocurrency) => {
      const price = preCheck(response[cryptocurrency.id].usd);

      // Mobile price label .cryptocurrency__price
      const cryptocurrencyMobileEl = document.createElement('div');
      cryptocurrencyMobileEl.className = 'cryptocurrency__price';
      cryptocurrencyMobileEl.innerHTML = price;

      cryptocurrency.previousElementSibling.appendChild(cryptocurrencyMobileEl);

      // Tablet and desktop price label
      cryptocurrency.innerHTML = price;
   });
});


let isShown = false;

const hiddenClass = "colum__hidden";
const currencyElements = Array.from(document.getElementsByClassName(hiddenClass));

export function toggleCurrencies() {
   const input = document.getElementsByClassName("popular-currencies__search")[0];

   input.value = "";
   findCurrency();

   const button = document.getElementsByClassName("popular-currencies__button")[0];

   if (isShown) {
      currencyElements.forEach(currencyEl => {
         if (!currencyEl.classList.contains(hiddenClass)) {
            currencyEl.classList.add(hiddenClass);
         }
      })
      isShown = false;
      button.textContent = "See all cryptocurrencies"

   } else {
      currencyElements.forEach(currencyEl => {
         if (currencyEl.classList.contains(hiddenClass)) {
            currencyEl.classList.remove(hiddenClass);
         }
      });

      isShown = true;
      button.textContent = "Hide all currencies";
   }
}

// Search cache to be used in findCurrency()
const searchCache = [];

export function findCurrency() {
   const input = document.getElementsByClassName("popular-currencies__search")[0];
   
   [...searchCache].forEach(({ currencyEl }) => {
      currencyEl.style.removeProperty("display");
   });

   if (input.value.replace(" ", "") === "") {
      return;
   }

   [...searchCache].forEach(({ keywords, currencyEl }) => {
      if (!keywords.includes(input.value.toLowerCase())) {
         currencyEl.style.display = "none";
      } else {
         currencyEl.style.removeProperty('display');
      }
   });
}

window.addEventListener('load', () => {
  // Create the search cache here
  const cryptocurrencyNames = Array.from(document.getElementsByClassName("cryptocurrency__name"));
  const cryptocurrencyShots = Array.from(document.getElementsByClassName("cryptocurrency__short"));

  if (cryptocurrencyNames.length !== cryptocurrencyShots.length) {
    throw new Error(`Expected cryptocurrencyNames.length and cryptocurrencyShots.length to be equal. Got cryptocurrencyNames.length = ${cryptocurrenciesNames.length} and cryptocurrencyShots.length = ${cryptocurrencyShots.length}.`)
  }

  for (let i = 0; i < cryptocurrencyNames.length; i += 1) {
    let keywords = cryptocurrencyNames[i].innerHTML.toLowerCase();
    keywords += " ";
    keywords += cryptocurrencyShots[i].innerHTML.toLowerCase();

    if (cryptocurrencyNames[i].parentElement.parentElement !== cryptocurrencyShots[i].parentElement.parentElement) {
      throw new Error('Expected cryptocurrencyNames[i] and cryptocurrencyShots[i] to be on same level.')
    }

    const currencyEl = cryptocurrencyNames[i].parentElement.parentElement;

    searchCache.push({
      keywords,
      currencyEl,
    });
  }
});

// Mobile menu

let menuState = true;
let desktop = false;
const menuBodyNav = document.getElementsByClassName('menu__body')[0];
const iconMenu = document.querySelectorAll('.menu__icons > .icon-menu')[0];
const header = document.getElementsByClassName('header')[0];

function enableMenu() {
   menuState = true;

   if (!desktop) {
      header.style.position = 'fixed';
      header.style.background = 'rgba(2, 0, 21, 1)';
   }

   menuBodyNav.style.removeProperty('display');
   iconMenu.classList.add('icon-menu__active');
}

function disableMenu() {
   menuState = false;

   header.style.removeProperty('position');
   header.style.removeProperty('background');
   menuBodyNav.style.display = 'none';

   if (iconMenu.classList.contains('icon-menu__active')) {
      iconMenu.classList.remove('icon-menu__active');
   }
}

export function toggleMenu() {
   if (menuState) {
      disableMenu();
   }
   else {
      enableMenu();
   }
}

let searchEnabled = false;

export function enableSearch() {
   const searchInput = document.getElementsByClassName("popular-currencies__search")[0];
   const searchButton = document.getElementsByClassName("button__search")[0];
   const title = document.getElementsByClassName("popular-currencies__title")[0];
   const searchIconGroup = document.getElementsByClassName("search-icon")[0];

   const popularCurrenciesTop = document.getElementsByClassName("popular-currencies__top")[0];

   searchButton.style.display = "none";
   searchInput.style.display = "block";

   Object.assign(popularCurrenciesTop.style, {
      flexDirection: "column",
      gap: '2rem',
      alignItems: 'flex-start',
   });

   if (!searchIconGroup.classList.contains("search-icon__mobile-active")) {
      searchIconGroup.classList.add("search-icon__mobile-active");
   }
   searchEnabled = true;

   window.addEventListener('resize', () => {
      if (searchEnabled) {
         if (window.matchMedia('(min-width: 769px)')) {
            searchButton.style.removeProperty('display');
            searchInput.style.removeProperty('display');
            popularCurrenciesTop.style.removeProperty('flex-direction');
            popularCurrenciesTop.style.removeProperty('gap');
            popularCurrenciesTop.style.removeProperty('align-items');

            if (searchIconGroup.classList.contains("search-icon__mobile-active")) {
               searchIconGroup.classList.remove("search-icon__mobile-active");
            }

            searchEnabled = false;
         }
      }
   });
}

window.addEventListener('load', () => {
   if (window.matchMedia('(max-width: 768px)').matches) {
      desktop = false;
      disableMenu();
   }
   
   if (window.matchMedia('(min-width: 768px)').matches) {
      desktop = true;
   }
});

window.addEventListener('resize', () => {
   if (window.matchMedia('(min-width: 768px)').matches) {
      if (!menuState) {
         desktop = true;
         enableMenu();
      }
   }

   if (window.matchMedia('(max-width: 768px)').matches) {
      if (menuState) {
         desktop = false;
         disableMenu();
      }
   }
});

// support button stopper at footer
const supportBlock = document.querySelector(".support-block");

if (supportBlock instanceof HTMLElement) {
   const supportButton = supportBlock.querySelectorAll(".support-block > .support__button")[0]

   if (supportButton instanceof HTMLElement) {
      const popularCurrenciesAction = document.querySelector('.popular-currencies__action');

      window.addEventListener('scroll', () => {
         const { scrollTop } = document.documentElement;

         let { top: supportBlockTop } = supportBlock.getBoundingClientRect();
         supportBlockTop += scrollTop;

         let { top: maxPos } = popularCurrenciesAction.getBoundingClientRect();
         maxPos += scrollTop - supportBlockTop;

         if (scrollTop > maxPos) {
            supportButton.style.position = 'absolute';
            supportButton.style.top = `${maxPos}px`;
         }
         else {
            supportButton.style.removeProperty('position');
            supportButton.style.removeProperty('top');
         }
      });
   }
}

/**
 * Injects the redirection link (./exchanger.html) into all Change, Sell and Buy buttons.
 */
export function changeSellBuyToExchangeRedirect() {
   const { localStorage } = window;

   const { sendCrypto, receiveCrypto } = storageConfig.tokenNames;

   $('.button__change, .button__sell')
   .each((_, el) => {
      $(el).on('click', () => {
         const columnPriceEl = el.parentElement.parentElement.querySelector('.colum__price');

         if (!(columnPriceEl instanceof Element)) {
            throw new ElementNotFoundError('.colum__price');
         }

         const cryptoId = columnPriceEl.id;

         localStorage.setItem(sendCrypto, cryptoId);
      });

      $(el).attr('href', './exchanger.html');
   });

   $('.button__buy')
   .each((_, el) => {
      $(el).on('click', () => {
         const columnPriceEl = el.parentElement.parentElement.querySelector('.colum__price');

         if (!(columnPriceEl instanceof Element)) {
            throw new ElementNotFoundError('.colum__price');
         }

         const cryptoId = columnPriceEl.id;
   
         localStorage.setItem(receiveCrypto, cryptoId);
      });
      $(el).attr('href', './exchanger.html');
   });
}

/**
 * Closes the menu after link clicked
 */
export function autoCloseMenu() {
   $('header a, footer a').on('click', () => {
      if (menuState) {
         disableMenu();
      }
   });
}
