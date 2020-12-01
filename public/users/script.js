
document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        allDaySlot:false,
        slotMinTime:"07:00:00",
        slotMaxTime:"22:00:00",
        weekends:false,
        defaultTimedEventDuration: duree ,


        themeSystem: 'bootstrap',

        headerToolbar: {
            left: 'prev',
            center: 'title',
            right: 'next',
        },
        events: liste
    });
    calendar.setOption('locale', 'fr');

    calendar.render();
});


