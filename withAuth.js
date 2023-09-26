// cette fonction permet de verifier que c'est bien la bonne personne qui veut faire une operation sensible comme se connecter, ajouter des choses...

// on a besoin d'importer le token
const jwt = require("jsonwebtoken");

const config = require("./config.js");

// on stocke le secret dans une variable
const secret = config.token.secret;
console.log(secret);

// 3. creation d'une fonction withAuth qui vas verifier

const withAuth = (req, res, next) => {
    const token = req.headers["x-access-token"];
    if (token === undefined) {
        res.json({
            status: 404,
            msg: "token not found",
        });
    } else {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.json({
                    status: 401,
                    msg: "error, your token is invalid",
                });
            } else {
                req.id = decoded.id;
                next();
            }
        });
    }
};
//permet d'exporter la fonction withAuth qui sera accessible partout en import avec require
module.exports = withAuth;
