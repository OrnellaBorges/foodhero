module.exports = (app, db) => {
    app.get("/api/testAd", async (req, res, next) => {
        res.json({ msg: "tout va bien bro la route testAd fonctionne" });
    });

    app.get("/api/v1/allAds", async (req, res, next) => {});
    app.put("/api/v1/updateAds", async (req, res, next) => {});
    app.delete("/api/v1/deleteAds", async (req, res, next) => {});
};
