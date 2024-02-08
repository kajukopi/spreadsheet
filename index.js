const { doc, drive } = require("./auth/google");
const express = require("express");
const app = express();
const { rowsConvertJson } = require("./converter/rows");
const port = 3000 || process.env.PORT;

const generate = require("nanoid/generate");
const id = generate("1234567890", 5); //=> "4f90d13a42"
console.log(id);

app.get("/", async (req, res) => {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["assets"];
    if (!sheet) throw "Sheet not found!";
    const rows = await sheet.getRows();
    if (!rows.length) throw "0 Rows";
    console.log(rowsConvertJson(rows).find("id", "#515151"));
    console.log(rowsConvertJson(rows).push({ id: "#41322", name: "Montana" }));
    res.json({
      status: true,
      data: {
        content: rowsConvertJson(rows).value(),
        message: `${rows.length} Rows`,
      },
    });
  } catch (error) {
    res.json({ status: false, data: { content: null, message: error } });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
