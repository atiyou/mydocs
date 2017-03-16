var selectedSlide = [], sliderCount = [], slideCount = [];
function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}
function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}
jQuery(document).ready(function ($) {
   if(navigator.userAgent.match(/MSIE\s(?!9.0)/)){
    if(getCookie('user_ie8')!=1){
        if (typeof Drupal.settings.jetair_configuration.jetair_ie_warning_form !== 'undefined' && Drupal.settings.jetair_configuration.jetair_ie_warning_form !== '') {
            $('#tui-info-modal').modal('show');
            $('#tui-info-modal .modal-title').html(Drupal.t('Warning'));
            $('#tui-info-modal .modal-body').html(Drupal.t(Drupal.settings.jetair_configuration.jetair_ie_warning_form));
            $('#tui-info-modal .modal-footer').html('');
            setCookie('user_ie8',1);
        }
     }
   }

  /* navigation */
  var viewport = $(window);
  var menuButton = $('#menuButton');
  var navigationHolder = $(".navigation");
  var profileNavigation = $(".profileNavigation");
  var header = $(".header");
  /* feature detection */

  // make "tab" selected when hash exists
  if ($('.tabBar').length) {
    if (window.location.hash) {
      var hash = window.location.hash.substring(1);
      $('.tabBar a[title=' + hash + ']').trigger('click');
    }
  }


  //if mobile then underline the links in the footer
  if (typeof isMobile != 'undefined' && isMobile.any) {
    //$(".footer-main-center li").addClass("footer_underline");
  }

  // Mobile toggles
  $(document).on("click touchstart", ".toggle", function (e) {
    e.preventDefault();
    $(this).parent().find(".bd").toggle();
  });

  $('.lang_dropdown_form').prepend('<div class="lang-dropdown-form-text">' + $('#lang-dropdown-select-language option:selected').text() + '<span class="glyphicon font-tui">/</span></div>');

  // Mobile - append secondary_tui_nav to navbar-nav when screen is xs (mobile)
  if (typeof breakpoint != 'undefined' && breakpoint == 'screen-xs' && $('.secondary_tui_nav').length) {
    var secNav = $('.secondary_tui_nav').clone();
    secNav.find('li').each(function () {
      if ($(this).find('a').attr('href').search('my_zone') != -1) {
        $(this).find('a').append('<i class="glyphicon glyphicon-user"></i>');
      }
      $('.navbar-nav').append($(this).addClass('visible-xs'));
    });
    if ($('.region-header-top-agent').length) {
      var regAgent = $('.region-header-top-agent').clone();
      $('.navbar-nav').append('<li class="visible-xs">' + regAgent.html() + '</li>');
    }
  }
  /*
   MOBILE FILTER LOGIC
   */

  $(document).on("click", "#filter, #sort", function (e) {
    e.preventDefault();

    var id = $(this).attr("id");
    var li = $(this).parent();

    if (li.hasClass("selected")) {
      li.removeClass("selected");
      $("section[data-panel=" + id + "]").hide();
    }
    else {
      $("li", ".mobileFiltersHead").removeClass("selected");
      li.addClass("selected");
      $("section", "#panels").hide();
      $("section[data-panel=" + id + "]").show();
    }
  });


  // Filter color checks
  $(document).on("change", "#filterOptions input[type='checkbox'], #filterOptions input[type='radio']", function () {
    var count = $(this).closest(".inputList").find('input[type=checkbox]:checked, input[type=radio]:checked').length;
    var group = $(this).attr("name");

    count == 0 ? $("a[rel=" + group + "]").removeClass("active") : $("a[rel=" + group + "]").addClass("active");
  });

  /*
   END OF MOBILE FILTER LOGIC
   */

  // Move responsive elements

  function moveElements() {
    if (typeof breakpoint != 'undefined') {
      if (breakpoint == 'xs') {
        if (navigationHolder.find(profileNavigation).length == 0) {
          navigationHolder.append(profileNavigation);
        }
      }
      else {
        if (header.find(profileNavigation).length == 0) {
          //				header.children( 'div.region' ).children('section[id^=block-menu-menu-secondary-menu]').prepend(profileNavigation);
          $('section[id^=block-menu-menu-secondary-menu]').append(profileNavigation);
        }
      }
    }
  }


  if (typeof viewport != 'undefined') {
    viewport.resize(function () {
      moveElements();
    });
  }

  moveElements();

  // Make navigation

  navigationHolder.hide();

  menuButton.click(function (e) {
    navigationHolder.toggle();
  });

  // Set same heights
  var $block = $('.sameHeight'),
    blockHeight = 0;

  $block.each(function () {
    if ($(this).height() > blockHeight) {
      blockHeight = $(this).height();
    }
  });

  $block.height(blockHeight);

  $('.closeFilter').click(function () {
    window.location = $(this).parent().attr("href");
  });

  if ($('input.filters').length) {
    $('input.filters').on("change", function () {
      if ($(this).attr('checked') == 'checked') {
        var nameFilter = $(this).attr('name');
        var descrFilter = $('#link_' + nameFilter).html();
        descrFilter = descrFilter.replace(/\((\s?)+\d+(\s?)+\)/, '').trim();
        if (typeof dataLayer != "undefined") {
          dataLayer.push({
            'event': 'hotellijst',
            'eventCategory': 'hotellijst',
            'eventAction': 'filter',
            'eventLabel': descrFilter
          });
        }
        $('#link_' + nameFilter).data('event', 'true');
      }
    });
    $('a[id^=link_]').click(function () {
      if ($(this).data('event') == undefined) {
        var nameFilter = $(this).attr('name');
        var descrFilter = $(this).html();
        if ($(this).attr('id').substring(0, 9) == "link_star") {
          descrFilter = $(this).attr('id').substring(10) + " sterren";
        } else {
          descrFilter = descrFilter.replace(/\((\s?)+\d+(\s?)+\)/, '').trim();
        }
        if (typeof dataLayer != "undefined") {
          dataLayer.push({
            'event': 'hotellijst',
            'eventCategory': 'hotellijst',
            'eventAction': 'filter',
            'eventLabel': descrFilter
          });
        }
      }
    });
  }

  if ($('section.sort a').length) {
    $('section.sort a').click(function () {
      var descrFilter = $(this).html();
      if (typeof dataLayer != "undefined") {
        dataLayer.push({
          'event': 'hotellijst',
          'eventCategory': 'hotellijst',
          'eventAction': 'filter',
          'eventLabel': descrFilter
        });
      }
    });
  }

  if ($('.thumbgallery-hotel').length) {
    if (typeof isMobile != 'undefined' && isMobile.any && $.isFunction($.fn.photoSwipe)) {
      $(".thumbgallery-hotel").photoSwipe({
        enableMouseWheel: true,
        enableKeyboard: true,
        captionAndToolbarAutoHideDelay: 0,
        imageScaleMethod: 'fit',
        rel: 'data-gallery-hotel'
      });
    } else {
      if ($.isFunction($.fn.colorbox)) {
        $('.thumbgallery-hotel').colorbox({
          maxHeight: '100%',
          rel: 'data-gallery-hotel'
        });
      }
    }
  }

  if ($('.thumbgallery').length) {
    if (typeof isMobile != 'undefined' && isMobile.any && $.isFunction($.fn.photoSwipe)) {

      var group_gallery = false;
      $("div.hotel-block").each(function (index) {
        var className = "gallery-" + (index + 1);
        $(this).find("a.thumbgallery")
            .addClass(className)
            .photoSwipe({
              enableMouseWheel: true,
              enableKeyboard: true,
              captionAndToolbarAutoHideDelay: 0,
              imageScaleMethod: 'fit',
              rel: className
            }
        );
        group_gallery = true;
      });

      if (group_gallery==false) {
        $(".thumbgallery").photoSwipe({
          enableMouseWheel: true,
          enableKeyboard: true,
          captionAndToolbarAutoHideDelay: 0,
          imageScaleMethod: 'fit',
          rel: 'data-gallery'
        });
      }

    } else {
      if ($.isFunction($.fn.colorbox)) {
        var group_gallery = false;
        $("div.hotel-block").each(function (index) {
            var className = "gallery-" + (index + 1);
            $(this).find("a.thumbgallery")
                .addClass(className)
                .colorbox({
                  maxHeight: '100%',
                  rel: className
                }
            );
            group_gallery = true;
        });

        if (group_gallery==false) {
          $('.thumbgallery').colorbox({
            maxHeight: '100%',
            rel: 'data-gallery'
          });
        }



      }




    }
  }
  if ($('.videogallery').length && $.isFunction($.fn.colorbox)) {
    $(".videogallery").colorbox({
      /*rel:'thumbs', */
      transition: "none",
      iframe: true,
      innerHeight: 391,
      innerWidth: 640,
      rel: 'data-gallery'
    });
  }

  if ($.isFunction($.fn.tooltipster)) {
    if ($('.advantagesInfoPopover').length > 0) {
      if( isMobile.any ) {
        $('.advantagesInfoPopover').tooltipster({
          trigger: 'click',
          maxWidth: 400,
          contentAsHTML: true,
	  interactive: true
        });
      }else {
        $('.advantagesInfoPopover').tooltipster({
          trigger: 'click',
          onlyOne: true,
          maxWidth: 400,
          contentAsHTML: true,
	  interactive: true
        });
      }
    }
  }

  $('body').click(function () {
    if ($('.tooltipster-base').length > 0) {
      //$( document ).tooltipster('hide')
      $(".tooltipster-base").hide();
    }
  });

  $('.hidethumb').parent().hide();


  $('#emergency').on('shown.bs.modal', function (e) {
    $('.accordion-body').collapse('show');
  });

  /*Mobile footer add collapse*/
  if (typeof breakpoint != 'undefined' && breakpoint == 'screen-xs') {
    var section = $('.footer-center aside .block-menu');
    section.each(function () {
      var getHtml = $(this).find('h3').html();
      var setHtml = "<a href='javascript:void(0);'";
      //setHtml 	+= " data-target='#" + $(this).attr( 'id' )+ "-nav'";
      setHtml += "  class='link-styled h4'>";
      setHtml += getHtml;
      setHtml += "</a>";
      $(this).find('h3').html(setHtml);
      $(this).find('h3').addClass('collapsed hd-collapse');
      $(this).find('h3').attr('data-target', '#' + $(this).attr('id') + '-nav');
      $(this).find('h3').attr('data-toggle', 'collapse');
      $(this).find('h3').attr('href', '#' + $(this).attr('id') + '-nav');
      $(this).find('.menu').attr('id', $(this).attr('id') + '-nav').addClass('collapse');
    });
  }



  $("body").on('click', 'a[data-toggle=collapse]', function (e) {
    e.preventDefault();
    $(this).parent().toggleClass("collapsed");
  });

  if (typeof breakpoint != 'undefined' && (breakpoint == 'screen-md' || breakpoint == 'screen-lg')) {
    expandInputFields($('.search-hotel-inline'));
  }

 /* try {
    $('.important-message marquee').marquee('pointer').mouseover(function () {
      $(this).trigger('stop');
    }).mouseout(function () {
      $(this).trigger('start');
    });
  } catch (excp) {
  }*/


  addSlider();

  if ($('.ie8 body').length) {
    $('.ie8 body').css({'display': 'inherit'});
  }

  if ($(".minplus-select").length){
    replaceMinplusSelect();
  }
});

