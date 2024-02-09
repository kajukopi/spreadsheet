const { doc, drive } = require("./auth/google");
const express = require("express");
const app = express();
const { tab } = require("./converter/tab");
const port = 3000 || process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const generate = require("nanoid/generate");
const id = generate("1234567890", 5); //=> "4f90d13a42"
console.log(id);

app.get("/", async (req, res) => {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["assets"];
    if (!sheet) throw "Sheet not found!";
    const result = await tab(sheet);
    console.log(result);
    console.log(result.find("id", "#12345"));
    res.cookie("username", "john", { maxAge: 900000, httpOnly: true });
    res.json({
      status: true,
      data: {
        content: result.value(),
        message: `${result.value().length} Rows`,
      },
    });
  } catch (error) {
    res.json({ status: false, data: { content: null, message: error } });
  }
});

// POST
app.post("/", async (req, res) => {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["assets"];
    if (!sheet) throw "Sheet not found!";
    const result = await tab(sheet);
    const find = result.find("id", "#" + req.params.id);
    if (!find) throw "Data not found!";
    const update = find.update(req.body);
    console.log(update);
    res.cookie("username", "john", { maxAge: 900000, httpOnly: true });
    res.json({
      status: true,
      data: {
        content: result.value(),
        message: `${result.value().length} Rows`,
      },
    });
  } catch (error) {
    res.json({ status: false, data: { content: null, message: error } });
  }
});

// UPDATE
app.put("/:id", async (req, res) => {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["assets"];
    if (!sheet) throw "Sheet not found!";
    const result = await tab(sheet);
    const find = result.find("id", "#" + req.params.id);
    if (!find) throw "Data not found!";
    const update = find.update(req.body);
    console.log(update);
    res.cookie("username", "john", { maxAge: 900000, httpOnly: true });
    res.json({
      status: true,
      data: {
        content: result.value(),
        message: `${result.value().length} Rows`,
      },
    });
  } catch (error) {
    res.json({ status: false, data: { content: null, message: error } });
  }
});

// DELETE
app.delete("/:id", async (req, res) => {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["assets"];
    if (!sheet) throw "Sheet not found!";
    const result = await tab(sheet);
    const find = result.find("id", "#" + req.params.id);
    if (!find) throw "Data not found!";
    const del = find.delete();
    console.log(del);
    res.cookie("username", "john", { maxAge: 900000, httpOnly: true });
    res.json({
      status: true,
      data: {
        content: result.value(),
        message: `${result.value().length} Rows`,
      },
    });
  } catch (error) {
    res.json({ status: false, data: { content: null, message: error } });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
