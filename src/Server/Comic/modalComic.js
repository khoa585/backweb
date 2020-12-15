import ComicDb from '../../Modal/comic'
export const getlistComic = async (page, numberItem) => {
    let result = await ComicDb.find({}).limit(numberItem)
    let data = result.map((item) => {
        return item;
    });
    let total = await ComicDb.countDocuments();

    return { data, total };
}