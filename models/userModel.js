const bcrypt = require("bcryptjs");
const saltRounds = 10;

module.exports = (_db) => {
  db = _db;
  return UserModel;
};

class UserModel {
  //SAUVEGARDE UTILISATEUR
  static async saveOneUser(req) {
    //ici on crée des racourcis des datas reçues de l'utilisateur qui sont dans req.body
    /* const password = req.body.password
        const firstName = req.body.firstName
        const lastName = req.body.lastName
        const email = req.body.email */

    // ici on fait un racoursi on destructure et on affecte req.body
    const { firstName, lastName, password, email } = req.body;

    console.log("lastName", lastName);
    console.log("email", email);
    console.log("firstName", firstName);
    console.log("password", password);

    // verifier si le mail est utiliser ou pas on fait une requete sql qui cherche dans tous lers users
    const user = await db.query("SELECT * FROM usersAccount WHERE email = ?", [
      email,
    ]);
    //console.log('user', user)

    // si il y a un utilisateur avec le mail fourni en req alors
    if (user.length) {
      // on envoit un message d'erreur
      return "email déjà utilisé";
    } else {
      //ici on stock dans une constante  et on crypte le mot de passe
      const cryptedPassword = await bcrypt.hash(password, saltRounds);

      // on enregistre vraiment l'utilisateur si il n'ay a pas l'email en bdd
      return db
        .query(
          "INSERT INTO usersAccount (firstName, lastName, email, cryptedPassword, accountCreationDate) VALUES(?, ?, ?, ?, NOW())",
          [firstName, lastName, email, cryptedPassword]
        )
        .then((result) => {
          return result;
        })
        .catch((err) => {
          return err;
        });
    }
  }

  //ici on recup un utilisateur par son email
  static getOneUserByEmail(email) {}

  //ici on recup un utilisateur par son id
  static getOneUserById(email) {}

  //ici on recup un utilisateur par son id donc on a besoin de lui passer en argument "id" car il a besoin de cet datata
  static getOneUserById(id) {}

  // MODIFIER UTILISAZTEUR : en paramettre de la fonction on a besoin de la requete du front et de id de l'utilisateur
  static updateOneUser(req, userId) {}

  static updateConnexion(id) {
    //que fait cette partie ?
  }
}
