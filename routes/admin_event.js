const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require(path.join(__dirname, '..', 'bin', 'bdd')); // Permet la connexion à la base de données
const auth = require (path.join(__dirname, '..', 'bin', 'auth'));
const jwt = require('jsonwebtoken');
const htmlspecialchars = require('htmlspecialchars');
const { Console } = require('console');
const recupParam = require(path.join(__dirname, '..', 'bin', 'paramRecup'));

const modelEvenement = require(path.join(__dirname, '..', 'model', 'evenement'));
const modelCreneau = require(path.join(__dirname, '..', 'model', 'creneaux'));
const modelEtudiant = require(path.join(__dirname, '..', 'model', 'etudiant'));
const modelProf = require(path.join(__dirname, '..', 'model', 'professeur'));


function miseAJourPage (template, donnee, id) {
    let num = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];

    let dateDebut = new Date(String(donnee.dateDebut));
    donnee.dateDebut = dateDebut.getFullYear() + "-" + num[dateDebut.getMonth()+1] + "-" + num[dateDebut.getDate()];

    let dateLimiteResa = new Date(String(donnee.dateLimiteResa));
    donnee.dateLimiteResa = dateLimiteResa.getFullYear() + "-" + num[dateLimiteResa.getMonth()+1] + "-" + num[dateLimiteResa.getDate()];

    template = template.toString().replace('%id%', htmlspecialchars(donnee.id));
    template = template.toString().replace('%dateDebut%', htmlspecialchars(donnee.dateDebut));
    template = template.toString().replace(new RegExp('%nomEvent%', 'gi'), htmlspecialchars(donnee.nom));
    template = template.toString().replace('%Duree%', htmlspecialchars(donnee.Duree));
    template = template.toString().replace('%dateLimiteResa%', htmlspecialchars(donnee.dateLimiteResa));
    template = template.toString().replace('%dureeCreneau%', htmlspecialchars(donnee.dureeCreneau));
    template = template.toString().replace('%nombreMembresJury%', htmlspecialchars(donnee.nombreMembresJury));
    template = template.toString().replace('%anneePromo%', htmlspecialchars(donnee.anneePromo));
    template = template.toString().replace(new RegExp(':id', 'gi'), id);
    return template;
}

router.all('/create', (req, res, next) => { //Création de l'évenement
    if (auth(req, res, next) !== 1) {
        fs.readFile(path.join(__dirname, 'error', 'Admin', 'pasAdmin.html'), (err, template) => {
            if (err)
                throw err;
            else
                res.end(template);
        });
    } else {
        console.log("OK");
        fs.readFile(path.join(__dirname, 'view', 'Admin', 'evenement', 'creationEvenement.html'), (err, template) => {
            if (err)
                throw err;
            fs.readFile(path.join(__dirname, 'view', 'Admin', 'header.html'), (err, header) => {
                let accueil = template.toString().replace('<header>%</header>', header.toString());
                res.end(accueil)
            });
        });
    }
});

router.all('/modifierSalleProf/:id', (req, res, next) => { //Création de l'évenement
    if (auth(req, res, next) !== 1) {
        fs.readFile(path.join(__dirname, 'error', 'Admin', 'pasAdmin.html'), (err, template) => {
            if (err)
                throw err;
            else
                res.end(template);
        });
    } else {
        console.log("OK");
        fs.readFile(path.join(__dirname, 'view', 'Admin', 'evenement', 'modifierCreneau.html'), (err, template) => {
            if (err)
                throw err;
            else {
                fs.readFile(path.join(__dirname, 'view', 'Admin', 'header.html'), (err, header) => {
                    //console.log(template.toString());
                    let accueil = template.toString().replace('<header>%</header>', header.toString());
                    modelCreneau.getProf().then((nom)=>{
                            modelEvenement.getNbJury(req.params.id).then((nbJury)=>{
                                let text = '<script>let nbJury =' + nbJury[0].nombreMembresJury +';let prof=`<option selected disabled value=""> Prof </option>'
                                let string = JSON.parse(JSON.stringify(nom))
                                for (let prof of string) {
                                    text += '<option value="' + prof['id'] + '" >' + prof['nom'] +' '+ prof['prenom']+ '</option> ';
                                }
                                console.log(text);
                                res.end(accueil.toString().replace('<prof></prof>', text+"`</script>"));
                            }).catch((error) => {
                                res.end("Probleme jury")
                            })
                    }).catch((error) => {
                        res.end("Probleme prof")
                    })
                });
            }
            
        });
    }
});

