function* generator() {
  let previousTimestamp = Date.now().toString(36);
  let collisionCount = 0;
  while (true) {
    const timestampString = Date.now().toString(36);
    if (previousTimestamp !== timestampString) {
      collisionCount = 0;
      previousTimestamp = timestampString;
      yield timestampString;
    } else {
      yield previousTimestamp + collisionCount.toString();
      collisionCount++;
    }
  }
}
const generatorFn = generator();
const generateUniqueId = ({ length = 16 }) => {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let id = length < 12 ? "" : generatorFn.next().value;
  while (id.length < length) {
    const char = chars[Math.floor(Math.random() * chars.length)];
    if (id.length & 1) {
      id += char;
    } else {
      id = char + id;
    }
  }
  return id;
};

const generateUniqueId1 = (length = 16) => {
  let uniqueId = "";
  while (uniqueId.length < length) {
    uniqueId += Math.random().toString(36).slice(2);
  }
  return uniqueId.slice(0, length);
};

const generateUniqueId5 = (length) => {
  if (length < 8) {
    return Math.random().toString(36).slice(2).slice(0, length);
  }
  const timestamp = Date.now().toString(36);
  return (
    timestamp +
    Array.from(
      { length: length - timestamp.length },
      () => Math.random().toString(36)[2]
    ).join("")
  );
};

const generateUniqueId6 = ({ length = 16 } = {}) => {
  if (length < 14) {
    return Array.from(
      { length: length },
      () => Math.random().toString(36)[2]
    ).join("");
  }
  const timestamp = Date.now().toString(36);
  const randomPart = Array.from(
    { length: length - timestamp.length },
    () => Math.random().toString(36)[2]
  ).join("");
  const half = Math.floor(randomPart.length / 2);
  return randomPart.slice(0, half) + timestamp + randomPart.slice(half);
};

let map = new Map();
let i = 1;
while (100000 > i) {
  i++;
  const id = generateUniqueId({ length: 13 });
  console.log(id);
  if (map.has(id)) {
    console.log("Existed-" + id);
    break;
  }
  map.set(id, true);
  if (i % 1000000 == 0) {
    console.log(i);
  }
}

console.log(i);
