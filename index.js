const express = require("express");
const session = require("express-session");
const cors = require("cors");
const { isAdmin, middleWare } = require("./middleware");
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

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 6 * 60 * 60 * 1000,
      // maxAge: 60 * 1000,
    },
  })
);

app.use(middleWare);

app.use("/api", require("./router/api"));

app.use("/auth", require("./router/auth"));

app.use("/upload", require("./router/upload"));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

