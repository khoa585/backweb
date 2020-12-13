import express from "express";
const router = express.Router();
const request = require("request-promise");
let cheerio = require("cheerio");
const URL_PAGE = "http://truyenqq.com/";

router.get("/test", async () => {
    let url = URL_PAGE;
    let resultData = await request(url);
    let $ = cheerio.load(resultData);
    let load = $('.story-item');
    let listLink = [];
    load.each(function (i, element) {

        // let linkCommic1 = cheerio.load(element)("div.top-notice > span.time-ago").text()
        let linkCommic1 = cheerio.load(element)("a:first-child").attr("href")
    
        if (linkCommic1) {
            listLink.push(linkCommic1);
        }
    })
    console.log(listLink)
}
);
export default router;