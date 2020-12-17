import ComicDb from '../../Modal/comic'
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