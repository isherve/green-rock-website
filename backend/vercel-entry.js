'use strict';

/**
 * Vercel backend service entry (committed so deploy validation passes).
 * `npm run build` in backend/ produces dist/app.js before the service starts.
 */
module.exports = require('./dist/app.js');
