var slider, slider2;
function initSlide1(){
  if(slider === undefined){
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
}else{
  setTimeout(function(){location.reload()},300)
}
}
function initSlide2(){
  if(slider2 === undefined){
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
}else{
  setTimeout(function(){location.reload()},300)
}
}
$(document).ready(function(){
  if(document.location.href.indexOf("industrial-fans-and-silencers") != -1){
        initSlide1()
  }else if(document.location.href.indexOf("silencers") != -1)
        initSlide2()
   });

   $("#industrial-fans-and-silencers").click(function(){
     setTimeout(function(){initSlide1()},100)
   })
   $("#silencers").click(function(){
     setTimeout(function(){initSlide2()},100)
   })