jQuery(document).ajaxComplete(function (e, xhr, settings) {
  //addClassAndroidSelects();

  if ($.isFunction($.fn.tooltipster)) {
    if ($('.payNowInfoPopover ').length > 0) {
      $('.payNowInfoPopover ').tooltipster({
        trigger: 'click',
        onlyOne: true,
        maxWidth: 400,
        contentAsHTML: true
      });
    }
  }
});



function expandSelect() {
  $('#' + id).click();
}

function getHeights() {
  var checkHeight = $(window).height();
  $('.player-container').height(checkHeight);
  $('.player').height(checkHeight);
  $('.header-container').height(checkHeight);
}
function expandInputFields(field) {
  $('.expand-input').find('input').on('click', function (event) {
    if (!event.detail || event.detail == 1) { //ignore expaning when double click
      if ($('.expand-input').hasClass('expanded')) {
        $('.expand-input').removeClass('expanded');
        $('.expand-input').find('input').trigger('blur');
      } else {
        $('.expand-input').addClass('expanded');
        /*to make this flexible, I'm storing the current width in an attribute*/
        $('.expand-input').attr('data-default', $('.expand-input').width());
        $('.expand-input').width(field.width());
        $('.expand-input').find('.input-group').css('z-index', '1010');
      }
    } else {
      return false;
    }
  }).blur(function () {
    /* lookup the original width */
    if (!$('.dropdown .autocomplete').length) {
      var w = $('.expand-input').attr('data-default');
      $('.expand-input').animate({width: w}, 'fast', 'swing', function () {
        $('.expand-input').removeClass('expanded');
        $('.expand-input').attr('style', '');
        $('.expand-input').find('.input-group').attr('style', '');
      });
    }
  }).keydown(function () {
    if (!$('.expand-input').hasClass('expanded')) {
      $('.expand-input').addClass('expanded');
      /*to make this flexible, I'm storing the current width in an attribute*/
      $('.expand-input').attr('data-default', $('.expand-input').width());
      $('.expand-input').width(field.width());
      $('.expand-input').find('.input-group').css('z-index', '1010');
    }
  });
}

