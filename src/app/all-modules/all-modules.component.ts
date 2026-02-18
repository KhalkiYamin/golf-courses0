import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-all-modules',
  templateUrl: './all-modules.component.html',
  styleUrls: ['./all-modules.component.css']
})
export class AllModulesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

      // Textarea Text Count
    
    var maxLength = 100;
    $('#review_desc').on('keyup change', function () {
      var length = $(this).val().length;
      length = maxLength-length;
      $('#chars').text(length);
    });

    // Floating Label

    if($('.floating').length > 0 ){
      $('.floating').on('focus blur', function (e: { type: string; }) {
      $(this).parents('.form-focus').toggleClass('focused', (e.type === 'focus' || this.value.length > 0));
      }).trigger('blur');
    }
    
    // Tooltip
	
    if($('[data-toggle="tooltip"]').length > 0 ){
      $('[data-toggle="tooltip"]').tooltip();
    }
    
    // Add More Hours
    
      $(".hours-info").on('click','.trash', function () {
      $(this).closest('.hours-cont').remove();
      return false;
      });

      $(".add-hours").on('click', function () {
      
      var hourscontent = '<div class="row form-row hours-cont">' +
        '<div class="col-12 col-md-10">' +
          '<div class="row form-row">' +
            '<div class="col-12 col-md-6">' +
              '<div class="form-group">' +
                '<label>Start Time</label>' +
                '<select class="form-control">' +
                  '<option>-</option>' +
                  '<option>12.00 am</option>' +
                  '<option>12.30 am</option>' + 
                  '<option>1.00 am</option>' +
                  '<option>1.30 am</option>' +
                '</select>' +
              '</div>' +
            '</div>' +
            '<div class="col-12 col-md-6">' +
              '<div class="form-group">' +
                '<label>End Time</label>' +
                '<select class="form-control">' +
                  '<option>-</option>' +
                  '<option>12.00 am</option>' +
                  '<option>12.30 am</option>' +
                  '<option>1.00 am</option>' +
                  '<option>1.30 am</option>' +
                '</select>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="col-12 col-md-2"><label class="d-md-block d-sm-none d-none">&nbsp;</label><a href="#" class="btn btn-danger trash"><i class="far fa-trash-alt"></i></a></div>' +
      '</div>';
      
          $(".hours-info").append(hourscontent);
          return false;
      });
    
    // Content div min height set
    
    function resizeInnerDiv() {
      var height = $(window).height();	
      var header_height = $(".header").height();
      var footer_height = $(".footer").height();
      var setheight = height - header_height;
      var trueheight = setheight - footer_height;
      $(".content").css("min-height", trueheight);
    }
    
    if($('.content').length > 0 ){
      resizeInnerDiv();
    }

    $(window).resize(function(){
      if($('.content').length > 0 ){
        resizeInnerDiv();
      }
    });

    
    // Chat

    var chatAppTarget = $('.chat-window');
    (function() {
      if ($(window).width() > 991)
        chatAppTarget.removeClass('chat-slide');
      
      $(document).on("click",".chat-window .chat-users-list a.media",function () {
        if ($(window).width() <= 991) {
          chatAppTarget.addClass('chat-slide');
        }
        return false;
      });
      $(document).on("click","#back_user_list",function () {
        if ($(window).width() <= 991) {
          chatAppTarget.removeClass('chat-slide');
        }	
        return false;
      });
    })();
    
  }

}
