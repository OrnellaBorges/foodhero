// CREATION DES ROUTES QUI PERMETTENT DE RECEPTIONNER LES REQUETES (marchandises qui arrive sur les rail)
const bcrypt = require("bcryptjs");
const withAuth = require("../withAuth");
const config = require("../config.js");
const secret = process.env.SECRET || config.token.secret;
const jwt = require("jsonwebtoken");

module.exports = (app, db) => {
    // sert a exporter le fichier
    const UserModel = require("../models/userModel")(db);

    //CREATE = creation d'un compte utilisateur
    //Route de creation d'un utilisateur
    app.post("/api/v1/user/create", async (req, res, next) => {
        const { email } = req.body;
        // 1- on verifie si l'utilisateur existe déjà ou pas si il existe on le refoule.
        // on stock dans une constante let userFound le resultat de la fonction getOneUserByEmail qui recup un utilisateur par son email
        const userFound = await UserModel.getOneUserByEmail(email); // ici on stock dans la constante toute les données reçu de la fonction getOneUserByEmail qui fait une requete a la bdd dans le UserModel
        //ici on fait if / else une condition si ???
        if (userFound.code) {
            // si il une err dans la requete sql il va stocker un objet d'erreur dans la variable userFound
            // userFound doit retourner un tableau vide pour signifier que la place est libre pour cette utilisateur et personne n'utilise le meme email
            res.json({
                status: 500,
                msg: "pb dans la requete sql de getOneUserById",
                err: userFound.code,
            });
        } else {
            // si userFound voit qu'il y a qq1 avec le meme mail il retourne un tableau qui n'est pas vide et en front le res.json

            if (userFound.length) {
                // si le tableau est supérieur a 0
                //if (userFound[0].email === email) {
                // CE IF NA PAS LIEU DETRE !!!!
                // et que userFound.email correspondent alors on envoit le msg au front "Email déjà utilisé."
                res.json({ status: 401, msg: "Email déjà utilisé." });
                //}
            } else {
                // dans le cas ou c'est inférieur à 0 c'est que la place est libre
                // on stock dans let user la reponse de la fonction de sauvegarde d'un utilisateur createOneUser(req) on lui passe la req du front en argument
                const userCreated = await UserModel.createOneUser(req);
                if (userCreated.code) {
                    // ???? ERROR DANS LA REQUETE MAIS IL NE RENTRE JAMAIS MDR POURQUOI
                    res.json({
                        status: 500,
                        msg: "pb dans la requete sql de createOneUser",
                        err: userCreated.code,
                    });
                } else {
                    // QUAND TOUT EST OK
                    res.json({
                        status: 200,
                        msg: "Votre compte à bien été crée!",
                    });
                }
            }
        }
    });

    //UPDATE = modifier un compte
    app.put("/api/v1/user/update/:id", withAuth, async (req, res, next) => {
        //on stock dans une constante le resultat de la requete updateOneUser qui se trouve dans la class UserModel
        // on doit lui passer en argument le req du front et l'id
        const { id } = req.params;
        const userFound = await UserModel.getOneUserById(id);
        //VERIFICATION si la requete sql à echoué avec une condition avec le .code qui est un objet d'erreur
        if (userFound.code) {
            res.json({
                status: 500,
                msg: "pb dans la requete sql de getOneUserById",
                err: userFound.code,
            });
        } else {
            if (userFound.length) {
                const userUpdated = await UserModel.updateOneUser(req, id);
                if (userUpdated.code) {
                    res.json({
                        status: 500,
                        msg: "pb dans la requete sql de updateOneUser",
                        err: userUpdated.code,
                    });
                } else {
                    res.json({
                        status: 200,
                        result: "utilisateur bien modifié",
                    });
                }
            } else {
                res.json({
                    status: 500,
                    msg: "L'utilisateur n'existe pas",
                    err: userFound.code,
                });
            }
        }
    });

    //LOGGIN = connexion de l'utilisateur à son compte
    // CREATION DU TOKEN DANS CETTE PA
    app.post("/api/v1/user/login", async (req, res, next) => {
        //version ES6
        // ici on fait une DESTRUCTURATION en ES6 qui permet d'eviter d'ecrire req.body.email
        const { email, password } = req.body; // on a besoin de l'email rentré par l'utilisateur
        //version ES5 on faisait comme ça
        //const email = req.body.email
        if (email === "" || password === "") {
            // SI UTILISATEUR NA RIEN MIS DANS L4INPUT
            //LE RES ON LE CONSTRUIT COMME ON VEUT C4EST A NOUS DE LA FAIRE
            // si l'email est strictement egal a une chaine de caractère vide
            // res est la reponse que l'on va renvoyer au front
            //.json permet de convertir la res (response) au format json
            // Dans les parenthèses on ecrit ou on invente la response qui sera reçu par le front en format json
            res.json({
                status: 401,
                msg: "Enter your email or your password...",
            });
        } else {
            // VERIFICATION = si l'utilisateur existe dans la bdd avec un email correspondant
            // on utilise la fonction .getOneUserByEmail(email) on passe en argument l'email de l'utilisateur et la fonction du Model va chercher l'email via la requerte sql dela query
            //si user.code existe on renvoit une response 500 au front
            const user = await UserModel.getOneUserByEmail(email); // on verif si un email existe ou pas
            if (user.code) {
                // cas 1: si il existe et on fait un message d'erreur au front
                res.json({
                    status: 500,
                    msg: "la requete sql n'a pas fonctionné",
                    error: user.code,
                });
            } else {
                if (user.length === 0) {
                    //cas 2 :  SI IL N'EXISTE PAS DANS BDD = L'utilisateur a rentrée un mail mais il s'est trompé
                    //on retourne un message d'erreur
                    res.json({
                        status: 404,
                        msg: "Pas d'utilisateur correspondant à ce mail.",
                    });
                } else {
                    // sinon si il existe
                    //on compare les password avec bcrypt
                    const same = await bcrypt.compare(
                        password,
                        user[0].cryptedPassword
                    );
                    //si c'est true
                    if (same) {
                        //dans payload on stock les valeurs qu'on va glisser dans le token (attention jamais d'infos craignos!)
                        const payload = { email: email, id: user[0].id };
                        //on crée notre token avec sa signature (secret)
                        const token = jwt.sign(payload, secret);
                        res.json({
                            status: 200,
                            token: token,
                            user: user[0],
                            msg: "Connecté",
                        });
                    } else {
                        //on retourne un json d'erreur
                        res.json({
                            status: 401,
                            msg: "Votre mot de passe est incorrect",
                        });
                    }
                }
            }
        }
    });

    // LOGOUT = route qui permet a l'utilisateur de se déconnecter

    // route permettant de recuperer les infos d'un user lorsqu'il veut contacter un utilisateur et commander un plat
    app.get("/api/v1/user/getOneUser/:id", async (req, res, next) => {
        const { id } = req.params;
        const oneUser = await UserModel.getOneUserById(id);
        console.log("oneUser", oneUser);
        if (oneUser.code) {
            res.json({
                status: 500,
                msg: "pas reussi a recup les l'utilisateur",
                err: oneUser.code,
            });
        } else {
            res.json({
                status: 200,
                oneUser: oneUser,
                msg: "user bien récupéré",
            });
        }
    });

    //DELETE = supprimer le compte d'un compte
    app.delete("/api/v1/user/delete/:id", withAuth, async (req, res, next) => {
        const { id } = req.params;
        const userFound = await UserModel.getOneUserById(id);
        if (userFound.code) {
            res.json({
                status: 500,
                msg: "pb dans la requete sql de getOneUserById",
                err: userFound.code,
            });
        } else {
            if (userFound.length) {
                const userDeleted = await UserModel.deleteOneUser(id);
                if (userDeleted.code) {
                    res.json({
                        status: 500,
                        msg: "pb dans la requete sql de deleteOneUser",
                        err: userDeleted.code,
                    });
                } else {
                    res.json({
                        status: 200,
                        result: "Votre compte à bien été supprimé.",
                    });
                }
            } else {
                res.json({
                    status: 500,
                    msg: "L'utilisateur n'existe pas",
                    err: userFound.code,
                });
            }
        }

        /* const deleteSuccess = reponse.affectedRows;
        if (deleteSuccess) {
            res.json({ status: 200, msg: "Votre compte à bien été supprimé." });
        } else {
            res.json({ status: 500, msg: "il y a un soucis !" });
        } */
        /* // si la requete sql est mal ecrite
        if (user.code) {
            // . code permet de generer un objet d'erreur si celui ci existe alors c'est que la requete sql est mauvaise
            res.json({
                status: 500,
                msg: "il y a un soucis dans ta requete sql bro va verifier ta syntaxe!",
                err: user,
            });
        } else {
            res.json({ status: 200, msg: "Votre compte à bien été supprimé." });
        } */
    });

    /* app.post('api/v1/updateConnexion/:id'), async (req, res, next) => {
    const { id } = req.params
    await UserModel.updateConnexion(req)
  }

  app.post('api/v1/updateConnexion'), async (req, res, next) => {
    const { age, name, sexe, ville } = req.body.objet
    await UserModel.updateConnexion(req)
  } */
};
