const { Router } = require("express");
const router = Router();
const { doc, drive } = require("../auth/google");
const generate = require("nanoid/generate");
const { sheets, getDataForPage } = require("../converter/tab");

// Get All
router.get("/:col", async (req, res) => {
  try {
    const col = req.params.col;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[col];
    const rows = await sheets(sheet);
    if (rows.status === false) throw rows;
    const read = rows.read();
    const result = await read;
    const pages = parseInt(req.query.page) || 1;
    const totalPages = Math.ceil(result.content.length / 5);
    if (pages < 1 || pages > totalPages)
      throw { status: false, content: "Page not found" };
    result.content = await getDataForPage(pages, result);
    result.pagination = {
      page: parseInt(req.query.page) || 1,
      per_page: 5,
      total_pages: totalPages,
      total_items: result.content.length,
    };
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Get With Id
router.get("/:col/:id", async (req, res) => {
  try {
    const col = req.params.col;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[col];
    const rows = await sheets(sheet);
    if (rows.status === false) throw rows;
    const read = rows.read(req.params.id);
    const result = await read;
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
});

// POST
router.post("/:col", async (req, res) => {
  try {
    const col = req.params.col;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[col];
    const rows = await sheets(sheet);
    if (rows.status === false) throw rows;
    const id = generate(
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghizklmnopqrstuvwxyz1234567890",
      14
    );
    const create = rows.create(id, req.body);
    const result = await create;
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
});

// UPDATE
router.put("/:col/:id", async (req, res) => {
  try {
    const col = req.params.col;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[col];
    const rows = await sheets(sheet);
    if (rows.status === false) throw rows;
    const id = req.params.id;
    const update = rows.update(id, req.body);
    const result = await update;
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
});

// DELETE
router.delete("/:col/:id", async (req, res) => {
  try {
    const col = req.params.col;
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle[col];
    const rows = await sheets(sheet);
    if (rows.status === false) throw rows;
    const id = req.params.id;
    const del = rows.delete(id, req.body);
    const result = await del;
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
