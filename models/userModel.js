const bcrypt = require("bcryptjs");
const { response } = require("express");
const saltRounds = 10;

module.exports = (_db) => {
    db = _db;
    return UserModel;
};

class UserModel {
    //SAUVEGARDE UTILISATEUR
    // static est une fonction version class en poo
    // en argument on passe req qui vient du front ce sont les donnée que l'utilisateur rentre lorsqyu'il ecrit dans les formulaires pour creer un compte
    static async createOneUser(req) {
        //ici on crée des racourcis des datas reçues de l'utilisateur qui sont dans req.body

        // ici on fait un racourci on destructure et on affecte req.body
        const { password, email, firstName, lastName } = req.body;

        // verifier si le mail est utiliser ou pas on fait une requete sql qui cherche dans tous lers users
        /* const user = await db.query("SELECT * FROM user WHERE email = ?", [
            email,
        ]);

        // si il y a un utilisateur avec le mail fourni en req alors
        if (user.length) {
            // on envoit un message d'erreur
            return "email déjà utilisé";
        } else { */
        //ici on stock dans une constante  et on crypte le mot de passe
        const cryptedPassword = await bcrypt.hash(password, saltRounds);

        // on enregistre vraiment l'utilisateur si il n'y a pas l'email en bdd
        return (
            db
                //.query() est une methode qui permet de faire la requete sql entre les parenthèses
                .query(
                    "INSERT INTO users (firstName, lastName, email, cryptedPassword, accountCreationDate) VALUES(?, ?, ?, ?, NOW())",
                    [firstName, lastName, email, cryptedPassword]
                )
                //en cas de succès il retourne les données
                .then((result) => {
                    return result;
                })
                .catch((err) => {
                    return err;
                    // si il ne trouve pas il renvoit l'erreur
                })
        );
        //}
    }

    //ici on recup un utilisateur par son email donc on lui passe en paramètre de la fonction email
    static getOneUserByEmail(email) {
        return db
            .query("SELECT * FROM users WHERE email = ?", [email])
            .then((response) => {
                return response;
                //en cas de succès il retourne les données
            })
            .catch((err) => {
                return err;
                // si il ne trouve pas il renvoit l'erreur
            });
    }

    //ici on recup un utilisateur par son id donc on a besoin de lui passer en argument "id" car il a besoin de cet data qui vient du front
    static getOneUserById(id) {
        return db
            .query("SELECT * FROM users WHERE id = ?", [id])
            .then((response) => {
                // dans le cas ou il y a les données il va renvoyer les données via response
                return response;
            })

            .catch((err) => {
                //si il il y a un problème dans la bdd il va revoyer l'erreur
                return err;
            });
    }

    // MODIFIER UTILISATEUR : en paramettre de la fonction on a besoin de la requete du front et de id de l'utilisateur et la require (requete)
    static async updateOneUser(req, id) {
        const { firstName, lastName, email, password } = req.body;
        const cryptedPassword = await bcrypt.hash(password, saltRounds);
        return (
            db
                .query(
                    "UPDATE users SET firstName = ?, lastName = ?, email = ?, cryptedPassword = ? WHERE id = ?",
                    [firstName, lastName, email, cryptedPassword, id]
                )
                .then((response) => {
                    // on passe en argument la response de la requete
                    // en cas de succès on retourne la response donc toutes les données demandées dans la requete
                    return response;
                })
                // on passe une callback en argument de la méthode .catch()
                .catch((err) => {
                    // en cas d'erreur si la bdd n'a rien trouvé il renvoit erreur
                    return err;
                })
        );
    }

    //Mise a jour de la connexion => dernière date de connexion a afficher par exemple
    /* static updateConnexion(id) {
        //const { id } = req.params;
        return db
            .query("UPDATE users SET connexionTimestamp = NOW() WHERE id = ?", [
                id,
            ])
            .then((res) => {
                return res;
            })
            .catch((err) => {
                return err;
            });
    } */

    //SUPPRIMER UN COMPTE
    static deleteOneUser(id) {
        return db
            .query("DELETE FROM users WHERE id = ? ", [id])
            .then((res) => {
                return res; // SI ta requete est bonne ça passe dans un then succès
            })
            .catch((err) => {
                return err; // si la requete est pas bonne quelque chose s'est mal passé alors il passe dans le catch egt il renvoi l'err dans le .code
            });
    }
}