function addSlider() {
  slideCount = 3;
  if (typeof breakpoint != 'undefined' && breakpoint == 'screen-xs') {
    if ($(window).innerWidth() < 481) {
      slideCount = 1;
    } else {
      slideCount = 2;
    }
  }
  buildSlider();

  $(window).resize(function () {

    if (typeof breakpoint != 'undefined' && breakpoint === 'screen-xs') {
      if ($(window).innerWidth() < 481 && slideCount > 1) {
        slideCount = 1;
        buildSlider();
      } else if ($(window).innerWidth() > 480 && slideCount !== 2) {
        slideCount = 2;
        buildSlider();
      }
    } else if (typeof breakpoint != 'undefined' && breakpoint !== 'screen-xs' && slideCount < 3) {
      slideCount = 3;
      buildSlider();
    }
  });
}
function buildSlider() {
  $(".block-slider").each(function (i) {
    selectedSlide[i] = 0;
    sliderCount[i] = $(this).find(".slider-item").length;
    sliding = false;

    $(this).find(".slider-prev").removeClass("active");
    if (sliderCount[i] > slideCount) {
      $(this).find(".slider-next").addClass("active");
    }
    $(this).on("click", ".slider-next", function () {
      if (sliding === false) {
        sliding = true;
        i = $(".block-slider").index($(this).parents(".block-slider"));

        if (selectedSlide[i] < (sliderCount[i] - slideCount)) {
          selectedSlide[i] = selectedSlide[i] + 1;
          if (selectedSlide[i] === (sliderCount[i] - slideCount)) {
            $(".block-slider:eq(" + i + ") .slider-next").removeClass("active");
          }
          $(".block-slider:eq(" + i + ") .slider-item:eq(" + (selectedSlide[i] - 1) + ")").fadeOut('slow', function () {
            $(".block-slider:eq(" + i + ") .slider-item:eq(" + (selectedSlide[i] + (slideCount - 1)) + ")").fadeIn();

            $(".block-slider:eq(" + i + ") .slider-prev").addClass("active");
            sliding = false;
          });
        }
      }
    });
    $(this).on("click", ".slider-prev", function () {
      if (sliding === false) {
        sliding = true;
        i = $(".block-slider").index($(this).parents(".block-slider"));
        if (selectedSlide[i] > 0) {
          selectedSlide[i] = selectedSlide[i] - 1;
          if (selectedSlide[i] === 0) {
            $(".block-slider:eq(" + i + ") .slider-prev").removeClass("active");
          }
          $(".block-slider:eq(" + i + ") .slider-item:eq(" + (selectedSlide[i] + slideCount) + ")").fadeOut('slow', function () {
            $(".block-slider:eq(" + i + ") .slider-item:eq(" + (selectedSlide[i]) + ")").fadeIn();

            $(".block-slider:eq(" + i + ") .slider-next").addClass("active");
            sliding = false;
          });
        }
      }
    });
    $(this).find(".slider-item").hide().each(function (index, value) {
      if (index < slideCount) {
        $(this).show();
      }
    });
  });

  function tog(v){return v?'addClass':'removeClass';}
  $(document).on('input', '.clearable', function(){
    $(this)[tog(this.value)]('x');
  }).on('mousemove', '.x', function( e ){
    $(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]('onX');
  }).on('touchstart click', '.onX', function( ev ){
    ev.preventDefault();
    $(this).removeClass('x onX').val('').change();
  });
}
Drupal.behaviors.limitCharactersTextarea = {
  attach: function (context, settings) {
    $('.limit-characters', context).on('input propertychange paste', function () {
      var limit = ($(this).attr('max') )?$(this).attr('max'):2000;
      $(this).parent().siblings(".description, .help-block").children(".placeholder").html(limit - $(this).val().length);
    });
  }
};

