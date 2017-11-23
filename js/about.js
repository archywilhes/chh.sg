var aboutSessions = $(".aboutSession")
var subMenuButtons = $(".subMenu a")

var buttons_and_divs_and_name = _.zip(subMenuButtons, aboutSessions)

var shown = $(".shown")
var shownBtn = $(".selected_item")

_.each(buttons_and_divs_and_name, function(bdn){
  $(bdn[0]).on("click", function(){
    shown.removeClass("shown")
    shownBtn.removeClass("selected_item")
    shown = $(bdn[1])
    shownBtn = $(bdn[0])
    shown.addClass("shown")
    shownBtn.addClass("selected_item")
    window.history.pushState(null, $(bdn[0]).attr('id'), $(bdn[0]).attr('id')+".html");
  })
})
