// authRoutes permet de creer des routes
// pour la gestion de la connexion par le fameux token

// quescequ'un token :
// il permet lors d'une autentification une fois que le
//compte est crée et que la connexion est faite 1 fois
//il permet de creer un pass temporaire evitant ainsi
// de faire des requetes à la bdd a chaque reconnexion de l'utilisateur
// c'est un pass temporaire afin d'economiser le nombre de requete au server

const withAuth = require("../withAuth");

module.export = (app, db) => {
    const userModel = require("../models/userModel")(db);

    // route de recup des infos de l'user par son token (permet la reconxion automatique du front)
    // de que le front demande la reconnexion via la requette l'api verifie le token et si il
    // correspond bien il va retourner les datas au front

    //ROUTE PERMETTANT LA GESTION DE LA CONNEXION
    app.get("/api/v1/user/checkToken", withAuth, async (req, res, next) => {
        // ons stock dans user la static function qui permet de recup l'user par son id qu'on passe en argument de la fonction
        let user = await userModel.getOneUser(req.id);

        // une condition qui permet de verif si il n'y a pas d'erreur dans le requete sql
        if (user.code) {
            // on renvpoit une reponse au front on construit un objet
            res.json({ status: 500, error: user });
        }
        // sinon on renvoit une autre reponse si tout est ok

        res.json({ status: 200, user: user[0] });
    });
};
