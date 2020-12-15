
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        titleFormat:{ year: 'numeric', month: 'long', day: 'numeric' },
        allDaySlot:false,
        slotMinTime:"07:00",
        scrollTime:"08:00",
        slotMaxTime:"22:00",
        weekends:false,
        defaultTimedEventDuration: duree ,
        dayHeaderFormat:{ weekday: 'long',day:'numeric'},
        height: 'auto',
        nowIndicator: true,
        themeSystem: 'bootstrap',

        headerToolbar: {
            left: 'prev',
            center: 'title',
            right: 'next',
        },
        events: liste
    });
    calendar.setOption('locale', 'fr');
    if(now != ""){
        calendar.gotoDate(now);
    }
    calendar.render();
});


