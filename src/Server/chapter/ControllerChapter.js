import express from "express";
import { getChapterByID } from "./ModelChapter";
import responeHelper from '../../common/responeHelper'

const router = express.Router();

router.get("/detail/:chapterId", async (req, res) => {
  try {
    const { chapter, listChapters } = await getChapterByID(
      req.params.chapterId
    );

    return responeHelper(req, res, null, { chapter, listChapters });
  } catch (error) {
    console.log(error);
    return responeHelper(req, res, error);
  }
});

export default router;
