const { Router } = require("express");
const bcrypt = require("bcrypt");
const { doc, drive } = require("../auth/google");
const { sheets, getDataForPage, getId } = require("../converter/tab");

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["users"];
    const rows = await sheets(sheet);
    if (rows.status === false) throw rows;
    const read = rows.read();
    const result = await read;
    const match = await bcrypt.compare(
      req.body.password,
      result.content[0].password
    );
    if (!match) throw "Username and Password not match!";
    req.session.isLoggedIn = true;
    return res
      .status(200)
      .json({ status: true, content: "You are logged in!" });
  } catch (error) {
    return res.status(400).json(error);
  }
});

router.post("/register", async (req, res) => {
  try {
    const saltRounds = 10;
    const { username, password } = req.body;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["users"];
    const rows = await sheets(sheet);
    if (rows.status === false) throw rows;
    req.body.password = await bcrypt.hash(password, saltRounds);
    const create = rows.customCreate(
      "username",
      getId("1234567890qwertyuiopasdfghjklzxcvbnm", 14),
      req.body
    );
    const result = await create;
    if (!result.status) throw result;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
