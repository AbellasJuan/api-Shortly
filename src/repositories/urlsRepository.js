import { connection } from "../database.js"

async function create(url, shortUrl, id) {
  return connection.query(`
    INSERT INTO 
      urls(url, "shortUrl", "userId")
    VALUES ($1, $2, $3)
  `, [url, shortUrl, id])
}

async function getByShortUrl(shortUrl) {
  return connection.query('SELECT * FROM urls WHERE "shortUrl"=$1', [shortUrl])
}

async function incrementVisitCount(urlId) {
  return connection.query(`
    UPDATE urls
      SET "visitCount"="visitCount" + 1
    WHERE id=$1
  `, [urlId])
}

async function getByIdAndUserId(id, userId) {
  return connection.query('SELECT * FROM urls WHERE id=$1 AND "userId"=$2', [id, userId])
}

async function getByUserId(userId) {
  return connection.query('SELECT * FROM urls WHERE "userId"=$1', [userId])
}

async function deleteUrl(id) {
  return connection.query('DELETE FROM urls WHERE id=$1', [id])
}

export const urlsRepository = {
  create,
  getByShortUrl,
  incrementVisitCount,
  getByIdAndUserId,
  getByUserId,
  deleteUrl
}