// authRoutes permet de creer des routes
// pour la gestion de la connexion par le fameux token

// quescequ'un token :
// il permet lors d'une autentification une fois que le
//compte est crée et que la connexion est faite 1 fois
//il permet de creer un pass temporaire evitant ainsi
// de faire des requetes à la bdd a chaque reconnexion de l'utilisateur
// c'est un pass temporaire afin d'economiser le nombre de requete au server

const withAuth = require("../withAuth");
const jwt = require("jsonwebtoken");
const secret = "popo";

module.export = (app, db) => {
  const userModel = require("../models/userModel")(db);

  // route de recup des infos de l'user par son token (permet la reconxion automatique du front)
  // de que le front demande la reconnexion via la requette l'api verifie le token et si il
  // correspond bien il va retourner les datas au front
};
