module.exports = (_db) => {
    db = _db;
    return AdModel;
};

class AdModel {
    //récupération de toutes les annonces
    static getAllAds() {
        return db
            .query("SELECT * FROM ads")
            .then((res) => {
                return res;
            })
            .catch((err) => {
                return err;
            });
    }

    // recup d'une seule annonce par son id >> quan dl'user va cliquer sur le détail d'une annonce
    static getOneAd(id) {
        return db
            .query("SELECT * FROM ads WHERE id = ?", [id])
            .then((res) => {
                return res;
            })
            .catch((err) => {
                return err;
            });
    }

    // sauvegarde/ creation d'une annonce quand l'user veut creer une annonce via un formulaire
    static createOneAd(req) {
        // req.body contient tous les champs du formulaire
        //ici on fait une destructuration ce qui permet de racourcir et d'eviter req.body.xxx
        const { userId, title, description, price } = req.body;

        return db
            .query(
                "INSERT INTO ads (userId, title, description, price, creationDate) VALUES (?, ?, ?, ?, NOW())",
                [userId, title, description, price] // pourquoi ya que id en bleu foncé ?
            )
            .then((res) => {
                return res;
            })
            .catch((err) => {
                return err;
            });
    }

    // modification d'une annonce
    static updateOneAd(req) {
        const { id, title, description, price } = req.body;

        return db
            .query(
                "UPDATE ads SET title=? , description=?, price=? WHERE id=?",
                [title, description, price, id]
            )
            .then((res) => {
                return res;
            })
            .catch((err) => {
                return err;
            });
    }

    // supprimer une annonce
    static deleteOneAd(id) {
        return db
            .query("DELETE FROM ads WHERE id=?", [id])
            .then((res) => {
                return res;
            })
            .catch((err) => {
                return err;
            });
    }

    static getUserAds(userId) {
        return db
            .query("SELECT * FROM ads WHERE userId = ?", [userId])
            .then((res) => {
                return res;
            })
            .catch((err) => {
                return err;
            });
    }
}
