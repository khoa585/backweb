import express from "express";
const router = express.Router();
const request = require("request-promise");
let cheerio = require("cheerio");
const URL_PAGE = "http://truyenqq.com/";
let commicDb = require("../Modal/comic");
router.get("/test", async () => {
    let url = URL_PAGE;
    let resultData = await request(url);
    let $ = cheerio.load(resultData);
    let load = $('.story-item');
    let listLink = [];
    load.each(function (i, element) {
        let linkCommic1 = cheerio.load(element)("a:first-child").attr("href")
    
        if (linkCommic1) {
            listLink.push(linkCommic1);
        }
    })
    let listPromise = listLink.map(item=>addCommic(item));
    let dataPromise = await Promise.all(listPromise);

    return dataPromise.length ;

}
);
const addCommic = (Link)=>{
    return commicDb.create({url:Link});
}
export default router;