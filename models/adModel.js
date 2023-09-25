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
        return db
            .query(
                "INSERT INTO ads (id, title, price, photo, quantity, creationTimestamp) VALUES (?, ?, ?, ?, ?, NOW())",
                [
                    req.body.name,
                    req.body.description,
                    req.body.price,
                    req.body.photo,
                    req.body.quantity,
                ]
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
        return db
            .query(
                "UPDATE beers SET name=? , description=?, price=?, photo=?, quantity=? WHERE id=?",
                [
                    req.body.name,
                    req.body.description,
                    req.body.price,
                    req.body.photo,
                    req.body.quantity,
                    id,
                ]
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
            .then((response) => {
                return response;
            })
            .catch((err) => {
                return err;
            });
    }
}
