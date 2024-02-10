
const express = require("express");
const app = express();
const port = 3000 || process.env.PORT;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// app.use("/", require("./router/"));

app.use("/users", require("./router/users"));

app.use("/invoices", require("./router/invoices"));

app.use("/blogs", require("./router/blogs"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
