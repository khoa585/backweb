const express = require('express')
const router = express.Router()
import comicRouter from './Comic/Controller'
router.use("/comic", comicRouter);
export default router