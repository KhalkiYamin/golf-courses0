import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  testimonialOptions = {
      nav: true,
			items: 1,
			autoplay: true,
			loop: true,
			autoplayTimeout: 50000,
			navText: ["<i class='fas fa-arrow-left owl-nav-left'></i>", "<i class='fas fa-arrow-right owl-nav-right ml-3'></i>"],
  };
  testimonialslides = [
    {
      img: "assets/img/clients/client2.jpg",
      name: "William  Zoe",
      country: "uk",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor, nunc vulputate aliquam in.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor, nunc vulputate aliquam in."
    },
    {
      img: "assets/img/clients/client2.jpg",
      name: "William  Zoe",
      country: "uk",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor, nunc vulputate aliquam in.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tortor, nunc vulputate aliquam in."
    }
  ];
  constructor() { }

  ngOnInit(): void {
  }

}
