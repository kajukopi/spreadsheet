const { doc } = require("../auth/google");
const { sheets, getId } = require("../converter/tab");

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

exports.isAdmin = async (req, res, next) => {
  if (!req?.session?.isLoggedIn) return res.status(400).json({ status: false, content: "You're not logged in!" });
  await doc.loadInfo();
  const docUsers = doc.sheetsByTitle["users"];
  const rows = await sheets(docUsers);
  if (rows.status === false) throw rows;
  const status = await rows.status(req?.session?.uid);
  createLog(req).catch((error) => {
    console.log(error);
  });
  if (req?.params?.col === "users") {
    if (status === "isAdmin") return next();
    return res.status(400).json({ status: false, content: "Access denied!" });
  } else {
    if (status === "isStaff" || status === "isAdmin") return next();
    return res.status(400).json({ status: false, content: "Access denied!" });
  }
};

async function createLog(req) {
  await doc.loadInfo();
  const log = doc.sheetsByTitle["log"];
  const rows = await sheets(log);
  switch (Object.getOwnPropertyNames(req.route.methods)[0]) {
    case "post":
      await rows.push("LOG-" + getId("1234567890", 8), {
        uid: req?.session?.uid,
        method: Object.getOwnPropertyNames(req.route.methods)[0],
        col_id: req?.params?.id,
        col_name: req?.params?.col,
      });
      break;
    case "put":
      await rows.push("LOG-" + getId("1234567890", 8), {
        uid: req?.session?.uid,
        method: Object.getOwnPropertyNames(req.route.methods)[0],
        col_id: req?.params?.id,
        col_name: req?.params?.col,
      });
      break;
    case "delete":
      await rows.push("LOG-" + getId("1234567890", 8), {
        uid: req?.session?.uid,
        method: Object.getOwnPropertyNames(req.route.methods)[0],
        col_id: req?.params?.id,
        col_name: req?.params?.col,
      });
      break;
    case "get":
      await rows.push("LOG-" + getId("1234567890", 8), {
        uid: req?.session?.uid,
        method: Object.getOwnPropertyNames(req.route.methods)[0],
        col_id: req?.params?.id,
        col_name: req?.params?.col,
      });
      break;
  }
}
