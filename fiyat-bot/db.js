const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "products.json");

function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
  }
  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function addProduct(p) {
  const products = readDB();
  products.push(p);
  writeDB(products);
  return p;
}

function getProducts() {
  return readDB();
}

function toggleProduct(id) {
  const products = readDB();
  const p = products.find(x => x.id === id);
  if (p) p.active = !p.active;
  writeDB(products);
  return p;
}

function updateProduct(id, updates) {
  const products = readDB();
  const index = products.findIndex(x => x.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    writeDB(products);
    return products[index];
  }
  return null;
}

module.exports = {
  addProduct,
  getProducts,
  toggleProduct,
  updateProduct,
  writeDB
};
