// IMPORTS

// pour toute operation on a besoin de la fonction qui verifie que l'user est bien connécté et que c'est bien lui
const withAuth = require("../withAuth");

module.exports = (app, db) => {
    //TEST
    app.get("/api/testAd", async (req, res, next) => {
        res.json({ msg: "tout va bien bro la route testAd fonctionne" });
    });

    // route permettant de recuperer toutes les annonces dans la page d'acceuil
    app.get("/api/v1/allAds", async (req, res, next) => {});

    // route permettant de recuperer une annonce lorsque que l'user clique sur une annonce pour la consulter
    app.get("/api/v1/allAds", async (req, res, next) => {});

    //route d'ajout d'une image dans l'api (stock une image et retourne au front le nom de l'image stocké)
    app.post("/api/v1/beer/pict", adminAuth, (req, res, next) => {});

    //route permettant de creer et sauvegarder une annonce
    app.post("/api/v1/beer/save", withAuth, async (req, res, next) => {});

    // route pour modifier une annonce
    app.put("/api/v1/updateAds", async (req, res, next) => {});

    // route pour supprimer une annonce
    app.delete("/api/v1/deleteAds", async (req, res, next) => {});
};
