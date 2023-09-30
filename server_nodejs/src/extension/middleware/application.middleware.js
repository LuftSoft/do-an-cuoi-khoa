module.exports = {
    checkData: (req, res, next) => {
        if (true) res.json({ success: false })
    },
    authorize: (permissions) => {
        return (req, res, next) => {
            console.log('pass middleware');
            next();
        }
    }
}