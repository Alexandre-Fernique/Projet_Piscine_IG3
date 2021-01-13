function addTime(heure,duree){
    let heureArray=heure.split(":");
    let dureeArray=duree.split(":");
    let returnMinute=parseInt(heureArray[1])+parseInt(dureeArray[1]);
    let returnHours=parseInt(heureArray[0])+parseInt(dureeArray[0]);

    if(returnMinute>=60){
        returnHours++;
        returnMinute-=60;
    }
    if(returnMinute<10)
        returnMinute = "0" + returnMinute;



    return returnHours+":"+returnMinute+":00";
}
let liste=[]

for (let event of tampon) {
    let prof ="";
    for (let i of ProfEvent)
    {
        if(i.id===event.id)
            prof+=i.nom+" "+i.prenom+", ";
    }
    let data ={};
    data = {
        id: event.id,
        title: event.salle+" "+event.prof,
        start: event.date.split("T")[0] + "T" + event.heureDebut,
        end:event.date.split("T")[0] + "T"+addTime(event.heureDebut,event.dureeCreneau)
    };
    console.log("HEYYYYYYYYY"+event.prof);
    liste.push(data);
    console.log(liste);

}



document.addEventListener('DOMContentLoaded', function() {
    let calendarEl = document.getElementById('calendar');
    var draggable = document.getElementById('external-events')

    new FullCalendar.Draggable(draggable, {
        itemSelector: '.fc-event',
        eventData: function(eventEl) {
            var requetID= new XMLHttpRequest();
            requetID.open("GET","/admin/evenement/idcreneau",false);
            let data={}
            requetID.onload=()=> {
                data ={
                    id: requetID.response,
                    title:"PAS DE SALLE",
                    duration: dureeCreneau[0].dureeCreneau,
                };
                console.log(data)
            }
            console.log(data)
            requetID.send()
            return data



        }
    });

    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        titleFormat:event.id,
        allDaySlot:false,
        slotMinTime:"07:00",
        scrollTime:"08:00",
        slotMaxTime:"22:00",
        weekends:false,
        dayMaxEvents:3,
        editable:true,
        eventDurationEditable:false,
        droppable: true,
        views:{
            timeGrid: {
                dayHeaderFormat:{ weekday: 'long',day:'numeric'},
                },
            dayGridMonth: {
                dayHeaderFormat:{ weekday: 'long'},
            }
        },
        buttonText:{
            month:    'Mois',
            week:     'Semaine',
        },
        height:'auto',
        dayHeaderFormat:{ weekday: 'long',day:'numeric'},
        nowIndicator: true,
        themeSystem: 'bootstrap',

        headerToolbar: {
            left: 'prev',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,next',
        },
        eventDrop : function(eventEdit) {
            var id = eventEdit.event.id;
            var date = eventEdit.event.startStr.split("T")[0];
            var heureDebut = eventEdit.event.startStr.split("T")[1];
            var request = new XMLHttpRequest();
            request.open("POST","/admin/evenement/modifier")
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			//informations necessaires à date, heureDebut, salle, dureeCreneau, idEvenement ,idGroupeProjet
            let data ="id="+id+"&date="+date+"&heureDebut="+heureDebut ;
            console.log(data);
            request.send(data);
            /*request.onload=()=>{
                console.log(request.response);
                if(request.response==="okay"){
                    alert[0].hidden=false
                    alert[1].hidden=true
                }
                else {
                    alert[1].hidden=false
                    alert[0].hidden=true
                }
            }*/
        } ,
        drop : function(event) {
            //date_object
            let url = window.location.href.split("/");
            let promo = url[url.length-1]; 
            var date = (1900+event.date.getYear())+"-"+event.date.getMonth()+1+"-"+event.date.getDate()
            var heureDebut = event.date.getHours()+":"+event.date.getMinutes()+":"+event.date.getSeconds()
            var request = new XMLHttpRequest();
            request.open("POST","/admin/evenement/createCreneau" )
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			//informations necessaires date, heureDebut, salle, dureeCreneau, idEvenement ,idGroupeProjet
            let data ="id="+eventID+"&date="+date+"&heureDebut="+heureDebut ;
            request.send(data);
            request.onload=()=>{
                console.log("MA reponse"+request.response);
            }
            /*request.onload=()=>{
                console.log(request.response);
                if(request.response==="okay"){
                    alert[0].hidden=false
                    alert[1].hidden=true
                }
                else {
                    alert[1].hidden=false
                    alert[0].hidden=true
                }
            }*/
        },
        eventClick: function(info) {
            let  salle = prompt("Modifiez la salle")
            let prof = prompt("Modifiez l'id")
            info.event.title.split(" ")[0] = salle
            info.event.title.split(" ")[1] = prof
            alert('Event: ' + info.event.title);
            console.log("event"+info.event.title);
            // change the border color just for fun
            info.el.style.borderColor = 'red';
          },
        events: liste,

    });
    calendar.setOption('locale', 'fr');

    calendar.render();
});