router.all('/afficherSalleProf/:id', (req, res, next) => {
    if (auth(req, res, next) !== 1) {
        fs.readFile(path.join(__dirname, 'error', 'Admin', 'pasAdmin.html'), (err, template) => {
            if (err)
                throw err;
            else
                res.end(template);
        });
    } else {
        let salle = recupParam(req, "salle");
        let listeidProf = recupParam(req, "nom");
        console.log("IDPROFFFF"+listeidProf);
        console.log(req.params.id)
        
        modelCreneau.modifierSalle([salle,req.params.id])
            .then((values) => { 
                modelCreneau.modifierProf(req.params.id, listeidProf)
                    .then((requete)=>{
                        console.log("par la aussi ");
                        console.log(requete);
                        //res.writeHead(302, {'Location': '/addCreneau/:id'});
                        res.end("end");
                    })
                    .catch(function (){
                        console.log("liaison etudiants groupe");
                        fs.readFile(path.join(__dirname, 'error', 'pbBDD.html'), (err, content) => {
                            content = content.toString().replace('<header>%</header>', "");
                            res.end(content);
                        });
                    });
            })
            .catch(function () {
                console.log("création groupe");
                fs.readFile(path.join(__dirname, 'error', 'pbBDD.html'), (err, content) => {
                    content = content.toString().replace('<header>%</header>', "");
                    res.end(content);
                });
        });
        
    }
});

router.all('/created', (req, res, next) => {
    if (auth(req, res, next) !== 1) {
        fs.readFile(path.join(__dirname, 'error', 'Admin', 'pasAdmin.html'), (err, template) => {
            if (err)
                throw err;
            else
                res.end(template);
        });
    } else {
        let nomEvent = recupParam(req, "nomEvent");
        let dateDebut = recupParam(req, "dateDebut");
        let Duree = recupParam(req, "Duree");
        let dateLimiteResa = recupParam(req, "dateLimiteResa");
        let dureeCreneau = recupParam(req, "dureeCreneau");
        let nombreMembresJury = recupParam(req, "nombreMembresJury");
        let anneePromo = recupParam(req, "anneePromo");

        modelEvenement.getByPromo("*", anneePromo)
            .then((row) => {
                if (row && row.length ) {
                    let alert = require('alert');
                    alert("Vous avez déjà un évenement en cours pour les " + anneePromo + " !")
                    res.writeHead(302, {'Location': '/admin/evenement/read/' + anneePromo});
                    res.end();
                } else {
                    modelEvenement.create([nomEvent ,dateDebut, Duree, dateLimiteResa, dureeCreneau, nombreMembresJury, anneePromo])
                        .then((retour) => {
                            console.log(retour);
                            res.writeHead(302, {'Location': '/admin/evenement/list'}); //On le redirige vers la vue de cet évenement
                            res.end();
                        })
                        .catch(
                            function (err) {
                                console.log(err);
                                fs.readFile(path.join(__dirname, 'error', 'pbBDD.html'), (err, content) => {
                                    content = content.toString().replace('<header>%</header>', "");
                                    res.end(content);
                                });
                            }
                        );
                }
            })
            .catch((error) => {
                console.log(error);
                fs.readFile(path.join(__dirname, 'error', 'pbBDD.html'), (err, content) => {
                    content = content.toString().replace('<header>%</header>', "");
                    res.end(content);
                });
            })
    }
});


