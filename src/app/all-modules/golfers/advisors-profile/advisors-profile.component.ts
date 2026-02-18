import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-advisors-profile',
  templateUrl: './advisors-profile.component.html',
  styleUrls: ['./advisors-profile.component.css']
})
export class AdvisorsProfileComponent implements OnInit {

  constructor() { }
  
  images = [
    {
      path: 'assets/img/features/feature-01.jpg',
    },
    {
      path: 'assets/img/features/feature-02.jpg',
    },
    {
      path: 'assets/img/features/feature-03.jpg',
    },
    {
      path: 'assets/img/features/feature-04.jpg',
    },
  ];
  
  ngOnInit(): void {
  }

}
