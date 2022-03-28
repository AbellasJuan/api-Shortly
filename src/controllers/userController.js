import bcrypt from 'bcrypt';
import { connection } from '../database.js';
import { urlsRepository } from '../repositories/urlsRepository.js';

export async function createUser(req, res) {
  const user = req.body;

  try {
    const existingUsers = await connection.query('SELECT * FROM users WHERE email=$1', [user.email])
    if (existingUsers.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(user.password, 10);

    await connection.query(`
      INSERT INTO 
        users(name, email, password) 
      VALUES ($1, $2, $3)
    `, [user.name, user.email, passwordHash])

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUser(req, res) {
  const { user } = res.locals;

  try {
    res.send(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function getUserById(req, res) {
  const { id } = req.params;

  try {
    const result = await connection.query(`
      SELECT 
         users.*,
        SUM(urls."visitCount") as "visitCount"
      FROM users 
        LEFT JOIN urls ON urls."userId"=users.id
      WHERE users.id=$1
      GROUP BY users.id
    `, [id]);
    if (result.rowCount === 0) {
      return res.sendStatus(404)
    }

    const urlsResult = await urlsRepository.getByUserId(id)
    const [user] = result.rows

    res.send({
      ...user,
      shortenedUrls: urlsResult.rows 
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}