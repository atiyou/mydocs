(function ($) {
  $(document).ready(function () {
    if( typeof isMobile !== 'undefined' &&  !isMobile.any && ( breakpoint != 'screen-sm' && breakpoint != 'screen-xs') ){
      if ($.isFunction($.fn.marquee) ) {
        $('.emergency-marquee').marquee(
          {
            'pauseOnHover': true
          }
        );
      }
    }
  });
})(jQuery);
;
var $ = jQuery;
$(document).ready(function () {

  $('ul.lm-filter').each(function () {
    var length = $(this).find('li').length;
    if (length > 7) {
      $('li', this).eq(6).nextAll().hide().addClass('toggleable');
      $(this).append('<li class="showMore">' + Drupal.t('more') + '</li>');
    }
  });

  if ($.isFunction($.fn.on)) {
    $('ul.lm-filter').on('click', '.showMore', function () {
      if ($(this).hasClass('less')) {
        $(this).text(Drupal.t('more')).removeClass('less');
      } else {
        $(this).text(Drupal.t('less')).addClass('less');
      }
      $(this).siblings('li.toggleable').toggle();
    });
  }

  var settings = Drupal.settings.amount_filter;

  if (typeof settings == 'object') {
    var min;
    var max;
    var minRange;
    var maxRange;
    var slideMin;
    var slideMax;
    var slideValue;
    min = parseInt(settings.min);
    max = parseInt(settings.max);
    slideValue = parseInt(settings.currentValue);
    if (settings.minRange) {
      minRange = parseInt(settings.minRange);
      maxRange = parseInt(settings.maxRange);
    } else {
      minRange = min;
      maxRange = max;
    }
    // prepare overlay
    var overlay = $('<div id="filterOverlay"><img src="/sites/all/modules/custom/book/img/loadingGif.gif" /></div>');
    overlay.css({
      'opacity': '0.7',
      'position': 'absolute',
      'top': '0',
      'left': '0',
      'z-index': '1000',
      'background': '#fff',
      'text-align': 'center',
      'padding': '15% 0 0 0',
      'width': $('#filters-sidebar').width() + 'px',
      'height': '100%'
    });

    slideMin = minRange;
    slideMax = maxRange;


    // init slider
    $('#slider-range').slider({
      range: true,
      step: 10,
      min: min,
      max: max,
      values: [minRange, maxRange],

      stop: function (event, ui) {
        handleInputFields(ui);
        handleFilterSelection();
      },
      slide: function (event, ui) {

        $('#sliderInputMin').val(ui.values[0]);
        $('#sliderInputMax').val(ui.values[1]);


      }
    });


    $('#slider-range-large').slider({
      range: true,
      step: 10,
      min: min,
      max: max,
      values: [minRange, maxRange],
      slide: function (event, ui) {

        $('#edit-min').val(ui.values[0]);
        $('#edit-max').val(ui.values[1]);

      }
    });

    // init slider
    $('#slider-radius').slider({
      value: slideValue,
      range: 'min',
      step: 1,
      min: min,
      max: max,
      slide: function (event, ui) {
        $('#filter_radius').html(ui.value + 'km');
      },
      stop: function (event, ui) {
        $('#filter_radius').html(ui.value + 'km');
        overlay.css('width', $('section.filters').width() + 'px');
        $('section.filters').append(overlay);
        var data_link = $('#filter_radius').attr('data-link').replace('%radius%', ui.value);
        location.href = data_link;
      }
    });

    // set input fields
    $('#sliderInputMin').val(minRange);
    $('#sliderInputMax').val(maxRange);

    // set input fields
    $('#edit-min').val(minRange);
    $('#edit-max').val(maxRange);

    // handle input events
    $('#sliderInputMin').on('blur', function () {
      updateSlider('#sliderInputMin', '#sliderInputMax', '#slider-range');
    });
    $('#sliderInputMax').on('blur', function () {
      updateSlider('#sliderInputMin', '#sliderInputMax', '#slider-range');
    });
    // handle filter events
    $('#filterRange').live('click', function () {
      handleFilterSelection();
    });
    // handle input events
    $('#edit-min').on('blur', function () {
      updateSlider('#edit-min', '#edit-max', '#slider-range-large');
    });
    $('#edit-max').on('blur', function () {
      updateSlider('#edit-min', '#edit-max', '#slider-range-large');
    });


    function updateSlider(sourceMin, soureMax, sliderId) {

      var checkMax = $(soureMax).val();
      if ($.isNumeric(checkMax)) {
        slideMax = parseInt(checkMax);
      }
      var checkMin = $(sourceMin).val();
      if ($.isNumeric(checkMin)) {
        slideMin = parseInt(checkMin);
      }
      if (slideMin >= slideMax) {
        slideMax = slideMin + 350;//separate sliders enough to prevent visual overlap
      }
      if (slideMin < min) {
        slideMin = min;
      }
      if (slideMax > max) {
        slideMax = max;
      }

      $(sourceMin).val(slideMin);
      $(soureMax).val(slideMax);
      $(sliderId).slider('values', [slideMin, slideMax]);
    }

    /* changes input fields with slider values and sets global vars slideMin & slideMax
     * this function can only be used within slider()
     */
    function handleInputFields(ui) {
      $('#sliderInputMin').val(ui.values[0]);
      $('#sliderInputMax').val(ui.values[1]);
      slideMin = $('#sliderInputMin').val();
      slideMax = $('#sliderInputMax').val();
    }

    function handleFilterSelection() {
      if (typeof slideMin !== 'undefined' && typeof slideMax !== 'undefined') {
        $('#filters-sidebar').append(overlay);
        var url = $(location).attr('href');

        // check if there are get parameters present in the url
        var get = url.search('\\?');
        if (get != -1) {
          var splittedUrl = url.split('?');
          url = splittedUrl[0];
        }

        var range = url.search('/range/');
        var results = url.search('results/filters');
        if (range == -1 && results == -1) {
          // range filter and results NOT present in the url
          location.href = url + '/results/filters/range/' + slideMin + ',' + slideMax;
        } else if (range == -1) {
          // range filter NOT present in the url
          location.href = url + '/range/' + slideMin + ',' + slideMax;
        } else {
          // range filter present in the url
          var splittedUrl = url.split('/');
          var rangePosition = $.inArray('range', splittedUrl) + 1;
          splittedUrl[rangePosition] = slideMin + ',' + slideMax;
          url = splittedUrl.join('/');
          location.href = url;
        }
      }
    }
  }
});
;
var $ = jQuery;
$(document).ready(function () {
  //implementation google tag manager

});

function sendGoogleTagManagerFields() {

  if ($('#edit-checkin-date-hidden').length && typeof dataLayer != 'undefined' && $('#edit-checkin-date-hidden').val() != '') {
    var checkinDateHidden = $('#edit-checkin-date-hidden').val();
    //dataLayer.push({'departureDate': checkinDateHidden});


    var oneDay = 24 * 60 * 60 * 1000;
    var secondDate = new Date(checkinDateHidden.substr(0, 4), parseInt(checkinDateHidden.substr(4, 2)) - 1, checkinDateHidden.substr(6, 2));
    var firstDate = new Date();
    var daysInAdvance = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
    // dataLayer.push({'daysInAdvance': daysInAdvance});

    var checkoutDateHidden = $('#edit-checkout-date-hidden').val();
    //   dataLayer.push({'returnDate': checkoutDateHidden});

    var firstDate = secondDate;
    var secondDate = new Date(checkoutDateHidden.substr(0, 4), parseInt(checkoutDateHidden.substr(4, 2)) - 1, checkoutDateHidden.substr(6, 2));
    var tripDuration = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
 //   dataLayer.push({'tripDuration': tripDuration});

    var numAdults = parseInt($('select.select-pax').val());
    var numChildren = parseInt($('select.select-child').val());
    if ($('#txt_childrenAges').length) {
      var decodedChildrenAges = jQuery.parseJSON($('#txt_childrenAges').val());
      if (decodedChildrenAges.length > 0) {
        dataLayer.push({'childrenAges': decodedChildrenAges});
      }
    }
  //  dataLayer.push({'numTravelers': (numAdults + numChildren )});

//    var mealtype = $('#edit-mealtype').val();
//    dataLayer.push({'mealType': mealtype});

/*    if ($('input[name=departureFlight]:checked').length) {
      var airportcode = $('input[name=departureFlight]:checked').val().substr(0, 3);
      dataLayer.push({'airportCode': airportcode});
    }*/
    dataLayer.push({'event': 'priceCalculator'});
  }
}
function setAllGoogleFields() {
  //transacties

  $('a').click(function () {
    if (this.host !== location.host) {
        var gtm_href = this.href;
        var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);
        if (gtm_href.match(regex) ){
        dataLayer.push({
            'event': 'Outbound links',
            'eventCategory': 'Outbound links',
            'eventAction': 'Click',
            'eventLabel': gtm_href
        }
      );
     }
    }
  });
  $('.front .flexiblock').click(function () {
      var hrefcontent = $(this).find('footer a').html();
      if( hrefcontent != '' && typeof hrefcontent !== 'undefined'){
          dataLayer.push({
              'event': 'Homepage Blocks',
              'eventCategory': 'Homepage Blocks',
              'eventAction': 'Click',
              'eventLabel': hrefcontent
          });
      }
  });

  /**** JAF ****/
  var google_tag_manager_depairport = Drupal.settings.google_tag_manager_depairport;
  if (google_tag_manager_depairport != undefined) {

    dataLayer.push({'departureAirport': google_tag_manager_depairport});
  }
  var google_tag_manager_pagelevel = Drupal.settings.google_tag_manager_pagelevel;
  if (google_tag_manager_pagelevel != undefined) {
    dataLayer.push({'pageLevel': google_tag_manager_pagelevel});
  }

  var google_tag_manager_retairport = Drupal.settings.google_tag_manager_retairport;
  if (google_tag_manager_retairport != undefined) {

    dataLayer.push({'returnAirport': google_tag_manager_retairport});
  }
  var google_tag_manager_depmonth = Drupal.settings.google_tag_manager_depmonth;
  if (google_tag_manager_depmonth != undefined) {
    dataLayer.push({'depMonth': google_tag_manager_depmonth});
  }

  var google_tag_manager_baggageweight = Drupal.settings.google_tag_manager_baggageweight;
  if (google_tag_manager_baggageweight != undefined && google_tag_manager_baggageweight != "") {
    dataLayer.push({'luggage': google_tag_manager_baggageweight});
  }
  var google_tag_manager_flighttype = Drupal.settings.google_tag_manager_flight_type;
  if (google_tag_manager_flighttype != undefined) {
    dataLayer.push({'flighttype': google_tag_manager_flighttype});
  }

  /****END JAF ****/
  var google_tag_manager_transactionId = Drupal.settings.transactionId;
  if (google_tag_manager_transactionId != undefined) {
    dataLayer.push({'transactionId': google_tag_manager_transactionId});
  }

  var google_tag_manager_transactionFlightType = Drupal.settings.transactionFlightType;
  if (google_tag_manager_transactionFlightType != undefined) {
    dataLayer.push({'transactionFlightType': google_tag_manager_transactionFlightType});
  }


  //1. language

  if (typeof dataLayer != 'undefined' && typeof pageStatus != 'undefined' && pageStatus!= "") {
    dataLayer.push({'event': pageStatus});
  }
  if (typeof dataLayer != 'undefined' && location.href.indexOf('sunjets') > 0) {
    if( typeof getDeviceType() == 'function'){
      dataLayer.push({'deviceType': getDeviceType()});
    }
  }
  var google_tag_manager_language = Drupal.settings.google_tag_manager_language;
  var google_tag_manager_user = Drupal.settings.google_tag_manager_user;
  if (google_tag_manager_language != undefined && google_tag_manager_language!="") {
    dataLayer.push({'language': google_tag_manager_language});
  }


  //2. cluster (main product category)
  var google_tag_manager_cluster = Drupal.settings.google_tag_manager_cluster;
  var google_tokens = Drupal.settings.google_tokens;


  if (google_tag_manager_cluster != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'cluster': google_tag_manager_cluster});
  } else if (google_tokens != undefined && google_tokens.cluster != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'cluster': google_tokens.cluster});
  }


  //3. page level
  var google_tokens_reset = Drupal.settings.google_tokens_reset;
  if (google_tokens_reset != undefined && google_tokens_reset.page_level != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'pageLevel': google_tokens_reset.page_level});
  } else if (google_tokens != undefined && google_tokens.page_level != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'pageLevel': google_tokens.page_level});
  }

 //track main menu elements
  $('nav.navbar-collapse-navigation a').click(function(e){
        if (typeof dataLayer != "undefined") {
            dataLayer.push({
                'event': 'main menu',
                'eventCategory': 'main menu',
                'eventAction': $(this).text().trim()

            });
        }
  });


  if ( ( $('.page-zoeken').length > 0 || $('.page-chercher').length > 0 ||
    $('.page-hotels').length > 0 ) && typeof dataLayer != 'undefined') {
    var i = 0;
    var hotelCode1 = "";
    var hotelCode2 = "";
    var hotelCode3 = "";
    $('h3 a.bookHotel').each(function () {
      i++;
      switch (i) {
        case 1:
          var hotelCode1 = $(this).attr('data-hotelid');
          dataLayer.push({'hotelCode1': hotelCode1});
          break;
        case 2:
          var hotelCode2 = $(this).attr('data-hotelid');
          dataLayer.push({'hotelCode2': hotelCode2});
          break;
        case 3:
          var hotelCode3 = $(this).attr('data-hotelid');
          dataLayer.push({'hotelCode3': hotelCode3});
          break;
        default:
      }
    });
  }

  if ( ($('.page-promoties').length > 0 || $('.promotions_page').length > 0 || $('.lastminutes_page').length > 0)
    && typeof dataLayer != 'undefined') {
    var i = 0;
    var hotelCode1 = "";
    var hotelCode2 = "";
    var hotelCode3 = "";
    if ($('.lm-top .col-md-4').length){
      $('.lm-top .col-md-4').each(function () {
        i++;
        switch (i) {
          case 1:
            var hotelCode1 = $(this).attr('data-hotelid');
            dataLayer.push({'hotelCode1': hotelCode1});
            break;
          case 2:
            var hotelCode2 = $(this).attr('data-hotelid');
            dataLayer.push({'hotelCode2': hotelCode2});
            break;
          case 3:
            var hotelCode3 = $(this).attr('data-hotelid');
            dataLayer.push({'hotelCode3': hotelCode3});
            break;
          default:
        }
      });
    }
  }
  if( $('.lastminutes_results').length > 0 ){
    var i = 0;
    var hotelCode1 = "";
    var hotelCode2 = "";
    var hotelCode3 = "";
    $('#tbl_lastminutes tr').each(function () {
      i++;
      //eerste rij is de header van de tabel
      switch (i) {
        case 2:
          var hotelCode1 = $(this).attr('data-hotelid');
          dataLayer.push({'hotelCode1': hotelCode1});
          break;
        case 3:
          var hotelCode2 = $(this).attr('data-hotelid');
          dataLayer.push({'hotelCode2': hotelCode2});
          break;
        case 4:
          var hotelCode3 = $(this).attr('data-hotelid');
          dataLayer.push({'hotelCode3': hotelCode3});
          break;
        default:
      }

    });
  }
  if ($('.book_step1').length > 0 ){
    var google_tag_manager_totalprice = Drupal.settings.google_tag_manager_totalprice;
    if (google_tag_manager_totalprice != undefined) {
      dataLayer.push({'totalPrice': google_tag_manager_totalprice});
    }
    var google_tag_manager_priceperpax = Drupal.settings.google_tag_manager_priceperpax;
    if (google_tag_manager_priceperpax > 0 ){
        dataLayer.push({'pricePerPax': google_tag_manager_priceperpax});
    }
  }

  //4. search/look
  var google_tag_manager_searchlook = Drupal.settings.google_tag_manager_searchlook;
  if (google_tag_manager_searchlook != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'searchLook': google_tag_manager_searchlook});
  }

  //5. countrycode
  var google_tag_manager_countrycode = Drupal.settings.google_tag_manager_countrycode;
  if (google_tag_manager_countrycode != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'countryCode': google_tag_manager_countrycode.toUpperCase()});
  }

  //6. regioncode
  var google_tag_manager_regioncode = Drupal.settings.google_tag_manager_regioncode;
  if (google_tag_manager_regioncode != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'regionCode': google_tag_manager_regioncode});
  }

  //7. resort code
  //8. hotel code
  var google_tag_manager_hotelcode = Drupal.settings.google_tag_manager_hotelcode;
  if (google_tag_manager_hotelcode != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'hotelCode': google_tag_manager_hotelcode});
  }

  //9. country name
  var google_tag_manager_countryname = Drupal.settings.google_tag_manager_countryname;
  if (google_tag_manager_countryname != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'countryName': google_tag_manager_countryname});
  }

  //10. region name
  var google_tag_manager_regionname = Drupal.settings.google_tag_manager_regionname;
  if (google_tag_manager_regionname != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'regionName': google_tag_manager_regionname});
  }


  var google_tag_manager_cityname = Drupal.settings.google_tag_manager_cityname;
  if (google_tag_manager_cityname != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'cityName': google_tag_manager_cityname});
  }

  //11. resort name
  var google_tag_manager_resortname = Drupal.settings.google_tag_manager_resortname;
  if (google_tag_manager_resortname != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'resortName': google_tag_manager_resortname});
  }

  //12. hotel name
  var google_tag_manager_hotelname = Drupal.settings.google_tag_manager_hotelname;
  if (google_tag_manager_hotelname != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'hotelName': google_tag_manager_hotelname});
  }

  //13. departure date
  var google_tag_manager_departuredate = Drupal.settings.google_tag_manager_departuredate;
  if (google_tag_manager_departuredate != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'departureDate': google_tag_manager_departuredate});
  }

  //14. return date
  var google_tag_manager_returndate = Drupal.settings.google_tag_manager_returndate;
  if (google_tag_manager_returndate != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'returnDate': google_tag_manager_returndate});
  }
  //15. days in advance
  var google_tag_manager_daysinadvance = Drupal.settings.google_tag_manager_daysinadvance;
  if (google_tag_manager_daysinadvance != undefined && google_tag_manager_daysinadvance >= 0 && typeof dataLayer != 'undefined') {
    if( google_tag_manager_daysinadvance < 7 ){
        dataLayer.push({'daysInAdvance': google_tag_manager_daysinadvance + ' day'});
    }else{
        if( google_tag_manager_daysinadvance < 57 ){
            dataLayer.push({'daysInAdvance': Math.round(google_tag_manager_daysinadvance/7) + ' week'});
        }else{
            if( google_tag_manager_daysinadvance < 365 ){
                dataLayer.push({'daysInAdvance': Math.round(google_tag_manager_daysinadvance/30) + ' month'});
            }else{
                dataLayer.push({'daysInAdvance': Math.round(google_tag_manager_daysinadvance/365) + ' year'});
            }
        }

    }
  }
  //16. trip duration
  var google_tag_manager_tripduration = Drupal.settings.google_tag_manager_tripduration;
  if (google_tag_manager_tripduration != undefined && google_tag_manager_tripduration > 0 && typeof dataLayer != 'undefined') {
    dataLayer.push({'tripDuration': google_tag_manager_tripduration});
  }
  //17. number of adults
  var google_tag_manager_numadults = Drupal.settings.google_tag_manager_numadults;
  if (google_tag_manager_numadults != undefined && google_tag_manager_numadults > 0 && typeof dataLayer != 'undefined') {
    dataLayer.push({'numAdults': google_tag_manager_numadults});
  }
  //18. number of adults
  var google_tag_manager_numchildren = Drupal.settings.google_tag_manager_numchildren;
  if (google_tag_manager_numchildren != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'numChildren': google_tag_manager_numchildren});
  }
  //19. number of infants
  var google_tag_manager_numbabies = Drupal.settings.google_tag_manager_numbabies;
  if (google_tag_manager_numbabies != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'numBabies': google_tag_manager_numbabies});
  }
  //20. number of travelers
  var google_tag_manager_numtravelers = Drupal.settings.google_tag_manager_numtravelers;
  if (google_tag_manager_numtravelers != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'numTravelers': google_tag_manager_numtravelers});
  }
  //21. ages of children
  var google_tag_manager_childrenages = Drupal.settings.google_tag_manager_childrenages;
  if (google_tag_manager_childrenages != undefined) {
    var decodedChildrenAges = jQuery.parseJSON(google_tag_manager_childrenages);
    var newages = [];
    for (age in decodedChildrenAges) {
      if (decodedChildrenAges[age] >= 0 && decodedChildrenAges[age] < 13) {
        newages[newages.length] = decodedChildrenAges[age];
      }
    }
    if (newages.length > 0 && typeof dataLayer != 'undefined') {
      dataLayer.push({'childrenAges': newages});
    }
  }
  //22. minimum budget
  var google_tag_manager_minbudget = Drupal.settings.google_tag_manager_minbudget;
  if (google_tag_manager_minbudget != undefined && typeof dataLayer != 'undefined') {
    var minBudget = parseInt(google_tag_manager_minbudget);
    var roundedMinBudget = Math.round(minBudget / 100) * 100;
    dataLayer.push({'minBudget': roundedMinBudget});
  }
  //23. maximum budget
  var google_tag_manager_maxbudget = Drupal.settings.google_tag_manager_maxbudget;
  if (google_tag_manager_maxbudget != undefined && typeof dataLayer != 'undefined') {
    var maxBudget = parseInt(google_tag_manager_maxbudget);
    var roundedMaxBudget = Math.round(maxBudget / 100) * 100;
    dataLayer.push({'maxBudget': roundedMaxBudget});
  }
  //24. meal type
  var google_tag_manager_mealtype = Drupal.settings.google_tag_manager_mealtype;
  if (google_tag_manager_mealtype != undefined && google_tag_manager_mealtype != '' && typeof dataLayer != 'undefined') {
    dataLayer.push({'mealType': google_tag_manager_mealtype});
  }
  //25. departure airportcode
  var google_tag_manager_airportcode = Drupal.settings.google_tag_manager_airportcode;
  if (google_tag_manager_airportcode != undefined && google_tag_manager_airportcode != '' && typeof dataLayer != 'undefined') {
    dataLayer.push({'airportCode': google_tag_manager_airportcode});
  }
  //26. hotel chain
  var google_tag_manager_hotelchain = Drupal.settings.google_tag_manager_hotelchain;
  if (google_tag_manager_hotelchain != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'hotelChain': google_tag_manager_hotelchain});
  }
  //28. travel agent
  var google_tag_manager_travelagent = Drupal.settings.google_tag_manager_travelagent;
  if (google_tag_manager_travelagent != undefined && google_tag_manager_user != 'sunjets' && typeof dataLayer != 'undefined') {
    dataLayer.push({'travelAgent': google_tag_manager_travelagent});
  }
  //30. saleschain
  var google_tag_manager_saleschain = Drupal.settings.google_tag_manager_saleschain;
  if (google_tag_manager_saleschain != undefined && google_tag_manager_user != 'sunjets' && typeof dataLayer != 'undefined') {
    dataLayer.push({'saleschain': google_tag_manager_saleschain});
  }
  if ( google_tag_manager_user == 'jetair' && typeof dataLayer != 'undefined') {
      if(window.location.href.indexOf("abta") > -1 ){
          if( window.location.href.indexOf(118501) == -1){
            dataLayer.push({'neps': 'A'});
          }
      }else{
        dataLayer.push({'neps': 'P'});
      }
  }
  //32. pricecalculator event
  var google_tag_manager_event = Drupal.settings.google_tag_manager_event;
  if (google_tag_manager_event != undefined && typeof dataLayer != 'undefined' && google_tag_manager_event != "" ) {
    dataLayer.push({'event': google_tag_manager_event});
  }
  // transactions

  var google_tag_manager_transactionCluster = Drupal.settings.transactionCluster;
  if (google_tag_manager_transactionCluster != undefined && typeof dataLayer != 'undefined') {
    dataLayer.push({'transactionCluster': google_tag_manager_transactionCluster});
  }

  var google_tag_manager_transactionAffiliation = Drupal.settings.transactionAffiliation;
  if (google_tag_manager_transactionAffiliation != undefined) {
    dataLayer.push({'transactionAffiliation': google_tag_manager_transactionAffiliation});
  }


  var google_tag_manager_transactionTotal = Drupal.settings.transactionTotal;
  if (google_tag_manager_transactionTotal != undefined) {
    dataLayer.push({'transactionTotal': google_tag_manager_transactionTotal});
  }
  var google_tag_manager_transactionFlightType = Drupal.settings.transactionFlightType;
  if (google_tag_manager_transactionFlightType != undefined) {
    dataLayer.push({'transactionFlightType': google_tag_manager_transactionFlightType});
  }
  var google_tag_manager_transactionFlightAirports = Drupal.settings.transactionFlightAirports;
  if (google_tag_manager_transactionFlightAirports != undefined) {
    dataLayer.push({'transactionFlightAirports': google_tag_manager_transactionFlightAirports});
  }
  var google_tag_manager_transactionFlightNumbers = Drupal.settings.transactionFlightNumbers;
  if (google_tag_manager_transactionFlightNumbers != undefined) {
    dataLayer.push({'transactionFlightNumbers': google_tag_manager_transactionFlightNumbers});
  }

  var google_tag_manager_transactionCity = Drupal.settings.transactionCity;
  if (google_tag_manager_transactionCity != undefined) {
    dataLayer.push({'transactionCity': google_tag_manager_transactionCity});
  }

  var google_tag_manager_transactionCountryCode = Drupal.settings.transactionCountryCode;
  if (google_tag_manager_transactionCountryCode != undefined) {
    dataLayer.push({'transactionCountryCode': google_tag_manager_transactionCountryCode});
  }


  var google_tag_manager_transactionCountry = Drupal.settings.transactionCountry;
  if (google_tag_manager_transactionCountry != undefined) {
    dataLayer.push({'transactionCountry': google_tag_manager_transactionCountry});
  }
  var google_tag_manager_transactionRegionCode = Drupal.settings.transactionRegionCode;
  if (google_tag_manager_transactionRegionCode != undefined) {
    dataLayer.push({'transactionRegionCode': google_tag_manager_transactionRegionCode});
  }

  var google_tag_manager_transactionHotelCode = Drupal.settings.transactionHotelCode;
  if (google_tag_manager_transactionHotelCode != undefined) {
    dataLayer.push({'transactionHotelCode': google_tag_manager_transactionHotelCode});
  }
  var google_tag_manager_transactionCountryName = Drupal.settings.transactionCountryName;
  if (google_tag_manager_transactionCountryName != undefined) {
    dataLayer.push({'transactionCountryName': google_tag_manager_transactionCountryName});
  }
  var google_tag_manager_transactionRegionName = Drupal.settings.transactionRegionName;
  if (google_tag_manager_transactionRegionName != undefined) {
    dataLayer.push({'transactionRegionName': google_tag_manager_transactionRegionName});
  }
  var google_tag_manager_transactionResortName = Drupal.settings.transactionResortName;
  if (google_tag_manager_transactionResortName != undefined) {
    dataLayer.push({'transactionResortName': google_tag_manager_transactionResortName});
  }

  var google_tag_manager_transactionHotelName = Drupal.settings.transactionHotelName;
  if (google_tag_manager_transactionHotelName != undefined) {
    dataLayer.push({'transactionHotelName': google_tag_manager_transactionHotelName});
  }
  var google_tag_manager_transactionDepartureDate = Drupal.settings.transactionDepartureDate;
  if (google_tag_manager_transactionDepartureDate != undefined) {
    dataLayer.push({'transactionDepartureDate': google_tag_manager_transactionDepartureDate});
  }
  var google_tag_manager_transactionReturnDate = Drupal.settings.transactionReturnDate;
  if (google_tag_manager_transactionReturnDate != undefined) {
    dataLayer.push({'transactionReturnDate': google_tag_manager_transactionReturnDate});
  }
  var google_tag_manager_transactionTripDuration = Drupal.settings.transactionTripDuration;
  if (google_tag_manager_transactionTripDuration != undefined) {
    dataLayer.push({'transactionTripDuration': google_tag_manager_transactionTripDuration});
  }
  var google_tag_manager_transactionDaysInAdvance = Drupal.settings.transactionDaysInAdvance;
  if (google_tag_manager_transactionDaysInAdvance != undefined) {
    dataLayer.push({'transactionDaysInAdvance': google_tag_manager_transactionDaysInAdvance});
  }

  var google_tag_manager_transactionNumTravelers = Drupal.settings.transactionNumTravelers;
  if (google_tag_manager_transactionNumTravelers != undefined) {
    dataLayer.push({'transactionNumTravelers': google_tag_manager_transactionNumTravelers});
  }

  var google_tag_manager_transactionNumAdults = Drupal.settings.transactionNumAdults;
  if (google_tag_manager_transactionNumAdults != undefined) {
    dataLayer.push({'transactionNumAdults': google_tag_manager_transactionNumAdults});
  }
  var google_tag_manager_transactionNumChildren = Drupal.settings.transactionNumChildren;
  if (google_tag_manager_transactionNumChildren != undefined) {
    dataLayer.push({'transactionNumChildren': google_tag_manager_transactionNumChildren});
  }
  var google_tag_manager_transactionNumBabies = Drupal.settings.transactionNumBabies;
  if (google_tag_manager_transactionNumBabies != undefined) {
    dataLayer.push({'transactionNumBabies': google_tag_manager_transactionNumBabies});
  }
  var google_tag_manager_transactionChildrenAges = Drupal.settings.transactionChildrenAges;
  if (google_tag_manager_transactionChildrenAges != undefined) {
    dataLayer.push({'transactionChildrenAges': google_tag_manager_transactionChildrenAges});
  }


  var google_tag_manager_tpSku = ( Drupal.settings.transactionProductsSku != undefined ) ? Drupal.settings.transactionProductsSku : '';
  var google_tag_manager_tpName = ( Drupal.settings.transactionProductsName != undefined ) ? Drupal.settings.transactionProductsName : '';
  var google_tag_manager_tpCategory = ( Drupal.settings.transactionProductsCategory != undefined ) ? Drupal.settings.transactionProductsCategory : '';
  var google_tag_manager_tpPrice = ( Drupal.settings.transactionProductsPrice != undefined ) ? Drupal.settings.transactionProductsPrice : '';
  var google_tag_manager_tpDiscount = ( Drupal.settings.transactionProductsDiscount != undefined ) ? Drupal.settings.transactionProductsDiscount : '';
  var google_tag_manager_tpQuantity = ( Drupal.settings.transactionProductsQuantity != undefined ) ? Drupal.settings.transactionProductsQuantity : '';


  if (google_tag_manager_tpQuantity != '' &&
    google_tag_manager_tpSku != '' &&
    google_tag_manager_tpName != '' &&
    google_tag_manager_tpPrice != '') {
    dataLayer.push({
      'transactionProducts': [{
        'sku': google_tag_manager_tpSku,
        'name': google_tag_manager_tpName,
        'category': google_tag_manager_tpCategory,
        'price': google_tag_manager_tpPrice,
        'discount': google_tag_manager_tpDiscount,
        'quantity': google_tag_manager_tpQuantity
      }]
    });

  }
  dataLayer.push({'event': 'send'}); // event dimension must be pushed at the last moment
}
;
(function ($) {

  $.fn.extend({
    //plugin-name - tuiValidation
    tuiValidation: function (options) {
      var defaults = {
        validateInline: true,
        showDefault: true
      };
      var tuiValidationoptions = $.extend(defaults, options);
      if (tuiValidationoptions['validateInline']) {
        $('.validate-inline, .required').live('blur change', function () {
          var type = this.type || this.tagName.toLowerCase();
          elementoptions = _get_validation_options(this, $(this), false);
          var validateOptions = $.extend(tuiValidationoptions, elementoptions);
          $(this).validateTuiElement(validateOptions);
        });
      }
      return this.each(function (i, d) {
        if ($(this).attr('id')) {
          elementoptions = _get_validation_options(d, $(this), 'onload');
          var validateOptions = $.extend(tuiValidationoptions, elementoptions);
          $(this).validateTuiElement(validateOptions);
        }
      });
    },
    validateTuiElement: function (options) {
      //Settings list and the default values
      var defaults = {
        errorMessage: Drupal.t('This field is not a valid email'),
        type: 'text', // text, radio, checkbox , select-one , select , textarea , hidden , submit , button
        icon: 'glyphicon-ok',
        color: 'tui-lightgrey-text',
        required: true
      };
      var validateOptions = $.extend(defaults, options);
      if (options['required']) {
        if (options['icon']) {
          $(this).parent().find('.validated').remove();
          var top =  $(this).parents().closest('.form-item').outerHeight();
          top -= 25;
          $(this).parent().removeClass("error");
          $(this).removeClass("error");
          var style = 'style = "';
          style += ( validateOptions['right']) ? 'right: ' + validateOptions['right'] : '';
          style += (top>0)?'top:'+top+'px':'';
          style += '"';
          $(this).parent().append('<span class="glyphicon ' + options['color'] + ' ' + options['icon'] + ' validated" ' + style + ' ></span>');
          if (options['error']) {
            $(this).addClass("error");
            $(this).parent().addClass("error");
          }
        }
      }
    },
    validateForm: function () {
      if ($(this).find('.glyphicon-remove.validated').length) {
        $(this).find('.form-submit').prop('disabled', true);
      } else {
        $(this).find('.form-submit').prop('disabled', false);
      }

    }
  });
})(jQuery);


