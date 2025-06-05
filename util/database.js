import Database from 'better-sqlite3'

const db = new Database('./data/database.sqlite');

db.prepare(`CREATE TABLE IF NOT EXISTS sellers (id INTEGER PRIMARY KEY AUTOINCREMENT, name STRING, address STRING, taxNumber STRING )`).run();
db.prepare(`CREATE TABLE IF NOT EXISTS buyers (id INTEGER PRIMARY KEY AUTOINCREMENT, name STRING, address STRING, taxNumber STRING )`).run();
db.prepare(`CREATE TABLE IF NOT EXISTS bills (id INTEGER PRIMARY KEY AUTOINCREMENT, sellerId INTEGER, buyerId INTEGER, billNumber STRING UNIQUE, created DATE, completed_date DATE,deadline DATE, total INTEGER, vat INTEGER, FOREIGN KEY(sellerId) REFERENCES sellers(id) ON DELETE CASCADE, FOREIGN KEY(buyerId) REFERENCES buyers(id) ON DELETE CASCADE )`).run();

//Seller functions
export const getSellers = () => db
    .prepare('SELECT * FROM sellers').all();

export const createSeller = (name, address, taxNumber) => db
    .prepare('INSERT INTO sellers (name, address, taxNumber) VALUES (?,?,?)').run(name, address, taxNumber);

export const updateSeller = (id, name, address, taxNumber) => db
    .prepare('UPDATE sellers SET name = ?, address = ?, taxNumber = ? WHERE id = ?').run(name, address, taxNumber, id);

export const deleteSeller = (id) => db
    .prepare('DELETE FROM sellers WHERE id =?').run(id);

// Buyers functions
export const getBuyers = () => db
    .prepare('SELECT * FROM buyers').all();

export const createBuyer = (name, address, taxNumber) => db
    .prepare('INSERT INTO buyers (name, address, taxNumber) VALUES (?,?,?)').run(name, address, taxNumber);

export const updateBuyer = (id, name, address, taxNumber) => db
    .prepare('UPDATE buyers SET name = ?, address = ?, taxNumber = ? WHERE id = ?').run(name, address, taxNumber, id);

export const deleteBuyer = (id) => db
    .prepare('DELETE FROM buyers WHERE id =?').run(id);

// Bills functions
export const getBills = () => db
    .prepare('SELECT * FROM bills').all();

export const createBill = (sellerId, buyerId, billNumber, created, completed_date, deadline, total, vat) => db
    .prepare('INSERT INTO bills (sellerId, buyerId, billNumber, created, completed_date, deadline, total, vat) VALUES (?,?,?,?,?,?,?,?)').run(sellerId, buyerId, billNumber, created, completed_date, deadline, total, vat);

export const updateBill = (id, sellerId, buyerId, billNumber, created, completed_date, deadline, total, vat) => db
    .prepare('UPDATE bills SET sellerId = ?, buyerId = ?,billNumber = ?,created = ?,completed_date = ?, deadline = ?, total = ?,vat = ? WHERE id = ?').run(sellerId, buyerId, billNumber, created, completed_date, deadline, total, vat, id);

export const deleteBill = (id) => db
    .prepare('DELETE FROM bills WHERE id =?').run(id);

const sellers = [
    { name: 'Ann', address: "cím1", taxNumber: "11111111-1-11" },
    { name: 'John', address: "cím2", taxNumber: "22222222-2-22" },
    { name: 'Jane', address: "cím3", taxNumber: "33333333-3-33" }
];
const buyers = [
    { name: 'Bob', address: "cím2", taxNumber: "22222222-2-22" },
    { name: 'Balázs', address: "cím3", taxNumber: "33333333-3-33" },
    { name: 'János', address: "cím3", taxNumber: "44444444-4-44" }
];

const dateString = `2005-10-01`;
const deadLineDateString = `2025-10-01`;

const bills = [
    { sellerId: 1, buyerId: 1, billNumber: "11111111-11111111-11111111", created: `${dateString}`, completed_date: `${dateString}`, deadline: `${deadLineDateString}`, total: 10000, vat: 27 },
    { sellerId: 1, buyerId: 1, billNumber: "22222222-22222222-22222222", created: `${dateString}`, completed_date: `${dateString}`, deadline: `${deadLineDateString}`, total: 20000, vat: 27 },
    { sellerId: 1, buyerId: 1, billNumber: "33333333-33333333-33333333", created: `${dateString}`, completed_date: `${dateString}`, deadline: `${deadLineDateString}`, total: 30000, vat: 27 },
    { sellerId: 2, buyerId: 2, billNumber: "44444444-44444444-44444444", created: `${dateString}`, completed_date: `${dateString}`, deadline: `${deadLineDateString}`, total: 40000, vat: 27 },
    { sellerId: 2, buyerId: 2, billNumber: "55555555-55555555-55555555", created: `${dateString}`, completed_date: `${dateString}`, deadline: `${deadLineDateString}`, total: 50000, vat: 27 },
    { sellerId: 2, buyerId: 2, billNumber: "66666666-66666666-66666666", created: `${dateString}`, completed_date: `${dateString}`, deadline: `${deadLineDateString}`, total: 60000, vat: 27 },
    { sellerId: 3, buyerId: 3, billNumber: "77777777-77777777-77777777", created: `${dateString}`, completed_date: `${dateString}`, deadline: `${deadLineDateString}`, total: 70000, vat: 27 },
    { sellerId: 3, buyerId: 3, billNumber: "88888888-88888888-88888888", created: `${dateString}`, completed_date: `${dateString}`, deadline: `${deadLineDateString}`, total: 180000, vat: 27 },
    { sellerId: 3, buyerId: 3, billNumber: "99999999-99999999-99999999", created: `${dateString}`, completed_date: `${dateString}`, deadline: `${deadLineDateString}`, total: 90000, vat: 27 },
];

if (getSellers().length === 0) {
    for (const seller of sellers) createSeller(seller.name, seller.address, seller.taxNumber);
}
if (getBuyers().length === 0) {
    for (const buyer of buyers) createBuyer(buyer.name, buyer.address, buyer.taxNumber);
}
if (getBills().length === 0) {
    for (const bill of bills) createBill(bill.sellerId, bill.buyerId, bill.billNumber, bill.created, bill.completed_date, bill.deadline, bill.total, bill.vat);
}