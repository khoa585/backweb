const request = require("request-promise");
let cheerio = require("cheerio");
import Chapter from "../../Modal/chapter";
const getImageLinks = async (uri) => {
  try {

    const response = await request(uri);
    const $ = cheerio.load(response);

    let imageLinks = [];
    let load = $("#app > div > section.section-detail-story > div > img");
    load.each(function (i, element) {

      let linkCommic1 = cheerio.load(element)('img').attr("data-src")
      if (linkCommic1) {
        imageLinks.push(linkCommic1);
      }
    })

    return imageLinks;
  } catch (error) {
    console.log(error);
  }
};

export const getChapterByID = async (chapterId) => {
  const chapter = await Chapter.findById(chapterId).populate({
    path: "comic_id",
    select: "name image",
  });
  if (chapter.images.length === 0 || chapter.images[0] === null) {
    const images = await getImageLinks(chapter.url);
    chapter.images = [...images];
  }
  await chapter.save();

  const listChapters = await Chapter.find({
    comic_id: chapter.comic_id,
  })

  return { chapter, listChapters };
};
