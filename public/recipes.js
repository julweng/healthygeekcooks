'use strict';
let username = localStorage.getItem("username");
console.log(username);
const icon = $("#icon");
const navLinks = $("#home, #search, #create, #edit, #logout");

/******* responsive menu bar, search bar, and create recipe buttons*******/
function responsiveMenuBarButton() {
  if($(window).innerWidth() <= 640) {
    /* menu */
    icon.removeClass("hidden");
    navLinks.addClass("hidden");
    /* search button */
    $("#search-span").addClass("hidden");
    /* create recipe buttons */
    $(".upload-publish-button").parent().removeClass("right");
    $(".clear-button").parent().removeClass("left");
    $(".upload-publish-button, .save-button, .clear-button").css("width", "80%");
  }
  else {
    /* menu */
    if(!icon.hasClass("hidden")) {
      icon.addClass("hidden");
    }
    /* create recipe buttons */
    if(!$(".upload-publish-button").parent().hasClass("right")) {
      $(".upload-publish-button").parent().addClass("right");
    }
    if(!$(".clear-button").parent().hasClass("left")) {
      $(".clear-button").parent().addClass("left")
    }
    /* menu */
    navLinks.removeClass("hidden");
    /* search buttons */
    $("#search-span").removeClass("hidden");
    /* create recipe buttons */
    $(".upload-publish-button, .save-button, .clear-button").css("width", "60%")
  }
}

function handleWindowResize() {
  $(window).on("resize", function() {
    responsiveMenuBarButton();
  });
}

function handleHamburgerClick() {
  icon.on("click", e => {
    e.preventDefault();
    if(navLinks.hasClass("hidden")) {
      navLinks.removeClass("hidden");
    }
    else {
      navLinks.addClass("hidden");
    }
  });
}

/******* search form *******/
/*function renderSearchForm() {
  $('#search-section').empty();
  const searchForm = `
    <form action="#" role="form" accept-charset="UTF-8" method="get" class="col-12" id="search-form">
      <div class="row">
        <label class="text-red search-label col-12 center" for="search"><span id="search-span">Search:</span>
        <input type="text" id="search-input" placeholder="milk of the poppy, butterbeer..." required />
        <input class="pointer red-background text-white" type="submit" id="searchsubmit" value="&#xf002;">
        </label>
      </div>
      <div class="row">
          <div class="col-12 center">
          <label class="pointer padding-right"><span class="left padding-right text-red">By:</span>
          <input type="radio" checked="checked" name="radio" role="checkbox">
        Name</label>
          <label class="pointer padding-right">
          <input type="radio" checked="checked" name="radio" role="checkbox">
        Series</label>
          <label class="pointer padding-right">
          <input type="radio" checked="checked" name="radio" role="checkbox">
        Type</label>
        </div>
      </div>
    </form>`
  $('#search-section').append(searchForm);
}*/

/******* accordions *******/
function handleAccordionClicks() {
  $("button.accordion").on("click", function(e) {
    e.preventDefault();
    e.stopPropagation();
    const panel = $(e.target).next();
    if(panel.hasClass("hidden")) {
      panel.removeClass("hidden");
    }
    else {
      panel.addClass("hidden");
    }
  });
}

/******* handle search click *******/
function handleSearchClick() {
  $("#search, .fa-search-plus").on("click", e => {
    e.preventDefault();
    $("#intro-section").remove();
    renderSearchForm();
  })
}



$(function() {
  responsiveMenuBarButton();
  handleWindowResize();
  handleHamburgerClick();
  handleAccordionClicks()
  //handleSearchClick();
})
