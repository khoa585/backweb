import responeHelper from './responeHelper'
const Authencation = (req, res, next) => {
    let { admin } = req.headers;
    if (admin === "ADMIN") return next();
    return responeHelper(req, res, "AUTHEN_FAIL");
}
export default Authencation