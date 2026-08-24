'use strict';

/**
 * Vercel backend service entry (committed so deploy validation passes).
 * `npm run build` in backend/ produces dist/app.js before the service starts.
 */
const mod = require('./dist/app.js');
module.exports = mod.default ?? mod;
