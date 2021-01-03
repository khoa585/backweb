import ComicDb from '../../Modal/comic'
import ChapterDb from '../../Modal/chapter'
import moment from 'moment';
import { getData, putData } from "./../../common/cache";
export const getlistComic = async (page, numberItem) => {
    let result = await ComicDb.find({})
        .skip((page - 1) * numberItem)
        .limit(numberItem)
    let data = result.map((item) => {
        return item;
    });
    let total = await ComicDb.countDocuments();

    return { data, total };
}
export const getComicById = async (comicId) => {
    const comic = await ComicDb.findById(comicId)
        .populate("chapters");
    return comic;
};
export const getListTop = async (type) => {
    let key = `LIST_TOP-${type}`;
    let dataCache = getData(key);
    if (dataCache) return dataCache;

    let listComicResult = await ComicDb.find({})

    listComicResult = listComicResult.sort((a, b) => {
        if (a.views - b.views) return -1; //tangdan
        if (a.views < b.views) return 1; //giamdan
        return 0;
    });
    const listComicResult_ = listComicResult.slice(0, 5)

    putData(key, listComicResult_);
    return listComicResult_;
};
