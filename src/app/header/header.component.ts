import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
declare var $:any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  url!: string;
  url1!: string;
  activeRoute!: string;
  active2Route!: string;
  guestuser: boolean = false;
  registereduser: boolean = false;
  constructor(private router: Router) { 
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url.split("/");
        this.url = url[1];
        this.url1 = url[2];
        this.activeRoute = this.url;
        this.active2Route = this.url1;
      }
    });
  }
  ngOnInit(): void {

    // Sidebar
	
    if($(window).width() <= 991){
      var Sidemenu = function() {
        this.$menuItem = $('.main-nav a');
      };
      
      function init() {
        var $this = Sidemenu;
        $('.main-nav a').on('click', function(e: { preventDefault: () => void; }) {
          if($(this).parent().hasClass('has-submenu')) {
            e.preventDefault();
          }
          if(!$(this).hasClass('submenu')) {
            $('ul', $(this).parents('ul:first')).slideUp(350);
            $('a', $(this).parents('ul:first')).removeClass('submenu');
            $(this).next('ul').slideDown(350);
            $(this).addClass('submenu');
          } else if($(this).hasClass('submenu')) {
            $(this).removeClass('submenu');
            $(this).next('ul').slideUp(350);
          }
        });
      }
  
      // Sidebar Initiate
      init();
      }

      // Mobile menu sidebar overlay
	
      $('body').append('<div class="sidebar-overlay"></div>');
      $(document).on('click', '#mobile_btn', function() {
        $('main-wrapper').toggleClass('slide-nav');
        $('.sidebar-overlay').toggleClass('opened');
        $('html').addClass('menu-opened');
        return false;
      });
      
      $(document).on('click', '.sidebar-overlay', function() {
        $('html').removeClass('menu-opened');
        $(this).removeClass('opened');
        $('main-wrapper').removeClass('slide-nav');
      });
      
      $(document).on('click', '#menu_close', function() {
        $('html').removeClass('menu-opened');
        $('.sidebar-overlay').removeClass('opened');
        $('main-wrapper').removeClass('slide-nav');
      });
      
      //scroll header

      $(document).ready(function(){
        $(window).scroll(function(){
        var scroll = $(window).scrollTop();
          if (scroll > 50) {
          $(".header-trans").css("background" , "#134a56");
          $(".header-trans").css("top" , "0");
          $(".header-trans").css("position" , "fixed");
          $('body').addClass('map-up');
          }

          else{
            $(".header-trans").css("background" , "transparent");  	
            $(".header-trans").css("top" , "auto");  
            $(".header-trans").css("position" , "relative");
            $('body').removeClass('map-up');	
          }
        });
      });
  }

}