function _get_validation_options(d, inputField, triggerFunction) {
  var type = d.type || d.tagName.toLowerCase();
  var error = ( inputField.hasClass('error') || inputField.parent().hasClass('error') ) ? true : false;
  var required = ( inputField.hasClass('required') || inputField.hasClass('validate-inline') ) ? true : false;
  var regExPattern = /([^\s])/;

  switch (type) {
    case 'checkbox':
    case 'radio':
      valid = inputField.is(':checked');
      options = _set_validation_options({
        valid: valid,
        error: error,
        triggerFunction: triggerFunction
      });
      break;
    case 'select-one':
    case 'select':
      valid = regExPattern.test(inputField.val());
      options = _set_validation_options({
        valid: valid,
        error: error,
        triggerFunction: triggerFunction
      });
      break;
    case 'textarea':
      valid = regExPattern.test(inputField.val());
      options = _set_validation_options({
        valid: valid,
        error: error,
        triggerFunction: triggerFunction
      });
      break;
    case 'hidden':
    case 'submit':
    case 'button':
    case 'div':
      required = false;
      break;
    default:
      regExPattern = _get_regExPattern(inputField);
      if (regExPattern != 'datepicker') {
        if (typeof inputField.attr('confirm-element') != 'undefined') {
          if ($(inputField.attr('confirm-element')).val() != inputField.val()) {
            valid = false;
          }
        } else {
          valid = regExPattern.test(inputField.val());
        }
      } else {
        valid = regExPattern;
      }
      options = _set_validation_options({
        valid: valid,
        error: error,
        triggerFunction: triggerFunction
      });
  }
  options = $.extend(options, {required: required});
  return options;
}

function _set_validation_options(context) {
  var options = [];
  var defaults = {
    valid: false,
    error: false,
    triggerFunction: 'onload'
  };
  var contexts = $.extend(defaults, context);
  if (contexts['valid'] == 'datepicker') {
    options['icon'] = false;
  } else if (contexts['valid'] !== false) {
    options['icon'] = 'glyphicon-ok';
    options['color'] = 'tui-green-text';
    options['error'] = false;
  } else {
    if (contexts['triggerFunction'] == 'onload') {
      if (contexts['error'] === true) {
        options['icon'] = 'glyphicon-remove';
        options['color'] = 'tui-wine-red-text';
        options['error'] = true;
      } else {
        if (contexts['showDefault']) {
          options['icon'] = 'glyphicon-ok';
          options['color'] = 'tui-lightgrey-text';
        } else {
          options['icon'] = false;
        }
      }
    }
    else if (contexts['error'] || contexts['valid'] == false) {
      options['icon'] = 'glyphicon-remove';
      options['color'] = 'tui-wine-red-text';
      options['error'] = true;
    } else {
      options['error'] = false;
      if (contexts['showDefault']) {
        options['icon'] = 'glyphicon-ok';
        options['color'] = 'tui-lightgrey-text';
      } else {
        options['icon'] = false;
      }
    }
  }
  return options;
}

function _get_regExPattern(el) {
  var type = el.attr('type');
  var regExPattern = new RegExp(/([^\s])/);
  if (type == 'email' || el.hasClass('email')) {
    regExPattern = new RegExp(/^[a-z0-9]+[a-z0-9._%+-]*@(?:[a-z0-9-]+\.)+[a-z]{2,6}$/i);
  } else if (type == 'tel' || el.hasClass('tel')) {
    regExPattern = new RegExp(/(^[+0-9\/\-\. ]{7,32})$/);
  } else if (type == 'number' || el.hasClass('number')) {
    regExPattern = new RegExp(/\d*(\.\d{0, 2})?/);
  } else if (el.hasClass('hasDatepicker')) {
    if ($('.datepicker').is(':visible') == false) {
      regExPattern = new RegExp(/([^\s])/);
    } else {
      regExPattern = 'datepicker';
    }
  }

  return regExPattern;
}

$(document).ready(function () {
  $(".validate-inline").tuiValidation({showDefault: false});
});
;
$(document).ready(function () {
  var var_inIframe = inIframe();
  var feww = $.getUrlVar('feww');
  var whitelabel = $.getUrlVar('whitelabel');
  var url = window.location.href;
  $.ajax({
    type: 'POST',
    dataType: 'json',
    url: '/whitelabel/iframe',
    data: {
      inIframe: var_inIframe,
      feww: feww,
      whitelabel: whitelabel,
      Url: url
    },
    success: function (data) {
      if (data['whitelabel'] == 'true') {
        $('html').addClass('whitelabel');
      } else {
        $('html').removeClass('whitelabel');
      }
    }
  });
});

function inIframe() {
  var urls = (window.location != window.parent.location) ? document.referrer : document.location;
  //can be removed when trinicom & new sites are gone. --> check if url is from optimizely
  if (typeof urls == 'string' && urls.indexOf('optimizely') > -1) {
    return false;
  } else {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }
}

$.extend({
  getUrlVars: function () {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  },
  getUrlVar: function (name) {
    return $.getUrlVars()[name];
  }
});
;
var $ = jQuery;
var fullPageScroll;

//Return the current scrollbar offsets as the x and y properties of an object
function getScrollOffsets() {

  // This works for all browsers except IE versions 8 and before
  if (window.pageXOffset != null) {
    return window.pageYOffset;
  }

  // For browsers in Standards mode
  var doc = window.document;
  if (document.compatMode === "CSS1Compat") {
    return doc.documentElement.scrollTop;
  }

  // For browsers in Quirks mode
  return doc.body.scrollTop;
}

function showLoader() {
  $('.bookPrice, .calculate').append('<div id="loadingMessage"><div id="loadingIcon"><i class="icon glyphicon glyphicon-refresh"> </i></div></div>');
}

function showFullPageLoader(customText) {

  fullPageScroll = getScrollOffsets();

  if (customText !== undefined) {
    $('#loadingText').text(customText);
  }

  var document = $(document).height();

  $('#fullPageLoader').css('height', document + 'px');
  $('#fullPageLoader,#loadingLogo,#loadingText,#loadingIcon').show();

  /**
   * Scroll up again until the loadingWindow is visible and centered
   */

  var viewportWidth = jQuery(window).width();
  viewportHeight = jQuery(window).height();

  if ($('#loadingText').length) {
    $load = jQuery('#loadingText');
    elWidth = $load.width();
    elHeight = $load.height();
    elOffset = $load.offset();
    jQuery(window).scrollTop(elOffset.top + ( elHeight / 2 ) - ( viewportHeight / 2 ))
      .scrollLeft(elOffset.left + ( elWidth / 2 ) - ( viewportWidth / 2 ));
    window.scrollTo(0, 0);
    $('html').addClass('loadingoverflow');
    $('body').addClass('loadingoverflow');

    if ($.browser.chrome || $.browser.mozilla) {
      var setClone = ( ( $.browser.mozilla ) ? 0 : 5);
      var n = $("div").find(".loadingAniIcon");
      var setColor = "#7AB3E3";
      if (1 === n.length)
        for (var s = 0; setClone > s; s++)!function () {
          var t = n.clone();
          setColor = ( ( setColor == "#D42E38" ) ? "#7AB3E3" : "#D42E38" );
          t.addClass("is-clone is-hidden"), n.after(t), t.css({
            transform: "rotateZ(" + 360 * Math.random() + "deg)"
          }), t.children().css({
            "-webkit-animation-duration": 5 * Math.random() + 3 + "s",
            "color": setColor
          }), setTimeout(function () {
            t.removeClass("is-hidden");
          }, 200 * s + 1e3 * Math.random());
        }()
    } else {
      var n = $("div").find(".loadingAniIcon");
      if (1 === n.length) {
        n.addClass('hidden');
      }
    }
  }
}

function hideLoader() {
  $('#loadingMessage').modal('hide');
  $('html').removeClass('loadingoverflow');
  $('body').removeClass('loadingoverflow');
}

function hideFullPageLoader() {
  $('#fullPageLoader,#loadingLogo,#loadingText,#loadingIcon').hide();
  $('html').removeClass('loadingoverflow');
  $('body').removeClass('loadingoverflow');
  window.scrollTo(0, fullPageScroll);
}
;
(function ($) {
  $(document).ready(function () {
    //addSliders();
    if( typeof getDeviceType != 'undefined' && getDeviceType() !== '' && getDeviceType()!== 'Desktop'){
        $('.device').val(getDeviceType().toLowerCase());
    }else{
        var device = 'computer';
    }
    // ogone online payment
    $('.slider-radios input[type=radio]:checked').trigger('change');
    if ($('#my_zone_paymentform').length) {
      $('#edit-submit').live('click', function (e) {
        e.preventDefault();
        $.ajax({
          type: 'POST',
          url: '/my_zone_online_payment_callback',
          data: $('#my_zone_paymentform').serialize()  + '&device=' + device,
          success: function (msg) {
            var obj = jQuery.parseJSON(msg);
            if (typeof obj.error !== 'undefined') {
              alert(obj.error);
            } else {
              var form = $('#my_zone_paymentform');
              $('#my_zone_paymentform input[name=form_id]').remove();
              $('#my_zone_paymentform input[name=form_build_id]').remove();
              $('#my_zone_paymentform input[name=form_token]').remove();
              if($('#my_zone_paymentform input[name=device]')){
                $('#my_zone_paymentform input[name=device]').remove();
              }
              form.append(obj.fields);
              form.attr('action', obj.url);
              $('#edit-onlineamount').remove();
              form.submit();
            }
          }
        });
      });
    }

    if ($.fn.powerTip != undefined) {
      $.fn.powerTip.smartPlacementLists.n = ['se-alt', 'ne-alt'];
      windowwidth = 'e';

      $('.help_po').powerTip({
        manual: true,
        placement: windowwidth,
        smartPlacement: true,
        closeDelay: 60000
      });
      $('.help_po').on({
        click: function (event) {
          $.powerTip.show(this, event);
        },
        powerTipRender: function () {
          $('#powerTip').addClass('hulpPo');
        }
      });
    }

    // voucher online payment
    if ($('#my_zone_voucherpaymentform').length) {
      $('input[name=giftcertificateNumber] , input[name=giftcertificateVerification]').on('input propertychange blur', function (e) {
          checkGiftvoucher($(this));
      });

      function checkGiftvoucher(element) {
        $('#voucherstatus').html('');
        $('input[name=giftcertificateNumber] , input[name=giftcertificateVerification]').parent().find('span').remove();
        if ($('input[name=giftcertificateNumber]').val().length >= 12 && $('input[name=giftcertificateVerification]').val().length >= 10) {
          $.ajax({
            type: 'POST',
            url: '/my_zone_voucher_payment_callback',
            data: $('#my_zone_voucherpaymentform').serialize(),
            success: function (msg) {
              var obj = jQuery.parseJSON(msg);
              $('#voucherstatus').html(obj.output);
              var outValue = parseInt(obj.out_value);
              if ( outValue > 0) {
                $('#edit-voucherAmount').val(outValue);
                //IE fallback
                $('input[name=giftcertificateNumber] , input[name=giftcertificateVerification]').parent().find('span').remove();
                $('input[name=giftcertificateNumber] , input[name=giftcertificateVerification]').after('<span class="glyphicon validated glyphicon-ok tui-green-text"></span>');
                $('.validate-voucher').removeAttr('disabled');
              } else {
                $('#edit-voucherAmount').val(0);
                $('input[name=giftcertificateNumber] , input[name=giftcertificateVerification]').after('<span class="glyphicon validated tui-wine-red-text glyphicon-remove"></span>');
                $('#my_zone_voucherpaymentform .glyphicon').removeClass("glyphicon-ok");
                $('#my_zone_voucherpaymentform .glyphicon').removeClass("tui-green-text");
                //IE fallback
                $('.validate-voucher').attr('disabled', 'disabled');
              }
            }
          });
        } else {
          $('#edit-voucherAmount').val(0);
          //IE fallback
          $('.validate-voucher').attr('disabled', 'disabled');
        }
      }
    }

    // change information
    if ($('#my-zone-changeinformationform').length) {
      $('input').css('margin-bottom', '10px');

      // loop over all email fields, hide them if they're empty
      for ($i = 0; $i < 5; $i++) {
        if ($('input[name^=emailTekst' + $i + ']').val() != '') {
          $('.email-row-' + $i).removeClass('hide');
        }
      }

      $('.add-email').on('click', function () {
        for ($i = 0; $i < 5; $i++) {
          if ($('.email-row-' + $i).hasClass('hide')) {
            $('.email-row-' + $i).removeClass('hide');
            break;
          }
        }
      });

      $('.add-phone').on('click', function () {
        var classes = $(this).attr('class').split(/\s/);
        var cat = classes[classes.length - 1];

        for ($i = 0; $i < 5; $i++) {
          if ($('.' + cat + '-' + $i).hasClass('hide')) {
            $('.' + cat + '-' + $i).removeClass('hide');
            break;
          }
        }
      });
    }

    // my zone login block
    if ($('.my-zone-login-block').length) {
      //T800: no longer do the hide via js (needs to be done via theming, there are business-rules!!!)
      //$( '.my-zone-login-block').hide();
      $('.show-login-block').click(function (e) {
        e.preventDefault();
        $('.my-zone-login-block').toggleClass('hidden');
      });
    }
  });
  //$('input[name=accommodation-opinion-sentence]').insertBefore('textarea[name=accommodation-opinion]');
  $('input[name=excursions-check]').live('click', function () {
    if ($(this).val() === 'T') {
      $('#csq-excurions').toggleClass('hide', false);
    } else {
      $('#csq-excurions').toggleClass('hide', true);
    }
  });

})(jQuery);

function addnewPhone(obj) {
  var addPhonerow = '.addPhoneRow' + obj;
  //check amount of visible addEmailRow --> show addNewEmailRow
  var checkinput = $(addPhonerow).not(':hidden').last().find('input[name^="phoneTekst' + obj + '"]').val();
  var visibleEmailRows = $(addPhonerow + ':visible').length;
  if (( $.trim(checkinput) != '' ) || ( visibleEmailRows = 0 ) || ( typeof checkinput == 'undefined' )) {
    $(addPhonerow + ':hidden:first').children().show();
    $(addPhonerow + ':hidden:first').toggle(true);
  }
  //hide button if 5th item is added
  if (visibleEmailRows >= 4) {
    $('.addNewPhone' + obj).addClass('hide');
  }
}

Drupal.behaviors.disableEnableChekboxesRadiobuttons = {
  attach: function (context, settings) {
    $('#csq-wrapper input[name$="-other"]').on('click keypress keyup change', function () {
      if ($.trim($(this).val()) !== '') {
        $(this).closest('.form-type-checkbox,.form-type-radio').find('input[type=checkbox], input[type=radio]').attr('checked', 'checked');
      } else {
        $(this).closest('.form-type-checkbox,.form-type-radio').find('input[type=checkbox], input[type=radio]').attr('checked', false);
      }
    });
  }
};


function _change_slider(radioElement, value) {
  var sliderArray = ['&#9450;', '&#9312;', '&#9313;', '&#9314;', '&#9315;', '&#9316;', '&#9317;', '&#9318;', '&#9319;', '&#9320;', '&#9321;'];
  var sliderNegativeArray = [( typeof isMobile != 'undefined' && isMobile.any ) ? '&#9450;' : '&#9471;', '&#10102;', '&#10103;', '&#10104;', '&#10105;', '&#10106;', '&#10107;', '&#10108;', '&#10109;', '&#10110;', '&#10111;'];

  var prevElement = radioElement.parents('.slider-radios').find('.selected');
  if (prevElement[0]) {
    prevElement.find('label').html(sliderArray[$(prevElement[0]).find('input').attr("value")]);
  }
  if (value !== "select") {
    $('.recommendation').removeClass('hidden');
    radioElement.parents('.slider-radios').find('.selected').removeClass('selected');
    var changeWidth = (( parseFloat(1) + parseFloat(radioElement.val()) ) * parseFloat(9.09) ) + '%';
    radioElement.parents('.slider-radios').find('.slider-radios-background').animate({
      width: changeWidth
    }, 'fast', function () {
      radioElement.parent().addClass('selected');
      radioElement.parents('.slider-radios').find('.selected').find('label').html(sliderNegativeArray[radioElement.val()]);
    });
    var $selectName = 'select[name=' + radioElement.attr('name') + '-select]';

    $($selectName).val(value + 1);
  } else {
    $('.recommendation').addClass('hidden');
    radioElement.parents('.slider-radios').find('.slider-radios-background').animate({
      width: 0
    }, 'fast', function () {
      radioElement.parent().removeClass('selected');
    });
  }

}

Drupal.behaviors.addSliderRadios = {
  attach: function (context, settings) {
    $('.slider-radios input[type=radio]').on('change', function () {
      var radioElement = $(this);
      var value = parseInt(radioElement.val());
      _change_slider(radioElement, value);
    });
    $('.slider-radios input[type=radio]').prop("selected", true);
    $('select[name$="-select"]').on('change', function () {
      var selectElement = $(this);
      var value = parseInt($(this).val());
      if (value &&  selectElement.attr('name').replace('-select', '')==='recommend') {
        $('.recommendation').removeClass('hidden');
      } else {
        $('.recommendation').addClass('hidden');
      }
      if (value === 0) {
        $("input[name=" + selectElement.attr('name').replace('-select', '') + "]").attr("checked", false);
        _change_slider($("input[name=" + selectElement.attr('name').replace('-select', '') + "]"), "select");
      } else {
        var radioName = 'input[name=' + selectElement.attr('name').replace('-select', '') + '][value=' + (value - 1 ) + ']';
        $(radioName).prop('checked', true).trigger('change');
      }

    });
  }
};
;
/**
 *
 */
var parentHeight = 0;
$(document).ready(function () {
  if ($('.sticky-pane').length) {
    $(window).on('click', function () {
      $(window).trigger("scroll");
    });
    $(window).stickyPane({
      scrollOnMobile: ['screen-md', 'screen-lg'],
      marginTop: '15'
    });
    parentHeight = $('.sticky-pane-parent').outerHeight(true);
  }
});

(function ($) {

  $.fn.extend({
    //plugin-name - stickyPane
    stickyPane: function (options) {

      var defaults = {
        stickyParent: $('.sticky-pane-parent'),
        stickyBlock: $('.sticky-pane'),
        isOnlyHidden: false, //scroll only if given item is hidden
        isOnlyHiddenField: '',
        scrollOnMobile: ['screen-xs', 'screen-sm', 'screen-md', 'screen-lg'],
        position: 'absolute'
        //width, margin, top, bottom --> no defaults only given with options
      };
      var stickyPaneOptions = $.extend(defaults, options);

      $(window).on('scroll resize', function () {
        if (typeof breakpoint != 'undefined' && $.inArray(breakpoint, stickyPaneOptions['scrollOnMobile']) !== -1) {
          _initScrollPane(stickyPaneOptions, $(this));
        }
      });
      if (typeof breakpoint != 'undefined' && $.inArray(breakpoint, stickyPaneOptions['scrollOnMobile']) !== -1) {
        _initScrollPane(stickyPaneOptions, $(this));
      }
    }
  });
})(jQuery);


function _initScrollPane(options) {
  //@Todo: review code --> this works but maybe there's a better way?
  var stickyParent = options['stickyParent'];
  var stickyBlock = options['stickyBlock'];
  var windowHeight = $(window).height();

  options['stickyBlock'].attr('style', ''); //clear style attribute -- before getting current style attributes
  var offsetParent = stickyParent.offset();
  var offsetBlock = stickyBlock.offset();
  var stickyBlockWidth = stickyBlock.outerWidth(true);
  var heightBlock = stickyBlock.outerHeight(true);
  var checkHeight = parseFloat(parentHeight - heightBlock);
  if (checkHeight < 50) {
    return;
  }
  var topBlock = $(window).scrollTop() - offsetBlock.top;

  var bottomHeightParent = $(window).scrollTop() - ( offsetParent.top + stickyParent.outerHeight(true));
  var bottomHeight = parseFloat(windowHeight) + parseFloat(bottomHeightParent);

  topBlock = topBlock + parseFloat(options['marginTop']);

  var VisibleHeight = getVisible(stickyParent);


  if (options['isOnlyHidden'] || options['isOnlyShown']) {
    if (_showBlock(options)) {
      stickyBlock.css(options);
    }
  } else {
    if (heightBlock < windowHeight) {
      if (VisibleHeight < heightBlock && topBlock > 0) {
        stickyBlock.css({
          bottom: bottomHeight + 'px',
          position: 'fixed',
          width: stickyBlockWidth
        });
      } else if (topBlock > 0) {
        stickyBlock.css({
          top: topBlock + 'px',
          position: options['position'],
          width: stickyBlockWidth
        });
      }
    } else {
      if( ( heightBlock + bottomHeight + topBlock )  > 0 ) {
        var bottomfix = (bottomHeight < 0)?15:(bottomHeight + 50);
        stickyBlock.css({
          bottom: bottomfix + 'px',
          position: 'fixed',
          width: stickyBlockWidth
        });
      }
    }
  }

}


function getVisible($el) {
  var scrollTop = $(window).scrollTop(),
    scrollBot = scrollTop + $(window).height(),
    elTop = $el.offset().top,
    elBottom = elTop + $el.outerHeight(),
    visibleTop = elTop < scrollTop ? scrollTop : elTop,
    visibleBottom = elBottom > scrollBot ? scrollBot : elBottom;
  return Math.max(visibleBottom - visibleTop, 0);
}

function _isScrolledIntoView(elem) {
  var docViewTop = $(window).scrollTop();
  var docViewBottom = docViewTop + $(window).height();

  var elemTop = $(elem).offset().top;
  var elemBottom = elemTop + $(elem).height();

  return (docViewBottom >= elemTop && docViewTop <= elemBottom);
}
;
var $ = jQuery;
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
  $('#edit-outbound-flight-dep , #edit-return-flight-dep , #edit-alt-outbound-flight-dep , #edit-alt-return-flight-dep').trigger('change');

  showAlternative();

  $('#edit-alt-add-alternative').on('click', function () {
    showAlternative();
  });

  check_visibility_invoices();

  $('#edit-invoices').on('click', function () {
    check_visibility_invoices();
  });

  $(".form-item-travelLegalInsurrance").insertAfter($("#edit-insurance-premium").parent());

  check_flights($('input[name=flights]:checked').val());
  $('input[name=flights]').on('click', function () {
    var val = $(this).val();
    check_flights(val);
  });

  check_insurance($('input[name=Insurance]:checked').val());
  $('input[name=Insurance]').on('click', function () {
    var val = $(this).val();
    check_insurance(val);
  });
  $('input[name="contact_jaf_contact_page"]').removeAttr('checked');
  $('input[name="contact_jaf_contact_page"]').on('click', function () {
    var value = $(this).val();

    switch (value) {
      case 'modification':
        $('.showmodification').removeClass('hidden');
        $('.cancellationform').addClass('hidden');
        break;
      case 'cancelation':
        $('.cancellationform').removeClass('hidden');
        $('.showmodification').addClass('hidden');
        break;
      case 'request':
        window.location.href = "groupform";
        break;
      default:
        $('#myModal').modal('show');
        $('#myModal').on('shown.bs.modal', function () {
          setTimeout(function () {
            window.location.href = Drupal.t("questions");
          }, 500);
        });
        $('#myModal').on('hide.bs.modal', function () {
          window.location.href = Drupal.t("questions");
        });
        break;
    }
  });

  if ($('.contactjaf').siblings('.alert-error').length > 0 && $('.contactjaf input').hasClass('error')) {
    $('input[name="contact_jaf_contact_page"]').filter('[value="cancelation"]').attr('checked', true);
    $('.cancellationform').removeClass('hidden');
  }

  if (typeof isMobile != 'undefined' && isMobile.any) {
    if($("#tui_contact_groupsform_form").length) {
      $("input[name='invoicemailbox'], input[name='zipcode']").on('focus', function (e) {
        e.preventDefault;
        document.getElementById($(this).attr('id')).setAttribute("type", "number");
      }).on('blur', function (e) {
        e.preventDefault;
        document.getElementById($(this).attr('id')).setAttribute("type", "text");
      });
    }
  }

});

