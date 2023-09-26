// IMPORTS

// pour toute operation on a besoin de la fonction qui verifie que l'user est bien connécté et que c'est bien lui
const withAuth = require("../withAuth");

module.exports = (app, db) => {
    //TEST
    app.get("/api/testAd", async (req, res, next) => {
        res.json({ msg: "tout va bien bro la route testAd fonctionne" });
    });

    // route permettant de recuperer toutes les annonces dans la page d'acceuil avc ou sans connexion
    app.get("/api/v1/ads/getAllAds", async (req, res, next) => {});

    // route permettant de recuperer une annonce lorsque que l'user ou visiteur clique sur une annonce pour la consulter
    app.get("/api/v1/ads/getOneAd", async (req, res, next) => {});

    // A DEPLACER PEUT ETRE DANS UN FICHIER A PART DASHBORD ROUTES
    // route permettant de recuperer toutes les annonces de l'utilisateur par son id lorsqu'il va dans son dashbord pour consulter toutes ces annonces
    // il faut creer une table qui stock les annonces de l'utilisateur en fonction de son id et doivent etre lié par l'userID
    app.get("/api/v1/ads/getAllUserAd", async (req, res, next) => {});

    // A DEPLACER PEUT ETRE DANS UN FICHIER A PART DASHBORD ROUTES
    //route d'ajout d'une image dans l'api (stock une image et retourne au front le nom de l'image stocké)
    //app.post("/api/v1/ads/pict", adminAuth, (req, res, next) => {});

    //route permettant de creer et sauvegarder une annonce a diviser en deux creer avec un bouton + et sauvegarder au click sur le bouton save donc 2 routes
    // ici on a besoin de withAuth pour ...
    app.post("/api/v1/ads/createOneAd", withAuth, async (req, res, next) => {});
    app.post("/api/v1/ads/saveOneAd", withAuth, async (req, res, next) => {});

    // A DEPLACER PEUT ETRE DANS UN FICHIER A PART DASHBORD ROUTES
    // route pour modifier une annonce
    app.put("/api/v1/ads/updateOneAd", async (req, res, next) => {});

    // A DEPLACER PEUT ETRE DANS UN FICHIER A PART DASHBORD ROUTES
    // route pour supprimer une annonce
    app.delete("/api/v1/ads/deleteOneAd", async (req, res, next) => {});
};
