const got = require("got");
const getJSONFromWWWPromise =  (url) => got(url).json();

module.exports = {getJSONFromWWWPromise}