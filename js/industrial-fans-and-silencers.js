var slider, slider2;
$(document).ready(function(){
      slider = $('.slider').bxSlider({
        auto: true,
        controls: false,
        pager: false
      })
      $("#previousSlide").click(function(){
        slider.goToPrevSlide()
      })
      $("#nextSlide").click(function(){
        slider.goToNextSlide()
      })
      slider2 = $('.slider2').bxSlider({
        auto: true,
        controls: false,
        pager: false
      })
      $("#previousSlide2").click(function(){
        slider2.goToPrevSlide()
      })
      $("#nextSlide2").click(function(){
        slider2.goToNextSlide()
      })
   });
