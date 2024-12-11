const fs = require("fs");
const path = require("path");
const fileName = path.join(__dirname, "CACHE.json");

const getFileName = (key = "") => {
  key = key.replace(/\W/g, "");
  return path.join(__dirname, `CACHE${key}.json`);
};

const setCache = (key, value, ttlInSeconds = 60, cachePath) => {
  try {
    let cache = {};
    const fileName = getFileName(cachePath || key);
    if (fs.existsSync(fileName)) {
      cache = JSON.parse(fs.readFileSync(fileName));
    }
    cache[key] = {
      value,
      ttl: Date.now() + ttlInSeconds * 1000,
    };
    fs.writeFileSync(fileName, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.log(error);
  }
};

const getCache = (key, cachePath) => {
  try {
    const fileName = getFileName(cachePath || key);
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
  } catch (error) {
    return null;
  }
};

const clearCache = (key, cachePath) => {
  try {
    const fileName = getFileName(cachePath || key);
    const cache = JSON.parse(fs.readFileSync(fileName));
    delete cache[key];
    fs.writeFileSync(fileName, JSON.stringify(cache, null, 2));
  } catch (error) {}
};

module.exports = {
  setCache,
  getCache,
  clearCache,
};
