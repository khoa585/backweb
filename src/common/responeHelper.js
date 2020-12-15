const responeHelper = (req, res, error,data, numberOfResult) => {
    if (error) {
        return res.json({
            status: error
        })
    } else {
        if (numberOfResult != null && numberOfResult != undefined) {
            return res.json({
                status: 'success',
                data,
                numberOfResult
            })
        }
        return res.json({
            status: 'success',
            data
        })
    }
}
export default responeHelper