function replaceMinplusSelect(){
  $(".minplus-select").each(function(){
    select = $(this);
    current_key = $(this).val();
    current_value = $(this).find('option:selected').text();

    minplus = $('<div>', {
      'class': 'minplus'
    });

    min_btn = $('<a>', {
      'class': 'px-min',
      'html': "<span class=\"glyphicon glyphicon-minus\"></span>",
      'href': 'javascript:void(0);',
      'click': minplusClicked
    }).appendTo(minplus);

    label = $('<span>',{
      'class': 'px-label',
      'text': current_value
    }).appendTo(minplus);

    plus_btn = $('<a>', {
      'class': 'px-plus',
      'html': "<span class=\"glyphicon glyphicon-plus\"></span>",
      'href': 'javascript:void(0)',
      'click': minplusClicked
    }).appendTo(minplus);

    $(this).after(minplus);
  });

  updateMinplusIcons();

  function minplusClicked(){
    minplus = $(this).parent(".minplus");
    select = minplus.prev();
    currentitem = select.find("option:selected");
    if($(this).hasClass("px-min")){
      newitem = currentitem.prev();
    } else {
      newitem = currentitem.next();
    }
    if(newitem.length && !newitem.attr('disabled')){
      currentitem.removeAttr('selected');
      newitem.attr("selected","selected");
      minplus.find(".px-label").text(newitem.text());
      if(select.hasClass("select-pax")) {
        updateChildren($("select.select-pax"), 'pax');
        $('#search-hotel .travelers-amount-pax').text(newitem.val());
      } else {
        updateChildren($("select.select-child"), 'child');
        $('#search-hotel .travelers-amount-child').text(newitem.val());
      }
      updateSession(false);
    }
    updateMinplusIcons();
  }
  function updateMinplusIcons(){
    $(".minplus").each(function(){
      select = $(this).prev();
      currentitem = select.find("option:selected");
      $(this).find(".px-min, .px-plus").removeClass("active");
      if(currentitem.prev().length){
        $(this).find(".px-min").addClass("active");
      }
      if(currentitem.next().length && !currentitem.next().attr('disabled')){
        $(this).find(".px-plus").addClass("active");
      }
    });
  }
}
;
(function ($) {
  $.fn.extend({
    //plugin-name - tuiCustomSelect
    tuiCustomSelect: function (options) {

      var defaults = {
        dataIcon: 'glyphicon-tui-small-arrow-down',
        classes: ['.custom-select'],
        selectIds: [],
        onAllSelects: false
      };
      var tuiCustomSelectOptions = $.extend(defaults, options);

      if (tuiCustomSelectOptions['onAllSelects']) {
        $('select').each(function () {
          _createCustomSelects($(this), tuiCustomSelectOptions);
        });
        $('body').on('change', 'select', function () {
          var hasIcon = ( typeof $(this).find("option:selected").attr("text-icon") != 'undefined' && $(this).find("option:selected").attr("text-icon") != '' ) ? '<span class="glyphicon ' + $(this).find("option:selected").attr("text-icon") + '"></span>' : '';
          $(this).siblings('.custom-select-box').children('.custom-select-text').html(hasIcon + $(this).find("option:selected").html());
          var select_value = $(this).val(); //for a reason, the selected value didn't change: so we use the code below
          $("#" + $(this).attr('id') + " option").removeAttr('selected');
          $("#" + $(this).attr('id') + " option[value='" + select_value + "']").attr('selected', true);
        });
      } else {
        $.each(tuiCustomSelectOptions['classes'], function (e, cl) {

          $(cl).each(function () {
            _createCustomSelects($(this), tuiCustomSelectOptions);
          });

          $('body').on('change', cl, function () {
            var hasIcon = ( typeof $(this).find("option:selected").attr("text-icon") != 'undefined' && $(this).find("option:selected").attr("text-icon") != '' ) ? '<span class="glyphicon ' + $(this).find("option:selected").attr("text-icon") + '"></span>' : '';
            $(this).siblings('.custom-select-box').children('.custom-select-text').html(hasIcon + $(this).find("option:selected").html());
            var select_value = $(this).val(); //for a reason, the selected value didn't change: so we use the code below
            $("#" + $(this).attr('id') + " option").removeAttr('selected');
            $("#" + $(this).attr('id') + " option[value='" + select_value + "']").attr('selected', true);
          });
        });

        $.each(tuiCustomSelectOptions['selectIds'], function (e, cl) {

          $(cl).each(function () {
            _createCustomSelects($(this), tuiCustomSelectOptions);
          });

          $('body').on('change', cl, function () {
            var hasIcon = ( typeof $(this).find("option:selected").attr("text-icon") != 'undefined' && $(this).find("option:selected").attr("text-icon") != '' ) ? '<span class="glyphicon ' + $(this).find("option:selected").attr("text-icon") + '"></span>' : '';
            $(this).siblings('.custom-select-box').children('.custom-select-text').html(hasIcon + $(this).find("option:selected").html());
            var select_value = $(this).val(); //for a reason, the selected value didn't change: so we use the code below
            $("#" + $(this).attr('id') + " option").removeAttr('selected');
            $("#" + $(this).attr('id') + " option[value='" + select_value + "']").attr('selected', true);
          });
        });
      }
    }
  });
})(jQuery);


