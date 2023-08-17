const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
let config
if(!process.env.HOST_DB) {
    config = require('../config')
}else {
    config = require('../config-exemple')
}
let secret = process.env.TOKEN_SECRET || config.token.secret;
//const mail = require('../lib/mailing');

const withAuth = require('../withAuth');


module.exports = (app, db)=>{
    const userModel = require('../models/UserModel')(db);
    
    //route d'ajout d'un utilisateur
    app.post('/api/v1/user/add', async (req,  res, next)=>{
        //sauvegarde d'un utilisateur (la colonne validate sera no par defaut)
        let result = await userModel.saveOneUser(req);
        
        if(result.code) {
            res.json({status: 500,msg: "echec requète", err: result})
        }

        if(result.status === 501 ) {
            res.json(result)        
        }
        
        //envoi d'un mail (avec un lien a qui pointe vers la route api de validation par le key_id)
        mail(
            req.body.email, 
            "validation de votre compte", 
            "Bienvenu sur commersaas", 
            'Pour valider votre mail, cliquez <a href="http://fsjs14.ide.3wa.io:9500/api/v1/user/validate/'+result.key_id+'">ici<a/> !'
        )
                
        res.json({status: 200, msg: "Utilisateur enregistré"})
    
    })
    
    //route de validation d'un utilisateur (par son key_id)
    app.get('/api/v1/user/validate/:key_id', async (req, res, next)=>{
        let key_id = req.params.key_id;
        //on update la colonne validate de no à yes
        let validate = await userModel.updateValidateUser(key_id);
        if(validate.code) {
            res.json({status: 500, msg: 'probleme', error: validate});
        }
        
        res.json({status: 200, msg:"compte utilisateur validé"})
    
    })
    
    
    
    //route de demande de récupération de mot de pass oublié
    app.post('/api/v1/user/forgot', async (req, res, next)=>{
        let result = await userModel.updateKeyId(req.body.email);
         
        if(result.code) {
             res.json({status: 500, msg: "nous n'avons pas pu envoyer un email", error: result});
         }
         
         let key_id = result.key_id;
         mail(
            req.body.email, 
            "changement de mot de passe", 
            "Mot de passe oublié ?", 
            'Pour modifier votre mot de passe, cliquez <a href="http://fsjs14.ide.3wa.io:9500/api/v1/user/changePassword/'+key_id+'">ici<a/> !'
            );
         
         res.json({status: 200, msg: "email envoyé"})
        
    })
    
    //route d'affichage du template de modification de password (ejs)
    app.get('/api/v1/user/changePassword/:key_id', async (req, res, next)=>{
        let key_id = req.params.key_id;
        
        res.render('forgot', {key_id: key_id, error: null})
    })
    
    //route de modification du mot de passe
    app.post('/api/v1/user/changePassword/:key_id', async (req, res, next)=>{
        let key_id = req.params.key_id;
        let error = null
        if(req.body.password1 !== req.body.password2) {
            error = "Vos deux mots de passe ne sont pas identique !";
        } else {
            let result = await userModel.updatepassword(req.body.password1, key_id);
            if(result.code) {
                error = "le mot de passe ne s'est pas modifié !"
            } else {
                error = "le mot de passe bien modifié !"
            }
        }
        
        res.render('forgot', {key_id: key_id, error: error})
        
    })
    
    //route de login
    app.post('/api/v1/user/login', async (req,  res, next)=>{
        let user = await userModel.getUserByMail(req.body.email);
        if(user.length === 0) {
            res.json({status: 404, msg: "email inexistant dans la base de donnée"})
        } else {
            if(user[0].validate === "no") {
                res.json({status: 403, msg: "Votre compte n'est pas validé"})
            }
            
            let same = await bcrypt.compare(req.body.password, user[0].password);
            if(same) {
    
                let infos = {id: user[0].id, email: user[0].email}
                let token = jwt.sign(infos, secret);
    
                res.json({status: 200, msg: "connecté", token: token, user: user[0]})
                
            } else {
                res.json({status: 401, msg: "mauvais mot de passe"})
            }
            
        }
        
    })
}





