/* global $, FunckyScroll, FunckyScrollThread, FSFadeOutEventListener, FSFadeInEventListener, FunckyScrollEventListener */

$(".contactButton").click(function(){
  $("html, body").animate({scrollTop: $("body").height()}, 500);
})

if(window.innerWidth >= 1700){
  $(".o0").css("opacity",1)
}else{

var $window = $(window),
    $featureImage1 = $(".session1 img"),
    $header = $(".header"),
    $headerWrapperTop = $(".header-top-wrapper"),
    $headerTop = $(".header-top"),
    $headerBtm = $(".header-bottom"),
    $darkOverlay1 = $(".session1 .darkOverlay"),
    $overlayWords1 = $(".session1 .overlayWords1"),
    $overlayWords2 = $(".session1 .overlayWords2"),
    $button1 = $(".session1 .button"),
    $headerTopNav = $(".header-top .nav"),
    $logoImage = $(".logoImage"),
    $logoSmall = $(".smallLogoImage"),
    $session2 = $(".session2"),
    $darkOverlay2 = $(".session2 .darkOverlay"),
    $overlayWords3 = $(".session2 .overlayWords1"),
    $button2 = $(".session2 .button")


var $contactBtn = $(".contactButton")

$(".header-top-spaceHolder").css("height", $headerWrapperTop.outerHeight() + "px")

var funckyScroll = new FunckyScroll()
funckyScroll.init()

var session1Thread = new FunckyScrollThread()

var noramlisingRatio = (689 / $(window).height() )

session1Thread.addEventListeners([
    new FSFadeOutEventListener({dom: $headerBtm, hOE: 50 * noramlisingRatio}),
    new FSFadeInEventListener({ dom: [ $darkOverlay1, $overlayWords1],hOE: 50 * noramlisingRatio}),
    new FSFadeInEventListener({dom: $overlayWords2, hOE: 70 * noramlisingRatio}),
    new FSFadeInEventListener({dom: $button1, hOE: 70 * noramlisingRatio})])

funckyScroll.addThread(session1Thread)

var session2Threashold = ($session2.position().top - 500) * noramlisingRatio
var session2Thread = new FunckyScrollThread({
    activationThreashold: session2Threashold
})

session2Thread.addEventListeners([
    new FSFadeInEventListener({dom: $darkOverlay2, hOE: 100 * noramlisingRatio}),
    new FSFadeInEventListener({dom: $overlayWords3, hOE: 70 * noramlisingRatio,
      willDeactivate:function(){
      console.log("solid")
      $contactBtn.addClass("selected")
    },willActivate:function(){
      $contactBtn.removeClass("selected")
    }}),
    new FSFadeInEventListener({dom: $button2, hOE: 70 * noramlisingRatio})
])

funckyScroll.addThread(session2Thread)

var toShiftFeatureImage1 = new FunckyScrollEventListener({
    hOE: function(){ return this.maxMarginTopShift * 2},
    deactivatingCondition: function(data) {
        return data.marginTopShift >= this.maxMarginTopShift
    },
    reactivatingCondition: function(scrollTop) {
        return scrollTop <= this.maxMarginTopShift * 2
    },
    computeData: function(scrollTop) {
        return {marginTopShift: scrollTop*0.5}
    },
    computeConstants: function() {
        this.originalMarginTop = parseInt($featureImage1.css("margin-top"))
        this.maxMarginTopShift = parseInt($featureImage1.height() - ($featureImage1.parent().height() + -this.originalMarginTop))
        //console.log(this.maxMarginTopShift)
    },
    sideEffect: function(data) {
        //console.log(data)
        $featureImage1.css("margin-top", (-data.marginTopShift + this.originalMarginTop) + "px")
    },
    willDeactivate: function() {

    }
})

funckyScroll.addSingleListenerThread(toShiftFeatureImage1)


}
// //
// var navBarThreashold = $header.outerHeight() - $headerTop.outerHeight()
// var navBarThread = new FunckyScrollThread({
//     activationThreashold: navBarThreashold
// })
// var smallLogoShouldShowUp = false
//
// var resizeHeaderTopPadding = new FunckyScrollEventListener({
//     hOE : 100,
//     deactivatingCondition: function(data) {
//         return data.padding <= 10
//     },
//     computeData: function(scrollTop) {
//         return {
//             padding: 30 * (1 - scrollTop / this.hOE),
//             alpha: scrollTop >= (this.hOE/2) ? 0 : (1 - scrollTop / (this.hOE/2))
//         }
//     },
//     sideEffect: function(data) {
//         $headerTop.css("padding", data.padding + "px 0")
//         $headerTopNav.css("opacity", data.alpha)
//     },
//     willDeactivate: function() {
//         smallLogoShouldShowUp = true
//         $logoSmall.removeClass("bounceIn")
//         $logoImage.addClass("bounceOut")
//     },
//     willActivate: function() {
//         smallLogoShouldShowUp = false
//         $headerWrapperTop.css("top", "0px")
//         $logoSmall.removeClass("bounceIn")
//         $logoSmall.addClass("bounceOut")
//     }
// })
//
//
// $logoImage.on("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function(){
//     if(smallLogoShouldShowUp){
//         console.log("show up")
//         $headerWrapperTop.css("top", "-30px")
//         $logoSmall.removeClass("bounceOut")
//         $logoSmall.addClass("bounceIn")
//         $logoSmall.css("opacity", 1)
//     }
// })
// $logoSmall.on("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function(){
//   if(!smallLogoShouldShowUp){
//     console.log("show down")
//     $logoImage.removeClass("bounceOut")
//     $logoImage.addClass("bounceIn")
//   }
// })
//
// navBarThread.addEventListeners([resizeHeaderTopPadding])

//funckyScroll.addThread(navBarThread)
