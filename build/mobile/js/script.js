var homeEyeTimer, homelessPreTimer, homelessYearTimer, sec2Timer;

var $sec1 = $('#section-home'), $sec2 = $('#section-homeless'), $sec3 = $('#section-talk'),
    $sec4 = $('#section-taiwan'), $sec5 = $('#section-earth');

var homeVideo = $('.video video', $sec1).get(0), earthVideo = $('.video video', $sec5).get(0);

var curTalkPeople = 3, updateTalkPeople;
var curEarthStep = 0, lastEarthStep = 0, updateEarthStep;


$(function () {
  var campaignUrl = 'https://change.greenpeace.org.tw/2019/ClimateStrike/?utm_campaign=2019-climate&utm_source=facebook&utm_medium=social&utm_content=cta_btn';

  $('.fb-share').attr('href', 'https://www.facebook.com/share.php?u=' + campaignUrl + '&hashtag=%23%E6%99%82%E9%96%93%E4%B8%8D%E5%A4%9A%E4%BA%86');

  resizeCanvas();

  // sec 1
  /*$('.eyes').on('aniDone', function() {
    //$.fn.fullpage.setAllowScrolling(true);
    $(this).addClass('fade-out');
    homeVideo.currentTime = 0
    homeVideo.play();
  });*/
  $(homeVideo).on('ended', function() {
    //homeVideo.play();
    /*if($sec1.hasClass('active')) {
      $.fn.fullpage.moveSectionDown();
    }*/
  }).on('timeupdate', function() {
    //console.log($(this).get(0).currentTime);
    if($(this).get(0).currentTime > 2.8) {
      $sec1.addClass('fade-out');
    }
    if($(this).get(0).currentTime >= 14 && $sec1.hasClass('active')) {
      homeVideo.pause();
      $.fn.fullpage.moveSectionDown();
    }
  });

  // sec 2
  $('.wave').on('aniDone', function() {
    if(aniFrames.wave.curFrame == 1 || aniFrames.wave.curFrame == aniFrames.wave.frames) {
      $sec2.removeClass('enter');
      $sec2.removeClass('play');
      clearInterval(sec2Timer);
    }
    else {
      //$.fn.fullpage.setAllowScrolling(true);
      $sec1.removeClass('enter');
      $sec3.removeClass('enter');
      $sec2.addClass('play');
      homeVideo.pause();
      clearInterval(sec2Timer);
      sec2Timer = setInterval(changeYearslater, 4000);
    }
  });
  function changeYearslater(){
    var nowBG = $('#section-homeless .bg__pic.active') || $('#section-homeless .bg__pic:last-child');
    nowBG.removeClass('active');
    if(nowBG.next().length >0){
      nowBG.next().addClass('active');
    }else{
      $('#section-homeless .bg__pic').eq(0).addClass('active');
    }
  }

  // sec 3
  var peopleCount = $('.people', $sec3).length;
  updateTalkPeople = function() {
    $('.people-container', $sec3).attr('data-step', curTalkPeople);
    $('.active', $sec3).removeClass('active');
    $('.people:eq(' + curTalkPeople + '), .text:eq(' + curTalkPeople + ')', $sec3).addClass('active');
  }
  updateTalkPeople();
  $sec3.on('swiped-left', function() {
    curTalkPeople ++;
    if(curTalkPeople > peopleCount - 1) {
      curTalkPeople = 0;
    }
    updateTalkPeople();
  }).on('swiped-right', function() {
    curTalkPeople --;
    if(curTalkPeople < 0) {
      curTalkPeople = peopleCount - 1;
    }
    updateTalkPeople();
  }).on('swiped-up', function() {
    $.fn.fullpage.setAllowScrolling(true);
    $.fn.fullpage.moveSectionDown();
  }).on('swiped-down', function() {
    $.fn.fullpage.setAllowScrolling(true);
    $.fn.fullpage.moveSectionUp();
  });
  $('.prev', $sec3).on('click', function() {
    $sec3.trigger('swiped-right');
  });
  $('.next', $sec3).on('click', function() {
    $sec3.trigger('swiped-left');
  });

  // sec 4
  $('.point', $sec4).on('click', function() {
    $.fn.fullpage.setAllowScrolling(false);
    $sec4.addClass('enter');
    $('.active', $sec4).removeClass('active');
    $(this).addClass('active');
    $('.info[data-area="' + $(this).data('area') + '"]', $sec4).addClass('active');
  });
  $('.close-link', $sec4).on('click', function() {
    $.fn.fullpage.setAllowScrolling(true);
    $('.active', $sec4).removeClass('active');
    $sec4.removeClass('enter');
  });

  $('.tip', $sec4).on('transitionend', function() {
    if($sec4.hasClass('active')) {
      $('.point:eq(0)', $sec4).trigger('click');
    }
  });

  $('.info-container', $sec4).on('swiped-left', function() {
    var $curPoint = $('.point.active', $sec4);
    if($curPoint.next().length > 0) {
      $curPoint.next().trigger('click');
    }
    else {
      $('.point:eq(0)', $sec4).trigger('click');;
    }
  }).on('swiped-right', function() {
    var $curPoint = $('.point.active', $sec4);
    if($curPoint.prev().length > 0) {
      $curPoint.prev().trigger('click');
    }
    else {
      $('.point:last-child', $sec4).trigger('click');;
    }
  }).on('swiped-up', function() {
    $.fn.fullpage.setAllowScrolling(true);
    $.fn.fullpage.moveSectionDown();
  }).on('swiped-down', function() {
    $.fn.fullpage.setAllowScrolling(true);
    $.fn.fullpage.moveSectionUp();
  });
  $('.prev', $sec4).on('click', function() {
    $('.info-container', $sec4).trigger('swiped-right');
  });
  $('.next', $sec4).on('click', function() {
    $('.info-container', $sec4).trigger('swiped-left');
  });

  // sec 5
  /*$('.earth').on('aniDone', function() {
    if(aniFrames.earth.curFrame == aniFrames.earth.frames) {
      setCanvasAniTo('earth', 1);
    }
  });*/
  //var earthCount = aniFrames.earth.steps.length;
  $(earthVideo).on('ended', function() {
    earthVideo.currentTime = 0;
    earthVideo.pause();
    curEarthStep = 0;
  }).on('timeupdate', function() {
    if(earthVideo.paused) {
      return;
    }
    var curTime = $(this).get(0).currentTime;
    console.log(curTime);
    pseudoCurEarthStep = curEarthStep;
    if(curEarthStep == 0 && lastEarthStep == earthCount - 2) {
      //pseudoCurEarthStep = earthCount - 1;
      if(curTime >= earthMedium) {
        earthVideo.pause();
        earthVideo.currentTime = 0;
        curEarthStep = 0;
      }
      return;
    }
    if(curTime >= earthSteps[pseudoCurEarthStep] && curTime < earthMedium) {
      earthVideo.pause();
      lastEarthStep = curEarthStep;
    }
    else if(curTime >= earthPseudoMax - earthSteps[pseudoCurEarthStep]) {
      earthVideo.pause();
      earthVideo.currentTime = earthPseudoMax - earthVideo.currentTime;
      lastEarthStep = curEarthStep;
    }
  });
  updateEarthStep = function(isLeave) {
    if(isLeave) {
      //stopCanvasAni('earth');
      //setCanvasAniTo('earth', 1);
      earthVideo.pause();
      earthVideo.currentTime = 0;
    }
    else {
      //playCanvasAniTo('earth', aniFrames.earth.steps[curEarthStep]);
      if(lastEarthStep > curEarthStep && earthVideo.currentTime < earthMedium) {
        earthVideo.currentTime = earthPseudoMax - earthVideo.currentTime;
      }
      else if(lastEarthStep < curEarthStep && earthVideo.currentTime > earthMedium) {
        earthVideo.currentTime = earthPseudoMax - earthVideo.currentTime;
      }
      else if(!earthVideo.paused && lastEarthStep == curEarthStep) {
        earthVideo.currentTime = earthPseudoMax - earthVideo.currentTime;
      }
      if(curEarthStep >= earthCount - 1) { curEarthStep = 0; }
      earthVideo.play();
    }
    //if(curEarthStep >= earthCount - 1) { curEarthStep = 0; }
    $('.active', $sec5).removeClass('active');
    $('.text:eq(' + curEarthStep + '), .bg:eq(' + curEarthStep + ')', $sec5).addClass('active');

    if(curEarthStep == earthCount - 2){
      $('#section-earth .arrow-down').stop().delay(3000).fadeIn();
      $('#section-earth .nav-container').fadeOut();
    }
    else{
      $('#section-earth .arrow-down').stop().fadeOut();
      $('#section-earth .nav-container').fadeIn();
    }

  }
  //updateEarthStep();
  $sec5.on('swiped-left', function() {
    //if(!earthVideo.paused) { return; }
    curEarthStep ++;
    if(curEarthStep > earthCount -1) {
      curEarthStep = 0;
    }
    updateEarthStep();
  }).on('swiped-right', function() {
    //if(!earthVideo.paused) { return; }
    curEarthStep --;
    if(curEarthStep < 0) {
      //setCanvasAniTo('earth', aniFrames.earth.frames);
      curEarthStep = earthCount -2;
      earthVideo.currentTime = earthMedium;
    }
    updateEarthStep();
  }).on('swiped-up', function() {
    $.fn.fullpage.setAllowScrolling(true);
    $.fn.fullpage.moveSectionDown();
  }).on('swiped-down', function() {
    $.fn.fullpage.setAllowScrolling(true);
    $.fn.fullpage.moveSectionUp();
  });
  $('.prev', $sec5).on('click', function() {
    $sec5.trigger('swiped-right');
  });
  $('.next', $sec5).on('click', function() {
    $sec5.trigger('swiped-left');
  });

  $('#container').fullpage({

    keyboardScrolling: false,
    bigSectionsDestination: 'top',

    afterLoad: function(anchorLink, index) {

      // sec 2
      $('.years').text(1);

      // sec 5
      curEarthStep = 0;
      updateEarthStep(true);

      switch(index) {

        case 1:
          //$.fn.fullpage.setAllowScrolling(false);
          $sec1.addClass('enter');
          if(!firstPlay) {
            homeVideo.currentTime = 0;
            homeVideo.play();
          }
          /*if(!firstPlay) {
            homeEyeTimer = setTimeout(function() {
              playCanvasAniTo('eyes');
            }, 1000);
          }*/
          break;

        case 2:
          //$.fn.fullpage.setAllowScrolling(false);
          $('.years').text(1);
          $sec2.addClass('enter');
          playCanvasAniTo('wave', aniFrames.wave.steps[0]);
          homelessPreTimer = setTimeout(function() {
            homelessYearTimer = setInterval(function() {
              var years = parseInt($('.years').text());
              if(years < 30) {
                $('.years').text(years + 1);
              }
              else {
                clearInterval(homelessYearTimer);
              }
            }, 30);
            clearTimeout(homelessPreTimer);
          }, 500);
          break;

        //case 3:
        case 5:
          $.fn.fullpage.setAllowScrolling(false);
          //$sec3.addClass('enter');
          break;

        //case 5:
        case 4:
          $.fn.fullpage.setAllowScrolling(false);
          $('#section-earth .nav-container').fadeIn();
          break;

      }

    },

    onLeave: function(index, nextIndex, direction) {

      switch(index) {

        case 1:
          //clearTimeout(homeEyeTimer);
          //stopCanvasAni('eyes');
          firstPlay = false;
          break;

        case 2:
          clearTimeout(homelessPreTimer);
          clearInterval(homelessYearTimer);
          $sec2.removeClass('play');
          clearInterval(sec2Timer);
          if(direction == 'up') {
            playCanvasAniTo('wave', 1, aniFrames.wave.steps[0]);
            //setCanvasAniTo('eyes', 1);
            //$('.eyes').removeClass('fade-out');
            $sec1.removeClass('fade-out');
            $sec1.addClass('enter');
            //$sec3.removeClass('enter');
          }
          else if(direction == 'down') {
            playCanvasAniTo('wave', false, aniFrames.wave.steps[0]);
            $sec1.removeClass('enter');
            //$sec3.addClass('enter');
          }
          break;

        /*case 3:
          if(direction == 'down') {
            $sec3.removeClass('enter');
          }
          break;*/

        //case 4:
        case 3:
          $sec4.removeClass('enter');
          $('.active', $sec4).removeClass('active');
          break;

      }
      // if(nextIndex == 6){
      //   if($('#logo').is(':visible')) $('#logo').fadeOut();
      // }else{
      //   if(!$('#logo').is(':visible')) $('#logo').fadeIn();
      // }
      if(nextIndex != 4){
        $('#section-earth .arrow-down').stop().fadeOut();
      }
      if(index != 1) {
        homeVideo.currentTime = 0;
      }
    },

  });

  //$.fn.fullpage.setAllowScrolling(false);

});
