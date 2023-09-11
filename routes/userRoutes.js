// CREATION DES ROUTES QUI PERMETTENT DE RECEPTIONNER LES REQUETES (marchandises qui arrive sur les rail)

module.exports = (app, db) => {
  // sert a exporter le fichier
  const userModel = require("../models/userModel")(db);

  //ROUTE TEST
  app.get("/api/v1/user/test", async (req, res, next) => {
    console.log("req", req);
    res.json({ msg: "tout va vien bro, la route testUser fonctionne" });
  });

  //CREATE = creation d'un compte utilisateur
  //Route de creation d'un utilisateur
  app.post("/api/v1/user/create", async (req, res, next) => {
    const { email } = req.body;
    // 1- on verifie si l'utilisateur existe déjà ou pas si il existe on le refoule.
    // on stock dans une constante let check le resultat de la fonction getOneUserByEmail qui recup un utilisateur par son email
    const check = await userModel.getOneUserByEmail(email); // ici on stock dans la constante toute les données reçu de la fonction getOneUserByEmail qui fait une requete a la bdd dans le userModel
    console.log("check", check);
    //ici on fait if / else une condition si ???
    if (check.code) {
      // si il une err dans la requete sql il va stocker un objet d'erreur dans la variable check
      console.log("check2", check);
      // check doit retourner un tableau vide pour signifier que la place est libre pour cette utilisateur et personne n'utilise le meme email
      //console.log("check2", check);
      res.json({ status: 500, msg: "Erreur vérification email", err: check });
    } else {
      // si check voit qu'il y a qq1 avec le meme mail il retourne un tableau qui n'est pas vide et en front le res.json

      if (check.length > 0) {
        // si le tableau est supérieur a 0
        if (check[0].email === email) {
          // CE IF NA PAS LIEU DETRE !!!!
          // et que check.email correspondent alors on envoit le msg au front "Email déjà utilisé."
          res.json({ status: 401, msg: "Email déjà utilisé." });
        }
      } else {
        // dans le cas ou c'est inférieur à 0 c'est que la place est libre
        // on stock dans let user la reponse de la fonction de sauvegarde d'un utilisateur saveOneUser(req) on lui passe la req du front en argument
        let user = await userModel.saveOneUser(req);
        if (user.code) {
          // ???? ERROR DANS LA REQUETE MAIS IL NE RENTRE JAMAIS MDR POURQUOI
          res.json({ status: 500, msg: "Il y a eu un problème", err: user });
        } else {
          // QUAND TOUT EST OK
          res.json({ status: 200, msg: "Votre compte à bien été crée!" });
        }
      }
    }
  });

  /* // ENREGISTREMENT NOUVEL UTILISATEUR SI IL EXISTE PAS
    // ici on stock dans la constante une le resultat de la requete sql qui se trouve dans le model saveUser
    const result = await userModel.saveOneUser(req);
    console.log("result saveOneUser", result);

    // reponse pour le front qu'on convertit en json le result
    res.json(result);
  }); */

  //UPDATE = modifier un compte
  app.put("/api/v1/user/update", async (req, res, next) => {
    //on stock dans une constante le resultat de la requete updateOneUser qui se trouve dans la class userModel
    // on doit lui passer en argument le req du front et l'id
    let user = await userModel.updateOneUser(req, req.params.id);

    //VERIFICATION si la requete sql à echoué avec une condition avec le .code qui est un objet d'erreur
    if (user.code) {
      //on revoi une reponse au front qu'on convertir en json
      res.json({
        status: 500,
        msg: "Gros problème dans la requete sql tu dois vérifier la syntaxe de la requete dans userModel",
        err: user,
      });

      // PROFIL MODIFIE => renvoyer info mis a jour au front => redux peut mettre a jour automatiquement les info de l'utilisateur connecté

      //stocker dans newUser les donnée que donne getOneUser
      let newUser = await userModel.getOneUser(req.params.id);
      if (user.code) {
        res.json({ status: 500, msg: "pb dans la requete sql", err: newUser });
      } else {
        res.json({ status: 500, result: user, newUser: newUser[0] });
      }
    }
  });

  //LOGGIN = connexion de l'utilisateur à son compte
  // CREATION DU TOKEN DANS cette route
  app.post("/api/v1/user/loggin", async (req, res, next) => {
    //version ES6
    // ici on fait une DESTRUCTURATION en ES6 qui permet d'eviter d'ecrire req.body.email
    const { email } = req.body; // on a besoin de l'email rentré par l'utilisateur
    //version ES5 on faisait comme ça
    //const email = req.body.email

    // VERIFICATIONS :

    if (email === "") {
      // SI UTILISATEUR NA RIEN MIS DANS L4INPUT
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
    //si user.code existe on renvoit une response 500 au front
    if (user.code) {
      // cas 1: si il existe eton fait un message d'erreur au front
      res.json({ status: 500, msg: "Erreur vérification email.", err: user });
    } else {
      //cas 2 :  SI IL N'EXISTE PAS DANS BDD = L'utilisateur a rentrée un mail mais il s'est trompé
    }
  });

  // LOGOUT = route qui permet a l'utilisateur de se déconnecter

  //DELETE = supprimer le compte d'un compte
  app.post("/api/v1/user/delete", async (req, res, next) => {});
};
