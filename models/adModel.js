module.exports = (_db) => {
    db = _db;
    return BeerModel;
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

    // recup d'une seule annonce par son id
    static getOneAd(id) {
        return db.query("SELECT * FROM ads WHERE id = ?", [id]).then().catch();
    }

    // sauvegarde d'une annonce
    static saveOneAd(id) {
        //ici on fait une destructuration ce qui permet de racourcir et d'eviter req.body.xxx
        const { id, title, description, price } = req.body;

        // CHANGER CREATIONDATE PAR CREATIONTIMESTAMP

        return db
            .query(
                "INSERT INTO ads (id, title, description, price, creationDate) VALUES (?, ?, ?, ?, NOW())",
                [id, title, description, price] // pourquoi ya que id en bleu foncé ?
            )
            .then((res) => {
                return res;
            })
            .catch((err) => {
                return err;
            });
    }

    // modification d'une annonce
    static updateOneAd(req, id) {
        const { title, description, price } = req.body;

        return db
            .query(
                "UPDATE ads SET title=? , description=?, price=?, photo=? WHERE id=?",
                [id, title, description, price]
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
}
