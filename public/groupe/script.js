var cible=document.getElementById("Cible")
for(etu of etudiant){
    cible.innerHTML+= "<div class='form-group'>\n<label for='nom'>Etudiant</label>\n<input type='text' class='form-control' id='nom'value='"+etu.nom+" "+etu.prenom+"' readonly></input></div>";

}
document.getElementById("nomTuteurEntreprise").value=info[0].nomTuteurEntreprise
document.getElementById("prenomTuteurEntreprise").value=info[0].prenomTuteurEntreprise
document.getElementById("nomT").value=info[0].prenom+" "+info[0].nom
document.getElementById("nomEntreprise").value=info[0].nomEntreprise
