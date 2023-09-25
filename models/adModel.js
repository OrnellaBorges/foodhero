module.exports = (_db) => {
    db = _db;
    return BeerModel;
};

class AdModel {
    //récupération des annonces

    static getAllAds() {}

    // recup d'une seule annonce par son id
    static getOneAd(id) {}

    // sauvegarde d'une annonce
    static saveOneAd(id) {}

    // modification d'une annonce
    static updateOneAd(req, id) {}

    // supprimer une annonce
    static deleteOneAd() {}
}
