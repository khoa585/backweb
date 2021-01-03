const request = require("request-promise");
let cheerio = require("cheerio");
const URL_PAGE = "https://khotruyen.net/truyen-yeu-thich?page=";
let commicDb = require("../Modal/comic");
let chapterDb = require("../Modal/chapter");


const getLinkgetLink = async (page) => {
    let url = URL_PAGE + page;
    let resultData = await request(url);
    let $ = cheerio.load(resultData);
    let load = $('#app > div > section > div > div.row.row-sm .col-6.col-sm-3.col-md-3.col-lg-2');
    let listLink = [];
    load.each(function (i, element) {
        let linkCommic1 = cheerio.load(element)(".tile-story a").attr('href')
        if (linkCommic1) {
            listLink.push(linkCommic1);
        }
    })

    let listPromise = listLink.map(item => addCommic(item));
    let dataPromise = await Promise.all(listPromise);

    return dataPromise.length;
}

const addCommic = (Link) => {
    // console.log(Link)
    return commicDb.create({ url: Link });
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
    objects["name"] = $("#app > div > section > div > div.bg-white > div.overview-story.d-lg-flex > div.text > h1").text();
    objects["views"] = $("#app > div > section > div > div.bg-white > div.overview-story.d-lg-flex > div.text > div.txt > div > span:nth-child(4) > span").text();
    objects["author"] = $("#app > div > section > div > div.bg-white > div.overview-story.d-lg-flex > div.text > div.txt > p:nth-child(2)").text();
    let status = $("#app > div > section > div > div.bg-white > div.overview-story.d-lg-flex > div.text > div.txt > p:nth-child(1)").text();
    objects["team"] = "Khoa Dưỡng Duy"
    if (status == "Tình trang: Đang cập nhật") {
        objects["status"] = 0;
    } else { objects["status"] = 1; }
    let image = $("#app > div > section > div > div.bg-white > div.overview-story.d-lg-flex > div.img  img").attr("data-src")
    objects["image"] = "https://khotruyen.net" + image
    let category = $("#app > div > section > div > div.bg-white > div.overview-story.d-lg-flex > div.text > ul.list-tag-story.list-orange li")
    category.each((i, element) => {
        listGenders.push(cheerio.load(element)('a').text())
    })
    objects["genres"] = listGenders;
    objects["hot"] = Math.floor(Math.random() * 2) + 1
    objects["description"] = $("#app > div > section > div > div.bg-white > div.overview-story.d-lg-flex > div.text > div.story-detail-info").text()

    await commicDb.updateOne({ _id: commicId }, objects);
    let chapterSelect = $("#app > div > section > div > div.bg-white > div.list-chapters > div.box-list .chapter-item");
    chapterSelect.each(function (i, element) {
        let object = {};
        let elementDetial = cheerio.load(element);
        object.url = elementDetial(".col-md-10.col-sm-10.col-8 a").attr("href");
        object.name = elementDetial(".col-md-10.col-sm-10.col-8 a").text();
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
    let commicUpdate = await commicDb.updateOne({ _id: comic_id }, {
        "$push": {
            "chapters": chapterCreate._id
        }
    })
    return url;
}

module.exports = {
    find_,
    getLinkgetLink,
    getDetialComic
}
