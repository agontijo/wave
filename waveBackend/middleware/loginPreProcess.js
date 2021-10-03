emailMapActions = require('../database/emailMapActions.js');
regexVal = require('../utils/regexValidation.js');

const resolveUname = async (req, res, next) => {
  if (req?.body?.username && regexVal.looksLikeEmail(req.body.username)) {
    // User signed in with email, need to resolve with uname from db
    const map = (await emailMapActions.getEmailMap(req.body.username))?.Item;
    if (map?.uname) { req.body.username = map.uname; }
  }
  next();
}

module.exports = {
  resolveUname,
};
