const express = require("express");
const router = express.Router();
const { doc, drive } = require("../auth/google");
const generate = require("nanoid/generate");
const { sheets, getDataForPage } = require("../converter/tab");
// Get All
router.get("/", async (req, res) => {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["blogs"];
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
    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

// Get With Id
router.get("/:id", async (req, res) => {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["blogs"];
    const rows = await sheets(sheet);
    if (rows.status === false) throw rows;
    const read = rows.read(req.params.id);
    const result = await read;
    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["blogs"];
    const rows = await sheets(sheet);
    if (rows.status === false) throw rows;
    const id = "BLOG" + generate("1234567890", 6);
    const create = rows.create(id, req.body);
    const result = await create;
    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["blogs"];
    const rows = await sheets(sheet);
    if (rows.status === false) throw rows;
    const id = req.params.id;
    const update = rows.update(id, req.body);
    const result = await update;
    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle["blogs"];
    const rows = await sheets(sheet);
    if (rows.status === false) throw rows;
    const id = req.params.id;
    const del = rows.delete(id, req.body);
    const result = await del;
    res.json(result);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
