$(".contactButton").click(function(){
  $("html, body").animate({scrollTop: $("body").height()}, 500);
})
$(".subMenu1 a, .subMenu2 a").click(function(){
  $("html, body").animate({scrollTop: 0}, 300);
})

var $headerBtm = $(".header-bottom")
var funckyScroll = new FunckyScroll()
funckyScroll.init()
var session1Thread = new FunckyScrollThread()

session1Thread.addEventListeners([
    new FSFadeOutEventListener({dom: $headerBtm, hOE: 50})])

funckyScroll.addThread(session1Thread)


$(function(){

  var cB = $(".contactButton")
  var pageSelection = $(".selected")
    var bodyheight = $("body").height()
  $(window).scroll(function(){

      if($("body").height() - ($(window).scrollTop() + $(window).height()) <= 250){
      cB.addClass("selected")
      pageSelection.removeClass("selected")
    }else{
      cB.removeClass("selected")
      pageSelection.addClass("selected")
    }
  });
});
