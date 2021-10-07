module.exports = {
  eightDigitHexID: () => Math.floor((1 + Math.random()) * 10000000000).toString(16).substr(1),
};
