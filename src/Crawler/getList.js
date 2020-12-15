const request = require("request-promise");
let cheerio = require("cheerio");
const URL_PAGE = "https://thichtruyentranh.com/truyen-moi-nhat/trang.";
let commicDb = require("../Modal/comic");
let chapterDb = require("../Modal/chapter");


const getLinkgetLink = async (page) => {
    let url = URL_PAGE + page + ".html";
    let resultData = await request(url);
    let $ = cheerio.load(resultData);
    let load = $('ul.ulListruyen li');
    let listLink = [];

    load.each(function (i, element) {
        let linkCommic1 = cheerio.load(element)("div.divthumb > a:first-child").attr("href")

        if (linkCommic1) {
            listLink.push(linkCommic1);
        }
    })
    // console.log(listLink)
    let listPromise = listLink.map(item => addCommic(item));
    let dataPromise = await Promise.all(listPromise);

    return dataPromise.length;
}

const addCommic = (Link) => {
    // console.log(Link)
    return commicDb.create({ url: "https://thichtruyentranh.com/" + Link });
}
const find_ = () => {
    return commicDb.find({
        $or: [
            {
                description: { $exists: false }
            },
            {
                chapters: { $size: 0 }
            }
        ]

    })
}


const getDetialComic = async (url, commicId) => {
    let data = await request({
        uri: url
    })
    const $ = cheerio.load(data);
    let listChapter = [];
    let objects = {};
    let listGenders = [];
    objects["name"] = $("ul.ulpro_line > li:nth-child(1) > .divListtext > .spantile2 > h1").text();
    objects["author"] = $("#pagebody_list > div.divleftpage > div:nth-child(1) > div > ul > li:nth-child(1) > div.divListtext > ul > li:nth-child(1) > div.item2 > a").text();
    let status = $("ul.ulpro_line > li:nth-child(1) > .divListtext >ul.ullist_item > li:nth-child(1) > .item1:nth-child(2) > span").text();
    objects["team"] = "Khoa Dưỡng Duy"
    if (status == "Còn Tiếp") {
        objects["status"] = 0;
    } else { objects["status"] = 1; }
    let image = $("ul.ulpro_line > li:nth-child(1) > .divthum2 > a > img").attr("src")
    objects["image"] = image.split(new RegExp(/\?time.*/))[0]
    let category = $("#pagebody_list > div.divleftpage > div:nth-child(1) > div > ul > li:nth-child(1) > div.divListtext > ul > li:nth-child(3) > div.item2 > a")
    category.each((i, element) => {
        listGenders.push(cheerio.load(element).text())
    })
    objects["genres"] = listGenders;
    objects["description"] = $("ul.ulpro_line > li:nth-child(3) > p:nth-child(2)").text()
    await commicDb.updateOne({ _id: commicId }, objects);
    let chapterSelect = $("ul.ul_listchap > li");
    chapterSelect.each(function (i, element) {
        let object = {};
        let elementDetial = cheerio.load(element);
        object.url = "https://thichtruyentranh.com/" + elementDetial("a").attr("href");
        object.name = elementDetial("a").text();
        if (object.url) {
            listChapter.push(object);
        }
    })

    let listPromise = listChapter.map((item, index) => AddChapter(item.url, item.name, index + 1, commicId));
    let dataResult = await Promise.all(listPromise);
    return { total: listChapter.length, update: dataResult.length };

}

const AddChapter = async (url, name, index, comic_id) => {
    let chapterCreate = await chapterDb.create({
        url: url,
        name: name,
        comic_id: comic_id,
        index: index,
    })
    return chapterCreate;
}

module.exports = {
    find_,
    getLinkgetLink,
    getDetialComic
}
