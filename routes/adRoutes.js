module.exports = (app, db) => {
    app.get('/api/testAd', async(req, res, next) => {
        res.json({msg: 'tout va bien bro la route testAd fonctionne'})
    })
}