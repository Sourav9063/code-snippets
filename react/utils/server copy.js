const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());
const express = require("express");
const frameguard = require("frameguard");
const cors = require("cors");
const next = require("next");
const connectDB = require("./src/config/DB");
let basicAuth = require("basic-auth");
const https = require("https");
const fs = require("fs");
const { createIO } = require("./src/lib/services/SocketService");
const { createServer } = require("http");
const key = fs.readFileSync(
  "src/config/ssl-certificate/localhost/localhost.decrypted.key"
);
const cert = fs.readFileSync(
  "src/config/ssl-certificate/localhost/localhost.crt"
);
require("./src/lib/constants/ValidatorExtension");

const auth = function (req, res, next) {
  const reqUrl = req.url;
  const headers = req.headers;

  if (
    reqUrl.startsWith("/api/") ||
    reqUrl.startsWith("/.well-known/") ||
    reqUrl.startsWith("/_next/static/") ||
    headers["http-x-clipiii-sp-key"] === process.env.SP_KEY
  ) {
    next();
    return;
  }
  let user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    res.sendStatus(401);
    return;
  }
  if (
    user.name === process.env.BASIC_USER &&
    user.pass === process.env.BASIC_USER_PASSWORD
  ) {
    next();
  } else {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    res.sendStatus(401);
    return;
  }
};

const noAuth = function (req, res, next) {
  next();
};

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const hostname = "localhost";
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();
    const httpServer = createServer(server);
    const io = createIO(httpServer);

    connectDB();

    server.use(frameguard({ action: "sameorigin" }));
    server.use(express.json());
    server.use(
      express.urlencoded({
        extended: true,
      })
    );

    server.use(
      cors({
        origin: "*",
      })
    );

    server.get("/test", (req, res) => {
      res.send(
        `isProduction = ${process.env.ENV_TYPE} ${process.env.AUTH}`,
        200
      );
    });
    // disable auth in production
    server.all(
      "*",
      `${process.env.ENV_TYPE}` == `production` &&
        `${process.env.AUTH}` == "false"
        ? noAuth
        : auth,
      (req, res) => {
        res.io = io;
        return handle(req, res);
      }
    );
    httpServer.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })

  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
