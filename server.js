const express = require('express');
const app = express();
app.use(express.static(__dirname + '/public'));
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
const cors = require('cors');
app.use(cors());
const config = require('./config')
const mysql = require('promise-mysql');

//CREATION _ IMPORTATION  DES ROUTES QU ON STOCVK DANS DES CONSTANTES 
const userRoutes = require('./routes/userRoutes')
const adRoutes = require('./routes/adRoutes')


// SYOCKAGE DES INFO CHEMINS DE CONFIG DE BDD DANS CONTANTES
const host = process.env.HOST_DB || config.db.host;
const database = process.env.DATABASE_DB || config.db.database;
const user = process.env.USER_DB || config.db.user;
const password = process.env.PASSWORD_DB || config.db.password;
const port = process.env.PORT || config.db.port;

//CONNEXION A MA BDD 
mysql.createConnection({
	host: host,
	database: database,
	user: user,
	password: password,
	port: port
}).then((db) => {
    console.log('connecté bdd');
	
	app.get('/', (req, res, next)=>{
		res.json({msg: 'Welcome to Food Hero api bro!', status: 200})
	})

    //APPEL de nos routes
    userRoutes(app, db)
    adRoutes(app, db)
})
// en cas d'erreur 
.catch(err=>console.log(err)) 


// on stock le chemin du port dans une constantes 
const PORT = process.env.PORT || 9600;

// ici 
app.listen(PORT, ()=>{
	console.log('listening port: '+PORT+' bro!');
})