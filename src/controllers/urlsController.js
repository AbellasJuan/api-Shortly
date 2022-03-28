import { nanoid } from 'nanoid';
import { urlsRepository } from '../repositories/urlsRepository.js';

export async function shortenUrl(req, res) {
  const { id } = res.locals.user;
  const { url } = req.body;
  const shortUrl = nanoid(8);

  await urlsRepository.create(url, shortUrl, id)

  res.status(201).send({
    shortUrl
  })
}

export async function getUrl(req, res) {
  const { shortUrl } = req.params;
  
  const result = await urlsRepository.getByShortUrl(shortUrl)
  if (result.rowCount === 0) {
    return res.sendStatus(404)
  }

  const [url] = result.rows;
  await urlsRepository.incrementVisitCount(url.id);

  delete url.visitCount;
  delete url.userId;

  res.send(url)
}

export async function deleteUrl(req, res) {
  const { id } = req.params;
  
  const result = await urlsRepository.getByIdAndUserId(id, res.locals.user.id)
  if (result.rowCount === 0) {
    return res.sendStatus(401)
  }

  await urlsRepository.deleteUrl(id)

  res.sendStatus(200)
}