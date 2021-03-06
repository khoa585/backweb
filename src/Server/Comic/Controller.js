const express = require('express')
const router = express.Router()
import { getlistComic ,getComicById,getListTop,searchListComics,getlistAllComic,deleteComicById} from './modalComic'
import responeHelper from '../../common/responeHelper'
router.post("/list", async (req, res) => {
    try {
        const { page, numberLimit } = req.body
        const { data, total } = await getlistComic(page, numberLimit)
        return responeHelper(req, res, null, data, total);
    } catch (error) {

    }

});

router.post("/listAll", async (req, res) => {
  try {
      const { data, total } = await getlistAllComic()
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

  router.post("/search", async (req, res) => {
    try {
      const { name} = req.body;
      const { comics, total } = await searchListComics(
        name
      );
      return responeHelper(req, res, null, comics, total);
    } catch (error) {
      return responeHelper(req, res, error);
    }
  });

  router.post("/delete/:comicId", async (req, res) => {
    try {
        const { comicId } = req.params;
        const comic = await deleteComicById(comicId);
        if (!comic) {
            throw "COMIC_NOT_FOUND";
        }

        return responeHelper(req, res, null, comic);
    } catch (error) {
        console.log(error);
        return responeHelper(req, res, error);
    }
});
export default router