function check_visibility_invoices() {
  if ($('input[name=invoices]:checked').length) {
    $('#groupinvoice').removeClass('hidden');
  } else {
    $('#groupinvoice').addClass('hidden');
  }
}


function check_flights(val) {
  if (val == "OUT") {
    $('.return-form').addClass('hidden');
    $('.outbound-form').removeClass('hidden');
  } else if (val == "RET") {
    $('.outbound-form').addClass('hidden');
    $('.return-form').removeClass('hidden');
  } else {
    $('.return-form').removeClass('hidden');
    $('.outbound-form').removeClass('hidden');
  }
}

function check_insurance(val) {
  if (val == "noInsurrance") {
    $(".form-item-travelLegalInsurrance").addClass('hidden');
    $(".form-item-confirmInsurrance").addClass('hidden');
    $("#edit-travellegalinsurrance").prop('disabled', true);
  } else if (val == "Premium") {
    $(".form-item-travelLegalInsurrance").removeClass('hidden');
    $(".form-item-confirmInsurrance").removeClass('hidden');
    $("#edit-travellegalinsurrance").prop('disabled', false);
  } else {
    $(".form-item-travelLegalInsurrance").addClass('hidden');
    $(".form-item-confirmInsurrance").removeClass('hidden');
    $("#edit-travellegalinsurrance").prop('disabled', true);
  }
}

function showAlternative() {
  if ($('#edit-alt-add-alternative').is(':checked')) {
    $('.alternativeflights').removeClass('hidden');
  } else {
    $('.alternativeflights').addClass('hidden');
  }
}

;
var tui_monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

var tui_monthNamesShort = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];
var tui_dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

var tui_dayNamesShort = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
];

