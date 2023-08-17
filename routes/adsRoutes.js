






/* 

//route de récupération de toutes les annonces
app.get("/api/v1/ads", async (req, res, next) => {
    let adsBDD = await db.query("SELECT * FROM ads")
    if(adsBDD.code){
        res.json({status: 500, error_msg: adsBDD})
    } else {
        res.json({status: 200, results: adsBDD})
    }
})

//route de récupération d'une seule annonce (par son id)
app.get("/api/v1/ads/:id", async (req, res, next) => {
    let addBDD = await db.query("SELECT * FROM ads WHERE Id = ?", [req.params.id])
    if(addBDD.code){
        res.json({status: 500, error_msg: addBDD})
    } else {
        res.json({status: 200, results: addBDD[0]})
    }
})

//une route de sauvegarde d'une annonce (pour l'image vous mettez req.body.url)
app.post("/api/v1/ads/save", async (req, res, next) => {
    let ajout = await db.query("INSERT INTO ads (Title, Contents, Url, CreationTimesTamp) VALUES (?, ?, ?, NOW())", [req.body.title, req.body.contents, req.body.url])
    if(ajout.code){
        res.json({status: 500, error_msg: ajout})
    }else{
        res.json({status: 200, result: "Annonce enregistrée!"})
    }
})

//route d'ajout d'une image dans l'api (stock une image et retourne au front le nom de l'image stocké)
app.post("/api/v1/ads/pict", (req, res, next) => {
    console.log(req.files.image)
    //si on a pas envoyé de req.files via le front ou que cet objet ne possède aucune propriété
    if(!req.files || Object.keys(req.files).length === 0){
        //on envoi une réponse d'erreur
        res.json({status: 400, msg: "La photo n'a pas pu être récupéré!"})
    }else{
        //la fonction mv va envoyer l'image dans le dossier que l'on souhaite
        req.files.image.mv(`public/images/${req.files.image.name}`, (err)=>{
            //si ça plante dans la callback
            if(err){
                res.json({status: 500, msg: "La photo n'a pas pu être récupéré!", error: err})
            }
        })
        
        //si c'est good on retourne un json avec le nom de la photo qui vient d'être enregistré vers le front
        res.json({status: 200, msg: "image enregistrée poto!", url: req.files.image.name})
    }
})

//route de modification d'une annonce
app.put('/api/v1/ads/update/:id', async (req, res, next)=>{
    let addBDD = await db.query("SELECT * FROM ads WHERE Id = ?", [req.params.id])
    if(addBDD.code){
        res.json({status: 500, error_msg: addBDD})
    }else{
        console.log(req.body)
        let modif = await db.query("UPDATE ads SET Title=?, Contents=?, Url=? WHERE Id = ?", [req.body.title, req.body.contents, req.body.url, req.params.id])
        if(modif.code){
            res.json({status: 500, error_msg: modif})
        }else{
            //on vérifie si l'utilisateur a changé d'image, si le nouvel url a été changé, on supprime l'ancienne image du back
            if(addBDD[0].Url !== req.body.url){
                fs.unlink(`public/images/${addBDD[0].Url}`, (err) => {
                    if(err){
                        res.json({status: 500, error_msg: "L'articler est supprimé mais pas l'image", err: err})
                    }else{
                        res.json({status: 200, msg: "Modification de l'annonce réussie!"})
                    }
                })
            }else{
                //il n'a pas modifié l'url c'est toujours la mm image on lui dit tout est ok
                res.json({status: 200, msg: "Modification de l'annonce réussie!"})
            }
        }
    }
})

//route de suppression d'une annonce
app.delete("/api/v1/ads/delete/:id", async (req, res, next)=>{
    let addBDD = await db.query("SELECT * FROM ads WHERE Id = ?", [req.params.id])
    if(addBDD.code){
        res.json({status: 500, error_msg: addBDD})
    }else{
        let supp = await db.query("DELETE FROM ads WHERE Id = ?", [req.params.id])
        if(supp.code){
            res.json({status: 500, error_msg: supp})
        }else{
            //si l'image d'avant suppression ne correspond pas à no-pict
            if(addBDD[0].Url !== "no-pict.webp"){
                //on ordonne la suppression de l'image de l'article qui vient d'être supprimé
                fs.unlink(`public/images/${addBDD[0].Url}`, (err) => {
                    if(err){
                        res.json({status: 500, error_msg: "L'articler est supprimé mais pas l'image", err: err})
                    }else{
                        res.json({status: 200, msg: "Annonce supprimée avec succès!"})
                    }
                })
            }else{
                res.json({status: 200, msg: "Annonce supprimée avec succès!"})
            }
        }
    }
})


*/