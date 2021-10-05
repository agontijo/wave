module.exports = {
  eightDigitHexID: () => Math.floor((1 + Math.random()) * 100000000).toString(16).substr(1),
};
