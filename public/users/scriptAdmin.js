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

let now="";
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
        title: event.salle+prof,
        start: event.date.split("T")[0] + "T" + event.heureDebut,
        end:event.date.split("T")[0] + "T"+addTime(event.heureDebut,event.dureeCreneau)
    };
    liste.push(data);
    console.log(liste);

}
document.addEventListener('DOMContentLoaded', function() {
    let calendarEl = document.getElementById('calendar');
    var draggable = document.getElementById('external-events')

    new FullCalendar.Draggable(draggable, {
        itemSelector: '.fc-event',
        eventData: function(eventEl) {
          return {
            //duration : duree
          };
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
        editable: true,
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
        eventDrop : function(evenEdit) {
            var id = eventEdit.event.id;
            var date = eventEdit.event.start.split("T")[0];
            var heureDebut = eventEdit.event.start.split("T")[1];
            var request = new XMLHttpRequest();
            request.open("POST","admin/evenement/modifier/")
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			//informations necessaires à date, heureDebut, salle, dureeCreneau, idEvenement ,idGroupeProjet
            let data ="id="+id+"&date="+date+"&heureDebut="+heureDebut ;
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
            var id = 1 //demander à julien
            var date = (1900+event.date.getYear())+"-"+event.date.getMonth()+1+"-"+event.date.getDate()
            var heureDebut = event.date.getHours()+":"+event.date.getMinutes()+":"+event.date.getSeconds()
            var request = new XMLHttpRequest();
            request.open("POST","/admin/evenement/createCreneau" )
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			//informations necessaires date, heureDebut, salle, dureeCreneau, idEvenement ,idGroupeProjet
            let data ="id="+id+"&date="+date+"&heureDebut="+heureDebut ;
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
        events: liste,

    });
    calendar.setOption('locale', 'fr');
    if(now != ""){
        calendar.gotoDate(now);
    }
    calendar.render();
});



