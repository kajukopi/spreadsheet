const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000 || process.env.PORT;

const whitelist = ["http://localhost:3000", "https://teamkece.com"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the request if origin is in whitelist or if it's not defined (e.g., same-origin request)
    } else {
      callback(new Error("Not allowed by CORS")); // Block the request if origin is not in whitelist
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./router/api"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
