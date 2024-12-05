const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let db: any = null

async function getDb() {
  if (db) return db
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  })
  await db.exec(`
    CREATE TABLE IF NOT EXISTS cachedOffers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider TEXT,
      btc TEXT,
      createdAt INTEGER
    )
  `)
  return db
}

export async function saveCachedOffers(offersData: any[]) {
  const db = await getDb()
  const stmt = await db.prepare(
    'INSERT INTO cachedOffers (provider, btc, createdAt) VALUES (?, ?, ?)'
  )
  for (const offer of offersData) {
    await stmt.run(offer.provider, offer.btc, Date.now())
  }
  await stmt.finalize()
}

export async function getCachedForProvider(providerName: string) {
  const db = await getDb()
  return db.get(
    'SELECT * FROM cachedOffers WHERE provider = ? ORDER BY createdAt DESC LIMIT 1',
    providerName
  )
}

module.exports = { saveCachedOffers, getCachedForProvider };
