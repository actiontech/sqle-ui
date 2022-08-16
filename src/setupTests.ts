// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import 'jest-canvas-mock';
import 'jsdom-worker';

global.ResizeObserver = require('resize-observer-polyfill');

Enzyme.configure({ adapter: new Adapter() });
jest.setTimeout(10 * 1000);

Object.defineProperty(global, 'matchMedia', {
  writable: true,
  value: (query: any) => {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  },
});

// without stubbing do this:

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  // debug: true,

  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  resources: { en: { translations: {} } },
});

// class CanvasPattern {
//   constructor() {
//     this.setTransform = jest.fn(this.setTransform.bind(this));
//   }

//   setTransform(value: any) {
//     if (arguments.length > 0 && !(value instanceof Object))
//       throw new TypeError(
//         "Failed to execute 'setTransform' on 'CanvasPattern': parameter 1 ('transform') is not an object."
//       );
//   }
// }

// if (!window.CanvasPattern) window.CanvasPattern = CanvasPattern;
