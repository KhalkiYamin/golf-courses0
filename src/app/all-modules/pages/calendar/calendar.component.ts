import { Component, OnInit, ViewEncapsulation } from '@angular/core';
declare var FullCalendar: any;
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialDate: new Date(),
      editable: true,
      selectable: true,
      businessHours: true,
      dayMaxEvents: true, // allow "more" link when too many events
      headerToolbar: {
        start: 'prev,next today',
        center: 'title',
        end: 'dayGridMonth,dayGridWeek,dayGridDay',
      },
      themeSystem: 'bootstrap',
      events: [
        {
          title: 'All Day Event',
          start: '2021-04-01',
        },
        {
          title: 'Long Event',
          start: '2021-04-07',
        },
        {
          groupId: 999,
          title: 'Repeating Event',
          start: '2021-04-09T16:00:00',
        },
        {
          groupId: 999,
          title: 'Repeating Event',
          start: '2021-04-16T16:00:00',
        },
        {
          title: 'Conference',
          start: '2020-06-11',
        },
        {
          title: 'Meeting',
          start: '2020-06-12T10:30:00',
        },
        {
          title: 'Lunch',
          start: '2021-04-12T12:00:00',
        },
        {
          title: 'Meeting',
          start: '2021-04-12T14:30:00',
        },
        {
          title: 'Happy Hour',
          start: '2021-04-12T17:30:00',
        },
        {
          title: 'Dinner',
          start: '2021-04-12T20:00:00',
        },
        {
          title: 'Birthday Party',
          start: '2021-04-13T07:00:00',
        },
      ],
    });

    calendar.render();
  }

}