function _createCustomSelects(el, options) {
  var ieUserAgent = navigator.userAgent.match(/MSIE (\d+)/);
  if (ieUserAgent) {
    var ieVersion = ieUserAgent[1];
    if (ieVersion <= 8) {
      return;
    }
  }
  var hasIcon = ( typeof el.find("option:selected").attr("text-icon") != 'undefined' && el.find("option:selected").attr("text-icon") != '' ) ? '<span class="glyphicon ' + el.find("option:selected").attr("text-icon") + '"></span>' : '';
  var dataIcon = ( typeof el.attr('data-icon') != 'undefined' && el.attr('data-icon') != '' ) ? el.attr('data-icon') : options['dataIcon'];
  //flightplan works with selectbox size 5, code beneath stops this function from completing the customisation.
  if (el.attr('size') > 0 || el.attr('multiple') == true) {
    return;
  }
  if( el.prev().hasClass('custom-select-box') ){
    el.prev().remove();
  }
  if (el.css('display') != 'none' && ( typeof el.attr('id') != 'undefined' ) && !el.prev().hasClass('custom-select-box')) {
    el.addClass('custom-select');
    el.parent().addClass('position-rel');
    var classes = el.attr('class');
    el.before('<div class="custom-select-box ' + classes.replace('custom-select', '') + '"><span class="custom-select-text"></span><span class="glyphicon ' + dataIcon + ' pull-right"></span></div>');
    el.siblings('.custom-select-box').children('.custom-select-text').html(hasIcon + el.find("option:selected").text());
    el.css({'opacity': '0'});
  }
}
;
$(function () {
  function r(e, t) {
    var n = new Image, r = e.getAttribute("data-src");
    n.onload = function () {
      if (!!e.parent)e.parent.replaceChild(n, e); else e.src = r;
      t ? t() : null
    };
    n.src = r
  }

  function i(e) {
    var t = e.getBoundingClientRect();
    return t.top >= 0 && t.left >= 0 && t.top <= (window.innerHeight || document.documentElement.clientHeight)
  }

  var e = function (e, t) {
    if (document.querySelectorAll) {
      t = document.querySelectorAll(e)
    } else {
      var n = document, r = n.styleSheets[0] || n.createStyleSheet();
      r.addRule(e, "f:b");
      for (var i = n.all, s = 0, o = [], u = i.length; s < u; s++)i[s].currentStyle.f && o.push(i[s]);
      r.removeRule(0);
      t = o
    }
    return t
  }, t = function (e, t) {
    window.addEventListener ? this.addEventListener(e, t, false) : window.attachEvent ? this.attachEvent("on" + e, t) : this["on" + e] = t
  }, n = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t)
  };
  var s = new Array, o = e("img.lazy"), u = function () {
    for (var e = 0; e < s.length; e++) {
      if (i(s[e])) {
        r(s[e], function () {
          s.splice(e, e)
        })
      }
    }
  };
  for (var a = 0; a < o.length; a++) {
    s.push(o[a])
  }
  u();
  t("scroll", u)
})
;
/*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
!function (a) {
  function f(a, b) {
    if (!(a.originalEvent.touches.length > 1)) {
      a.preventDefault();
      var c = a.originalEvent.changedTouches[0], d = document.createEvent("MouseEvents");
      d.initMouseEvent(b, !0, !0, window, 1, c.screenX, c.screenY, c.clientX, c.clientY, !1, !1, !1, !1, 0, null), a.target.dispatchEvent(d)
    }
  }

  if (a.support.touch = "ontouchend"in document, a.support.touch) {
    var e, b = a.ui.mouse.prototype, c = b._mouseInit, d = b._mouseDestroy;
    b._touchStart = function (a) {
      var b = this;
      !e && b._mouseCapture(a.originalEvent.changedTouches[0]) && (e = !0, b._touchMoved = !1, f(a, "mouseover"), f(a, "mousemove"), f(a, "mousedown"))
    }, b._touchMove = function (a) {
      e && (this._touchMoved = !0, f(a, "mousemove"))
    }, b._touchEnd = function (a) {
      e && (f(a, "mouseup"), f(a, "mouseout"), this._touchMoved || f(a, "click"), e = !1)
    }, b._mouseInit = function () {
      var b = this;
      b.element.bind({
        touchstart: a.proxy(b, "_touchStart"),
        touchmove: a.proxy(b, "_touchMove"),
        touchend: a.proxy(b, "_touchEnd")
      }), c.call(b)
    }, b._mouseDestroy = function () {
      var b = this;
      b.element.unbind({
        touchstart: a.proxy(b, "_touchStart"),
        touchmove: a.proxy(b, "_touchMove"),
        touchend: a.proxy(b, "_touchEnd")
      }), d.call(b)
    }
  }
}(jQuery);
;
jQuery(document).ready(function ($) {

  $('body').on('hidden.bs.modal', '.modal', function () {
    $(this).removeData('bs.modal');
  });

  $(window).tuiCustomSelect({onAllSelects: true});

});

jQuery(document).ajaxComplete(function (e, xhr, settings) {
  $(window).tuiCustomSelect({onAllSelects: true});
});


function showDatepicker(el) {
  $(el).parent().find('input').focus();
}
;
