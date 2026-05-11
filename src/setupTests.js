// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// ── Polyfills required by react-router v7 in jsdom ─────────────────────────
// jsdom does not implement TextEncoder / TextDecoder; react-router uses them
// internally when parsing URLs.
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// ── jsdom stubs ──────────────────────────────────────────────────────────────
// jsdom does not implement window.scrollTo; stub it to silence the error
// that fires when pagination components scroll to the top of the page.
global.scrollTo = jest.fn();
