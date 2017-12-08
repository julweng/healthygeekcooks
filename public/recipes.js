'use strict';
let username = localStorage.getItem("username");
console.log(username);
const icon = $("#icon");
const modal = $(".modal");
const navLinks = $("#home, #search, #create, #edit, #logout");

/******* responsive menu bar, search bar, and create recipe buttons*******/
function responsiveMenuBarButton() {
  if($(window).innerWidth() <= 640) {
    /* menu */
    icon.removeClass("hidden");
    navLinks.addClass("hidden");
    /* search button */
    $("#search-span").addClass("hidden");
  }
  else {
    /* menu */
    if(!icon.hasClass("hidden")) {
      icon.addClass("hidden");
    }
    navLinks.removeClass("hidden");
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

function responsiveMenuBar() {
  responsiveMenuBarButton();
  handleWindowResize();
}

function handleMenuBarClicks() {
  handleHamburgerClick();
}

/***** accordions *****/
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

/***** handle search click *****/
function handleSearchClick() {
  $("#search, .fa-search-plus").on("click", e => {
    e.preventDefault();
    e.stopPropagation();
    $("#intro-section").remove();
    $("#search-section").empty();
    const searchForm = renderTemplate('/recipes/search', 'GET');
    console.log(searchForm.responseText);
  });
}

/***** ajax call for partial view *****/
function renderTemplate(url, type) {
  return $.ajax({
    url,
    type,
    dataType: 'text',
  })
  .done(handleSuccess)
  .fail(handleError);
}

/******* handle ajax error *******/
function handleError(xhr) {
	const err = xhr.status;
  if(err !== 200) {
	  alert(`${err}: ${xhr.statusText}`);
  }
}
/******* handle ajax done *******/
function handleSuccess(data, statusText, xhr) {
	const status = xhr.status;
  if(status === 200) {
    console.log(xhr.responseText);
  };
}

/* function renderSearchForm() {
  $('#search-section').empty();

  $('#search-section').append(searchForm);
}*/

/***** clear recipe create form *****/
function clearForm(selector) {
  $(selector).val('');
}

/***** get user input as string, convert to array, and trim outer spaces *****/
function trimStringArray(str) {
  return (str.split(",")).map(s => s.trim());
}

/***** basic recipe info form *****/
function clearBasicInfo() {
  $("#create-section").on("click", "#basic-clear", e => {
    e.preventDefault();
    console.log('basic clear clicked');
    const selector = $("#title, #serve, #type, #prep, #cook");
    clearForm(selector);
  })
}

function saveBasicInfo() {
  $("#create-section").on("click", "#basic-save", e => {
    e.preventDefault();
    console.log('basic save clicked');
    return( {
      "title": $("#title").val().trim(),
      "series": $("#series").val().trim(),
      "serve": parseInt($("#serve").val()),
      "type": trimStringArray($("#type").val()),
      "prepTime": $("#prep").val().trim(),
      "cookTime": $("#cook").val().trim()
    } )
  });
}

function handleImageClick() {
  /*$("#create-section").on("click", "#image", e => {
    e.preventDefault();
    console.log('image clicked');
    if($(".modal").hasClass("hidden")) {
      $(".modal").removeClass("hidden")
    }*/
    /*window.setTimeout(function() {
      $('#fileupload').fileupload({
            dataType: 'json',
            done: function (e, data) {
              console.log(arguments);
            }
        });
      }, 0);*/
    //});

}

function handleCloseClick() {
  $(".close").on("click", e => {
    e.preventDefault();
    modal.addClass("hidden");
    })
  }

function handleWindowClick() {
  $(window).on("click", e => {
    e.preventDefault();
    if(e.target.className === "modal") {
    	modal.addClass("hidden");
    }
  })
}

function handleModalEvent() {
	handleImageClick();
	handleCloseClick();
	handleWindowClick();
}

/****** ingredients and supplies form ******/
function clearIngredientsSupplies() {
  $("#create-section").on("click", "#ingredients-clear", e => {
    e.preventDefault();
    const selector = $("#supplies, #ingredients").val();
    clearForm(selector);
  });
}

function saveIngredientsSupplies() {
  $("#create-section").on("click", "#ingredients-save", e => {
    e.preventDefault();
    console.log('save ingredients clicked');
    const supplies = $("#supplies").val();
    const supArray = trimStringArray(supplies);
    console.log(supArray);
  })
}

/****** instructions form *****/
$("#create-section").on("click", "#ingredients-clear", e => {
  e.preventDefault();
  const selector = $("#title, #serve, #type, #prep, #cook");
  clearForm(selector);
});

/****** handle cancel button on create page ******/
function cancelCreateClick() {
  $("#cancel").on("click", e => {
    e.preventDefault();
    alert("cancel clicked");
    window.location.href="/recipes.html";
    return false;
  })
}

$(function() {
  //handleSearchClick();
  responsiveMenuBar();
  handleModalEvent();
  handleSearchClick();
  handleMenuBarClicks();
  handleAccordionClicks();
  clearBasicInfo();
  saveBasicInfo();
  cancelCreateClick();
  clearIngredientsSupplies();
  saveIngredientsSupplies();
})