var tui_dayNamesMin = [
  'Su',
  'Mo',
  'Tu',
  'We',
  'Th',
  'Fr',
  'Sa'
];
jQuery(document).ready(function ($) {
  tui_monthNames = [
    Drupal.t('January', {}, {context: 'Long month name'}),
    Drupal.t('February', {}, {context: 'Long month name'}),
    Drupal.t('March', {}, {context: 'Long month name'}),
    Drupal.t('April', {}, {context: 'Long month name'}),
    Drupal.t('May', {}, {context: 'Long month name'}),
    Drupal.t('June', {}, {context: 'Long month name'}),
    Drupal.t('July', {}, {context: 'Long month name'}),
    Drupal.t('August', {}, {context: 'Long month name'}),
    Drupal.t('September', {}, {context: 'Long month name'}),
    Drupal.t('October', {}, {context: 'Long month name'}),
    Drupal.t('November', {}, {context: 'Long month name'}),
    Drupal.t('December', {}, {context: 'Long month name'})
  ];

  tui_monthNamesShort = [
    Drupal.t('Jan', {}, {context: 'Short month name'}),
    Drupal.t('Feb', {}, {context: 'Short month name'}),
    Drupal.t('Mar', {}, {context: 'Short month name'}),
    Drupal.t('Apr', {}, {context: 'Short month name'}),
    Drupal.t('May', {}, {context: 'Short month name'}),
    Drupal.t('Jun', {}, {context: 'Short month name'}),
    Drupal.t('Jul', {}, {context: 'Short month name'}),
    Drupal.t('Aug', {}, {context: 'Short month name'}),
    Drupal.t('Sep', {}, {context: 'Short month name'}),
    Drupal.t('Oct', {}, {context: 'Short month name'}),
    Drupal.t('Nov', {}, {context: 'Short month name'}),
    Drupal.t('Dec', {}, {context: 'Short month name'})
  ];
  tui_dayNames = [
    Drupal.t('Sunday', {}, {context: 'day_name'}),
    Drupal.t('Monday', {}, {context: 'day_name'}),
    Drupal.t('Tuesday', {}, {context: 'day_name'}),
    Drupal.t('Wednesday', {}, {context: 'day_name'}),
    Drupal.t('Thursday', {}, {context: 'day_name'}),
    Drupal.t('Friday', {}, {context: 'day_name'}),
    Drupal.t('Saturday', {}, {context: 'day_name'})
  ];

  tui_dayNamesShort = [
    Drupal.t('Sun', {}, {context: 'Day name'}),
    Drupal.t('Mon', {}, {context: 'Day name'}),
    Drupal.t('Tue', {}, {context: 'Day name'}),
    Drupal.t('Wed', {}, {context: 'Day name'}),
    Drupal.t('Thu', {}, {context: 'Day name'}),
    Drupal.t('Fri', {}, {context: 'Day name'}),
    Drupal.t('Sat', {}, {context: 'Day name'})
  ];

  tui_dayNamesMin = [
    Drupal.t('Su', {}, {context: 'day_name'}),
    Drupal.t('Mo', {}, {context: 'day_name'}),
    Drupal.t('Tu', {}, {context: 'day_name'}),
    Drupal.t('We', {}, {context: 'day_name'}),
    Drupal.t('Th', {}, {context: 'day_name'}),
    Drupal.t('Fr', {}, {context: 'day_name'}),
    Drupal.t('Sa', {}, {context: 'day_name'})
  ];
  /**
   * Attaches language support to the jQuery UI datepicker component.
   */

    //Drupal.behaviors.localeTuiDatepicker = {
    //attach: function (context, settings) {
    // This code accesses Drupal.settings and localized strings via Drupal.t().
    // So this code should run after these are initialized. By placing it in an
    // attach behavior this is assured.
  $.tui_datepicker.regional['drupal-locale'] = $.extend({
    closeText: Drupal.t('Done'),
    prevText: '←',
    nextText: '→',
    currentText: Drupal.t('Today'),
    monthNames: tui_monthNames,
    monthNamesShort: tui_monthNamesShort,
    dayNames: tui_dayNames,
    dayNamesShort: tui_dayNamesShort,
    dayNamesMin: tui_dayNamesMin,
    dateFormat: Drupal.t('dd/mm/yy'),
    weekHeader: 'Wk',
    firstDay: 1,
    isRTL: 0
  }, Drupal.settings.language.language);
  $.tui_datepicker.setDefaults($.tui_datepicker.regional['drupal-locale']);
  //}
  //};

});
;
/*!
 * jQuery UI Tui_datepicker @VERSION
 * http://jqueryui.com
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

//>>label: Tui_datepicker
//>>group: Widgets
//>>description: Displays a calendar from an input or inline for selecting dates.
//>>docs: http://api.jqueryui.com/datepicker/
//>>demos: http://jqueryui.com/datepicker/
//>>css.structure: ../themes/base/core.css
//>>css.structure: ../themes/base/datepicker.css
//>>css.theme: ../themes/base/theme.css
var amountOfDays = 0;
var scrollToTop = 0;
(function (factory) {
  if (typeof define === "function" && define.amd) {

    // AMD. Register as an anonymous module.
    define([
      "jquery"
    ], factory);
  } else {

    // Browser globals
    factory(jQuery);
  }
}(function ($) {

  $.extend($.ui, {tui_datepicker: {version: "@VERSION"}});

  var tui_datepicker_instActive;

  function tui_datepicker_getZindex(elem) {
    var position, value;
    while (elem.length && elem[0] !== document) {
      // Ignore z-index if position is set to a value where z-index is ignored by the browser
      // This makes behavior of this function consistent across browsers
      // WebKit always returns auto if the element is positioned
      position = elem.css("position");
      if (position === "absolute" || position === "relative" || position === "fixed") {
        // IE returns 0 when zIndex is not specified
        // other browsers return a string
        // we ignore the case of nested elements with an explicit value of 0
        // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
        value = parseInt(elem.css("zIndex"), 10);
        if (!isNaN(value) && value !== 0) {
          return value;
        }
      }
      elem = elem.parent();
    }

    return 0;
  }

  /* Date picker manager.
   Use the singleton instance of this class, $.tui_datepicker, to interact with the date picker.
   Settings for (groups of) date pickers are maintained in an instance object,
   allowing multiple different settings on the same page. */

  function Tui_datepicker() {
    this._curInst = null; // The current instance in use
    this._keyEvent = false; // If the last event was a key event
    this._disabledInputs = []; // List of date picker inputs that have been disabled
    this._tui_datepickerShowing = false; // True if the popup picker is showing , false if not
    this._inDialog = false; // True if showing within a "dialog", false if not
    this._mainDivId = "ui-datepicker-div"; // The ID of the main datepicker division
    this._inlineClass = "ui-datepicker-inline"; // The name of the inline marker class
    this._appendClass = "ui-datepicker-append"; // The name of the append marker class
    this._triggerClass = "ui-datepicker-trigger"; // The name of the trigger marker class
    this._dialogClass = "ui-datepicker-dialog"; // The name of the dialog marker class
    this._disableClass = "ui-datepicker-disabled"; // The name of the disabled covering marker class
    this._unselectableClass = "ui-datepicker-unselectable"; // The name of the unselectable cell marker class
    this._currentClass = "ui-datepicker-current-day"; // The name of the current day marker class
    this._dayOverClass = "ui-datepicker-days-cell-over"; // The name of the day hover marker class
    this.regional = []; // Available regional settings, indexed by language code
    this.regional[""] = { // Default regional settings
      closeText: "Done", // Display text for close link
      prevText: "Prev", // Display text for previous month link
      nextText: "Next", // Display text for next month link
      currentText: "Today", // Display text for current month link
      monthNames: ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"], // Names of months for drop-down and formatting
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // For formatting
      dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], // For formatting
      dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], // For formatting
      dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], // Column headings for days starting at Sunday
      weekHeader: "Wk", // Column header for week of the year
      dateFormat: "dd/mm/yy", // See format options on parseDate
      firstDay: 0, // The first day of the week, Sun = 0, Mon = 1, ...
      isRTL: false, // True if right-to-left language, false if left-to-right
      showMonthAfterYear: false, // True if the year select precedes month, false for month then year
      yearSuffix: "" // Additional text to append to the year in the month headers
    };
    this._defaults = { // Global defaults for all the date picker instances
      showOn: "focus", // "focus" for popup on focus,
      // "button" for trigger button, or "both" for either
      showAnim: "", // Name of jQuery animation for popup
      showOptions: {}, // Options for enhanced animations
      defaultDate: 1, // Used when field is blank: actual date,
      // +/-number for offset from today, null for today
      appendText: "", // Display text following the input box, e.g. showing the format
      buttonText: "...", // Text for trigger button
      buttonImage: "", // URL for trigger button image
      buttonImageOnly: false, // True if the image appears alone, false if it appears on a button
      hideIfNoPrevNext: false, // True to hide next/previous month links
      // if not applicable, false to just disable them
      navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
      gotoCurrent: false, // True if today link goes back to current selection instead
      changeMonth: false, // True if month can be selected directly, false if only prev/next
      changeYear: false, // True if year can be selected directly, false if only prev/next
      changeMonthYear: false, // True if month and year  can be selected directly, false if only prev/next
      yearRange: "c-10:c+10", // Range of years to display in drop-down,
      // either relative to today's year (-nn:+nn), relative to currently displayed year
      // (c-nn:c+nn), absolute (nnnn:nnnn), or a combination of the above (nnnn:-n)
      showOtherMonths: false, // True to show dates in other months, false to leave blank
      selectOtherMonths: false, // True to allow selection of dates in other months, false for unselectable
      showWeek: false, // True to show week of the year, false to not show it
      calculateWeek: this.iso8601Week, // How to calculate the week of the year,
      // takes a Date and returns the number of the week for it
      shortYearCutoff: "+10", // Short year values < this are in the current century,
      // > this are in the previous century,
      // string value starting with "+" for current year + value
      minDate: '0d', // The earliest selectable date, or null for no limit
      maxDate: '+4y', // The latest selectable date, or null for no limit
      duration: "fast", // Duration of display/closure
      beforeShowDay: null, // Function that takes a date and returns an array with
      // [0] = true if selectable, false if not, [1] = custom CSS class name(s) or "",
      // [2] = cell title (optional), e.g. $.tui_datepicker.noWeekends
      beforeShow: null, // Function that takes an input field and
      // returns a set of custom settings for the date picker
      onShow: null, //Function that triggers when datepicker is shown
      onSelect: null, // Define a callback function when a date is selected
      onChangeMonthYear: null, // Define a callback function when the month or year is changed
      onClose: null, // Define a callback function when the tui_datepicker is closed
      numberOfMonths: 2, // Number of months to show at a time
      showCurrentAtPos: 0, // The position in multipe months at which to show the current month (starting at 0)
      stepMonths: 1, // Number of months to step back/forward
      stepBigMonths: 12, // Number of months to step back/forward for the big links
      altField: "", // Selector for an alternate field to store selected dates into
      altFormat: "yymmdd", // The date format to use for the alternate field
      constrainInput: true, // The input is constrained by the current date format
      showButtonPanel: true, // True to show button panel, false to not show it
      showButtonPanelOnTop: true, // True to show the button panel on top
      autoSize: false, // True to size the input for the date format, false to leave as is
      disabled: false, // The initial disabled state
      rangeSelect: false,  // The initial range state
      showOnFocus: true,
      setMobilePosition: true, //set the porisition hardcoded of the datepicker, or let de datpicker
      currentTitle: false, //Set a custom title for the datepicker
      subTitle: false, //set a subTitle --> not visible to safe currentTitle
      defaultTitle: false,
      parentDiv: false, //Set a div where de datepicker needs to be shown
      showAminOnClose: false, //set if animation shown on closing datepicker
      showAnimOnOpen: false, //set if animation is shown on opening datepicker
      selectcontrolsTop: '', //
      customMindate: '1d'
    };
    $.extend(this._defaults, this.regional[""]);
    this.regional.en = $.extend(true, {}, this.regional[""]);
    this.regional["en-US"] = $.extend(true, {}, this.regional.en);
    this.dpDiv = tui_datepicker_bindHover($("<div id='" + this._mainDivId + "' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"));
  }

  $.extend(Tui_datepicker.prototype, {
    /* Class name added to elements to indicate already configured with a date picker. */
    markerClassName: "hasDatepicker",

    //Keep track of the maximum number of rows displayed (see #7043)
    maxRows: 4,

    // TODO rename to "widget" when switching to widget factory
    _widgetDatepicker: function () {
      return this.dpDiv;
    },

    /* Override the default settings for all instances of the date picker.
     * @param  settings  object - the new settings to use as defaults (anonymous object)
     * @return the manager object
     */
    setDefaults: function (settings) {
      tui_datepicker_extendRemove(this._defaults, settings || {});
      return this;
    },

    /* Attach the date picker to a jQuery selection.
     * @param  target	element - the target input field or division or span
     * @param  settings  object - the new settings to use for this date picker instance (anonymous)
     */
    _attachDatepicker: function (target, settings) {
      var nodeName, inline, inst;
      nodeName = target.nodeName.toLowerCase();
      inline = (nodeName === "div" || nodeName === "span");
      if (!target.id) {
        this.uuid += 1;
        target.id = "dp" + this.uuid;
      }
      inst = this._newInst($(target), inline);
      inst.settings = $.extend({}, settings || {});
      if (nodeName === "input") {
        this._connectDatepicker(target, inst);
      } else if (inline) {
        this._inlineDatepicker(target, inst);
      }
      inst.input.attr("readonly", "readonly");
      $(window).focus();
    },

    /* Create a new instance object. */
    _newInst: function (target, inline) {
      var id = target[0].id.replace(/([^A-Za-z0-9_\-])/g, "\\\\$1"); // escape jQuery meta chars
      return {
        id: id, input: target, // associated target
        selectedDay: 0, selectedMonth: 0, selectedYear: 0, // current selection
        drawMonth: 0, drawYear: 0, // month being drawn
        inline: inline, // is datepicker inline or not
        dpDiv: (!inline ? this.dpDiv : // presentation div
          tui_datepicker_bindHover($("<div class='" + this._inlineClass + " ui-datepicker ui-widget ui-widget-content ui-helper-clearfix'></div>")))
      };
    },

    /* Attach the date picker to an input field. */
    _connectDatepicker: function (target, inst) {
      var input = $(target);
      inst.append = $([]);
      inst.trigger = $([]);
      if (typeof isMobile != 'undefined' && typeof breakpoint != 'undefined' && (isMobile.any || breakpoint === "screen-xs" || breakpoint === 'screen-sm')) {

        var dateRange = ( input.attr('data-date-range')) ? input.attr('data-date-range') : '';
        var check_date = $.tui_datepicker.parseDate($.tui_datepicker._get(inst, "dateFormat"), input.val());
        var addMobileDatepickerDiv = '<div class="custom-input-datepicker visible-xs visible-sm"><div class="custom-input-datepicker-child custom-datepicker-child-';
        var add_date_to_block = '';
        if (dateRange) {
          var chooseDate = (dateRange === 'to') ? Drupal.t('Date to', {}, {context: 'tui_datepicker'}) : Drupal.t('Date from', {}, {context: 'tui_datepicker'});
          add_date_to_block = (check_date instanceof Date) ? '<div class="tui-datepicker-date-full tui-datepicker-date-' + dateRange + '">' + Drupal.t((dateRange === 'to') ? "To" : "From") + '<br/><span class="tui-datepicker-date-day">' + tui_padding(check_date.getDate()) + '</span><span class="tui-datepicker-date-month">/' + tui_padding(check_date.getMonth() + 1) + '/' + check_date.getFullYear() + '</span> </div>' : '<div class="tui-datepicker-date-choose">' + chooseDate + '</div>';
          addMobileDatepickerDiv += dateRange + '">';
        } else {
          add_date_to_block = '<span class="tui-datepicker-date-choose">' + Drupal.t('Choose a date') + '</span>';
          addMobileDatepickerDiv += '<div class="custom-input-datepicker visible-xs visible-sm"><div class="custom-input-datepicker-child custom-datepicker-child">';
        }
        addMobileDatepickerDiv += '<span class="glyphicon glyphicon-tui-calendar"></span>' + add_date_to_block + "</div></div>";
        input.addClass('visible-md visible-lg');
        if (!input.siblings('.custom-input-datepicker').length) {
          $(addMobileDatepickerDiv).insertAfter(input).on('click', function () {
            input.focus();
          });
        }
      }


      if (input.hasClass(this.markerClassName)) {
        return;
      }
      this._attachments(input, inst);
      input.addClass(this.markerClassName).keydown(this._doKeyDown).
        keypress(this._doKeyPress).keyup(this._doKeyUp);
      this._autoSize(inst);
      $.data(target, "tui_datepicker", inst);
      //If disabled option is true, disable the datepicker once it has been attached to the input (see ticket #5665)
      if (inst.settings.disabled) {
        this._disableDatepicker(target);
      }

    },

    /* Make attachments based on settings. */
    _attachments: function (input, inst) {
      var showOn, buttonText, buttonImage,
        appendText = this._get(inst, "appendText");

      if (inst.append) {
        inst.append.remove();
      }
      if (appendText) {
        inst.append = $("<span class='" + this._appendClass + "'>" + appendText + "</span>");
        input["after"](inst.append);
      }
      input.unbind("focus", this._showDatepicker);

      if (inst.trigger) {
        inst.trigger.remove();
      }

      showOn = this._get(inst, "showOn");
      if (showOn === "focus" || showOn === "both") { // pop-up date picker when in the marked field
        input.focus(this._showDatepicker);

      }
      if (showOn === "button" || showOn === "both") { // pop-up date picker when button clicked
        buttonText = this._get(inst, "buttonText");
        buttonImage = this._get(inst, "buttonImage");
        inst.trigger = $(this._get(inst, "buttonImageOnly") ?
          $("<img/>").addClass(this._triggerClass).
            attr({src: buttonImage, alt: buttonText, title: buttonText}) :
          $("<button type='button'></button>").addClass(this._triggerClass).
            html(!buttonImage ? buttonText : $("<img/>").attr(
              {src: buttonImage, alt: buttonText, title: buttonText})));
        input["after"](inst.trigger);
        inst.trigger.click(function () {
          if ($.tui_datepicker._tui_datepickerShowing && $.tui_datepicker._lastInput === input[0]) {
            $.tui_datepicker._hideDatepicker();
          } else if ($.tui_datepicker._tui_datepickerShowing && $.tui_datepicker._lastInput !== input[0]) {
            $.tui_datepicker._hideDatepicker();
            $.tui_datepicker._showDatepicker(input[0]);
          } else {
            $.tui_datepicker._showDatepicker(input[0]);
          }
          return false;
        });
      }
    },

    /* Apply the maximum length for the date format. */
    _autoSize: function (inst) {
      if (this._get(inst, "autoSize") && !inst.inline) {
        var findMax, max, maxI, i,
          date = new Date(2009, 12 - 1, 20), // Ensure double digits
          dateFormat = this._get(inst, "dateFormat");

        if (dateFormat.match(/[DM]/)) {
          findMax = function (names) {
            max = 0;
            maxI = 0;
            for (i = 0; i < names.length; i++) {
              if (names[i].length > max) {
                max = names[i].length;
                maxI = i;
              }
            }
            return maxI;
          };
          date.setMonth(findMax(this._get(inst, (dateFormat.match(/MM/) ?
            "monthNames" : "monthNamesShort"))));
          date.setDate(findMax(this._get(inst, (dateFormat.match(/DD/) ?
            "dayNames" : "dayNamesShort"))) + 20 - date.getDay());
        }
        inst.input.attr("size", this._formatDate(inst, date).length);
      }
    },

    /* Attach an inline date picker to a div. */
    _inlineDatepicker: function (target, inst) {
      var divSpan = $(target);
      if (divSpan.hasClass(this.markerClassName)) {
        return;
      }
      divSpan.addClass(this.markerClassName).append(inst.dpDiv);
      $.data(target, "tui_datepicker", inst);
      this._setDate(inst, this._getDefaultDate(inst), true);
      this._updateDatepicker(inst);
      this._updateAlternate(inst);
      //If disabled option is true, disable the datepicker before showing it (see ticket #5665)
      if (inst.settings.disabled) {
        this._disableDatepicker(target);
      }
      // Set display:block in place of inst.dpDiv.show() which won't work on disconnected elements
      // http://bugs.jqueryui.com/ticket/7552 - A Datepicker created on a detached div has zero height
      inst.dpDiv.css("display", "block");
    },

    /* Pop-up the date picker in a "dialog" box.
     * @param  input element - ignored
     * @param  date	string or Date - the initial date to display
     * @param  onSelect  function - the function to call when a date is selected
     * @param  settings  object - update the dialog date picker instance's settings (anonymous object)
     * @param  pos int[2] - coordinates for the dialog's position within the screen or
     *					event - with x/y coordinates or
     *					leave empty for default (screen centre)
     * @return the manager object
     */
    _dialogDatepicker: function (input, date, onSelect, settings, pos) {
      var id, browserWidth, browserHeight, scrollX, scrollY,
        inst = this._dialogInst; // internal instance

      if (!inst) {
        this.uuid += 1;
        id = "dp" + this.uuid;
        this._dialogInput = $("<input type='text' id='" + id +
        "' style='position: absolute; top: -100px; width: 0px;'/>");
        this._dialogInput.keydown(this._doKeyDown);

        var parentDiv = this._get(inst, "parentDiv");
        if (typeof isMobile != 'undefined' && parentDiv && $(parentDiv).length && !isMobile.any) {
          $(parentDiv).append(this._dialogInput);
        } else {
          $("body").append(this._dialogInput);
        }
        addSwipeToDatepicker(this._dialogInput);
        inst = this._dialogInst = this._newInst(this._dialogInput, false);
        inst.settings = {};
        $.data(this._dialogInput[0], "tui_datepicker", inst);
      }
      tui_datepicker_extendRemove(inst.settings, settings || {});
      date = (date && date.constructor === Date ? this._formatDate(inst, date) : date);
      this._dialogInput.val(date);

      this._pos = (pos ? (pos.length ? pos : [pos.pageX, pos.pageY]) : null);
      if (!this._pos) {
        browserWidth = document.documentElement.clientWidth;
        browserHeight = document.documentElement.clientHeight;
        scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        this._pos = // should use actual width/height below
          [(browserWidth / 2) - 100 + scrollX, (browserHeight / 2) - 150 + scrollY];
      }
      // move input on screen for focus, but hidden behind dialog
      this._dialogInput.css("left", (this._pos[0] + 20) + "px").css("top", this._pos[1] + "px");
      inst.settings.onSelect = onSelect;
      this._inDialog = true;
      this.dpDiv.addClass(this._dialogClass);
      this._showDatepicker(this._dialogInput[0]);
      if ($.blockUI) {
        $.blockUI(this.dpDiv);
      }
      $.data(this._dialogInput[0], "tui_datepicker", inst);
      return this;
    },

    /* Detach a tui_datepicker from its control.
     * @param  target	element - the target input field or division or span
     */
    _destroyDatepicker: function (target) {
      var nodeName,
        $target = $(target),
        inst = $.data(target, "tui_datepicker");

      if (!$target.hasClass(this.markerClassName)) {
        return;
      }

      nodeName = target.nodeName.toLowerCase();
      $.removeData(target, "tui_datepicker");
      if (nodeName === "input") {
        inst.append.remove();
        inst.trigger.remove();
        $target.removeClass(this.markerClassName).
          unbind("focus", this._showDatepicker).
          unbind("keydown", this._doKeyDown).
          unbind("keypress", this._doKeyPress).
          unbind("keyup", this._doKeyUp);
      } else if (nodeName === "div" || nodeName === "span") {
        $target.removeClass(this.markerClassName).empty();
      }

      if (tui_datepicker_instActive === inst) {
        tui_datepicker_instActive = null;
      }
    },

    /* Enable the date picker to a jQuery selection.
     * @param  target	element - the target input field or division or span
     */
    _enableDatepicker: function (target) {
      var nodeName, inline,
        $target = $(target),
        inst = $.data(target, "tui_datepicker");

      if (!$target.hasClass(this.markerClassName)) {
        return;
      }

      nodeName = target.nodeName.toLowerCase();
      if (nodeName === "input") {
        target.disabled = false;
        inst.trigger.filter("button").
          each(function () {
            this.disabled = false;
          }).end().
          filter("img").css({opacity: "1.0", cursor: ""});
      } else if (nodeName === "div" || nodeName === "span") {
        inline = $target.children("." + this._inlineClass);
        inline.children().removeClass("ui-state-disabled");
        inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
          prop("disabled", false);
      }
      this._disabledInputs = $.map(this._disabledInputs,
        function (value) {
          return (value === target ? null : value);
        }); // delete entry
    },

    /* Disable the date picker to a jQuery selection.
     * @param  target	element - the target input field or division or span
     */
    _disableDatepicker: function (target) {
      var nodeName, inline,
        $target = $(target),
        inst = $.data(target, "tui_datepicker");

      if (!$target.hasClass(this.markerClassName)) {
        return;
      }

      nodeName = target.nodeName.toLowerCase();
      if (nodeName === "input") {
        target.disabled = true;
        inst.trigger.filter("button").
          each(function () {
            this.disabled = true;
          }).end().
          filter("img").css({opacity: "0.5", cursor: "default"});
      } else if (nodeName === "div" || nodeName === "span") {
        inline = $target.children("." + this._inlineClass);
        inline.children().addClass("ui-state-disabled");
        inline.find("select.ui-datepicker-month, select.ui-datepicker-year").
          prop("disabled", true);
      }
      this._disabledInputs = $.map(this._disabledInputs,
        function (value) {
          return (value === target ? null : value);
        }); // delete entry
      this._disabledInputs[this._disabledInputs.length] = target;
    },

    /* Is the first field in a jQuery collection disabled as a datepicker?
     * @param  target	element - the target input field or division or span
     * @return boolean - true if disabled, false if enabled
     */
    _isDisabledDatepicker: function (target) {
      if (!target) {
        return false;
      }
      for (var i = 0; i < this._disabledInputs.length; i++) {
        if (this._disabledInputs[i] === target) {
          return true;
        }
      }
      return false;
    },

    /* Retrieve the instance data for the target control.
     * @param  target  element - the target input field or division or span
     * @return  object - the associated instance data
     * @throws  error if a jQuery problem getting data
     */
    _getInst: function (target) {
      try {
        return $.data(target, "tui_datepicker");
      }
      catch (err) {
        throw "Missing instance data for this tui_datepicker";
      }
    },

    /* Update or retrieve the settings for a date picker attached to an input field or division.
     * @param  target  element - the target input field or division or span
     * @param  name	object - the new settings to update or
     *				string - the name of the setting to change or retrieve,
     *				when retrieving also "all" for all instance settings or
     *				"defaults" for all global defaults
     * @param  value   any - the new value for the setting
     *				(omit if above is an object or to retrieve a value)
     */
    _optionDatepicker: function (target, name, value) {
      var settings, date, minDate, maxDate,
        inst = this._getInst(target);

      if (arguments.length === 2 && typeof name === "string") {
        return (name === "defaults" ? $.extend({}, $.tui_datepicker._defaults) :
          (inst ? (name === "all" ? $.extend({}, inst.settings) :
            this._get(inst, name)) : null));
      }

      settings = name || {};
      if (typeof name === "string") {
        settings = {};
        settings[name] = value;
      }

      if (inst) {
        if (this._curInst === inst) {
          this._hideDatepicker();
        }

        date = this._getDateDatepicker(target, true);
        minDate = this._getMinMaxDate(inst, "min");
        maxDate = this._getMinMaxDate(inst, "max");
        tui_datepicker_extendRemove(inst.settings, settings);
        // reformat the old minDate/maxDate values if dateFormat changes and a new minDate/maxDate isn't provided
        if (minDate !== null && settings.dateFormat !== undefined && settings.minDate === undefined) {
          inst.settings.minDate = this._formatDate(inst, minDate);
        }
        if (maxDate !== null && settings.dateFormat !== undefined && settings.maxDate === undefined) {
          inst.settings.maxDate = this._formatDate(inst, maxDate);
        }
        if ("disabled" in settings) {
          if (settings.disabled) {
            this._disableDatepicker(target);
          } else {
            this._enableDatepicker(target);
          }
        }
        this._attachments($(target), inst);
        this._autoSize(inst);
        this._setDate(inst, date);
        this._updateAlternate(inst);
        this._updateDatepicker(inst);
      }
    },

    // change method deprecated
    _changeDatepicker: function (target, name, value) {
      this._optionDatepicker(target, name, value);
    },

    /* Redraw the date picker attached to an input field or division.
     * @param  target  element - the target input field or division or span
     */
    _refreshDatepicker: function (target) {
      var inst = this._getInst(target);
      if (inst) {
        this._updateDatepicker(inst);
      }
    },

    /* Set the dates for a jQuery selection.
     * @param  target element - the target input field or division or span
     * @param  date	Date - the new date
     */
    _setDateDatepicker: function (target, date) {
      var inst = this._getInst(target);
      if (inst) {
        this._setDate(inst, date);
        this._updateDatepicker(inst);
        this._updateAlternate(inst);
      }
    },

    /* Get the date(s) for the first entry in a jQuery selection.
     * @param  target element - the target input field or division or span
     * @param  noDefault boolean - true if no default date is to be used
     * @return Date - the current date
     */
    _getDateDatepicker: function (target, noDefault) {
      var inst = this._getInst(target);
      if (inst && !inst.inline) {
        this._setDateFromField(inst, noDefault);
      }
      return (inst ? this._getDate(inst) : null);
    },

    /* Handle keystrokes. */
    _doKeyDown: function (event) {
      var onSelect, dateStr, sel,
        inst = $.tui_datepicker._getInst(event.target),
        handled = true;

      inst._keyEvent = true;
      if ($.tui_datepicker._datepickerShowing) {
        switch (event.keyCode) {
          case 9:
            $.tui_datepicker._hideDatepicker();
            handled = false;
            break; // hide on tab out
          case 13:
            sel = $("td." + $.tui_datepicker._dayOverClass + ":not(." +
            $.tui_datepicker._currentClass + ")", inst.dpDiv);
            if (sel[0]) {
              $.tui_datepicker._selectDay(event.target, inst.selectedMonth, inst.selectedYear, sel[0]);
            }

            onSelect = $.tui_datepicker._get(inst, "onSelect");
            if (onSelect) {
              dateStr = $.tui_datepicker._formatDate(inst);

              // trigger custom callback
              onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);
            } else {
              $.tui_datepicker._hideDatepicker();
            }

            return false; // don't submit the form
          case 27:
            $.tui_datepicker._hideDatepicker();
            break; // hide on escape
          case 33:
            $.tui_datepicker._adjustDate(event.target, (event.ctrlKey ?
              -$.tui_datepicker._get(inst, "stepBigMonths") :
              -$.tui_datepicker._get(inst, "stepMonths")), "M");
            break; // previous month/year on page up/+ ctrl
          case 34:
            $.tui_datepicker._adjustDate(event.target, (event.ctrlKey ?
              +$.tui_datepicker._get(inst, "stepBigMonths") :
              +$.tui_datepicker._get(inst, "stepMonths")), "M");
            break; // next month/year on page down/+ ctrl
          case 35:
            if (event.ctrlKey || event.metaKey) {
              $.tui_datepicker._clearDate(event.target);
            }
            handled = event.ctrlKey || event.metaKey;
            break; // clear on ctrl or command +end
          case 36:
            if (event.ctrlKey || event.metaKey) {
              $.tui_datepicker._gotoToday(event.target);
            }
            handled = event.ctrlKey || event.metaKey;
            break; // current on ctrl or command +home
          case 37:
            if (event.ctrlKey || event.metaKey) {
              $.tui_datepicker._adjustDate(event.target, -1, "D");
            }
            handled = event.ctrlKey || event.metaKey;
            // -1 day on ctrl or command +left
            if (event.originalEvent.altKey) {
              $.tui_datepicker._adjustDate(event.target, (event.ctrlKey ?
                -$.tui_datepicker._get(inst, "stepBigMonths") :
                -$.tui_datepicker._get(inst, "stepMonths")), "M");
            }
            // next month/year on alt +left on Mac
            break;
          case 38:
            if (event.ctrlKey || event.metaKey) {
              $.tui_datepicker._adjustDate(event.target, -7, "D");
            }
            handled = event.ctrlKey || event.metaKey;
            break; // -1 week on ctrl or command +up
          case 39:
            if (event.ctrlKey || event.metaKey) {
              $.tui_datepicker._adjustDate(event.target, +1, "D");
            }
            handled = event.ctrlKey || event.metaKey;
            // +1 day on ctrl or command +right
            if (event.originalEvent.altKey) {
              $.tui_datepicker._adjustDate(event.target, (event.ctrlKey ?
                +$.tui_datepicker._get(inst, "stepBigMonths") :
                +$.tui_datepicker._get(inst, "stepMonths")), "M");
            }
            // next month/year on alt +right
            break;
          case 40:
            if (event.ctrlKey || event.metaKey) {
              $.tui_datepicker._adjustDate(event.target, +7, "D");
            }
            handled = event.ctrlKey || event.metaKey;
            break; // +1 week on ctrl or command +down
          default:
            handled = false;
        }
      } else if (event.keyCode === 36 && event.ctrlKey) { // display the date picker on ctrl+home
        $.tui_datepicker._showDatepicker(this);
      } else {
        handled = false;
      }

      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    },

    /* Filter entered characters - based on date format. */
    _doKeyPress: function (event) {
      var chars, chr,
        inst = $.tui_datepicker._getInst(event.target);

      if ($.tui_datepicker._get(inst, "constrainInput")) {
        chars = $.tui_datepicker._possibleChars($.tui_datepicker._get(inst, "dateFormat"));
        chr = String.fromCharCode(event.charCode == null ? event.keyCode : event.charCode);
        return event.ctrlKey || event.metaKey || (chr < " " || !chars || chars.indexOf(chr) > -1);
      }
    },

    /* Synchronise manual entry and field/alternate field. */
    _doKeyUp: function (event) {
      var date,
        inst = $.tui_datepicker._getInst(event.target);

      if (inst.input.val() !== inst.lastVal) {
        try {
          date = $.tui_datepicker.parseDate($.tui_datepicker._get(inst, "dateFormat"),
            (inst.input ? inst.input.val() : null),
            $.tui_datepicker._getFormatConfig(inst));

          if (date) { // only if valid
            $.tui_datepicker._setDateFromField(inst);
            $.tui_datepicker._updateAlternate(inst);
            $.tui_datepicker._updateDatepicker(inst);
          }
        }
        catch (err) {
        }
      }
      return true;
    },

    /* Pop-up the date picker for a given input field.
     * If false returned from beforeShow event handler do not show.
     * @param  input  element - the input field attached to the date picker or
     *					event - if triggered by focus
     */
    _showDatepicker: function (input) {
      input = input.target || input;
      if (input.nodeName.toLowerCase() !== "input") { // find from button/image trigger
        input = $("input", input.parentNode)[0];
      }

      if ($.tui_datepicker._isDisabledDatepicker(input) || $.tui_datepicker._lastInput === input) { // already here
        return;
      }

      var inst, beforeShow, beforeShowSettings, isFixed,
        offset, showAnim, duration;

      inst = $.tui_datepicker._getInst(input);
      if ($.tui_datepicker._curInst && $.tui_datepicker._curInst !== inst) {
        $.tui_datepicker._curInst.dpDiv.stop(true, true);
        if ( inst && $.tui_datepicker._tui_datepickerShowing) {
          $.tui_datepicker._hideDatepicker($.tui_datepicker._curInst.input[0]);
        }
      }

      var parentDiv = $.tui_datepicker._get(inst, "parentDiv");
      beforeShow = $.tui_datepicker._get(inst, "beforeShow");

      beforeShowSettings = beforeShow ? beforeShow.apply(input, [input, inst]) : {};
      if (beforeShowSettings === false) {
        return;
      }
      tui_datepicker_extendRemove(inst.settings, beforeShowSettings);

      inst.lastVal = null;
      $.tui_datepicker._lastInput = input;
      $.tui_datepicker._setDateFromField(inst);

      if ($.tui_datepicker._inDialog) { // hide cursor
        input.value = "";
      }

      if (!$.tui_datepicker._pos) { // position below input
        $.tui_datepicker._pos = $.tui_datepicker._findPos(input);
        $.tui_datepicker._pos[1] += input.offsetHeight; // add the height
      }

      isFixed = false;
      $(input).parents().each(function () {
        isFixed |= $(this).css("position") === "fixed";
        return !isFixed;
      });
      offset = {left: $.tui_datepicker._pos[0], top: $.tui_datepicker._pos[1]};

      $.tui_datepicker._pos = null;
      //to avoid flashes on Firefox
      inst.dpDiv.empty();
      // determine sizing offscreen

      if (typeof isMobile != 'undefined' && parentDiv && $(parentDiv).length && !isMobile.any) {
        inst.dpDiv.css({display: "block"});
      } else {
        inst.dpDiv.css({
          position: "absolute",
          display: "block",
          top: "-1000px"
        });
      }

      $.tui_datepicker._updateDatepicker(inst);

      // fix width for dynamic number of date pickers

      // and adjust position before showing
      offset = $.tui_datepicker._checkOffset(inst, offset, isFixed);
      var position_div = ($.tui_datepicker._inDialog && $.blockUI) ? "static" : (isFixed ? "fixed" : "absolute");
      if (typeof isMobile != 'undefined' && parentDiv && !isMobile.any) {
        position_div = 'block';
      }


      inst.dpDiv.css({
        position: position_div, display: "none",
        left: offset.left + "px", top: offset.top + "px"
      });
      onShow = $.tui_datepicker._get(inst, "onShow");
      onShowSettings = onShow ? onShow.apply(input, [input, inst]) : {};
      if (onShowSettings === false) {
        return;
      }
      var parentMobile  =$('.ui_datepicker_parent_mobile');
      if (typeof isMobile != 'undefined' && typeof breakpoint != 'undefined' && !isMobile.any && parentMobile.length && (breakpoint === 'screen-xs' || breakpoint === 'screen-sm')) {
        parentMobile.append($('.ui_datepicker_block'));
      } else if ($('.ui_datepicker_parent').length) {
        $('.ui_datepicker_parent > div').append($('.ui_datepicker_block'));
      }
      if (!inst.inline) {
        showAnimOnOpen = $.tui_datepicker._get(inst, "showAnimOnOpen");
        showAnim = (showAnimOnOpen === false) ? $.tui_datepicker._get(inst, "showAnim") : showAnimOnOpen;
        duration = $.tui_datepicker._get(inst, "duration");
        inst.dpDiv.css("z-index", tui_datepicker_getZindex($(input)) + 1);
        $.tui_datepicker._tui_datepickerShowing = true;

        if ($.effects && $.effects.effect[showAnim]) {
          inst.dpDiv.show(showAnim, $.tui_datepicker._get(inst, "showOptions"), duration);
        } else {
          inst.dpDiv[showAnim || "show"](showAnim ? duration : null);
        }

        if ($.tui_datepicker._shouldFocusInput(inst)) {
          inst.input.focus();
        }
        if (inst.input.attr('data-date-range') === 'to') {

        }
        $.tui_datepicker._curInst = inst;
        tui_datepicker_calculateRange(null, inst);

      }
      $(input).attr("readonly", "readonly");
      $(input).attr("disabled", "disabled");
      $(input).parent().addClass("active");
      if (typeof isMobile != 'undefined' && isMobile.any && !$('.ui-datepicker').hasClass('hide')) {
        var tuiOverlay = $("<div class='tui-datepicker-overlay'></div>");
        $('#' + $.tui_datepicker._mainDivId).before(tuiOverlay);
      }


    },

    /* Generate the date picker content. */
    _updateDatepicker: function (inst) {
      this.maxRows = 4; //Reset the max number of rows being displayed (see #7043)
      tui_datepicker_instActive = inst; // for delegate hover events
      inst.dpDiv.empty().append(this._generateHTML(inst));
      this._attachHandlers(inst);

      var origyearshtml,
        numMonths = this._getNumberOfMonths(inst),
        cols = numMonths[1],
        width = 272,
        activeCell = inst.dpDiv.find("." + this._dayOverClass + " a");
      if (typeof isMobile != 'undefined' && typeof breakpoint != 'undefined' && isMobile.any && ( breakpoint != "screen-xs" )) {
        width = ($('body').outerWidth() / cols ) - ( 30 / cols );
      }
      if (activeCell.length > 0) {
        tui_datepicker_handleMouseover.apply(activeCell.get(0));
      }

      inst.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width("");

      if (cols > 1) {
        inst.dpDiv.addClass("ui-datepicker-multi-" + cols).css("width", ( width * cols) + "px");
      }
      inst.dpDiv[(numMonths[0] !== 1 || numMonths[1] !== 1 ? "add" : "remove") +
      "Class"]("ui-datepicker-multi");

      if (inst === $.tui_datepicker._curInst && $.tui_datepicker._tui_datepickerShowing && $.tui_datepicker._shouldFocusInput(inst)) {
        inst.input.focus();
     }

      if (typeof isMobile != 'undefined' && this._get(inst, "rangeSelect") && !isMobile.any) {
        $('.ui-datepicker').find('td[data-handler=selectDay]').bind("mouseleave", function () {
          var openInstanceobj = inst.input.attr('data-date-range');
          $('.ui-datepicker-selected-' + openInstanceobj).removeClass('ui-datepicker-selected-' + openInstanceobj);
        });

        //show range when mouse outside datepicker or on disabled date
        inst.dpDiv.bind("mouseleave", function () {
          tui_datepicker_checkBetweenDates(inst, $(this));
        });
        $('.ui-datepicker-group-body').bind("mouseleave", function () {
          tui_datepicker_checkBetweenDates(inst, $(this));
        });
        $('.ui-datepicker').find("td").bind("mouseenter", function () {
          var hover_date = false;
          if ($(this).children().length) {
            hover_date = new Date($(this).attr('data-year'), $(this).attr('data-month'), $(this).find('.ui-state-default').text());
            hover_date = hover_date.getTime();
          }
          tui_datepicker_checkBetweenDates(inst, $(this), hover_date);
        });
      }
      // deffered render of the years select (to avoid flashes on Firefox)
      if (inst.yearshtml) {
        origyearshtml = inst.yearshtml;
        setTimeout(function () {
          //assure that inst.yearshtml didn't change.
          if (origyearshtml === inst.yearshtml && inst.yearshtml) {
            inst.dpDiv.find("select.ui-datepicker-year:first").replaceWith(inst.yearshtml);
          }
          origyearshtml = inst.yearshtml = null;
        }, 0);
      }
    },

    // #6694 - don't focus the input if it's already focused
    // this breaks the change event in IE
    // Support: IE and jQuery <1.9
    _shouldFocusInput: function (inst) {
      return inst.input && inst.input.is(":visible") && !inst.input.is(":disabled") && !inst.input.is(":focus");
    },

    /* Check positioning to remain on screen. */
    _checkOffset: function (inst, offset, isFixed) {
      setMobilePosition = $.tui_datepicker._get(inst, "setMobilePosition");
      rangeSelect = $.tui_datepicker._get(inst, "rangeSelect");

      if (typeof isMobile != 'undefined' && setMobilePosition && isMobile.any) {
       $('body').bind('touchmove', function (e) {
          e.preventDefault();
        });
        offset = centerOffset(inst.dpDiv, 'toTop');
      } else {
        var dpWidth = inst.dpDiv.outerWidth(),
          dpHeight = inst.dpDiv.outerHeight(),
          inputWidth = inst.input ? inst.input.outerWidth() : 0,
          inputHeight = inst.input ? inst.input.outerHeight() : 0,
          viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft()),
          viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());
        // now check if datepicker is showing outside window viewport - move to a better place if so.
        if (rangeSelect) {
          var position_datepickers = inst.input.parents('form').find('.hasDatepicker');
          var position_datepicker = offset.left;
          if (position_datepickers.length > 1) {
            position_datepicker = offset.left - ( ( dpWidth / 2 ) - (inputWidth / 2));
            offset = {left: position_datepicker, top: offset.top};
            if (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) {
              offset.left = Math.abs(viewWidth - dpWidth);
            } else if (offset.left <= 15) {
              offset.left = 15;
            }
            if (inst.input.parents().hasClass('book-form-fixed')) {
              offset.top = $('.book-form-fixed').outerHeight() - 15;
            } else {
              if (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) {
                offset.top = Math.abs(viewHeight - dpHeight);
              } else if (offset.top <= 15) {
                offset.top = viewHeight - dpHeight - 15;
              }
            }
          }

        } else {
          offset.left -= (isFixed && offset.left === inst.input.offset().left) ? $(document).scrollLeft() : 0;
          offset.top -= (isFixed && offset.top === (inst.input.offset().top + inputHeight)) ? $(document).scrollTop() : 0;
          offset.left -= Math.min(offset.left, (offset.left + dpWidth > viewWidth && viewWidth > dpWidth) ?
            Math.abs(offset.left + dpWidth - viewWidth) : 0);
          offset.top -= Math.min(offset.top, (offset.top + dpHeight > viewHeight && viewHeight > dpHeight) ? Math.abs(dpHeight + inputHeight) : 0);
        }
      }

      offset.top = Math.round(offset.top);
      offset.left = Math.round(offset.left);
      return offset;
    },

    /* Find an object's position on the screen. */
    _findPos: function (obj) {
      var position;

      while (obj && (obj.type === "hidden" || obj.nodeType !== 1 || $.expr.filters.hidden(obj))) {
        obj = obj["nextSibling"];
      }

      position = $(obj).offset();
      return [position.left, position.top];
    },

    /* Hide the date picker from view.
     * @param  input  element - the input field attached to the date picker
     */
    _hideDatepicker: function (input) {
      var bodyElem = $('body');
      bodyElem.unbind('touchmove');
      var showAnim, duration, postProcess, onClose, showAminOnClose, customMindate, showCustomTitle;
      inst = this._curInst;
      if (!inst || (input && inst !== $.data(input, "tui_datepicker"))) {
        return;
      }
      var dateRange = inst.input.attr("data-date-range");
      if (dateRange === 'to') {
        var toDate = inst.input.parents('form').find('input[data-date-range=to]').tui_datepicker("getDate");
        var fromDate = inst.input.parents('form').find('input[data-date-range=from]').tui_datepicker("getDate");

        showCustomTitle = '<span class="glyphicon glyphicon-tui-calendar"></span><span class="tui-datepicker-date-choose">' + Drupal.t('Date To') + '</span>';
        customMindate = $.tui_datepicker._get(inst, "customMindate");

        if (( customMindate === '0d' && toDate < fromDate ) || ( customMindate != '0d' && toDate <= fromDate )) {
          inst.input.parents('form').find('input[data-date-range=to]').tui_datepicker("setDate", null);
          $('.tui-datepicker-date-' + dateRange).html(showCustomTitle);
          inst.input.parents('form').find('.custom-datepicker-child-' + dateRange).html(showCustomTitle);
        }
      }
      if (this._tui_datepickerShowing) {
        showAminOnClose = $.tui_datepicker._get(inst, "showAminOnClose");
        showAnim = ( showAminOnClose === false ) ? this._get(inst, "showAnim") : showAminOnClose;
        duration = this._get(inst, "duration");
        postProcess = function () {
          $.tui_datepicker._tidyDialog(inst);
        };
        // DEPRECATED: after BC for 1.8.x $.effects[ showAnim ] is not needed
        if ($.effects && ( $.effects.effect[showAnim] || $.effects[showAnim] )) {
          inst.dpDiv.hide(showAnim, $.tui_datepicker._get(inst, "showOptions"), duration, postProcess);
        } else {
          inst.dpDiv[(showAnim === "slideDown" ? "slideUp" :
            (showAnim === "fadeIn" ? "fadeOut" : "hide"))]((showAnim ? duration : null), postProcess);
        }

        if (!showAnim) {
          postProcess();
        }
        if (typeof isMobile != 'undefined' && isMobile.any) {
          $('.tui-datepicker-overlay').remove();
        }
        this._tui_datepickerShowing = false;

        onClose = this._get(inst, "onClose");
        if (onClose) {
          onClose.apply((inst.input ? inst.input[0] : null), [(inst.input ? inst.input.val() : ""), inst]);
        }
        inst.input.parent().removeClass("active");
        inst.input.removeAttr("disabled");
        this._lastInput = null;
        if (this._inDialog) {
          this._dialogInput.css({
            position: "absolute",
            left: "0",
            top: "-100px"
          });
          if ($.blockUI) {
            $.unblockUI();
            var parentDiv = this._get(inst, "parentDiv");
            if (typeof isMobile != 'undefined' && parentDiv && $(parentDiv).length && !isMobile.any) {
              $(parentDiv).append(this.dpDiv);
            } else {
              bodyElem.append(this.dpDiv);
            }
            addSwipeToDatepicker(this.dpDiv);
          }
        }
        this._inDialog = false;
      }
    },

    /* Tidy up after a dialog display. */
    _tidyDialog: function (inst) {
      inst.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar");
    },


    /* Close date picker if clicked elsewhere. */
    _checkExternalClick: function (event) {
      if (!$.tui_datepicker._curInst) {
        return;
      }
      $('.hasDatepicker').blur();
      //remove focus datepicker --> bug when scrolling: datepicker wondt open again.
      var $target = $(event.target),
        inst = $.tui_datepicker._getInst($target[0]);

      if (( ( $target[0].id !== $.tui_datepicker._mainDivId &&
        $target.parents("#" + $.tui_datepicker._mainDivId).length === 0 && !$target.hasClass($.tui_datepicker.markerClassName) && !$target.closest("." + $.tui_datepicker._triggerClass).length &&
        $.tui_datepicker._tui_datepickerShowing && !($.tui_datepicker._inDialog && $.blockUI) ) ) ||
        ( $target.hasClass($.tui_datepicker.markerClassName) && $.tui_datepicker._curInst !== inst )) {
        $.tui_datepicker._hideDatepicker();
      }
    },

    /* Adjust one of the date sub-fields. */
    _adjustDate: function (id, offset, period) {
      var target = $(id),
        inst = this._getInst(target[0]);

      if (this._isDisabledDatepicker(target[0])) {
        return;
      }
      this._adjustInstDate(inst, offset +
        (period === "M" ? this._get(inst, "showCurrentAtPos") : 0), // undo positioning
        period);
      this._updateDatepicker(inst);
    },

    /* Action for current link. */
    _gotoToday: function (id) {
      var date,
        target = $(id),
        inst = this._getInst(target[0]);

      if (this._get(inst, "gotoCurrent") && inst.currentDay) {
        inst.selectedDay = inst.currentDay;
        inst.drawMonth = inst.selectedMonth = inst.currentMonth;
        inst.drawYear = inst.selectedYear = inst.currentYear;
      } else {
        date = new Date();
        inst.selectedDay = date.getDate();
        inst.drawMonth = inst.selectedMonth = date.getMonth();
        inst.drawYear = inst.selectedYear = date.getFullYear();
      }
      this._notifyChange(inst);
      this._adjustDate(target);
    },
    /* Action for selecting a new month/year. */
    _selectMonthYear: function (id, select, period) {
      var target = $(id);
      var inst = this._getInst(target[0]);
      inst['selected' + (period == 'M' ? 'Month' : 'Year')] =
        inst['draw' + (period == 'M' ? 'Month' : 'Year')] =
          parseInt(select.options[select.selectedIndex].value, 10);
      this._notifyChange(inst);
      this._adjustDate(target);
    },
    _selectMonthandYear: function (id, select, period) {
      var target = $(id);
      var inst = this._getInst(target[0]);
      var arr_year = select.options[select.selectedIndex].value.split("_");
      inst['selectedYear'] =
        inst['drawYear'] =
          parseInt(arr_year[1], 10);
      this._notifyChange(inst);
      this._adjustDate(target);
      inst['selectedMonth'] =
        inst['drawMonth'] =
          parseInt(arr_year[0], 10);
      this._notifyChange(inst);
      this._adjustDate(target);
    },

    /* Action for selecting a day. */
    _selectDay: function (id, month, year, td) {
      var inst,
        target = $(id);

      if ($(td).hasClass(this._unselectableClass) || this._isDisabledDatepicker(target[0])) {
        return;
      }

      inst = this._getInst(target[0]);
      inst.selectedDay = inst.currentDay = $("a", td).html();
      inst.selectedMonth = inst.currentMonth = month;
      inst.selectedYear = inst.currentYear = year;
      this._selectDate(id, this._formatDate(inst,
        inst.currentDay, inst.currentMonth, inst.currentYear));
    },

    /* Erase the input field and hide the date picker. */
    _clearDate: function (id) {
      var target = $(id);
      this._selectDate(target, "");
    },

    /* Update the input field with the selected date. */
    _selectDate: function (id, dateStr) {
      var onSelect,
        target = $(id),
        inst = this._getInst(target[0]);

      dateStr = (dateStr != null ? dateStr : this._formatDate(inst));

      if (inst.input) {
        inst.input.val(dateStr);
      }
      this._updateAlternate(inst);

      onSelect = this._get(inst, "onSelect");
      if (onSelect) {
        onSelect.apply((inst.input ? inst.input[0] : null), [dateStr, inst]);  // trigger custom callback
      } else if (inst.input) {
        inst.input.trigger("change"); // fire the change event
      }

      if (inst.inline) {
        this._updateDatepicker(inst);
      } else {
        var dateElement = $.tui_datepicker.parseDate($.tui_datepicker._get(inst, "dateFormat"), dateStr);
        var dateRange = inst.input.attr('data-date-range');
        if (dateRange === 'to') {
          $('td[data-handler=selectDay]').removeClass('ui-datepicker-selected-to');
          tui_datepicker_checkBetweenDates(inst, $('td[data-handler=selectDay][data-month=' + dateElement.getMonth() + '][data-year=' + dateElement.getFullYear() + '] a:textEquals(' + dateElement.getDate() + ')').parent(), dateElement);
          $('.ui-datepicker-buttonpane-footer').removeClass('hide');
        }
        var label = (dateRange === 'to') ? Drupal.t('To', {}, {context: 'datepicker'}) : Drupal.t('From', {}, {context: 'datepicker'});
        if (dateRange) {
          if (dateRange === 'from') {
            var toDate = inst.input.parents('form').find('input[data-date-range=to]').tui_datepicker("getDate");
            if (toDate) {
              $('.ui-datepicker-buttonpane-footer').removeClass('hide');
              var oneDay = 24 * 60 * 60 * 1000;
              var diffDays = Math.abs((toDate.getTime() - dateElement.getTime()) / oneDay);
              if (diffDays > 40) {
                inst.input.parents('form').find('input[data-date-range=to]').tui_datepicker("setDate", dateElement);
                toDate = '';
              }
            } else {
              inst.input.parents('form').find('input[data-date-range=to]').tui_datepicker("setDate", dateElement);
              toDate = '';
            }
            tui_add_customTitle('-to', toDate, Drupal.t('To', {}, {context: 'datepicker'}), inst);
          }
          if (toDate instanceof Date) {
            inst.input.parents('form').find('input[data-date-range=to]').attr('value', tui_padding(toDate.getDate()) + '/' + tui_padding(toDate.getMonth() + 1) + '/' + toDate.getFullYear());
          } else {
            inst.input.parents('form').find('input[data-date-range=to]').attr('value', '');
          }

          tui_add_customTitle('-' + dateRange, dateElement, label, inst);
        } else {
          tui_add_customTitle('', dateElement, label, inst);
          $('.ui-datepicker-buttonpane-footer').removeClass('hide');
        }

        inst.input.attr('value', tui_padding(dateElement.getDate()) + '/' + tui_padding(dateElement.getMonth() + 1) + '/' + dateElement.getFullYear());

        if (typeof isMobile != 'undefined' && ( !((inst.input.attr('data-date-range') === 'to') && isMobile.any))) {
          var showOnFocus = ((inst.input.attr('data-date-range') === 'from') ) ? $.tui_datepicker._get(inst, "showOnFocus") : false;
          if (typeof isMobile != 'undefined' && showOnFocus && isMobile.any) {
            inst.input.parents('form').find('input[data-date-range=to]').tui_datepicker("refresh").focus(0);
          } else {
            this._hideDatepicker();
            this._lastInput = inst.input[0];
            if (typeof(inst.input[0]) !== "object") {
            }
            this._lastInput = null;
          }
        }


      }

    },

    /* Update any alternate field to synchronise with the main field. */
    _updateAlternate: function (inst) {
      var altFormat, date, dateStr,
        altField = this._get(inst, "altField");
      if (altField === 'Default') {
        var name = inst.input.attr('name') + '_hidden';
        altField = 'input[name=' + name + ']';

      }

      if (altField) { // update alternate field too
        altFormat = this._get(inst, "altFormat") || this._get(inst, "dateFormat");
        date = this._getDate(inst);
        dateStr = this.formatDate(altFormat, date, this._getFormatConfig(inst));
        $(altField).each(function () {
          $(this).val(dateStr);
        });
      }
    },

    /* Set as beforeShowDay function to prevent selection of weekends.
     * @param  date  Date - the date to customise
     * @return [boolean, string] - is this date selectable?, what is its CSS class?
     */
    noWeekends: function (date) {
      var day = date.getDay();
      return [(day > 0 && day < 6), ""];
    },

    /* Set as beforeShowDay function to prevent selection of dates not in arrivals.
     * @param  date  Date - the date to customise
     * @return [boolean, string] - is this date selectable?, what is its CSS class?
     */
    showArrivals: function (date) {
      return tui_datepicker_disable_dates(date, arrivals, $(this));
    },

    /* Set as beforeShowDay function to prevent selection of dates not in departures.
     * @param  date  Date - the date to customise
     * @return [boolean, string] - is this date selectable?, what is its CSS class?
     */
    showDepartures: function (date) {
      return tui_datepicker_disable_dates(date, departures, $(this));
    },


    /**
     * Set the mindate of a range element
     * @param selectedDate
     * @param inst
     */
    changeminDate: function (selectedDate, inst) {
      tui_datepicker_changeminDate(selectedDate, inst);
    },

    /* Set as calculateWeek to determine the week of the year based on the ISO 8601 definition.
     * @param  date  Date - the date to get the week for
     * @return  number - the number of the week within the year that contains this date
     */
    iso8601Week: function (date) {
      var time,
        checkDate = new Date(date.getTime());

      // Find Thursday of this week starting on Monday
      checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));

      time = checkDate.getTime();
      checkDate.setMonth(0); // Compare with Jan 1
      checkDate.setDate(1);
      return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
    },

    /* Parse a string value into a date object.
     * See formatDate below for the possible formats.
     *
     * @param  format string - the expected format of the date
     * @param  value string - the date in the above format
     * @param  settings Object - attributes include:
     *					shortYearCutoff  number - the cutoff year for determining the century (optional)
     *					dayNamesShort	string[7] - abbreviated names of the days from Sunday (optional)
     *					dayNames		string[7] - names of the days from Sunday (optional)
     *					monthNamesShort string[12] - abbreviated names of the months (optional)
     *					monthNames		string[12] - names of the months (optional)
     * @return  Date - the extracted date value or null if value is blank
     */
    parseDate: function (format, value, settings) {
      if (format == null || value == null) {
        throw "Invalid arguments";
      }

      value = (typeof value === "object" ? value.toString() : value + "");
      if (value === "") {
        return null;
      }

      var iFormat, dim, extra,
        iValue = 0,
        shortYearCutoffTemp = (settings ? settings.shortYearCutoff : null) || this._defaults.shortYearCutoff,
        shortYearCutoff = (typeof shortYearCutoffTemp !== "string" ? shortYearCutoffTemp :
        new Date().getFullYear() % 100 + parseInt(shortYearCutoffTemp, 10)),
        dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
        dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
        monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
        monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
        year = -1,
        month = -1,
        day = -1,
        doy = -1,
        literal = false,
        date,
      // Check whether a format character is doubled
        lookAhead = function (match) {
          var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
          if (matches) {
            iFormat++;
          }
          return matches;
        },
      // Extract a number from the string value
        getNumber = function (match) {
          var isDoubled = lookAhead(match),
            size = (match === "@" ? 14 : (match === "!" ? 20 :
              (match === "y" && isDoubled ? 4 : (match === "o" ? 3 : 2)))),
            minSize = (match === "y" ? size : 1),
            digits = new RegExp("^\\d{" + minSize + "," + size + "}"),
            num = value.substring(iValue).match(digits);
          if (!num) {
            throw "Missing number at position " + iValue;
          }
          iValue += num[0].length;
          return parseInt(num[0], 10);
        },
      // Extract a name from the string value and convert to an index
        getName = function (match, shortNames, longNames) {
          var index = -1,
            names = $.map(lookAhead(match) ? longNames : shortNames, function (v, k) {
              return [[k, v]];
            }).sort(function (a, b) {
              return -(a[1].length - b[1].length);
            });

          $.each(names, function (i, pair) {
            var name = pair[1];
            if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
              index = pair[0];
              iValue += name.length;
              return false;
            }
          });
          if (index !== -1) {
            return index + 1;
          } else {
            throw "Unknown name at position " + iValue;
          }
        },
      // Confirm that a literal character matches the string value
        checkLiteral = function () {
          if (value.charAt(iValue) !== format.charAt(iFormat)) {
            throw "Unexpected literal at position " + iValue;
          }
          iValue++;
        };

      for (iFormat = 0; iFormat < format.length; iFormat++) {
        if (literal) {
          if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
            literal = false;
          } else {
            checkLiteral();
          }
        } else {
          switch (format.charAt(iFormat)) {
            case "d":
              day = getNumber("d");
              break;
            case "D":
              getName("D", dayNamesShort, dayNames);
              break;
            case "o":
              doy = getNumber("o");
              break;
            case "m":
              month = getNumber("m");
              break;
            case "M":
              month = getName("M", monthNamesShort, monthNames);
              break;
            case "y":
              year = getNumber("y");
              break;
            case "@":
              date = new Date(getNumber("@"));
              year = date.getFullYear();
              month = date.getMonth() + 1;
              day = date.getDate();
              break;
            case "!":
              date = new Date((getNumber("!") - this._ticksTo1970) / 10000);
              year = date.getFullYear();
              month = date.getMonth() + 1;
              day = date.getDate();
              break;
            case "'":
              if (lookAhead("'")) {
                checkLiteral();
              } else {
                literal = true;
              }
              break;
            default:
              checkLiteral();
          }
        }
      }

      if (iValue < value.length) {
        extra = value.substr(iValue);
        if (!/^\s+/.test(extra)) {
          throw "Extra/unparsed characters found in date: " + extra;
        }
      }

      if (year === -1) {
        year = new Date().getFullYear();
      } else if (year < 100) {
        year += new Date().getFullYear() - new Date().getFullYear() % 100 +
        (year <= shortYearCutoff ? 0 : -100);
      }

      if (doy > -1) {
        month = 1;
        day = doy;
        do {
          dim = this._getDaysInMonth(year, month - 1);
          if (day <= dim) {
            break;
          }
          month++;
          day -= dim;
        } while (true);
      }

      date = this._daylightSavingAdjust(new Date(year, month - 1, day));
      if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
        throw "Invalid date"; // E.g. 31/02/00
      }
      return date;
    },

    /* Standard date formats. */
    ATOM: "yy-mm-dd", // RFC 3339 (ISO 8601)
    COOKIE: "D, dd M yy",
    ISO_8601: "yy-mm-dd",
    RFC_822: "D, d M y",
    RFC_850: "DD, dd-M-y",
    RFC_1036: "D, d M y",
    RFC_1123: "D, d M yy",
    RFC_2822: "D, d M yy",
    RSS: "D, d M y", // RFC 822
    TICKS: "!",
    TIMESTAMP: "@",
    W3C: "yy-mm-dd", // ISO 8601

    _ticksTo1970: (((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) +
    Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000),

    /* Format a date object into a string value.
     * The format can be combinations of the following:
     * d  - day of month (no leading zero)
     * dd - day of month (two digit)
     * o  - day of year (no leading zeros)
     * oo - day of year (three digit)
     * D  - day name short
     * DD - day name long
     * m  - month of year (no leading zero)
     * mm - month of year (two digit)
     * M  - month name short
     * MM - month name long
     * y  - year (two digit)
     * yy - year (four digit)
     * @ - Unix timestamp (ms since 01/01/1970)
     * ! - Windows ticks (100ns since 01/01/0001)
     * "..." - literal text
     * '' - single quote
     *
     * @param  format string - the desired format of the date
     * @param  date Date - the date value to format
     * @param  settings Object - attributes include:
     *					dayNamesShort	string[7] - abbreviated names of the days from Sunday (optional)
     *					dayNames		string[7] - names of the days from Sunday (optional)
     *					monthNamesShort string[12] - abbreviated names of the months (optional)
     *					monthNames		string[12] - names of the months (optional)
     * @return  string - the date in the above format
     */
    formatDate: function (format, date, settings) {
      if (!date) {
        return "";
      }

      var iFormat,
        dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort,
        dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames,
        monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort,
        monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames,
      // Check whether a format character is doubled
        lookAhead = function (match) {
          var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
          if (matches) {
            iFormat++;
          }
          return matches;
        },
      // Format a number, with leading zero if necessary
        formatNumber = function (match, value, len) {
          var num = "" + value;
          if (lookAhead(match)) {
            while (num.length < len) {
              num = "0" + num;
            }
          }
          return num;
        },
      // Format a name, short or long as requested
        formatName = function (match, value, shortNames, longNames) {
          return (lookAhead(match) ? longNames[value] : shortNames[value]);
        },
        output = "",
        literal = false;

      if (date) {
        for (iFormat = 0; iFormat < format.length; iFormat++) {
          if (literal) {
            if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
              literal = false;
            } else {
              output += format.charAt(iFormat);
            }
          } else {
            switch (format.charAt(iFormat)) {
              case "d":
                output += formatNumber("d", date.getDate(), 2);
                break;
              case "D":
                output += formatName("D", date.getDay(), dayNamesShort, dayNames);
                break;
              case "o":
                output += formatNumber("o",
                  Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
                break;
              case "m":
                output += formatNumber("m", date.getMonth() + 1, 2);
                break;
              case "M":
                output += formatName("M", date.getMonth(), monthNamesShort, monthNames);
                break;
              case "y":
                output += (lookAhead("y") ? date.getFullYear() :
                (date.getYear() % 100 < 10 ? "0" : "") + date.getYear() % 100);
                break;
              case "@":
                output += date.getTime();
                break;
              case "!":
                output += date.getTime() * 10000 + this._ticksTo1970;
                break;
              case "'":
                if (lookAhead("'")) {
                  output += "'";
                } else {
                  literal = true;
                }
                break;
              default:
                output += format.charAt(iFormat);
            }
          }
        }
      }
      return output;
    },

    /* Extract all possible characters from the date format. */
    _possibleChars: function (format) {
      var iFormat,
        chars = "",
        literal = false,
      // Check whether a format character is doubled
        lookAhead = function (match) {
          var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) === match);
          if (matches) {
            iFormat++;
          }
          return matches;
        };

      for (iFormat = 0; iFormat < format.length; iFormat++) {
        if (literal) {
          if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
            literal = false;
          } else {
            chars += format.charAt(iFormat);
          }
        } else {
          switch (format.charAt(iFormat)) {
            case "d":
            case "m":
            case "y":
            case "@":
              chars += "0123456789";
              break;
            case "D":
            case "M":
              return null; // Accept anything
            case "'":
              if (lookAhead("'")) {
                chars += "'";
              } else {
                literal = true;
              }
              break;
            default:
              chars += format.charAt(iFormat);
          }
        }
      }
      return chars;
    },

    /* Get a setting value, defaulting if necessary. */
    _get: function (inst, name) {
      if (inst.input.attr(name)) {
        return inst.input.attr(name) !== undefined ?
          inst.input.attr(name) : this._defaults[name];
      } else {
        return inst.settings[name] !== undefined ?
          inst.settings[name] : this._defaults[name];
      }
    },

    /* Parse existing date and initialise date picker. */
    _setDateFromField: function (inst, noDefault) {
      if (inst.input.val() === inst.lastVal) {
        return;
      }

      var dateFormat = this._get(inst, "dateFormat"),
        dates = inst.lastVal = inst.input ? inst.input.val() : null,
        defaultDate = this._getDefaultDate(inst),
        date = defaultDate,
        settings = this._getFormatConfig(inst);

      try {
        date = this.parseDate(dateFormat, dates, settings) || defaultDate;
      } catch (event) {
        dates = (noDefault ? "" : dates);
      }
      inst.selectedDay = date.getDate();
      inst.drawMonth = inst.selectedMonth = date.getMonth();
      inst.drawYear = inst.selectedYear = date.getFullYear();
      inst.currentDay = (dates ? date.getDate() : 0);
      inst.currentMonth = (dates ? date.getMonth() : 0);
      inst.currentYear = (dates ? date.getFullYear() : 0);
      this._adjustInstDate(inst);
    },

    /* Retrieve the default date shown on opening. */
    _getDefaultDate: function (inst) {
      return this._restrictMinMax(inst,
        this._determineDate(inst, this._get(inst, "defaultDate"), new Date()));
    },

    /* A date may be specified as an exact value or a relative one. */
    _determineDate: function (inst, date, defaultDate) {
      var offsetNumeric = function (offset) {
          var date = new Date();
          date.setDate(date.getDate() + offset);
          return date;
        },
        offsetString = function (offset) {
          try {
            return $.tui_datepicker.parseDate($.tui_datepicker._get(inst, "dateFormat"),
              offset, $.tui_datepicker._getFormatConfig(inst));
          }
          catch (e) {
            // Ignore
          }

          var date = (offset.toLowerCase().match(/^c/) ?
                $.tui_datepicker._getDate(inst) : null) || new Date(),
            year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate(),
            pattern = /([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
            matches = pattern.exec(offset);

          while (matches) {
            switch (matches[2] || "d") {
              case "d" :
              case "D" :
                day += parseInt(matches[1], 10);
                break;
              case "w" :
              case "W" :
                day += parseInt(matches[1], 10) * 7;
                break;
              case "m" :
              case "M" :
                month += parseInt(matches[1], 10);
                day = Math.min(day, $.tui_datepicker._getDaysInMonth(year, month));
                break;
              case "y":
              case "Y" :
                year += parseInt(matches[1], 10);
                day = Math.min(day, $.tui_datepicker._getDaysInMonth(year, month));
                break;
            }
            matches = pattern.exec(offset);
          }
          return new Date(year, month, day);
        },
        newDate = (date == null || date === "" ? defaultDate : (typeof date === "string" ? offsetString(date) :
          (typeof date === "number" ? (isNaN(date) ? defaultDate : offsetNumeric(date)) : new Date(date.getTime()))));

      newDate = (newDate && newDate.toString() === "Invalid Date" ? defaultDate : newDate);
      if (newDate) {
        newDate.setHours(0);
        newDate.setMinutes(0);
        newDate.setSeconds(0);
        newDate.setMilliseconds(0);
      }
      return this._daylightSavingAdjust(newDate);
    },

    /* Handle switch to/from daylight saving.
     * Hours may be non-zero on daylight saving cut-over:
     * > 12 when midnight changeover, but then cannot generate
     * midnight datetime, so jump to 1AM, otherwise reset.
     * @param  date  (Date) the date to check
     * @return  (Date) the corrected date
     */
    _daylightSavingAdjust: function (date) {
      if (!date) {
        return null;
      }
      date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
      return date;
    },

    /* Set the date(s) directly. */
    _setDate: function (inst, date, noChange) {
      var clear = !date,
        origMonth = inst.selectedMonth,
        origYear = inst.selectedYear,
        newDate = this._restrictMinMax(inst, this._determineDate(inst, date, new Date()));

      inst.selectedDay = inst.currentDay = newDate.getDate();
      inst.drawMonth = inst.selectedMonth = inst.currentMonth = newDate.getMonth();
      inst.drawYear = inst.selectedYear = inst.currentYear = newDate.getFullYear();
      if ((origMonth !== inst.selectedMonth || origYear !== inst.selectedYear) && !noChange) {
        this._notifyChange(inst);
      }
      this._adjustInstDate(inst);
      if (inst.input) {
        inst.input.val(clear ? "" : this._formatDate(inst));
      }
    },

    /* Retrieve the date(s) directly. */
    _getDate: function (inst) {
      return (!inst.currentYear || (inst.input && inst.input.val() === "") ? null :
        this._daylightSavingAdjust(new Date(
          inst.currentYear, inst.currentMonth, inst.currentDay)));
    },

    /* Attach the onxxx handlers.  These are declared statically so
     * they work with static code transformers like Caja.
     */
    _attachHandlers: function (inst) {
      var stepMonths = this._get(inst, "stepMonths"),
        id = "#" + inst.id.replace(/\\\\/g, "\\");
      inst.dpDiv.find("[data-handler]").map(function () {
        var handler = {
          prev: function () {
            $.tui_datepicker._adjustDate(id, -stepMonths, "M");
          },
          next: function () {
            $.tui_datepicker._adjustDate(id, +stepMonths, "M");
          },
          hide: function () {
            $.tui_datepicker._hideDatepicker();
          },
          today: function () {
            $.tui_datepicker._gotoToday(id);
          },
          selectDay: function () {
            $.tui_datepicker._selectDay(id, +this.getAttribute("data-month"), + this.getAttribute("data-year"), this);
            return false;
          },
          selectMonth: function () {
            $.tui_datepicker._selectMonthYear(id, this, "M");
            return false;
          },
          selectMonthandYear: function () {
            $.tui_datepicker._selectMonthandYear(id, this, "M");
            return false;
          },
          selectYear: function () {
            $.tui_datepicker._selectMonthYear(id, this, "Y");
            return false;
          }
        };
        $(this).bind(this.getAttribute("data-event"), handler[this.getAttribute("data-handler")]);
      });
    },

    /* Generate the HTML for the current state of the date picker. */
    _generateHTML: function (inst) {

      var maxDraw, prevText, prev, nextText, next, currentText, gotoDate,
        controls, buttonPanel, firstDay, showWeek, dayNames, dayNamesMin,
        monthNames, monthNamesShort, beforeShowDay, showOtherMonths,
        selectOtherMonths, defaultDate, html, dow, row, group, col, selectedDate,
        cornerClass, calender, thead, day, daysInMonth, leadDays, curRows, numRows,
        printDate, dRow, tbody, daySettings, otherMonth, unselectable,
        currentTitle,selectcontrolsTop,controlsTop,
        tempDate = new Date(),
        today = this._daylightSavingAdjust(
          new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate())), // clear time
        showButtonPanel = this._get(inst, "showButtonPanel"),
        showButtonPanelOnTop = this._get(inst, "showButtonPanelOnTop"),
        hideIfNoPrevNext = this._get(inst, "hideIfNoPrevNext"),
        navigationAsDateFormat = this._get(inst, "navigationAsDateFormat"),
        numMonths = this._getNumberOfMonths(inst),
        showCurrentAtPos = this._get(inst, "showCurrentAtPos"),
        stepMonths = this._get(inst, "stepMonths"),
        isMultiMonth = (numMonths[0] !== 1 || numMonths[1] !== 1),
        currentDate = this._daylightSavingAdjust((!inst.currentDay ? new Date(9999, 9, 9) :
          new Date(inst.currentYear, inst.currentMonth, inst.currentDay))),
        minDate = this._getMinMaxDate(inst, "min"),
        maxDate = this._getMinMaxDate(inst, "max"),
        drawYear = inst.drawYear,
        rangeSelect = this._get(inst, "rangeSelect"),
        dateRange = inst.input.attr('data-date-range'),
        check_first_date = inst.input.parents('form').find('input[data-date-range=from]').tui_datepicker("getDate"),
        check_second_date = inst.input.parents('form').find('input[data-date-range=to]').tui_datepicker("getDate"),
        drawMonth = inst.drawMonth - showCurrentAtPos;
       if (typeof isMobile != 'undefined' && (!isMobile.any && dateRange === 'to' && check_second_date instanceof Date && (drawMonth == check_second_date.getMonth()) && check_first_date instanceof Date && (check_first_date.getMonth() < check_second_date.getMonth()))) {
        drawMonth--;
      }
      if (drawMonth < 0) {
        drawMonth += 12;
        drawYear--;
      }

      /*if (maxDate) {
        maxDraw = this._daylightSavingAdjust(new Date(maxDate.getFullYear(),
          maxDate.getMonth() - (numMonths[0] * numMonths[1]) + 1, maxDate.getDate()));
        maxDraw = (minDate && maxDraw < minDate ? minDate : maxDraw);
        while (this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1)) > maxDraw) {
          drawMonth--;
          if (drawMonth < 0) {
            drawMonth = 11;
            drawYear--;
          }
        }
      }*/

      inst.drawMonth = drawMonth;
      inst.drawYear = drawYear;


      prevText = this._get(inst, "prevText");
      prevText = (!navigationAsDateFormat ? prevText : this.formatDate(prevText,
        this._daylightSavingAdjust(new Date(drawYear, drawMonth - stepMonths, 1)),
        this._getFormatConfig(inst)));
      prev = (this._canAdjustMonth(inst, -1, drawYear, drawMonth) ?
      "<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click'" +
      " title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + "w" + "'>" + prevText + "</span></a>" :
        (hideIfNoPrevNext ? "" : "<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='" + prevText + "'><span class='ui-icon ui-icon-circle-triangle-" + "w" + "'>" + prevText + "</span></a>"));

      nextText = this._get(inst, "nextText");
      nextText = (!navigationAsDateFormat ? nextText : this.formatDate(nextText,
        this._daylightSavingAdjust(new Date(drawYear, drawMonth + stepMonths, 1)),
        this._getFormatConfig(inst)));

      next = (this._canAdjustMonth(inst, +1, drawYear, drawMonth) ?
      "<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click'" +
      " title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + "e" + "'>" + nextText + "</span></a>" :
        (hideIfNoPrevNext ? "" : "<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='" + nextText + "'><span class='ui-icon ui-icon-circle-triangle-" + "e" + "'>" + nextText + "</span></a>"));

      currentText = this._get(inst, "currentText");
      gotoDate = (this._get(inst, "gotoCurrent") && inst.currentDay ? currentDate : today);
      if (currentText) {
        currentText = (!navigationAsDateFormat ? currentText :
          this.formatDate(currentText, gotoDate, this._getFormatConfig(inst)));
      }

      showWeek = this._get(inst, "showWeek");
      dayNames = this._get(inst, "dayNames");
      dayNamesMin = this._get(inst, "dayNamesMin");
      monthNames = this._get(inst, "monthNames");
      monthNamesShort = this._get(inst, "monthNamesShort");
      beforeShowDay = this._get(inst, "beforeShowDay");
      showOtherMonths = this._get(inst, "showOtherMonths");
      selectOtherMonths = this._get(inst, "selectOtherMonths");
      selectcontrolsTop = this._get(inst, "selectcontrolsTop");
      defaultDate = this._getDefaultDate(inst);

      var showCustomTitle = _tui_datepicker_showCustomTitle(dateRange, check_first_date, check_second_date);


      currentTitle = ( this._get(inst, "currentTitle") ) ? '' + showCustomTitle : '';

      controls = (!inst.inline ? "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all glyphicon glyphicon-tui-arrow-left' data-handler='hide' data-event='click'>" +
      this._get(inst, "closeText") + "</button>" : "");

      if (selectcontrolsTop) {
        controlsTop = (!inst.inline ? "<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all glyphicon glyphicon-tui-arrow-left' data-handler='hide' data-event='click'>" +
        selectcontrolsTop + "</button>" : "");
      }
      buttonPanel = "<div class='ui-datepicker-buttonpane ui-widget-content ui-datepicker-buttonpane-header'>" + controlsTop + currentTitle + "</div>";
      buttonPanel += "<div class='ui-datepicker-close close pad-base' aria-label='Close' data-handler='hide' data-event='click'><span class='glyphicon glyphicon-remove'></span></div>";
      firstDay = parseInt(this._get(inst, "firstDay"), 10);
      firstDay = (isNaN(firstDay) ? 0 : firstDay);


      html = "";
      html += (showButtonPanelOnTop) ? buttonPanel + "<div class='ui-datepicker-row-break'></div>" : "";
      html += '<div class="ui-datepicker-group-body"><div class="ui-datepicker-group-scroll-pane">';
      for (row = 0; row < numMonths[0]; row++) {
        group = "";
        this.maxRows = 4;
        for (col = 0; col < numMonths[1]; col++) {
          selectedDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, inst.selectedDay));
          cornerClass = " ui-corner-all";
          calender = "";
          if (isMultiMonth) {
            calender += "<div class='ui-datepicker-group";
            if (numMonths[1] > 1) {
              switch (col) {
                case 0:
                  calender += " ui-datepicker-group-first";
                  cornerClass = " ui-corner-" + "left";
                  break;
                case numMonths[1] - 1:
                  calender += " ui-datepicker-group-last";
                  cornerClass = " ui-corner-" + "right";
                  break;
                default:
                  calender += " ui-datepicker-group-middle";
                  cornerClass = "";
                  break;
              }
            }
            calender += "'>";
          }

          if (typeof breakpoint != 'undefined' && (breakpoint === "screen-sm" || breakpoint === "screen-xs")) {
            calender += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + cornerClass + "'>" +
            prev +
            next +
            this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
              row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
            "</div><table class='ui-datepicker-calendar'><thead>" +
            "<tr>";
          } else {
            calender += "<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix" + cornerClass + "'>" +
            (/all|left/.test(cornerClass) && row === 0 ? prev : "") +
            (/all|right/.test(cornerClass) && row === 0 ? next : "") +
            this._generateMonthYearHeader(inst, drawMonth, drawYear, minDate, maxDate,
              row > 0 || col > 0, monthNames, monthNamesShort) + // draw month headers
            "</div><table class='ui-datepicker-calendar'><thead>" +
            "<tr>";
          }

          thead = (showWeek ? "<th class='ui-datepicker-week-col'>" + this._get(inst, "weekHeader") + "</th>" : "");
          for (dow = 0; dow < 7; dow++) { // days of the week
            day = (dow + firstDay) % 7;
            thead += "<th scope='col'" + ((dow + firstDay + 6) % 7 >= 5 ? " class='ui-datepicker-week-end'" : "") + ">" +
            "<span title='" + dayNames[day] + "'>" + dayNamesMin[day] + "</span></th>";
          }
          calender += thead + "</tr></thead><tbody>";
          daysInMonth = this._getDaysInMonth(drawYear, drawMonth);
          if (drawYear === inst.selectedYear && drawMonth === inst.selectedMonth) {
            inst.selectedDay = Math.min(inst.selectedDay, daysInMonth);
          }
          leadDays = (this._getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
          curRows = Math.ceil((leadDays + daysInMonth) / 7); // calculate the number of rows to generate
          numRows = (isMultiMonth ? this.maxRows > curRows ? this.maxRows : curRows : curRows); //If multiple months, use the higher number of rows (see #7043)
          this.maxRows = numRows;
          printDate = this._daylightSavingAdjust(new Date(drawYear, drawMonth, 1 - leadDays));
          numRows = ( typeof breakpoint != 'undefined' && ( breakpoint === 'screen-sm' || breakpoint === 'screen-xs' || numMonths == 1 )) ? numRows : 6;
          for (dRow = 0; dRow < numRows; dRow++) { // create date picker rows
            calender += "<tr>";
            tbody = (!showWeek ? "" : "<td class='ui-datepicker-week-col'>" +
            this._get(inst, "calculateWeek")(printDate) + "</td>");
            for (dow = 0; dow < 7; dow++) { // create date picker days
              daySettings = (beforeShowDay ?
                beforeShowDay.apply((inst.input ? inst.input[0] : null), [printDate]) : [true, ""]);
              daySettings[0] = (daySettings[0]) ? daySettings[0] : '';
              daySettings[1] = (daySettings[1]) ? daySettings[1] : '';
              daySettings[2] = (daySettings[2]) ? daySettings[2] : '';
              otherMonth = (printDate.getMonth() !== drawMonth);
              unselectable = (otherMonth && !selectOtherMonths) || !daySettings[0] ||
              (minDate && printDate < minDate) || (maxDate && printDate > maxDate);
              tbody += "<td class='" +
              ((dow + firstDay + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + // highlight weekends
              (otherMonth ? " ui-datepicker-other-month" : "") + // highlight days from other months
              ((printDate.getTime() === selectedDate.getTime() && drawMonth === inst.selectedMonth && inst._keyEvent) || // user pressed key
              (defaultDate.getTime() === printDate.getTime() && defaultDate.getTime() === selectedDate.getTime()) ?
                // or defaultDate is current printedDate and defaultDate is selectedDate
              " " + this._dayOverClass : "") + // highlight selected day
              (unselectable ? " " + this._unselectableClass + " ui-state-disabled" : "") +  // highlight unselectable days
              (otherMonth && !showOtherMonths ? "" : " " + daySettings[1] + // highlight custom dates
              (printDate.getTime() === currentDate.getTime() ? " " + this._currentClass : "") + // highlight selected day
              (printDate.getTime() === today.getTime() ? " ui-datepicker-today" : "")) + "'" + // highlight today (if different)
              ((!otherMonth || showOtherMonths) && daySettings[2] ? " title='" + daySettings[2].replace(/'/g, "&#39;") + "'" : "") + // cell title
              (unselectable ? "" : "data-handler='selectDay' data-event='click' " ) + "  data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'" + ">" + // actions
              (otherMonth && !showOtherMonths ? "<span class=\"ui-state-default ui-state-other-month\">" + printDate.getDate() + "</span>" : // display for other months
                (unselectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" : "<a class='ui-state-default" +
                (printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") +
                (printDate.getTime() === currentDate.getTime() ? " ui-state-active" : "") + // highlight selected day
                (otherMonth ? " ui-priority-secondary" : "") + // distinguish dates from other months
                "' href='#'>" + printDate.getDate() + "</a>")) + "</td>"; // display selectable date
              printDate.setDate(printDate.getDate() + 1);
              printDate = this._daylightSavingAdjust(printDate);
            }
            calender += tbody + "</tr>";
          }
          drawMonth++;
          if (drawMonth > 11) {
            drawMonth = 0;
            drawYear++;
          }
          calender += "</tbody></table>" + (isMultiMonth ? "</div>" +
          ((numMonths[0] > 0 && col === numMonths[1] - 1) ? "<div class='ui-datepicker-row-break'></div>" : "") : "");
          group += calender;
        }
        html += group;
      }
      html += '</div></div>';
      html += "<div class='ui-datepicker-buttonpane ui-widget-content ui-datepicker-buttonpane-footer hide'>" + controls + "</div>";
      html += (!showButtonPanelOnTop) ? buttonPanel : "";
      inst._keyEvent = false;
      return html;
    },

    /* Generate the month and year header. */
    _generateMonthYearHeader: function (inst, drawMonth, drawYear, minDate, maxDate,
                                        secondary, monthNames, monthNamesShort) {
      var inMinYear, inMaxYear, month, years, thisYear, determineYear, year, endYear,
        changeMonth = this._get(inst, "changeMonth"),
        changeYear = this._get(inst, "changeYear"),
        changeMonthYear = this._get(inst, 'changeMonthYear'),
        showMonthAfterYear = this._get(inst, "showMonthAfterYear"),
        html = "<div class='ui-datepicker-title'>",
        monthHtml = "";

      // month selection
      if ((secondary || !changeMonth) && !changeMonthYear) {
        monthHtml += "<span class='ui-datepicker-month'>" + monthNames[drawMonth] + "</span>";
      } else if (changeMonthYear && !secondary) {
        var years = this._get(inst, 'yearRange').split(':');
        var thisYear = new Date().getFullYear();
        var determineYear = function (value) {
          var year_value = (value.match(/c[+-].*/) ? drawYear + parseInt(value.substring(1), 10) :
            (value.match(/[+-].*/) ? thisYear + parseInt(value, 10) :
              parseInt(value, 10)));
          return (isNaN(year_value) ? thisYear : year_value);
        };
        year = determineYear(years[0]);
        endYear = Math.max(year, determineYear(years[1] || ''));
        var hideoption = "";
        var setOptiondisabled = "";
        year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
        endYear = ( ( maxDate && !isNaN(maxDate.getFullYear())) ? Math.min(endYear, maxDate.getFullYear()) : endYear);
        monthHtml += '<select class="ui-datepicker-monthyear" data-handler="selectMonthandYear" data-event="change">';
        for (; year <= endYear; year++) {
          inMinYear = (minDate && minDate.getFullYear() == year);
          inMaxYear = (maxDate && maxDate.getFullYear() == year);
          for (var month = 0; month < 12; month++) {
            if ((!inMinYear || month >= minDate.getMonth()) &&
              (!inMaxYear || month <= maxDate.getMonth())) {
              monthHtml += '<option value="' + month + '_' + year + '"' +
              ((month == drawMonth && year == drawYear) ? ' selected="selected"' : '')  +
              '>' + monthNames[month] + ' ' + year + '</option>';
            }
          }
        }
        monthHtml += '</select>';
      } else if (secondary && changeMonthYear) {
        html += '<span class="ui-datepicker-year">' + monthNames[drawMonth] + ' ' + drawYear + '</span>';
      } else {
        inMinYear = (minDate && minDate.getFullYear() === drawYear);
        inMaxYear = (maxDate && maxDate.getFullYear() === drawYear);
        monthHtml += "<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>";
        for (month = 0; month < 12; month++) {
          if ((!inMinYear || month >= minDate.getMonth()) && (!inMaxYear || month <= maxDate.getMonth())) {
            monthHtml += "<option value='" + month + "'" +
            (month === drawMonth ? " selected='selected'" : "") +
            ">" + monthNamesShort[month] + "</option>";
          }
        }
        monthHtml += "</select>";
      }

      if (!showMonthAfterYear) {
        html += monthHtml + (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "");
      }

      // year selection
      if (!inst.yearshtml) {
        inst.yearshtml = "";
        if ((secondary || !changeYear) && !changeMonthYear) {
          html += '<span class="ui-datepicker-year">' + drawYear + '</span>';
        } else if (secondary || !changeYear) {
          html += '';
        } else {
          // determine range of years to display
          years = this._get(inst, "yearRange").split(":");
          thisYear = new Date().getFullYear();
          determineYear = function (value) {
            var year = (value.match(/c[+\-].*/) ? drawYear + parseInt(value.substring(1), 10) :
              (value.match(/[+\-].*/) ? thisYear + parseInt(value, 10) :
                parseInt(value, 10)));
            return (isNaN(year) ? thisYear : year);
          };
          year = determineYear(years[0]);
          endYear = Math.max(year, determineYear(years[1] || ""));
          year = (minDate ? Math.max(year, minDate.getFullYear()) : year);
          endYear = (maxDate ? Math.min(endYear, maxDate.getFullYear()) : endYear);
          inst.yearshtml += "<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";
          for (; year <= endYear; year++) {
            inst.yearshtml += "<option value='" + year + "'" +
            (year === drawYear ? " selected='selected'" : "") +
            ">" + year + "</option>";
          }
          inst.yearshtml += "</select>";

          html += inst.yearshtml;
          inst.yearshtml = null;
        }
      }

      html += this._get(inst, "yearSuffix");
      if (showMonthAfterYear) {
        html += (secondary || !(changeMonth && changeYear) ? "&#xa0;" : "") + monthHtml;
      }
      html += "</div>"; // Close datepicker_header
      return html;
    },

    /* Adjust one of the date sub-fields. */
    _adjustInstDate: function (inst, offset, period) {
      var year = inst.drawYear + (period === "Y" ? offset : 0),
        month = inst.drawMonth + (period === "M" ? offset : 0),
        day = Math.min(inst.selectedDay, this._getDaysInMonth(year, month)) + (period === "D" ? offset : 0),
        date = this._restrictMinMax(inst, this._daylightSavingAdjust(new Date(year, month, day)));
      inst.selectedDay = date.getDate();
      inst.drawMonth = inst.selectedMonth = date.getMonth();
      inst.drawYear = inst.selectedYear = date.getFullYear();
      if (period === "M" || period === "Y") {
        this._notifyChange(inst);
      }
    },

    /* Ensure a date is within any min/max bounds. */
    _restrictMinMax: function (inst, date) {
      var minDate = this._getMinMaxDate(inst, "min"),
        maxDate = this._getMinMaxDate(inst, "max"),
        rangeSelect = this._get(inst, "rangeSelect"),
        newDate = (minDate && date < minDate ? minDate : date);
      if (rangeSelect) {
        return date;
      } else {
        return (maxDate && newDate > maxDate ? maxDate : newDate);
      }
    },

    /* Notify change of month/year. */
    _notifyChange: function (inst) {
      var onChange = this._get(inst, "onChangeMonthYear");
      if (onChange) {
        onChange.apply((inst.input ? inst.input[0] : null),
          [inst.selectedYear, inst.selectedMonth + 1, inst]);
      }
    },

    /* Determine the number of months to show. */
    _getNumberOfMonths: function (inst) {
      var setMobilePosition = $.tui_datepicker._get(inst, "setMobilePosition");
      var numMonths = this._get(inst, "numberOfMonths");
      if (numMonths > 1) {
        if (typeof isMobile != 'undefined' && typeof breakpoint != 'undefined' && (setMobilePosition && isMobile.any && ( breakpoint === 'screen-xs' || breakpoint == 'screen-sm' ))) {
          numMonths = 3;
        } else if (typeof isMobile != 'undefined' && (setMobilePosition && isMobile.any && typeof breakpoint != 'undefined' && ( breakpoint != 'screen-xs' && breakpoint != 'screen-sm' ))) {
          numMonths = 2;
        }
      }
      return (numMonths == null ? [1, 1] : (typeof numMonths === "number" ? [1, numMonths] : numMonths));
    },

    /* Determine the current maximum date - ensure no time components are set. */
    _getMinMaxDate: function (inst, minMax) {
      return this._determineDate(inst, this._get(inst, minMax + "Date"), null);
    },

    /* Find the number of days in a given month. */
    _getDaysInMonth: function (year, month) {
      return 32 - this._daylightSavingAdjust(new Date(year, month, 32)).getDate();
    },

    /* Find the day of the week of the first of a month. */
    _getFirstDayOfMonth: function (year, month) {
      return new Date(year, month, 1).getDay();
    },

    /* Determines if we should allow a "next/prev" month display change. */
    _canAdjustMonth: function (inst, offset, curYear, curMonth) {
      var numMonths = this._getNumberOfMonths(inst),
        date = this._daylightSavingAdjust(new Date(curYear,
          curMonth + (offset < 0 ? offset : numMonths[0] * numMonths[1]), 1));

      if (offset < 0) {
        date.setDate(this._getDaysInMonth(date.getFullYear(), date.getMonth()));
      }
      return this._isInRange(inst, date);
    },

    /* Is the given date in the accepted range? */
    _isInRange: function (inst, date) {
      var yearSplit, currentYear,
        minDate = this._getMinMaxDate(inst, "min"),
        maxDate = this._getMinMaxDate(inst, "max"),
        minYear = null,
        maxYear = null,
        years = this._get(inst, "yearRange");
      if (years) {
        yearSplit = years.split(":");
        currentYear = new Date().getFullYear();
        minYear = parseInt(yearSplit[0], 10);
        maxYear = parseInt(yearSplit[1], 10);
        if (yearSplit[0].match(/[+\-].*/)) {
          minYear += currentYear;
        }
        if (yearSplit[1].match(/[+\-].*/)) {
          maxYear += currentYear;
        }
      }
      if( typeof breakpoint != 'undefined' && ( breakpoint === 'screen-sm' || breakpoint === 'screen-xs')){
        maxDate.setMonth(maxDate.getMonth() + 2);
      }
      return ((!minDate || date.getTime() >= minDate.getTime()) &&
      (!maxDate || date.getTime() <= maxDate.getTime()) &&
      (!minYear || date.getFullYear() >= minYear) &&
      (!maxYear || date.getFullYear() <= maxYear));
    },

    /* Provide the configuration settings for formatting/parsing. */
    _getFormatConfig: function (inst) {
      var shortYearCutoff = this._get(inst, "shortYearCutoff");
      shortYearCutoff = (typeof shortYearCutoff !== "string" ? shortYearCutoff :
      new Date().getFullYear() % 100 + parseInt(shortYearCutoff, 10));
      return {
        shortYearCutoff: shortYearCutoff,
        dayNamesShort: this._get(inst, "dayNamesShort"),
        dayNames: this._get(inst, "dayNames"),
        monthNamesShort: this._get(inst, "monthNamesShort"),
        monthNames: this._get(inst, "monthNames")
      };
    },

    /* Format the given date for display. */
    _formatDate: function (inst, day, month, year) {
      if (!day) {
        inst.currentDay = inst.selectedDay;
        inst.currentMonth = inst.selectedMonth;
        inst.currentYear = inst.selectedYear;
      }
      var date = (day ? (typeof day === "object" ? day :
        this._daylightSavingAdjust(new Date(year, month, day))) :
        this._daylightSavingAdjust(new Date(inst.currentYear, inst.currentMonth, inst.currentDay)));
      return this.formatDate(this._get(inst, "dateFormat"), date, this._getFormatConfig(inst));
    }
  });

  /*
   * Bind hover events for datepicker elements.
   * Done via delegate so the binding only occurs once in the lifetime of the parent div.
   * Global datepicker_instActive, set by _updateDatepicker allows the handlers to find their way back to the active picker.
   */
  function tui_datepicker_bindHover(dpDiv) {
    var selector = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
    return dpDiv.delegate(selector, "mouseout", function () {
      $(this).removeClass("ui-state-hover");
      $(this).closest('tr').prevAll().find('td:not(.ui-state-disabled)').find('a').removeClass('ui-state-hover-range');
      $(this).parent().prevAll('td:not(.ui-state-disabled)').find('a').removeClass('ui-state-hover-range');
      if (this.className.indexOf("ui-datepicker-prev") !== -1) {
        $(this).removeClass("ui-datepicker-prev-hover");
      }
      if (this.className.indexOf("ui-datepicker-next") !== -1) {
        $(this).removeClass("ui-datepicker-next-hover");
      }

    })
      .delegate(selector, "mouseover", tui_datepicker_handleMouseover);
  }

  function tui_datepicker_handleMouseover() {
    if (!$.tui_datepicker._isDisabledDatepicker(tui_datepicker_instActive.inline ? tui_datepicker_instActive.dpDiv.parent()[0] : tui_datepicker_instActive.input[0])) {
      $(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover");
      $(this).addClass("ui-state-hover");

      //$(this).prevUntil(".ui-state-disabled").addClas('.ui-state-hover-range');
      if (this.className.indexOf("ui-datepicker-prev") !== -1) {
        $(this).addClass("ui-datepicker-prev-hover");
      }
      if (this.className.indexOf("ui-datepicker-next") !== -1) {
        $(this).addClass("ui-datepicker-next-hover");
      }
    }
  }

  /* jQuery extend now ignores nulls! */
  function tui_datepicker_extendRemove(target, props) {
    $.extend(target, props);
    for (var name in props) {
      if (props[name] == null) {
        target[name] = props[name];
      }
    }
    return target;
  }

  /* Invoke the datepicker functionality.
   @param  options  string - a command, optionally followed by additional parameters or
   Object - settings for attaching new datepicker functionality
   @return  jQuery object */
  $.fn.tui_datepicker = function (options) {

    /* Verify an empty collection wasn't passed - Fixes #6976 */
    if (!this.length) {
      return this;
    }

    /* Initialise the date picker. */
    if (!$.tui_datepicker.initialized) {
      $(document).on("mousedown touchstart", function (e) {
        $.tui_datepicker._checkExternalClick(e);
      });
      if (typeof isMobile != 'undefined' && !isMobile.any) {
        viewport.scroll(function () {
          $.tui_datepicker._hideDatepicker();
        });
      }
      $.tui_datepicker.initialized = true;
    }

    var otherArgs = Array.prototype.slice.call(arguments, 1);
    /* Append tui_datepicker main container to body if not exist. */
    var mainDiv = $("#" + $.tui_datepicker._mainDivId);
    if (mainDiv.length === 0) {
      var parentDiv = '.ui_datepicker_block';
      if (typeof isMobile != 'undefined' && (parentDiv && $(parentDiv).length && !isMobile.any)) {
        $(parentDiv).append($.tui_datepicker.dpDiv);
      } else {
        $("body").append($.tui_datepicker.dpDiv);
        addSwipeToDatepicker($.tui_datepicker.dpDiv);
      }
    }

    if (typeof options === "string" && (options === "isDisabled" || options === "getDate" || options === "widget")) {
      return $.tui_datepicker["_" + options + "Datepicker"].
        apply($.tui_datepicker, [this[0]].concat(otherArgs));
    }
    if (options === "option" && arguments.length === 2 && typeof arguments[1] === "string") {
      return $.tui_datepicker["_" + options + "Datepicker"].
        apply($.tui_datepicker, [this[0]].concat(otherArgs));
    }

    return this.each(function () {
      typeof options === "string" ?
        $.tui_datepicker["_" + options + "Datepicker"].
          apply($.tui_datepicker, [this].concat(otherArgs)) :
        $.tui_datepicker._attachDatepicker(this, options);
    });


  };

  $.tui_datepicker = new Tui_datepicker(); // singleton instance
  $.tui_datepicker.initialized = false;
  $.tui_datepicker.uuid = new Date().getTime();
  $.tui_datepicker.version = "@VERSION";
  return $.tui_datepicker;

}));

/**
 * calculate range and place result in datepicker
 * @param elem
 * @param checkInstance
 */
function tui_datepicker_calculateRange(elem, checkInstance) {
  var check_first_date, check_second_date;
  if (!checkInstance) {
    var target = elem; // cache lookup
    var openInstance = $.tui_datepicker._curInst.input;
    var target_month = target.parent('td').data('month');
    var target_year = target.parent('td').data('year');
    var val = parseInt(target.text(), 10); // grab the target date
    check_first_date = new Date(target_year, target_month, val); // make into an actual date
    check_second_date = ( openInstance.attr('data-date-range') === 'to' ) ? openInstance.parents('form').find('input[data-date-range=from]').tui_datepicker("getDate") : openInstance.parents('form').find('input[data-date-range=to]').tui_datepicker("getDate");
  } else {
    check_first_date = checkInstance.input.parents('form').find('input[data-date-range=from]').tui_datepicker("getDate");
    check_second_date = checkInstance.input.parents('form').find('input[data-date-range=to]').tui_datepicker("getDate");
  }
  if (check_second_date !== null && check_first_date !== null && $.isEmptyObject(check_second_date)) {
    var diff = Math.abs(Math.floor(( check_first_date - check_second_date ) / 86400000));
    $('.ui-datepicker-amount').html(Drupal.formatPlural(diff, '1 night', '@count nights'));
  }

}

/**
 * Disable dates
 * @param day
 * @param shedule
 * @param currentInst
 * @returns {*}
 */
function tui_datepicker_disable_dates(day, shedule, currentInst) {
  var showEnabled = false;
  if (currentInst) {
    var openInstanceobj = currentInst.attr('data-date-range');
    var date_str = [day.getFullYear(), tui_padding(day.getMonth() + 1), tui_padding(day.getDate())].join('-');
    var from_date = currentInst.parents('form').find('input[data-date-range=from]').tui_datepicker("getDate");
    var to_date = currentInst.parents('form').find('input[data-date-range=to]').tui_datepicker("getDate");
    showEnabled = (shedule === 'all' || $.inArray(date_str, shedule) > -1 );
    if (Drupal.settings.ajaxPageState.theme !== "jetairfly") {
      showEnabled = (showEnabled && !(( openInstanceobj === 'to' && from_date && ( day.getTime() === from_date.getTime() ))));
    }
    var addClass = (showEnabled) ? 'strong' : '';

    if (from_date && ( day.getTime() === from_date.getTime() )) {
      return [showEnabled, 'ui-datepicker-selected-from'];
    } else if (to_date && ( day.getTime() === to_date.getTime() )) {
      return [showEnabled, 'ui-datepicker-selected-to'];
    } else if (( from_date && to_date) && ( from_date.getTime() < day.getTime()) && ( day.getTime() < to_date.getTime())) {
      return [showEnabled, 'ui-datepicker-selected-between ' + addClass];
    } else {
      return [showEnabled, addClass];
    }
  } else {
    return [true];
  }
}

/**
 * set min date & maxdate datepicker
 * @param input
 * @param shedule
 */
function tui_datepicker_setMinMaxDate(input, shedule) {
  var inst = $(input);
  var check_date = inst.tui_datepicker('getDate');
  if (!$.isEmptyObject(shedule) && shedule !== 'all' && check_date) {
    var input_date = check_date.getFullYear() + '-' + tui_padding(check_date.getMonth()) + '-' + check_date.getDate();
    if (input_date && $.inArray(input_date, shedule) < 0) {
      //@TOD0: Add english translation for error
      inst.tui_datepicker("option", "currentTitle", inst.tui_datepicker("option", "subTitle"));
      inst.tui_datepicker('setDate', null);
    }
    else {
      inst.tui_datepicker("option", "currentTitle", inst.tui_datepicker("option", "defaultTitle"));
    }
  }


}

var class_from = ( document.URL.indexOf("jetairfly") > -1) ? '.tui-datepicker-title .tui-datepicker-date-from' : '.tui-datepicker-title .tui-datepicker-date-from , td.ui-datepicker-selected-from';
var class_to = ( document.URL.indexOf("jetairfly") > -1) ? '.tui-datepicker-title .tui-datepicker-date-to' : '.tui-datepicker-title .tui-datepicker-date-to ,td.ui-datepicker-selected-to';

$(class_from).live('click', function (e) {
  e.preventDefault();
  $("input[data-date-range=from]").tui_datepicker('show');
  $("input[data-date-range=to]").tui_datepicker('hide');
});
$(class_to).live('click', function (e) {
  e.preventDefault();
  $("input[data-date-range=to]").tui_datepicker('show');
  $("input[data-date-range=from]").tui_datepicker('hide');
});


/**
 * Add padding to a number if smaler than ten
 * @param number
 * @returns {string}
 */
function tui_padding(number) {
  return (number < 10 ? '0' : '') + number;
}


$(window).resize(function () {
  var hasDatepicker = $('.hasDatepicker');
  if (typeof isMobile != 'undefined' && !isMobile.any) {
    hasDatepicker.tui_datepicker('hide');
    hasDatepicker.blur();
  }
  /**
   * placed next part in comment: Android browser samsung: in jetairfly: when trying to change de date with select datepicker dissapears and reappers.
   */
  /*else {
    hasDatepicker.tui_datepicker('refresh');
  }*/
});


function tui_datepicker_addTooltip(elem, tekstje) {
  if ($.isFunction($.fn.tooltipster)) {
    if (elem.length > 0) {
      elem.tooltipster({
        onlyOne: true,
        maxWidth: 400,
        contentAsHTML: true,
        multiple: true,
        content: $('<span>' + tekstje + '</span>')
      });
      elem.tooltipster('show');
    }
  }
}

function tui_disable_datepicker(from, to, inst) {
  if ($('input[name=' + from + ']').val() === '' || $('input[name=' + to + ']').val() === '') {
    if (typeof isMobile != 'undefined' && typeof breakpoint != 'undefined' && (isMobile.any || (breakpoint == "screen-xs" || breakpoint == "screen-sm"))) {
      alert($.tui_datepicker._get(inst, "subTitle"));
      $('.ui-datepicker').addClass('hide');
    } else {
      $('.ui-datepicker').html('<div class="error-flights text-center">' + $.tui_datepicker._get(inst, "subTitle") + '</div>');
    }
  } else {
    $('.ui-datepicker').removeClass('hide');
  }

}

function addSwipeToDatepicker(elem) {
  elem.touchwipe({
    wipeLeft: function () {
      $('.ui-datepicker-next').trigger('click');
    },
    wipeRight: function () {
      $('.ui-datepicker-prev').trigger('click');
    },
    wipeDown: function () {
      var dateActive=  $('div[class^=tui-datepicker-date].active');
      var scrollpane = $('.ui-datepicker-group-scroll-pane');
      dateActive.addClass('swiping');
      if (!$('.ui-datepicker-next.ui-state-disabled').length) {
        var scrollPangescrolltop = scrollpane.offset().top;
        var groupOuterHeight = $('.ui-datepicker-group').outerHeight();
        scrollToTop = scrollPangescrolltop + groupOuterHeight - $('.ui-datepicker-group-body').offset().top;
        scrollpane.animate(
          {
            top: -scrollToTop
          },
          '500',
          function () {
            dateActive.removeClass('swiping');
            $('.ui-datepicker-next').trigger('click');
          }
        );
      }
    },
    wipeUp: function () {
      var dateActive=  $('div[class^=tui-datepicker-date].active');
      var scrollpane = $('.ui-datepicker-group-scroll-pane');
      dateActive.addClass('swiping');
      if (!$('.ui-datepicker-prev.ui-state-disabled').length) {
        var scrollPangescrolltop = scrollpane.offset().top;
        var groupOuterHeight = $('.ui-datepicker-group').outerHeight();
        scrollToTop = scrollPangescrolltop + groupOuterHeight - $('.ui-datepicker-group-body').offset().top;
        scrollpane.animate(
          {
            top: scrollToTop
          },
          '500', function () {
            dateActive.removeClass('swiping');
            $('.ui-datepicker-prev').trigger('click');
          }
        );
      }
    },
    min_move_x: 50,
    min_move_y: 50,
    preventDefaultEvents: true
  });
}

function tui_datepicker_checkBetweenDates(inst, el, hover_date) {
  var from_date = inst.input.parents('form').find('input[data-date-range=from]').tui_datepicker("getDate");
  from_date = ( from_date ) ? from_date.getTime() : from_date;
  var to_date = inst.input.parents('form').find('input[data-date-range=to]').tui_datepicker("getDate");
  to_date = ( to_date ) ? to_date.getTime() : to_date;
  amountOfDays = Math.abs(Math.floor(( from_date - to_date ) / 86400000));
  $('.ui-datepicker-selected-between').removeClass('ui-datepicker-selected-between');
  var openInstanceobj = inst.input.attr('data-date-range');
  $('.ui-datepicker-selected-' + openInstanceobj).removeClass('ui-datepicker-selected-' + openInstanceobj);
  el.not('.ui-state-disabled').addClass("ui-datepicker-selected-" + openInstanceobj);

  $.each($('.ui-datepicker').find("td"), function (index, elinst) {
    var td_date = new Date($(elinst).attr('data-year'), $(elinst).attr('data-month'), $(elinst).find('.ui-state-default').text());
    td_date = td_date.getTime();
    $(elinst).removeClass('ui-datepicker-selected-between');
    if (hover_date) {
      if (openInstanceobj === 'from') {
        if (from_date && td_date > hover_date && ( ( to_date && td_date > hover_date && td_date < to_date ) || ( from_date && td_date < hover_date ) )) {
          $(elinst).addClass('ui-datepicker-selected-between');
        }
      } else {
        if (( td_date > from_date ) && ( td_date && td_date < hover_date )) {
          //if (td_date > from_date && ( to_date && td_date > hover_date && td_date < to_date ) || ( from_date && td_date < hover_date && td_date > from_date )) {
          $(elinst).addClass('ui-datepicker-selected-between');
        }
      }
    } else {
      if (!hover_date && ( td_date > from_date ) && ( td_date < to_date )) {
        $(elinst).addClass('ui-datepicker-selected-between');
      } else if (td_date == from_date) {
        $(elinst).addClass('ui-datepicker-selected-from');
      } else if (td_date == to_date) {
        $(elinst).addClass('ui-datepicker-selected-to');
      }

    }

  });
}
function _tui_datepicker_showCustomTitle(dateRange, check_first_date, check_second_date) {
  var add_First_date_to_block = '<span class="tui-datepicker-date-choose">' + Drupal.t('From', {}, {context: 'datepicker'}) + ((dateRange == 'from') ? ':<br/>' + Drupal.t('Choose a date') + '</span>' : '');
  var add_Second_date_to_block = '<span class="tui-datepicker-date-choose">' + Drupal.t('To', {}, {context: 'datepicker'}) + ((dateRange == 'to') ? ':<br/>' + Drupal.t('Choose a date') + '</span>' : '');

  add_Second_date_to_block = (check_second_date instanceof Date && (dateRange == 'from') && ( check_second_date !== check_first_date )) ? '<div class="tui-datepicker-date-full"><span class="tui-datepicker-date-weekday">' + Drupal.t(tui_dayNames[check_second_date.getDay()], {}, {context: 'day_name'}) + '<br /></span><span class="tui-datepicker-date-day">' + check_second_date.getDate() + '</span> <span class="tui-datepicker-date-month">' + Drupal.t(tui_monthNames[check_second_date.getMonth()], {}, {context: 'Long month name'}) + '</span> </div>' : add_Second_date_to_block;
  add_First_date_to_block = (check_first_date instanceof Date && (dateRange == 'to') && ( check_first_date !== check_second_date ) ) ? '<div class="tui-datepicker-date-full"><span class="tui-datepicker-date-weekday">' + Drupal.t(tui_dayNames[check_first_date.getDay()], {}, {context: 'day_name'}) + '<br /></span><span class="tui-datepicker-date-day">' + check_first_date.getDate() + '</span> <span class="tui-datepicker-date-month">' + Drupal.t(tui_monthNames[check_first_date.getMonth()], {}, {context: 'Long month name'}) + '</span> </div>' : add_First_date_to_block;

  from_active = (dateRange == 'from') ? " active" : "";
  to_active = (dateRange == 'to') ? " active" : "";

  var showCustomTitle = '<div class="tui-datepicker-title">' + '<div class="tui-datepicker-dates ui-helper-clearfix">';
  if (dateRange) {
    showCustomTitle +=
      '<div class="tui-datepicker-date-from' + from_active + '"><span class="glyphicon glyphicon-tui-calendar"></span>' + ((check_first_date instanceof Date && (dateRange == 'to')) ? Drupal.t('From', {}, {context: 'datepicker'}) + ':<br/>' : '') +
      add_First_date_to_block +
      '</div>' +
      '<div class="tui-datepicker-date-to' + to_active + '"><span class="glyphicon glyphicon-tui-calendar"></span>' + ((check_second_date instanceof Date && (dateRange == 'from') ) ? Drupal.t('To', {}, {context: 'datepicker'}) + ':<br/>' : '') +
      add_Second_date_to_block;
  } else {
    showCustomTitle +=
      '<div class="tui-datepicker-date"><span class="glyphicon glyphicon-tui-calendar"></span>' + ((check_first_date instanceof Date && (dateRange == 'from')) ? Drupal.t('Depart') + ':<br/>' : '') +
      add_First_date_to_block;
  }
  return showCustomTitle + '</div></div></div>';
}


$.expr[':'].textEquals = function (el, i, m) {
  var searchText = m[3];
  var match = $(el).text().trim().match("^" + searchText + "$");
  return match && match.length > 0;
};


$(document).ready(function () {
  add_tui_datepicker();
});
jQuery(document).ajaxComplete(function () {
  add_tui_datepicker();
});

function add_tui_datepicker() {
  if ($.isFunction($.fn.tui_datepicker)) {
    $('.tui-datepicker').tui_datepicker({
      minDate: "-2Y",
      maxDate: "+2Y",
      setMobilePosition: true,
      numberOfMonths: 2,
      dateFormat: "dd/mm/yy"
    });
  }
}

function tui_add_customTitle(dateRange, dateElement, title, inst) {
  if (dateElement instanceof Date) {
    var showCustomTitle_child = '<span class="glyphicon glyphicon-tui-calendar"></span>' + title + '<br /><div class="tui-datepicker-date-full tui-datepicker-full-date' + dateRange + '"><span class="tui-datepicker-date-day">' + tui_padding(dateElement.getDate()) + '</span><span class="tui-datepicker-date-month">/' + tui_padding((dateElement.getMonth() + 1)) + '/' + dateElement.getFullYear() + '</span> </div>';
    var showCustomTitle = '<span class="glyphicon glyphicon-tui-calendar"></span>' + title + '<br /><div class="tui-datepicker-date-full tui-datepicker-full-date' + dateRange + '"><span class="tui-datepicker-date-weekday">' + Drupal.t(tui_dayNames[dateElement.getDay()], {}, {context: 'day_name'}) + '<br></span><span class="tui-datepicker-date-day">' + dateElement.getDate() + '</span> <span class="tui-datepicker-date-month">' + Drupal.t(tui_monthNames[dateElement.getMonth()], {}, {context: 'Long month name'}) + '</span> </div>';
    $('.ui-datepicker .tui-datepicker-date' + dateRange).html(showCustomTitle);
    inst.input.parents('form').find('.custom-datepicker-child' + dateRange).html(showCustomTitle_child);
  } else {
    var chooseDate = (dateRange === 'to') ? Drupal.t('Date to', {}, {context: 'tui_datepicker'}) : ( dateRange === '' ) ? '' : Drupal.t('Date from', {}, {context: 'tui_datepicker'});
    var add_date_to_block = '<div class="tui-datepicker-date-choose">' + chooseDate + '</div>';
    $('.ui-datepicker .tui-datepicker-date' + dateRange).html(add_date_to_block);
    inst.input.parents('form').find('.custom-datepicker-child' + dateRange).html(add_date_to_block);
  }

}

/**
 * tui datepicker: change min date
 * @param selectedDate
 * @param inst
 */
function tui_datepicker_changeminDate(selectedDate, inst) {
  var rangeSelect = $.tui_datepicker._get(inst, "rangeSelect");
  var minDate = $.tui_datepicker.parseDate($.tui_datepicker._get(inst, "dateFormat"), selectedDate);
  var setSelectedDate = $.tui_datepicker.parseDate($.tui_datepicker._get(inst, "dateFormat"), selectedDate);
  minDate.setDate(minDate.getDate());

  var travelDuration = ( Drupal.settings.travelDuration ) ? Drupal.settings.travelDuration : 7;

  if (typeof isMobile != 'undefined' && !isMobile.any) {
    var getNewDate = minDate;
    setSelectedDate.setDate(( amountOfDays > 1 && amountOfDays < 50) ? (getNewDate.getDate() + amountOfDays) : (getNewDate.getDate() + ( travelDuration - 1 )));
  }

  if (departures !== 'all' && departures.length) {
    var getNewMinDate = tui_datepicker_checkValidDate(departures, minDate);
    setSelectedDate = tui_datepicker_checkValidDate(departures, setSelectedDate);
  } else {
    var getNewMinDate = minDate;
  }
  if (rangeSelect) {
    var currentDate = new Date(inst.drawYear, inst.drawMonth);
    inst.input.parents('form').find('input[data-date-range=to]').tui_datepicker("option", "minDate", getNewMinDate);

    inst.input.parents('form').find('input[data-date-range=to]').tui_datepicker("setDate", setSelectedDate);
  }
}

function tui_datepicker_checkValidDate(days, instDate) {
  var bestDiff = null;

  for (i = 0; i < days.length; ++i) {
    var day = new Date(days[i].replace(/(\d{4})-(\d{2})-(\d{2})/, "$2/$3/$1"));
    currDiff = Math.abs(day - instDate);
    if (currDiff < bestDiff || bestDiff == null) {
      bestDate = day;
      bestDiff = currDiff;
    } else if (currDiff == bestDiff && day > instDate) {
      bestDiff = currDiff;
    }
  }

  return bestDate;
}
;
var $ = jQuery;

$(document).ready(function () {

  $(document).on("mousedown touchstart", function (e) {
    var $target = $(e.target);
    if (!$target.parents('#help-block').size()) {
      $("#help-block").toggleClass("minimized", true).toggleClass("maximized", false);
    }
  });
  if (typeof isMobile != 'undefined' && isMobile.any) {
    $('.help-content').appendTo(($('.footer-main-info .container').length ) ? $('.footer-main-info .container') : $('.footer-content'));
  }

  $('.help-label').on('click', function (e) {
    $("#help-block").toggleClass("minimized").toggleClass("maximized");
  });
  $('#help-block').removeClass('hidden');

  if (!$('#help-block').length) {
    $('.view-contact-us').show();
  } else {
    $('footer.footer .footer-content').css('border-top','1px solid #A0C8E6');
    $('footer.footer .footer-content').css('margin','20px 0 25px 0');
  }

  $("#help-block #help-faq a").click(function (e) {
    $('#help-modal .modal-title').text($(this).text());
    $('#help-modal .modal-body').html($(this).attr('href'));
    $('#help-modal').modal('show');
    e.preventDefault();
  });

});
;
/*

 Tooltipster 3.3.0 | 2014-11-08
 A rockin' custom tooltip jQuery plugin

 Developed by Caleb Jacob under the MIT license http://opensource.org/licenses/MIT

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

;
(function ($, window, document) {

  var pluginName = "tooltipster",
    defaults = {
      animation: 'fade',
      arrow: true,
      arrowColor: '',
      autoClose: true,
      content: null,
      contentAsHTML: false,
      contentCloning: true,
      debug: true,
      delay: 200,
      minWidth: 0,
      maxWidth: null,
      functionInit: function (origin, content) {
      },
      functionBefore: function (origin, continueTooltip) {
        continueTooltip();
      },
      functionReady: function (origin, tooltip) {
      },
      functionAfter: function (origin) {
      },
      hideOnClick: false,
      icon: '(?)',
      iconCloning: true,
      iconDesktop: false,
      iconTouch: false,
      iconTheme: 'tooltipster-icon',
      interactive: false,
      interactiveTolerance: 350,
      multiple: false,
      offsetX: 0,
      offsetY: 0,
      onlyOne: false,
      position: 'top',
      positionTracker: false,
      positionTrackerCallback: function (origin) {
        // the default tracker callback will close the tooltip when the trigger is
        // 'hover' (see https://github.com/iamceege/tooltipster/pull/253)
        if (this.option('trigger') == 'hover' && this.option('autoClose')) {
          this.hide();
        }
      },
      restoration: 'current',
      speed: 350,
      timer: 0,
      theme: 'tooltipster-default',
      touchDevices: true,
      trigger: 'hover',
      updateAnimation: true
    };

  function Plugin(element, options) {

    // list of instance variables

    this.bodyOverflowX;
    // stack of custom callbacks provided as parameters to API methods
    this.callbacks = {
      hide: [],
      show: []
    };
    this.checkInterval = null;
    // this will be the user content shown in the tooltip. A capital "C" is used because there is also a method called content()
    this.Content;
    // this is the original element which is being applied the tooltipster plugin
    this.$el = $(element);
    // this will be the element which triggers the appearance of the tooltip on hover/click/custom events.
    // it will be the same as this.$el if icons are not used (see in the options), otherwise it will correspond to the created icon
    this.$elProxy;
    this.elProxyPosition;
    this.enabled = true;
    this.options = $.extend({}, defaults, options);
    this.mouseIsOverProxy = false;
    this.options.trigger = ( this.$el.attr('data-trigger' ) )?this.$el.attr('data-trigger' ):this.options.trigger;

    // a unique namespace per instance, for easy selective unbinding
    this.namespace = 'tooltipster-' + Math.round(Math.random() * 100000);
    // Status (capital S) can be either : appearing, shown, disappearing, hidden
    this.Status = 'hidden';
    this.timerHide = null;
    this.timerShow = null;
    // this will be the tooltip element (jQuery wrapped HTML element)
    this.$tooltip;

    // for backward compatibility
    if( (this.$el.attr('data-icon') ) == ''){
      this.options.iconTheme =false;
      this.options.iconDesktop= false;
      this.options.iconTouch = false;
    }else {
    this.options.iconTheme = this.options.iconTheme.replace('.', '');
    }
    this.options.theme = this.options.theme.replace('.', '');

    // launch

    this._init();
  }

  Plugin.prototype = {

    _init: function () {

      var self = this;

      // disable the plugin on old browsers (including IE7 and lower)
      if (document.querySelector) {

        // note : the content is null (empty) by default and can stay that way if the plugin remains initialized but not fed any content. The tooltip will just not appear.

        // let's save the initial value of the title attribute for later restoration if need be.
        var initialTitle = null;
        // it will already have been saved in case of multiple tooltips
        if (self.$el.data('tooltipster-initialTitle') === undefined) {

          initialTitle = self.$el.attr('title');

          // we do not want initialTitle to have the value "undefined" because of how jQuery's .data() method works
          if (initialTitle === undefined) initialTitle = null;

          self.$el.data('tooltipster-initialTitle', initialTitle);
        }

        // if content is provided in the options, its has precedence over the title attribute.
        // Note : an empty string is considered content, only 'null' represents the absence of content.
        // Also, an existing title="" attribute will result in an empty string content
        if (self.options.content !== null) {
          self._content_set(self.options.content);
        }
        else {
          self._content_set(initialTitle);
        }

        var c = self.options.functionInit.call(self.$el, self.$el, self.Content);
        if (typeof c !== 'undefined') self._content_set(c);

        self.$el
          // strip the title off of the element to prevent the default tooltips from popping up
          .removeAttr('title')
          // to be able to find all instances on the page later (upon window events in particular)
          .addClass('tooltipstered');

        // detect if we're changing the tooltip origin to an icon
        // note about this condition : if the device has touch capability and self.options.iconTouch is false, you'll have no icons event though you may consider your device as a desktop if it also has a mouse. Not sure why someone would have this use case though.
        if ((!deviceHasTouchCapability && self.options.iconDesktop) || (deviceHasTouchCapability && self.options.iconTouch)) {

          // TODO : the tooltip should be automatically be given an absolute position to be near the origin. Otherwise, when the origin is floating or what, it's going to be nowhere near it and disturb the position flow of the page elements. It will imply that the icon also detects when its origin moves, to follow it : not trivial.
          // Until it's done, the icon feature does not really make sense since the user still has most of the work to do by himself

          // if the icon provided is in the form of a string
          if (typeof self.options.icon === 'string') {
            // wrap it in a span with the icon class
            self.$elProxy = $('<span class="' + self.options.iconTheme + '"></span>');
            self.$elProxy.text(self.options.icon);
          }
          // if it is an object (sensible choice)
          else {
            // (deep) clone the object if iconCloning == true, to make sure every instance has its own proxy. We use the icon without wrapping, no need to. We do not give it a class either, as the user will undoubtedly style the object on his own and since our css properties may conflict with his own
            if (self.options.iconCloning) self.$elProxy = self.options.icon.clone(true);
            else self.$elProxy = self.options.icon;
          }

          self.$elProxy.insertAfter(self.$el);
        }
        else {
          self.$elProxy = self.$el;
        }

        // for 'click' and 'hover' triggers : bind on events to open the tooltip. Closing is now handled in _showNow() because of its bindings.
        // Notes about touch events :
        // - mouseenter, mouseleave and clicks happen even on pure touch devices because they are emulated. deviceIsPureTouch() is a simple attempt to detect them.
        // - on hybrid devices, we do not prevent touch gesture from opening tooltips. It would be too complex to differentiate real mouse events from emulated ones.
        // - we check deviceIsPureTouch() at each event rather than prior to binding because the situation may change during browsing
        if (self.options.trigger == 'hover') {

          // these binding are for mouse interaction only
          self.$elProxy
            .on('mouseenter.' + self.namespace, function () {
              if (!deviceIsPureTouch() || self.options.touchDevices) {
                self.mouseIsOverProxy = true;
                self._show();
              }
            })
            .on('mouseleave.' + self.namespace, function () {
              if (!deviceIsPureTouch() || self.options.touchDevices) {
                self.mouseIsOverProxy = false;
              }
            });

          // for touch interaction only
          if (deviceHasTouchCapability && self.options.touchDevices) {

            // for touch devices, we immediately display the tooltip because we cannot rely on mouseleave to handle the delay
            self.$elProxy.on('touchstart.' + self.namespace, function () {
              self._showNow();
            });
          }
        }
        else if (self.options.trigger == 'click') {

          // note : for touch devices, we do not bind on touchstart, we only rely on the emulated clicks (triggered by taps)
          self.$elProxy.on('click.' + self.namespace, function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (!deviceIsPureTouch() || self.options.touchDevices) {
              self._show();
            }
          });
        }
      }
    },

    // this function will schedule the opening of the tooltip after the delay, if there is one
    _show: function () {

      var self = this;

      if (self.Status != 'shown' && self.Status != 'appearing') {

        if (self.options.delay) {
          self.timerShow = setTimeout(function () {

            // for hover trigger, we check if the mouse is still over the proxy, otherwise we do not show anything
            if (self.options.trigger == 'click' || (self.options.trigger == 'hover' && self.mouseIsOverProxy)) {
              self._showNow();
            }
          }, self.options.delay);
        }
        else self._showNow();
      }
    },

    // this function will open the tooltip right away
    _showNow: function (callback) {

      var self = this;

      // call our constructor custom function before continuing
      self.options.functionBefore.call(self.$el, self.$el, function () {

        // continue only if the tooltip is enabled and has any content
        if (self.enabled && self.Content !== null) {

          // save the method callback and cancel hide method callbacks
          if (callback) self.callbacks.show.push(callback);
          self.callbacks.hide = [];

          //get rid of any appearance timer
          clearTimeout(self.timerShow);
          self.timerShow = null;
          clearTimeout(self.timerHide);
          self.timerHide = null;

          // if we only want one tooltip open at a time, close all auto-closing tooltips currently open and not already disappearing
          if (self.options.onlyOne) {
            $('.tooltipstered').not(self.$el).each(function (i, el) {

              var $el = $(el),
                nss = $el.data('tooltipster-ns');

              if( typeof  nss === 'object') {
                // iterate on all tooltips of the element
                $.each(nss, function (i, ns) {
                  var instance = $el.data(ns),
                  // we have to use the public methods here
                    s = instance.status(),
                    ac = instance.option('autoClose');

                  if (s !== 'hidden' && s !== 'disappearing' && ac) {
                    instance.hide();
                  }
                });
              }
            });
          }

          var finish = function () {
            self.Status = 'shown';

            // trigger any show method custom callbacks and reset them
            $.each(self.callbacks.show, function (i, c) {
              c.call(self.$el);
            });
            self.callbacks.show = [];
          };

          // if this origin already has its tooltip open
          if (self.Status !== 'hidden') {

            // the timer (if any) will start (or restart) right now
            var extraTime = 0;

            // if it was disappearing, cancel that
            if (self.Status === 'disappearing') {

              self.Status = 'appearing';

              if (supportsTransitions()) {

                self.$tooltip
                  .clearQueue()
                  .removeClass('tooltipster-dying')
                  .addClass('tooltipster-' + self.options.animation + '-show');

                if (self.options.speed > 0) self.$tooltip.delay(self.options.speed);

                self.$tooltip.queue(finish);
              }
              else {
                // in case the tooltip was currently fading out, bring it back to life
                self.$tooltip
                  .stop()
                  .fadeIn(finish);
              }
            }
            // if the tooltip is already open, we still need to trigger the method custom callback
            else if (self.Status === 'shown') {
              finish();
            }
          }
          // if the tooltip isn't already open, open that sucker up!
          else {

            self.Status = 'appearing';
            self.options.maxWidth = ( self.$el.attr('data-max-width') ) ? self.$el.attr('max-width') : null;
            // the timer (if any) will start when the tooltip has fully appeared after its transition
            var extraTime = self.options.speed;

            // disable horizontal scrollbar to keep overflowing tooltips from jacking with it and then restore it to its previous value
            self.bodyOverflowX = $('body').css('overflow-x');
            $('body').css('overflow-x', 'hidden');

            // get some other settings related to building the tooltip
            var animation = 'tooltipster-' + self.options.animation,
              animationSpeed = '-webkit-transition-duration: ' + self.options.speed + 'ms; -webkit-animation-duration: ' + self.options.speed + 'ms; -moz-transition-duration: ' + self.options.speed + 'ms; -moz-animation-duration: ' + self.options.speed + 'ms; -o-transition-duration: ' + self.options.speed + 'ms; -o-animation-duration: ' + self.options.speed + 'ms; -ms-transition-duration: ' + self.options.speed + 'ms; -ms-animation-duration: ' + self.options.speed + 'ms; transition-duration: ' + self.options.speed + 'ms; animation-duration: ' + self.options.speed + 'ms;',
              minWidth = self.options.minWidth ? 'min-width:' + Math.round(self.options.minWidth) + 'px;' : '',
              maxWidth = self.options.maxWidth ? 'max-width:' + Math.round(self.options.maxWidth) + 'px;' : '',
              pointerEvents = self.options.interactive ? 'pointer-events: auto;' : '';

            // build the base of our tooltip
            self.$tooltip = $('<div class="tooltipster-base ' + self.options.theme + '" style="' + minWidth + ' ' + maxWidth + ' ' + pointerEvents + ' ' + animationSpeed + '"><div class="tooltipster-content"></div></div>');

            // only add the animation class if the user has a browser that supports animations
            if (supportsTransitions()) self.$tooltip.addClass(animation);

            // insert the content
            self._content_insert();

            // attach
            self.$tooltip.appendTo('body');

            // do all the crazy calculations and positioning
            self.reposition();

            // call our custom callback since the content of the tooltip is now part of the DOM
            self.options.functionReady.call(self.$el, self.$el, self.$tooltip);

            // animate in the tooltip
            if (supportsTransitions()) {

              self.$tooltip.addClass(animation + '-show');

              if (self.options.speed > 0) self.$tooltip.delay(self.options.speed);

              self.$tooltip.queue(finish);
            }
            else {
              self.$tooltip.css('display', 'none').fadeIn(self.options.speed, finish);
            }

            // will check if our tooltip origin is removed while the tooltip is shown
            self._interval_set();

            // reposition on scroll (otherwise position:fixed element's tooltips will move away form their origin) and on resize (in case position can/has to be changed)
            $(window).on('scroll.' + self.namespace + ' resize.' + self.namespace, function () {
              self.reposition();
            });

            // auto-close bindings
            if (self.options.autoClose) {

              // in case a listener is already bound for autoclosing (mouse or touch, hover or click), unbind it first
              $('body').off('.' + self.namespace);

              // here we'll have to set different sets of bindings for both touch and mouse
              if (self.options.trigger == 'hover') {

                // if the user touches the body, hide
                if (deviceHasTouchCapability) {
                  // timeout 0 : explanation below in click section
                  setTimeout(function () {
                    // we don't want to bind on click here because the initial touchstart event has not yet triggered its click event, which is thus about to happen
                    $('body').on('touchstart.' + self.namespace, function () {
                      self.hide();
                    });
                  }, 0);
                }

                // if we have to allow interaction
                if (self.options.interactive) {

                  // touch events inside the tooltip must not close it
                  if (deviceHasTouchCapability) {
                    self.$tooltip.on('touchstart.' + self.namespace, function (event) {
                      event.stopPropagation();
                    });
                  }

                  // as for mouse interaction, we get rid of the tooltip only after the mouse has spent some time out of it
                  var tolerance = null;

                  self.$elProxy.add(self.$tooltip)
                    // hide after some time out of the proxy and the tooltip
                    .on('mouseleave.' + self.namespace + '-autoClose', function () {
                      clearTimeout(tolerance);
                      tolerance = setTimeout(function () {
                        self.hide();
                      }, self.options.interactiveTolerance);
                    })
                    // suspend timeout when the mouse is over the proxy or the tooltip
                    .on('mouseenter.' + self.namespace + '-autoClose', function () {
                      clearTimeout(tolerance);
                    });
                }
                // if this is a non-interactive tooltip, get rid of it if the mouse leaves
                else {
                  self.$elProxy.on('mouseleave.' + self.namespace + '-autoClose', function () {
                    self.hide();
                  });
                }

                // close the tooltip when the proxy gets a click (common behavior of native tooltips)
                if (self.options.hideOnClick) {

                  self.$elProxy.on('click.' + self.namespace + '-autoClose', function () {
                    self.hide();
                  });
                }
              }
              // here we'll set the same bindings for both clicks and touch on the body to hide the tooltip
              else if (self.options.trigger == 'click') {

                // use a timeout to prevent immediate closing if the method was called on a click event and if options.delay == 0 (because of bubbling)
                setTimeout(function () {
                  $('body').on('click.' + self.namespace + ' touchstart.' + self.namespace, function () {
                    self.hide();
                  });
                }, 0);

                // if interactive, we'll stop the events that were emitted from inside the tooltip to stop autoClosing
                if (self.options.interactive) {

                  // note : the touch events will just not be used if the plugin is not enabled on touch devices
                  self.$tooltip.on('click.' + self.namespace + ' touchstart.' + self.namespace, function (event) {
                    event.stopPropagation();
                  });
                }
              }
            }
          }

          // if we have a timer set, let the countdown begin
          if (self.options.timer > 0) {

            self.timerHide = setTimeout(function () {
              self.timerHide = null;
              self.hide();
            }, self.options.timer + extraTime);
          }
        }
      });
    },

    _interval_set: function () {

      var self = this;

      self.checkInterval = setInterval(function () {

        // if the tooltip and/or its interval should be stopped
        if (
          // if the origin has been removed
        $('body').find(self.$el).length === 0
          // if the elProxy has been removed
        || $('body').find(self.$elProxy).length === 0
          // if the tooltip has been closed
        || self.Status == 'hidden'
          // if the tooltip has somehow been removed
        || $('body').find(self.$tooltip).length === 0
        ) {
          // remove the tooltip if it's still here
          if (self.Status == 'shown' || self.Status == 'appearing') self.hide();

          // clear this interval as it is no longer necessary
          self._interval_cancel();
        }
        // if everything is alright
        else {
          // compare the former and current positions of the elProxy to reposition the tooltip if need be
          if (self.options.positionTracker) {

            var p = self._repositionInfo(self.$elProxy),
              identical = false;

            // compare size first (a change requires repositioning too)
            if (areEqual(p.dimension, self.elProxyPosition.dimension)) {

              // for elements with a fixed position, we track the top and left properties (relative to window)
              if (self.$elProxy.css('position') === 'fixed') {
                if (areEqual(p.position, self.elProxyPosition.position)) identical = true;
              }
              // otherwise, track total offset (relative to document)
              else {
                if (areEqual(p.offset, self.elProxyPosition.offset)) identical = true;
              }
            }

            if (!identical) {
              self.reposition();
              self.options.positionTrackerCallback.call(self, self.$el);
            }
          }
        }
      }, 200);
    },

    _interval_cancel: function () {
      clearInterval(this.checkInterval);
      // clean delete
      this.checkInterval = null;
    },

    _content_set: function (content) {
      // clone if asked. Cloning the object makes sure that each instance has its own version of the content (in case a same object were provided for several instances)
      // reminder : typeof null === object
      if (typeof content === 'object' && content !== null && this.options.contentCloning) {
        content = content.clone(true);
      }
      this.Content = content;
    },

    _content_insert: function () {

      var self = this,
        $d = this.$tooltip.find('.tooltipster-content');

      if (typeof self.Content === 'string' && !self.options.contentAsHTML) {
        $d.text(self.Content);
      }
      else {
        $d
          .empty()
          .append(self.Content);
      }
    },

    _update: function (content) {

      var self = this;

      // change the content
      self._content_set(content);

      if (self.Content !== null) {

        // update the tooltip if it is open
        if (self.Status !== 'hidden') {

          // reset the content in the tooltip
          self._content_insert();

          // reposition and resize the tooltip
          self.reposition();

          // if we want to play a little animation showing the content changed
          if (self.options.updateAnimation) {

            if (supportsTransitions()) {

              self.$tooltip.css({
                'width': '',
                '-webkit-transition': 'all ' + self.options.speed + 'ms, width 0ms, height 0ms, left 0ms, top 0ms',
                '-moz-transition': 'all ' + self.options.speed + 'ms, width 0ms, height 0ms, left 0ms, top 0ms',
                '-o-transition': 'all ' + self.options.speed + 'ms, width 0ms, height 0ms, left 0ms, top 0ms',
                '-ms-transition': 'all ' + self.options.speed + 'ms, width 0ms, height 0ms, left 0ms, top 0ms',
                'transition': 'all ' + self.options.speed + 'ms, width 0ms, height 0ms, left 0ms, top 0ms'
              }).addClass('tooltipster-content-changing');

              // reset the CSS transitions and finish the change animation
              setTimeout(function () {

                if (self.Status != 'hidden') {

                  self.$tooltip.removeClass('tooltipster-content-changing');

                  // after the changing animation has completed, reset the CSS transitions
                  setTimeout(function () {

                    if (self.Status !== 'hidden') {
                      self.$tooltip.css({
                        '-webkit-transition': self.options.speed + 'ms',
                        '-moz-transition': self.options.speed + 'ms',
                        '-o-transition': self.options.speed + 'ms',
                        '-ms-transition': self.options.speed + 'ms',
                        'transition': self.options.speed + 'ms'
                      });
                    }
                  }, self.options.speed);
                }
              }, self.options.speed);
            }
            else {
              self.$tooltip.fadeTo(self.options.speed, 0.5, function () {
                if (self.Status != 'hidden') {
                  self.$tooltip.fadeTo(self.options.speed, 1);
                }
              });
            }
          }
        }
      }
      else {
        self.hide();
      }
    },

    _repositionInfo: function ($el) {
      return {
        dimension: {
          height: $el.outerHeight(false),
          width: $el.outerWidth(false)
        },
        offset: $el.offset(),
        position: {
          left: parseInt($el.css('left')),
          top: parseInt($el.css('top'))
        }
      };
    },

    hide: function (callback) {

      var self = this;

      // save the method custom callback and cancel any show method custom callbacks
      if (callback) self.callbacks.hide.push(callback);
      self.callbacks.show = [];

      // get rid of any appearance timeout
      clearTimeout(self.timerShow);
      self.timerShow = null;
      clearTimeout(self.timerHide);
      self.timerHide = null;

      var finishCallbacks = function () {
        // trigger any hide method custom callbacks and reset them
        $.each(self.callbacks.hide, function (i, c) {
          c.call(self.$el);
        });
        self.callbacks.hide = [];
      };

      // hide
      if (self.Status == 'shown' || self.Status == 'appearing') {

        self.Status = 'disappearing';

        var finish = function () {

          self.Status = 'hidden';

          // detach our content object first, so the next jQuery's remove() call does not unbind its event handlers
          if (typeof self.Content == 'object' && self.Content !== null) {
            self.Content.detach();
          }

          self.$tooltip.remove();
          self.$tooltip = null;

          // unbind orientationchange, scroll and resize listeners
          $(window).off('.' + self.namespace);

          $('body')
            // unbind any auto-closing click/touch listeners
            .off('.' + self.namespace)
            .css('overflow-x', self.bodyOverflowX);

          // unbind any auto-closing click/touch listeners
          $('body').off('.' + self.namespace);

          // unbind any auto-closing hover listeners
          self.$elProxy.off('.' + self.namespace + '-autoClose');

          // call our constructor custom callback function
          self.options.functionAfter.call(self.$el, self.$el);

          // call our method custom callbacks functions
          finishCallbacks();
        };

        if (supportsTransitions()) {

          self.$tooltip
            .clearQueue()
            .removeClass('tooltipster-' + self.options.animation + '-show')
            // for transitions only
            .addClass('tooltipster-dying');

          if (self.options.speed > 0) self.$tooltip.delay(self.options.speed);

          self.$tooltip.queue(finish);
        }
        else {
          self.$tooltip
            .stop()
            .fadeOut(self.options.speed, finish);
        }
      }
      // if the tooltip is already hidden, we still need to trigger the method custom callback
      else if (self.Status == 'hidden') {
        finishCallbacks();
      }

      return self;
    },

    // the public show() method is actually an alias for the private showNow() method
    show: function (callback) {
      this._showNow(callback);
      return this;
    },

    // 'update' is deprecated in favor of 'content' but is kept for backward compatibility
    update: function (c) {
      return this.content(c);
    },
    content: function (c) {
      // getter method
      if (typeof c === 'undefined') {
        return this.Content;
      }
      // setter method
      else {
        this._update(c);
        return this;
      }
    },

    reposition: function () {

      var self = this;

      // in case the tooltip has been removed from DOM manually
      if ($('body').find(self.$tooltip).length !== 0) {

        // reset width
        self.$tooltip.css('width', '');

        // find variables to determine placement
        self.elProxyPosition = self._repositionInfo(self.$elProxy);
        var arrowReposition = null,
          windowWidth = $(window).width(),
        // shorthand
          proxy = self.elProxyPosition,
          tooltipWidth = self.$tooltip.outerWidth(false),
          tooltipInnerWidth = self.$tooltip.innerWidth() + 1, // this +1 stops FireFox from sometimes forcing an additional text line
          tooltipHeight = self.$tooltip.outerHeight(false);

        // if this is an <area> tag inside a <map>, all hell breaks loose. Recalculate all the measurements based on coordinates
        if (self.$elProxy.is('area')) {
          var areaShape = self.$elProxy.attr('shape'),
            mapName = self.$elProxy.parent().attr('name'),
            map = $('img[usemap="#' + mapName + '"]'),
            mapOffsetLeft = map.offset().left,
            mapOffsetTop = map.offset().top,
            areaMeasurements = self.$elProxy.attr('coords') !== undefined ? self.$elProxy.attr('coords').split(',') : undefined;

          if (areaShape == 'circle') {
            var areaLeft = parseInt(areaMeasurements[0]),
              areaTop = parseInt(areaMeasurements[1]),
              areaWidth = parseInt(areaMeasurements[2]);
            proxy.dimension.height = areaWidth * 2;
            proxy.dimension.width = areaWidth * 2;
            proxy.offset.top = mapOffsetTop + areaTop - areaWidth;
            proxy.offset.left = mapOffsetLeft + areaLeft - areaWidth;
          }
          else if (areaShape == 'rect') {
            var areaLeft = parseInt(areaMeasurements[0]),
              areaTop = parseInt(areaMeasurements[1]),
              areaRight = parseInt(areaMeasurements[2]),
              areaBottom = parseInt(areaMeasurements[3]);
            proxy.dimension.height = areaBottom - areaTop;
            proxy.dimension.width = areaRight - areaLeft;
            proxy.offset.top = mapOffsetTop + areaTop;
            proxy.offset.left = mapOffsetLeft + areaLeft;
          }
          else if (areaShape == 'poly') {
            var areaXs = [],
              areaYs = [],
              areaSmallestX = 0,
              areaSmallestY = 0,
              areaGreatestX = 0,
              areaGreatestY = 0,
              arrayAlternate = 'even';

            for (var i = 0; i < areaMeasurements.length; i++) {
              var areaNumber = parseInt(areaMeasurements[i]);

              if (arrayAlternate == 'even') {
                if (areaNumber > areaGreatestX) {
                  areaGreatestX = areaNumber;
                  if (i === 0) {
                    areaSmallestX = areaGreatestX;
                  }
                }

                if (areaNumber < areaSmallestX) {
                  areaSmallestX = areaNumber;
                }

                arrayAlternate = 'odd';
              }
              else {
                if (areaNumber > areaGreatestY) {
                  areaGreatestY = areaNumber;
                  if (i == 1) {
                    areaSmallestY = areaGreatestY;
                  }
                }

                if (areaNumber < areaSmallestY) {
                  areaSmallestY = areaNumber;
                }

                arrayAlternate = 'even';
              }
            }

            proxy.dimension.height = areaGreatestY - areaSmallestY;
            proxy.dimension.width = areaGreatestX - areaSmallestX;
            proxy.offset.top = mapOffsetTop + areaSmallestY;
            proxy.offset.left = mapOffsetLeft + areaSmallestX;
          }
          else {
            proxy.dimension.height = map.outerHeight(false);
            proxy.dimension.width = map.outerWidth(false);
            proxy.offset.top = mapOffsetTop;
            proxy.offset.left = mapOffsetLeft;
          }
        }

        // our function and global vars for positioning our tooltip
        var myLeft = 0,
          myLeftMirror = 0,
          myTop = 0,
          offsetY = parseInt(self.options.offsetY),
          offsetX = parseInt(self.options.offsetX),
        // this is the arrow position that will eventually be used. It may differ from the position option if the tooltip cannot be displayed in this position
          practicalPosition = self.options.position;

        // a function to detect if the tooltip is going off the screen horizontally. If so, reposition the crap out of it!
        function dontGoOffScreenX() {

          var windowLeft = $(window).scrollLeft();

          // if the tooltip goes off the left side of the screen, line it up with the left side of the window
          if ((myLeft - windowLeft) < 0) {
            arrowReposition = myLeft - windowLeft;
            myLeft = windowLeft;
          }

          // if the tooltip goes off the right of the screen, line it up with the right side of the window
          if (((myLeft + tooltipWidth) - windowLeft) > windowWidth) {
            arrowReposition = myLeft - ((windowWidth + windowLeft) - tooltipWidth);
            myLeft = (windowWidth + windowLeft) - tooltipWidth;
          }
        }

        // a function to detect if the tooltip is going off the screen vertically. If so, switch to the opposite!
        function dontGoOffScreenY(switchTo, switchFrom) {
          // if it goes off the top off the page
          var checkOffset = '';
          if (((proxy.offset.top - $(window).scrollTop() - tooltipHeight - offsetY - 12) < 0) && (switchFrom.indexOf('top') > -1)) {
            practicalPosition = switchTo;
          }

          // if it goes off the bottom of the page
          if (((proxy.offset.top + proxy.dimension.height + tooltipHeight + 12 + offsetY) > ($(window).scrollTop() + $(window).height())) && (switchFrom.indexOf('bottom') > -1)) {
            practicalPosition = switchTo;
            myTop = (proxy.offset.top - tooltipHeight) - offsetY - 12;
          }
        }

        if (practicalPosition == 'top') {
          var leftDifference = (proxy.offset.left + tooltipWidth) - (proxy.offset.left + proxy.dimension.width);
          myLeft = (proxy.offset.left + offsetX) - (leftDifference / 2);
          myTop = (proxy.offset.top - tooltipHeight) - offsetY - 35;
          dontGoOffScreenX();
          dontGoOffScreenY('bottom', 'top');
        }

        if (practicalPosition == 'top-left') {
          myLeft = proxy.offset.left + offsetX;
          myTop = (proxy.offset.top - tooltipHeight) - offsetY - 12;
          dontGoOffScreenX();
          dontGoOffScreenY('bottom-left', 'top-left');
        }

        if (practicalPosition == 'top-right') {
          myLeft = (proxy.offset.left + proxy.dimension.width + offsetX) - tooltipWidth;
          myTop = (proxy.offset.top - tooltipHeight) - offsetY - 12;
          dontGoOffScreenX();
          dontGoOffScreenY('bottom-right', 'top-right');
        }

        if (practicalPosition == 'bottom') {
          var leftDifference = (proxy.offset.left + tooltipWidth) - (proxy.offset.left + proxy.dimension.width);
          myLeft = proxy.offset.left - (leftDifference / 2) + offsetX;
          myTop = (proxy.offset.top + proxy.dimension.height) + offsetY + 18;
          dontGoOffScreenX();
          dontGoOffScreenY('top', 'bottom');
        }

        if (practicalPosition == 'bottom-left') {
          myLeft = proxy.offset.left + offsetX;
          myTop = (proxy.offset.top + proxy.dimension.height) + offsetY + 12;
          dontGoOffScreenX();
          dontGoOffScreenY('top-left', 'bottom-left');
        }

        if (practicalPosition == 'bottom-right') {
          myLeft = (proxy.offset.left + proxy.dimension.width + offsetX) - tooltipWidth;
          myTop = (proxy.offset.top + proxy.dimension.height) + offsetY + 12;
          dontGoOffScreenX();
          dontGoOffScreenY('top-right', 'bottom-right');
        }

        if (practicalPosition == 'left') {
          myLeft = proxy.offset.left - offsetX - tooltipWidth - 12;
          myLeftMirror = proxy.offset.left + offsetX + proxy.dimension.width + 12;
          var topDifference = (proxy.offset.top + tooltipHeight) - (proxy.offset.top + proxy.dimension.height);
          myTop = proxy.offset.top - (topDifference / 2) - offsetY;

          // if the tooltip goes off boths sides of the page
          if ((myLeft < 0) && ((myLeftMirror + tooltipWidth) > windowWidth)) {
            var borderWidth = parseFloat(self.$tooltip.css('border-width')) * 2,
              newWidth = (tooltipWidth + myLeft) - borderWidth;
            self.$tooltip.css('width', newWidth + 'px');

            tooltipHeight = self.$tooltip.outerHeight(false);
            myLeft = proxy.offset.left - offsetX - newWidth - 12 - borderWidth;
            topDifference = (proxy.offset.top + tooltipHeight) - (proxy.offset.top + proxy.dimension.height);
            myTop = proxy.offset.top - (topDifference / 2) - offsetY;
          }

          // if it only goes off one side, flip it to the other side
          else if (myLeft < 0) {
            myLeft = proxy.offset.left + offsetX + proxy.dimension.width + 12;
            arrowReposition = 'left';
          }
        }

        if (practicalPosition == 'right') {
          myLeft = proxy.offset.left + offsetX + proxy.dimension.width + 12;
          myLeftMirror = proxy.offset.left - offsetX - tooltipWidth - 12;
          var topDifference = (proxy.offset.top + tooltipHeight) - (proxy.offset.top + proxy.dimension.height);
          myTop = proxy.offset.top - (topDifference / 2) - offsetY;

          // if the tooltip goes off boths sides of the page
          if (((myLeft + tooltipWidth) > windowWidth) && (myLeftMirror < 0)) {
            var borderWidth = parseFloat(self.$tooltip.css('border-width')) * 2,
              newWidth = (windowWidth - myLeft) - borderWidth;
            self.$tooltip.css('width', newWidth + 'px');

            tooltipHeight = self.$tooltip.outerHeight(false);
            topDifference = (proxy.offset.top + tooltipHeight) - (proxy.offset.top + proxy.dimension.height);
            myTop = proxy.offset.top - (topDifference / 2) - offsetY;
          }

          // if it only goes off one side, flip it to the other side
          else if ((myLeft + tooltipWidth) > windowWidth) {
            myLeft = proxy.offset.left - offsetX - tooltipWidth - 12;
            arrowReposition = 'right';
          }
        }

        // if arrow is set true, style it and append it
        if (self.options.arrow) {

          var arrowClass = 'tooltipster-arrow-' + practicalPosition;

          // set color of the arrow
          if (self.options.arrowColor.length < 1) {
            var arrowColor = self.$tooltip.css('background-color');
          }
          else {
            var arrowColor = self.options.arrowColor;
          }

          // if the tooltip was going off the page and had to re-adjust, we need to update the arrow's position
          if (!arrowReposition) {
            arrowReposition = '';
          }
          else if (arrowReposition == 'left') {
            arrowClass = 'tooltipster-arrow-right';
            arrowReposition = '';
          }
          else if (arrowReposition == 'right') {
            arrowClass = 'tooltipster-arrow-left';
            arrowReposition = '';
          }
          else {
            arrowReposition = 'left:' + Math.round(arrowReposition) + 'px;';
          }

          // building the logic to create the border around the arrow of the tooltip
          if ((practicalPosition == 'top') || (practicalPosition == 'top-left') || (practicalPosition == 'top-right')) {
            var tooltipBorderWidth = parseFloat(self.$tooltip.css('border-bottom-width')),
              tooltipBorderColor = self.$tooltip.css('border-bottom-color');
          }
          else if ((practicalPosition == 'bottom') || (practicalPosition == 'bottom-left') || (practicalPosition == 'bottom-right')) {
            var tooltipBorderWidth = parseFloat(self.$tooltip.css('border-top-width')),
              tooltipBorderColor = self.$tooltip.css('border-top-color');
          }
          else if (practicalPosition == 'left') {
            var tooltipBorderWidth = parseFloat(self.$tooltip.css('border-right-width')),
              tooltipBorderColor = self.$tooltip.css('border-right-color');
          }
          else if (practicalPosition == 'right') {
            var tooltipBorderWidth = parseFloat(self.$tooltip.css('border-left-width')),
              tooltipBorderColor = self.$tooltip.css('border-left-color');
          }
          else {
            var tooltipBorderWidth = parseFloat(self.$tooltip.css('border-bottom-width')),
              tooltipBorderColor = self.$tooltip.css('border-bottom-color');
          }

          if (tooltipBorderWidth > 1) {
            tooltipBorderWidth++;
          }

          var arrowBorder = '';
          if (tooltipBorderWidth !== 0) {
            var arrowBorderSize = '',
              arrowBorderColor = 'border-color: ' + tooltipBorderColor + ';';
            if (arrowClass.indexOf('bottom') !== -1) {
              arrowBorderSize = 'margin-top: -' + Math.round(tooltipBorderWidth) + 'px;';
            }
            else if (arrowClass.indexOf('top') !== -1) {
              arrowBorderSize = 'margin-bottom: -' + Math.round(tooltipBorderWidth) + 'px;';
            }
            else if (arrowClass.indexOf('left') !== -1) {
              arrowBorderSize = 'margin-right: -' + Math.round(tooltipBorderWidth) + 'px;';
            }
            else if (arrowClass.indexOf('right') !== -1) {
              arrowBorderSize = 'margin-left: -' + Math.round(tooltipBorderWidth) + 'px;';
            }
            arrowBorder = '<span class="tooltipster-arrow-border" style="' + arrowBorderSize + ' ' + arrowBorderColor + ';"></span>';
          }

          // if the arrow already exists, remove and replace it
          self.$tooltip.find('.tooltipster-arrow').remove();

          // build out the arrow and append it
          var arrowConstruct = '<div class="' + arrowClass + ' tooltipster-arrow" style="' + arrowReposition + '">' + arrowBorder + '<span style="border-color:' + arrowColor + ';"></span></div>';
          self.$tooltip.append(arrowConstruct);
        }

        // position the tooltip
        self.$tooltip.css({
          'top': Math.round(myTop) + 'px',
          'left': Math.round(myLeft) + 'px'
        });
      }

      return self;
    },

    enable: function () {
      this.enabled = true;
      return this;
    },

    disable: function () {
      // hide first, in case the tooltip would not disappear on its own (autoClose false)
      this.hide();
      this.enabled = false;
      return this;
    },

    destroy: function () {

      var self = this;

      self.hide();

      // remove the icon, if any
      if (self.$el[0] !== self.$elProxy[0]) {
        self.$elProxy.remove();
      }

      self.$el
        .removeData(self.namespace)
        .off('.' + self.namespace);

      var ns = self.$el.data('tooltipster-ns');

      // if there are no more tooltips on this element
      if (ns.length === 1) {

        // optional restoration of a title attribute
        var title = null;
        if (self.options.restoration === 'previous') {
          title = self.$el.data('tooltipster-initialTitle');
        }
        else if (self.options.restoration === 'current') {

          // old school technique to stringify when outerHTML is not supported
          title =
            (typeof self.Content === 'string') ?
              self.Content :
              $('<div></div>').append(self.Content).html();
        }

        if (title) {
          self.$el.attr('title', title);
        }

        // final cleaning
        self.$el
          .removeClass('tooltipstered')
          .removeData('tooltipster-ns')
          .removeData('tooltipster-initialTitle');
      }
      else {
        // remove the instance namespace from the list of namespaces of tooltips present on the element
        ns = $.grep(ns, function (el, i) {
          return el !== self.namespace;
        });
        self.$el.data('tooltipster-ns', ns);
      }

      return self;
    },

    elementIcon: function () {
      return (this.$el[0] !== this.$elProxy[0]) ? this.$elProxy[0] : undefined;
    },

    elementTooltip: function () {
      return this.$tooltip ? this.$tooltip[0] : undefined;
    },

    // public methods but for internal use only
    // getter if val is ommitted, setter otherwise
    option: function (o, val) {
      if (typeof val == 'undefined') return this.options[o];
      else {
        this.options[o] = val;
        return this;
      }
    },
    status: function () {
      return this.Status;
    }
  };

  $.fn[pluginName] = function () {

    // for using in closures
    var args = arguments;

    // if we are not in the context of jQuery wrapped HTML element(s) :
    // this happens when calling static methods in the form $.fn.tooltipster('methodName'), or when calling $(sel).tooltipster('methodName or options') where $(sel) does not match anything
    if (this.length === 0) {

      // if the first argument is a method name
      if (typeof args[0] === 'string') {

        var methodIsStatic = true;

        // list static methods here (usable by calling $.fn.tooltipster('methodName');)
        switch (args[0]) {

          case 'setDefaults':
            // change default options for all future instances
            $.extend(defaults, args[1]);
            break;

          default:
            methodIsStatic = false;
            break;
        }

        // $.fn.tooltipster('methodName') calls will return true
        if (methodIsStatic) return true;
        // $(sel).tooltipster('methodName') calls will return the list of objects event though it's empty because chaining should work on empty lists
        else return this;
      }
      // the first argument is undefined or an object of options : we are initalizing but there is no element matched by selector
      else {
        // still chainable : same as above
        return this;
      }
    }
    // this happens when calling $(sel).tooltipster('methodName or options') where $(sel) matches one or more elements
    else {

      // method calls
      if (typeof args[0] === 'string') {

        var v = '#*$~&';

        this.each(function () {

          // retrieve the namepaces of the tooltip(s) that exist on that element. We will interact with the first tooltip only.
          var ns = $(this).data('tooltipster-ns'),
          // self represents the instance of the first tooltipster plugin associated to the current HTML object of the loop
            self = ns ? $(this).data(ns[0]) : null;

          // if the current element holds a tooltipster instance
          if (self) {

            if (typeof self[args[0]] === 'function') {
              // note : args[1] and args[2] may not be defined
              var resp = self[args[0]](args[1], args[2]);
            }
            else {
              throw new Error('Unknown method .tooltipster("' + args[0] + '")');
            }

            // if the function returned anything other than the instance itself (which implies chaining)
            if (resp !== self) {
              v = resp;
              // return false to stop .each iteration on the first element matched by the selector
              return false;
            }
          }
          else {
            throw new Error('You called Tooltipster\'s "' + args[0] + '" method on an uninitialized element');
          }
        });

        return (v !== '#*$~&') ? v : this;
      }
      // first argument is undefined or an object : the tooltip is initializing
      else {

        var instances = [],
        // is there a defined value for the multiple option in the options object ?
          multipleIsSet = args[0] && typeof args[0].multiple !== 'undefined',
        // if the multiple option is set to true, or if it's not defined but set to true in the defaults
          multiple = (multipleIsSet && args[0].multiple) || (!multipleIsSet && defaults.multiple),
        // same for debug
          debugIsSet = args[0] && typeof args[0].debug !== 'undefined',
          debug = (debugIsSet && args[0].debug) || (!debugIsSet && defaults.debug);

        // initialize a tooltipster instance for each element if it doesn't already have one or if the multiple option is set, and attach the object to it
        this.each(function () {

          var go = false,
            ns = $(this).data('tooltipster-ns'),
            instance = null;

          if (!ns) {
            go = true;
          }
          else if (multiple) {
            go = true;
          }
          else if (debug) {
            console.log('Tooltipster: one or more tooltips are already attached to this element: ignoring. Use the "multiple" option to attach more tooltips.');
          }

          if (go) {
            instance = new Plugin(this, args[0]);

            // save the reference of the new instance
            if (!ns) ns = [];
            ns.push(instance.namespace);
            $(this).data('tooltipster-ns', ns)

            // save the instance itself
            $(this).data(instance.namespace, instance);
          }

          instances.push(instance);
        });

        if (multiple) return instances;
        else return this;
      }
    }
  };

  // quick & dirty compare function (not bijective nor multidimensional)
  function areEqual(a, b) {
    var same = true;
    $.each(a, function (i, el) {
      if (typeof b[i] === 'undefined' || a[i] !== b[i]) {
        same = false;
        return false;
      }
    });
    return same;
  }

  // detect if this device can trigger touch events
  var deviceHasTouchCapability = !!('ontouchstart' in window);

  // we'll assume the device has no mouse until we detect any mouse movement
  var deviceHasMouse = false;
  $('body').one('mousemove', function () {
    deviceHasMouse = true;
  });

  function deviceIsPureTouch() {
    return (!deviceHasMouse && deviceHasTouchCapability);
  }

  // detecting support for CSS transitions
  function supportsTransitions() {
    var b = document.body || document.documentElement,
      s = b.style,
      p = 'transition';

    if (typeof s[p] == 'string') {
      return true;
    }

    v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms'],
      p = p.charAt(0).toUpperCase() + p.substr(1);
    for (var i = 0; i < v.length; i++) {
      if (typeof s[v[i] + p] == 'string') {
        return true;
      }
    }
    return false;
  }
})(jQuery, window, document);
;
/**
 * Created by evando01 on 18/05/2015.
 */
//info-popover

(function ($) {
  Drupal.behaviors.tui_info_icon = {
    attach: function (context, settings) {
      if ($.isFunction($.fn.tooltipster)) {
        $('.tui-info-popover').tooltipster({
          animation: 'fade',
          contentAsHTML: true,
          hideOnClick: true,
          debug: false,
          icon: '',
          iconTheme: 'glyphicon-tui-info-2 glyphicon tooltipster-icon',
          iconDesktop: true,
          iconTouch: true,
          onlyOne: true,
          touchDevices: true,
          interactive: true,
          trigger: 'click',
          multiple: false,
          functionInit: function (origin, content) {
            return $('<div />').html(content).text();
          }
          //maxWidth:400 --> overwritten in tooltipster file so you can use max-width attribute
        });
      }

      if ($.isFunction($.fn.modal)) {
        $('.tui-info-modal').on('show.bs.modal', function (e) {
          var modalHeader, modalBody, modalFooter;

          if ($(e.relatedTarget).attr('data-modal-body') !== undefined) {
            modalBody = $(e.relatedTarget).attr('data-modal-body');
          }
          if ($(e.relatedTarget).attr('data-modal-title') !== undefined) {
            modalHeader = $(e.relatedTarget).attr('data-modal-title');
          }
          if ($(e.relatedTarget).attr('data-modal-footer') !== undefined) {
            modalFooter = $(e.relatedTarget).attr('data-modal-footer');
          }
          $('.tui-info-modal .modal-content').html(
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
            '<h4 class="modal-title">' + modalHeader + '</h4>' +
            '</div>' +
            '<div class="modal-body">' +
            modalBody +
            '</div>' +
            '<div class="modal-footer">' +
            modalFooter +
            '</div>'
          );
        });
      }
    }
  };


  $(document).ajaxComplete(function (event, xhr, settings) {
    Drupal.attachBehaviors($('.tui-info-popover'));
    Drupal.attachBehaviors($('.tui-info-modal'));
  });
  $(document).on("hidden.bs.modal", function (e) {
    $(e.target).removeData("bs.modal").find(".modal-content").empty();
  });
})(jQuery);
;
