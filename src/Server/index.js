const express = require('express')
const router = express.Router()
import comicRouter from './Comic/Controller'
import chapterRouter from './chapter/ControllerChapter'
router.use("/comic", comicRouter);
router.use("/chapter", chapterRouter);
export default router