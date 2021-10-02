const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).send("Not Authenticated!");
  }
};

const isNotLoggedIn = (req, res, next) => {
  if (req.user) {
    res.redirect(`/api/user/${req.user.uname}`);
  } else {
    next();
  }
};

module.exports = {
  isLoggedIn,
  isNotLoggedIn,
};