router.all('/read/:id', (req, res, next) => { //Afficher le détail de l'évenement
    if (auth(req, res, next) !== 1) {
        fs.readFile(path.join(__dirname, 'error', 'Admin', 'pasAdmin.html'), (err, template) => {
            if (err)
                throw err;
            else
                res.end(template);
        });
    } else {
        fs.readFile(path.join(__dirname, 'view', 'Admin', 'evenement', 'detail.html'), (err, template) => {
            if (err)
                throw err;
            fs.readFile(path.join(__dirname, 'view', 'Admin', 'header.html'), (error, header) => {
                if (error)
                    throw error;
                let accueil = template.toString().replace('<header>%</header>', header.toString());
                modelEvenement.getByPromotion(req.params.id)
                    .then((data) => {
                        if (data.length > 0) { //l'évenement recherché existe bien
                            accueil = miseAJourPage(accueil, data[0], req.params.id);
                            //template = template.toString().replace('disabled', ''); Pour la modification de l'événement, si on utilise la même page hmtl
                            res.end(accueil);
                        }
                        else { //Notre événement n'existe pas
                            fs.readFile(path.join(__dirname, 'view', 'Admin', 'evenement', 'pasEvenementId.html'), (err, content) => {
                                content = content.toString().replace('<header>%</header>', header.toString());
                                content = content.toString().replace(':id', req.params.id);
                                res.end(content);
                            });
                        }
                    })
                    .catch((err) => { //erreur de communication avec la BDD *
                        console.log(err);
                        fs.readFile(path.join(__dirname, 'error', 'pbBDD.html'), (err, content) => {
                            content = content.toString().replace('<header>%</header>', header.toString());
                            res.end(content);
                        });
                    })
            });
        });
    }
});

