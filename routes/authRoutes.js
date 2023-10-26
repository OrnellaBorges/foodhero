const withAuth = require("../withAuth");

//routes permettant la gestion de la connexion par token (avec le front qui jouera aussi avec redux)
module.exports = (app, db) => {
    const UserModel = require("../models/UserModel")(db);

    //route de récupération des infos de l'utilisateur connecté par son token
    app.get("/api/v1/user/checkToken", withAuth, async (req, res, next) => {
        let user = await UserModel.getOneUserById(req.id);

        if (user.code) {
            res.json({ status: 500, err: user });
        }

        res.json({ status: 200, user: user });
    });
};
