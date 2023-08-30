// CREATION DES ROUTES QUI PERMETTENT DE RECEPTIONNER LES REQUETES (marchandises qui arrive sur les rail)

module.exports = (app, db) => {
  const userModel = require("../models/userModel")(db);

  //ROUTE TEST
  app.get("/api/testUser", async (req, res, next) => {
    console.log("req", req);
    res.json({ msg: "tout va vien bro, la route testUser fonctionne" });
  });

  //Route de creation d'une annonce
  app.post("/api/user/createAccount", async (req, res, next) => {
    // ici on stock dans la constante une le resultat de la requete sql qui se trouve dans le model saveUser
    const result = await userModel.saveUser(req);

    // reponse pour le front qu'on convertit en json le result
    res.json(result);
  });

  app.put("/api/user/updateAccount", async (req, res, next) => {});

  app.post("/api/user/deleteAccount", async (req, res, next) => {});

  app.post("/api/user/logginAccount", async (req, res, next) => {});
};