router.all('/list', (req, res, next) => {
    if (auth(req, res, next) !== 1) {
        fs.readFile(path.join(__dirname, 'error', 'Admin', 'pasAdmin.html'), (err, template) => {
            if (err)
                throw err;
            else
                res.end(template);
        });
    } else {
        fs.readFile(path.join(__dirname, 'view', 'Admin', 'evenement', 'list.html'), (err, template) => {
            if (err)
                throw err;
            fs.readFile(path.join(__dirname, 'view', 'Admin', 'header.html'), (err, header) => {
                let page = template.toString().replace('<header>%</header>', header.toString());
                modelEvenement.getAll()
                    .then((data) => {
                        if (data.length > 0) { //On a pu trouver un événement dans notre base de donnée
                            let tmp, resultat = "";
                            for (let i = 0; i < data.length; i++) {
                                tmp = '<div class="col-md-4 card" style="width: 30rem;">' +
                                            '<div class="card-body">' +
                                                '<h5 class="card-title">' + data[i].nom + '</h5>' +
                                                '<h6 class="card-subtitle mb-2 text-muted">' + data[i].anneePromo +'</h6>' +
                                                '<a href="/admin/evenement/read/'+ data[i].anneePromo +'" class="card-link">Voir l\'événement</a>' +
                                            '</div>' +
                                        '</div>'
                                resultat += tmp;
                            }
                            console.log(resultat)
                            page = page.toString().replace('<evenements>%</evenements>', resultat.toString());
                            res.end(page);
                        }
                        else {
                            fs.readFile(path.join(__dirname, 'view', 'Admin', 'evenement', 'pasEvenement.html'), (err, content) => {
                                content = content.toString().replace('<header>%</header>', header.toString());
                                res.end(content);
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        fs.readFile(path.join(__dirname, 'error', 'pbBDD.html'), (err, content) => {
                            content = content.toString().replace('<header>%</header>', header.toString());
                            res.end(content);
                        });
                    })
            });
        })
    }
})

router.all('/addCreneau/:id', (req, res, next) => { //Affichage du planning pour l'ajout de crenau à un evenement
    if (auth(req, res, next) !== 1) {
        fs.readFile(path.join(__dirname, 'error', 'Admin', 'pasAdmin.html'), (err, template) => {
            if (err)
                throw err;
            else
                res.end(template);
        });
    } else {
        console.log("OK");
        fs.readFile(path.join(__dirname, 'view', 'Admin', 'evenement', 'ajoutCreneau.html'), (err, template) => {
            if (err)
                throw err;
            fs.readFile(path.join(__dirname, 'view', 'Admin', 'header.html'), (err, header) => {
                if(err)
                    throw err;

                let accueil = template.toString().replace('<header>%</header>', header.toString());

                modelEtudiant.getEvent(req.params.id).then((listEvent) => {
                    modelEtudiant.getProfEvent(req.params.id).then((profEvent) => {
                        console.log(req.params.id)
                        modelCreneau.getEvent(req.params.id).then((nomEvent)=> {
                            modelCreneau.getDureeCreneau(req.params.id).then((dureeCreneau)=> {
                                console.log(nomEvent)
                                let donne = "<script>let tampon=" + JSON.stringify(listEvent) + ";let ProfEvent=" + JSON.stringify(profEvent) + ";let dureeCreneau=" + JSON.stringify(dureeCreneau) + ";let eventID=" + JSON.stringify(nomEvent[0].id) + "</script>" //ajouter dureeCreneau : slotDuration
                                res.end(accueil.replace('<event></event>', donne).replace("%NOMEVENT%",htmlspecialchars(nomEvent[0].nom)))
                                //ajout à la page html la liste des creneaux et la durée générale de tout les créneaux
                            }).catch(() => {
                                console.log("Problème duree creneau")
                            })
                        }).catch(() => {
                            console.log("Problème nom event")
                        })
                        
                    }).catch(() => {
                        console.log("Problème Prof event")
                    })
                }).catch(() => {
                    console.log("Problème event ou groupe");
                    //Si l'étudiant n'a pas de groupe ou erreur dans la requête SQL des events
                    res.end("Erreur")
                })

            });
        });
    }
});

router.post('/createCreneau', (req, res, next) => { //Creer un creneau pour un event
    if (auth(req, res, next) !== 1) {
        fs.readFile(path.join(__dirname, 'error', 'Admin', 'pasAdmin.html'), (err, template) => {
            if (err)
                throw err;
            else
                res.end(template);
        });
    } else {
        //"INSERT INTO `creneaux` (`date`, `heureDebut`, `salle`, `idEvenement`, `idGroupeProjet`)
        let id = recupParam(req, "id");
        let date = recupParam(req, "date");
        let heureDebut = recupParam(req, "heureDebut");
        console.log("Mon ID"+id)

        modelCreneau.createCreneau([date, heureDebut, id])
            .then((retour) => {
                res.end("OK");
            })
            .catch(
                function () {
                    console.log("Une erreur est survenue dans la fonction");
                    res.end("ERROR CREATION");
                }
            );
    }
});
router.get("/idcreneau",((req, res) => {
    modelCreneau.getIdLastCreate().then((id)=>{
        console.log(id[0].id)
        res.end(JSON.stringify(id[0].id))
    }).catch(()=>{
        console.log("problème")
        res.end("Problème")
    })
}));

router.post('/modifier', (req, res, next) => { //Ajouter u crenau à un evenement
    if (auth(req, res, next) !== 1) {
        fs.readFile(path.join(__dirname, 'error', 'Admin', 'pasAdmin.html'), (err, template) => {
            if (err)
                throw err;
            else
                res.end(template);
        });
    } else {
        //"INSERT INTO `creneaux` (`date`, `heureDebut`, `salle`, `idEvenement`, `idGroupeProjet`)
        let id = recupParam(req, "id");
        let date = recupParam(req, "date");
        let heureDebut = recupParam(req, "heureDebut").split(" ")[0];
        console.log(heureDebut);
        modelCreneau.modifier([date, heureDebut, id])
            .then((retour) => {
               res.end("OK");
            })
            .catch(
                function () {
                    console.log("Une erreur est survenue dans la fonction");
                    res.end("ERROR");
                }
            );
    }
});
router.post('/addSalleProf', (req, res, next) => { //Ajouter u crenau à un evenement
    if (auth(req, res, next) !== 1) {
        fs.readFile(path.join(__dirname, 'error', 'Admin', 'pasAdmin.html'), (err, template) => {
            if (err)
                throw err;
            else
                res.end(template);
        });
    } else {
        console.log("addSalleeeee")
        let salle = recupParam(req, "salle");
        let id = recupParam(req, "id");
        let prof = recupParam(req, "prof");
        console.log(salle);
        console.log(prof);
        modelCreneau.modifierSalle([salle,id])
            .then((retour) => {
                modelCreneau.modifierProf([id,prof])
                .then((retour) => {
                    console.log(retour)
                    //res.writeHead(302, {'Location': '/admin/evenement/addCreneau:id'});
                    res.end("OK");
                })
                .catch(
                    function () {
                        console.log("Une erreur est survenue dans la fonction");
                        res.end("ERROR");
                    }
            );
            })
            .catch(
                function () {
                    console.log("Une erreur est survenue dans la fonction");
                    res.end("ERROR");
                }
        );
    }
});

router.all('/update/:id', (req, res, next) => { //Afficher le détail de l'évenement
    if (auth(req, res, next) !== 1) {
        fs.readFile(path.join(__dirname, 'error', 'Admin', 'pasAdmin.html'), (err, template) => {
            if (err)
                throw err;
            else
                res.end(template);
        });
    } else {
        fs.readFile(path.join(__dirname, 'view', 'Admin', 'evenement', 'update.html'), (err, template) => {
            if (err)
                throw err;
            fs.readFile(path.join(__dirname, 'view', 'Admin', 'header.html'), (err, header) => {
                if (err)
                    throw err;
                let accueil = template.toString().replace('<header>%</header>', header.toString());
                modelEvenement.getByPromotion(req.params.id)
                    .then((data) => {
                        if (data.length > 0) {
                            modelEvenement.getAllPromotionAvailable()
                                .then((listePromotion) => {

                                    let promo;
                                    let txt = "<option value = \"" + req.params.id + "\" selected>" + req.params.id +"</option> \n";
                                    for (let i = 0; i < listePromotion.length; i ++) {
                                        promo = listePromotion[i].annee;

                                        txt += "<option value = \"" + promo + "\">" + promo +"</option>"
                                        txt += "\n";
                                    }
                                    accueil = accueil.toString().replace("%option%", txt);
                                    accueil = miseAJourPage(accueil, data[0], req.params.id);
                                    res.end(accueil);
                                })
                                .catch((err) => {
                                    console.log(err);
                                    throw err;
                                })
                        } else {
                            fs.readFile(path.join(__dirname, 'view', 'Admin', 'evenement', 'pasEvenementId.html'), (err, content) => {
                                content = content.toString().replace('<header>%</header>', header.toString());
                                content = content.toString().replace(':id', req.params.id);
                                res.end(content);
                            });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        fs.readFile(path.join(__dirname, 'error', 'pbBDD.html'), (err, content) => {
                            content = content.toString().replace('<header>%</header>', header.toString());
                            res.end(content);
                        });
                    })
            });
        });
    }
});

router.all('/updated', (req, res, next) => {
    if (auth(req, res, next) !== 1) { //On test si la personne qui tente de rentrer est un administrateur
        fs.readFile(path.join(__dirname, 'error', 'Admin', 'pasAdmin.html'), (err, template) => {
            if (err)
                throw err;
            else
                res.end(template);
        });
    } else {
        let id = recupParam(req, "id");
        let nomEvent = recupParam(req, "nomEvent");
        let dateDebut = recupParam(req, "dateDebut");
        let Duree = recupParam(req, "Duree");
        let dateLimiteResa = recupParam(req, "dateLimiteResa");
        let dureeCreneau = recupParam(req, "dureeCreneau");
        let nombreMembresJury = recupParam(req, "nombreMembresJury");
        let anneePromo = recupParam(req, "anneePromo");
        modelEvenement.update([nomEvent, dateDebut, Duree, dateLimiteResa, dureeCreneau, nombreMembresJury, anneePromo, id])
            .then((retour) => {
                console.log(retour);
                res.writeHead(302, {'Location': '/admin/evenement/read/' + anneePromo}); //On le redirige vers la vue de cet évenement
                res.end();
            })
            .catch(
                function (err) {
                    console.log(err);
                    fs.readFile(path.join(__dirname, 'error', 'pbBDD.html'), (err, content) => {
                        content = content.toString().replace('<header>%</header>', "");
                        res.end(content);
                    });
                }
            );
    }
});

router.all("/delete/:id", (req, res, next) => {
    if (auth(req, res, next) !== 1) { //On test si la personne qui tente de rentrer est un administrateur
        fs.readFile(path.join(__dirname, 'error', 'Admin', 'pasAdmin.html'), (err, template) => {
            if (err)
                throw err;
            else
                res.end(template);
        });
    } else {
        const modelCreneaux = require(path.join(__dirname, '..', 'model', 'creneaux'));
        const modelParticipe = require(path.join(__dirname, '..', 'model', 'participe'));
        const modelgroupeProjet = require(path.join(__dirname, '..', 'model', 'groupeProjet'));
        const modelComposer = require(path.join(__dirname, '..', 'model', 'composer'));
        modelParticipe.clearByEvent(req.params.id)
            .then((pa) => { //Nettoyage de la table Participe
                console.log("Participe : " + pa)
                modelCreneaux.clearByEvent(req.params.id)
                    .then((ev) => { //Nettoyage de la table Creneaux
                        console.log("Creneaux : " + ev)
                        modelEvenement.clearByEvent(req.params.id)
                            .then((cr) => { //Nettoyage de la table Evenement
                                console.log("Evenement : " + cr)
                                fs.readFile(path.join(__dirname, 'view', 'Admin', 'evenement', 'supprime.html'), (err, template) => {
                                    if (err)
                                        throw err;
                                    fs.readFile(path.join(__dirname, 'view', 'Admin', 'header.html'), (err, header) => {
                                        if (err)
                                            throw err;
                                        template = template.toString().replace('<header>%</header>', header.toString());
                                        template = template.toString().replace(':id', req.params.id);
                                        res.end(template);
                                    })
                                })
                            })
                            .catch((err) => {
                                console.log(err);
                                fs.readFile(path.join(__dirname, 'error', 'pbBDD.html'), (err, content) => {
                                    content = content.toString().replace('<header>%</header>', "");
                                    res.end(content);
                                });
                            })
                    })
                    .catch((err) => {
                        console.log(err);
                        fs.readFile(path.join(__dirname, 'error', 'pbBDD.html'), (err, content) => {
                            content = content.toString().replace('<header>%</header>', "");
                            res.end(content);
                        });
                    });
            })
            .catch((err) => {
                console.log(err);
                fs.readFile(path.join(__dirname, 'error', 'pbBDD.html'), (err, content) => {
                    content = content.toString().replace('<header>%</header>', "");
                    res.end(content);
                });
            })
        // modelComposer.clearByEvent(req.params.id)
        //     .then((com) => {
        //         console.log("Composer : " + com)
        //         modelgroupeProjet.truncate()
        //             .then((pr) => {
        //                 console.log("Groupe Projet : " + pr)
        //                 //TODO ?
        //             })
        //             .catch((err) => {
        //                 console.log("Une erreur dans le truncate des groupeprojet");
        //                 res.end(err);
        //             })
        //     })
        //     .catch((err) => {
        //         console.log("Une erreur dans le truncate des Composer (Etudiants / groupeprojet)");
        //         res.end(err);
        //     })
    }
});

module.exports = router;