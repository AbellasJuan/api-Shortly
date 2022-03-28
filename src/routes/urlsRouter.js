import { Router } from "express";
import { deleteUrl, getUrl, shortenUrl } from "../controllers/urlsController.js";
import { validateSchemaMiddleware } from "../middlewares/validateSchemaMiddleware.js";
import { validateTokenMiddleware } from "../middlewares/validateTokenMiddleware.js";
import urlSchema from "../schemas/urlSchema.js";

const urlsRouter = Router();
urlsRouter.post('/urls/shorten', validateSchemaMiddleware(urlSchema), validateTokenMiddleware, shortenUrl);
urlsRouter.get('/urls/:shortUrl', getUrl)
urlsRouter.delete('/urls/:id', validateTokenMiddleware, deleteUrl)
export default urlsRouter;