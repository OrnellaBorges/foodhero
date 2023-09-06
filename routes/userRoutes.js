// CREATION DES ROUTES QUI PERMETTENT DE RECEPTIONNER LES REQUETES (marchandises qui arrive sur les rail)

module.exports = (app, db) => {
  const userModel = require("../models/userModel")(db);

  //ROUTE TEST
  app.get("/api/v1/user/test", async (req, res, next) => {
    console.log("req", req);
    res.json({ msg: "tout va vien bro, la route testUser fonctionne" });
  });

  //CREATE = creation d'un compte utilisateur
  //Route de creation d'un utilisateur
  app.post("/api/v1/user/create", async (req, res, next) => {
    // 1- on verifie si l'utilisateur existe déjà ou pas si il existe on le refoule.
    // on stock dans une constante let check le resultat de la fonction getOneUserByEmail qui recup un utilisateur par son email
    const check = await userModel.getOneUserByEmail(req.body.email);
    console.log("check", check);
    //ici on fait if / else une condition si

    // ENREGISTREMENT NOUVEL UTILISATEUR SI IL EXISTE PAS
    // ici on stock dans la constante une le resultat de la requete sql qui se trouve dans le model saveUser
    const result = await userModel.saveOneUser(req);
    console.log("result saveOneUser", result);

    // reponse pour le front qu'on convertit en json le result
    res.json(result);
  });

  //UPDATE = modifier un compte
  app.put("/api/v1/user/updateAccount", async (req, res, next) => {});

  //LOGGIN = connexion de l'utilisateur à son compte
  app.post("/api/v1/user/logginAccount", async (req, res, next) => {
    //version ES6
    // ici on fait une DESTRUCTURATION en ES6 qui permet d'eviter d'ecrire req.body.email
    const { email } = req.body;
    //version ES5 on faisait comme ça
    //const email = req.body.email

    if (email === "") {
      //LE RES ON LE CONSTRUIT COMME ON VEUT C4EST A NOUS DE LA FAIRE
      // si l'email est strictement egal a une chaine de caractère vide
      // res est la reponse que l'on va renvoyer au front
      //.json permet de convertir la res (response) au format json
      // Dans les parenthèses on ecrit ou on invente la response qui sera reçu par le front en format json
      res.json({ status: 401, msg: "Enter your email..." });
    }
    // VERIFICATION = si l'utilisateur existe dans la bdd avec un email correspondant
    // on utilise la fonction .getOneUserByEmail(email) on passe en argument l'email de l'utilisateur et la fonction du Model va chercher l'email via la requerte sql dela query
    let user = await userModel.getOneUserByEmail(email);

    //si user.code existe on revoit une response 500
    if (user.code) {
      res.json({ status: 500, msg: "Erreur vérification email.", err: user });
    }
  });

  //DELETE = supprimer le compte d'un compte
  app.post("/api/v1/user/deleteAccount", async (req, res, next) => {});
};
