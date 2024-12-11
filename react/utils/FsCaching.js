const fs = require("fs");
const path = require("path");
const fileName = path.join(__dirname, "cache.json");

const setCache = (key, value, ttlInSeconds = 5) => {
  let cache = {};
  if (fs.existsSync(fileName)) {
    cache = JSON.parse(fs.readFileSync(fileName));
  }
  cache[key] = {
    value,
    ttl: Date.now() + ttlInSeconds * 1000,
  };
  fs.writeFileSync(fileName, JSON.stringify(cache, null, 2));
};

const getCache = (key) => {
  if (!fs.existsSync(fileName)) {
    return null;
  }
  const cache = JSON.parse(fs.readFileSync(fileName));
  if (!cache[key]) {
    return null;
  }
  if (cache[key].ttl < Date.now()) {
    delete cache[key];
    fs.writeFileSync(fileName, JSON.stringify(cache, null, 2));
    return null;
  }
  return cache[key].value;
};

const clearCache = (key) => {
  const cache = JSON.parse(fs.readFileSync(fileName));
  delete cache[key];
  fs.writeFileSync(fileName, JSON.stringify(cache, null, 2));
};

const clearAllCache = () => {
  fs.writeFileSync(fileName, JSON.stringify({}, null, 2));
};

module.exports = {
  setCache,
  getCache,
  clearCache,
  clearAllCache,
};
