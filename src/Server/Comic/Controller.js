const express = require('express')
const router = express.Router()
import { getlistComic } from './modalComic'
import responeHelper from '../../common/responeHelper'
router.post("/list", async (req, res) => {
    try {
        const { page, numberLimit } = req.body
        const { data, total } = await getlistComic(page, numberLimit)
        return responeHelper(req, res, null, data, total);
    } catch (error) {

    }

});
export default router