exports.middleWare = async (req, res, next) => {
  // if (req.session.isLoggedIn) {
  //   return next();
  // } else {
  //   if (req.body.username || req.body.password) return next();
  // }
  // return res
  //   .status(400)
  //   .json({ status: false, content: "You're not logged in!" });
  return next();
};
