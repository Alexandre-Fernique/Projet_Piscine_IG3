
console.log("initialisation")

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        initialDate: '2020-11-07',
        allDaySlot:false,

        slotMinTime:"07:00:00",
        slotMaxTime:"22:00:00",
        weekends:false,


        themeSystem: 'bootstrap',

        headerToolbar: {
            left: 'prev',
            center: 'title',
            right: 'next',
        },



        events: [

            {
                groupId: '999',
                title: 'Repeating Event',
                start: '2020-11-09T16:00:00'
            },
            {
                groupId: '999',
                title: 'Repeating Event',
                start: '2020-11-16T16:00:00'
            },

            {
                title: 'Meeting',
                start: '2020-11-12T10:30:00',
                end: '2020-11-12T12:30:00'
            },
            {
                title: 'Lunch',
                start: '2020-11-12T12:00:00'
            },
            {
                title: 'Meeting',
                start: '2020-11-12T14:30:00'
            },
            {
                title: 'Birthday Party',
                start: '2020-11-13T07:00:00'
            },
            {
                title: 'Click for Google',
                url: 'http://google.com/',
                start: '2020-11-28'
            }
        ]
    });
    calendar.setOption('locale', 'fr');

    calendar.render();
});
console.log("fini")


