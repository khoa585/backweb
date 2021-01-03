const express = require('express')
const router = express.Router()
import { getlistComic ,getComicById,getListTop} from './modalComic'
import responeHelper from '../../common/responeHelper'
router.post("/list", async (req, res) => {
    try {
        const { page, numberLimit } = req.body
        const { data, total } = await getlistComic(page, numberLimit)
        return responeHelper(req, res, null, data, total);
    } catch (error) {

    }

});

router.get("/detail/:comicId", async (req, res) => {
    try {
        const { comicId } = req.params;
        const comic = await getComicById(comicId);
        if (!comic) {
            throw "COMIC_NOT_FOUND";
        }

        return responeHelper(req, res, null, comic);
    } catch (error) {
        console.log(error);
        return responeHelper(req, res, error);
    }
});


router.post("/list-top", async (req, res) => {
    try {
      let listTop = await getListTop(req.body.type);
      return responeHelper(req, res, null, listTop);
    } catch (error) {
      return responeHelper(req, res, error);
    }
  });
export default router