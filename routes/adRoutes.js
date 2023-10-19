// pour toute operation on a besoin de la fonction qui verifie que l'user est bien connécté et que c'est bien lui
const withAuth = require("../withAuth");

module.exports = (app, db) => {
    // ATTENTION IL FAUT IMPORTER NOTRE MODELE AVANT
    const AdModel = require("../models/adModel")(db);

    //route permettant de creer et sauvegarder une annonce a diviser en deux creer avec un bouton + et sauvegarder au click sur le bouton save donc 2 routes
    // ici on a besoin de withAuth pour ...
    app.post("/api/v1/ads/createOneAd", async (req, res, next) => {
        const createAd = await AdModel.createOneAd(req);
        if (createAd.code) {
            res.json({
                status: 500,
                msg: "il y a eu un problème dans la requete : createOneAd",
            });
        }
        res.json({
            status: 200,
            msg: "L'annonce a bien été crée!",
            result: createAd,
        });
    });

    // route permettant de recuperer toutes les annonces dans la page d'acceuil avc ou sans connexion
    app.get("/api/v1/ads/getAllAds", async (req, res, next) => {
        const allAds = await AdModel.getAllAds();

        if (allAds.code) {
            res.json({ status: 500, msg: "pas reussi a recup les annonces" });
        }

        res.json({ status: 200, allAds: allAds });
    });

    // route permettant de recuperer une annonce lorsque que l'user ou visiteur clique sur une annonce pour la consulter
    app.get("/api/v1/ads/getOneAd/:id", async (req, res, next) => {
        const { id } = req.params;
        const oneAd = await AdModel.getOneAd(id);

        if (oneAd.code) {
            res.json({ status: 500, msg: "pas reussi a recup les annonces" });
        }

        res.json({ status: 200, oneAd: oneAd });
    });

    //ROUTE d'ajout d'une image dans l'api (stock une image et retourne au front le nom de l'image stocké)
    //app.post("/api/v1/ads/pict", adminAuth, (req, res, next) => {});

    // route permettant de recuperer toutes les annonces de l'utilisateur par son id lorsqu'il va dans son dashbord pour consulter toutes ces annonces
    // il faut creer une table qui stock les annonces de l'utilisateur en fonction de son id et doivent etre lié par l'userID
    app.get("/api/v1/ads/getAllUserAd/:userId", async (req, res, next) => {
        const { userId } = req.params;
        const userAds = await AdModel.getUserAds(userId);

        if (userAds.code) {
            res.json({ status: 500, msg: "pas reussi a recup les annonces" });
        }

        res.json({ status: 200, userAds: userAds });
    });

    // A DEPLACER PEUT ETRE DANS UN FICHIER A PART DASHBORD ROUTES
    //route d'ajout d'une image dans l'api (stock une image et retourne au front le nom de l'image stocké)
    //app.post("/api/v1/ads/pict", adminAuth, (req, res, next) => {});

    // route pour modifier une annonce
    app.put("/api/v1/ads/updateOneAd/:id", async (req, res, next) => {
        const id = req.params.id;
        const updateOneAd = await AdModel.updateOneAd(req, id);

        if (updateOneAd.code) {
            res.json({
                status: 500,
                msg: "il y'a eu un problème dans ta requete!",
            });
        }
        res.json({
            status: 200,
            msg: "L'annonce' a bien été modifiée!",
            result: updateOneAd,
        });
    });

    // route pour supprimer une annonce
    app.delete("/api/v1/ads/deleteOneAd/:id", async (req, res, next) => {
        const id = req.params.id;
        const result = await AdModel.deleteOneAd(id);

        if (result.code) {
            res.json({ status: 500, err: result });
        }

        res.json({
            status: 200,
            msg: "Votre annonce à bien été supprimée.",
        });
    });
};
