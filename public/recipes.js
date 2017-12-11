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

/****** seasrch bar placeholder *****/
function setPlaceholder() {
  $("#search-section").on("change", "input[type=radio]", function(e) {
    e.preventDefault();
    let by = $("input[type=radio]:checked").val();
    switch(by) {
      case 'name':
        $("#search-input").attr("placeholder", "butterbeer");
        break;
      case 'series':
        $("#search-input").attr("placeholder", "world of warcraft");
        break;
      case 'type':
        $("#search-input").attr("placeholder", "low fat");
        break;
    }
  });
}

/***** accordions *****/
function handleAccordionClicks() {
  $("#create-section").on("click", "button.accordion", function(e) {
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
    renderSearchForm();
  });
}

function renderSearchForm() {
  $('#search-section').empty();
  const searchForm = `
    <form action="#" role="form" accept-charset="UTF-8" method="get" class="col-12" id="search-form">
      <div class="row">
        <label class="text-red search-label col-12 center" for="search"><span id="search-span">Search:</span>
        <input type="text" id="search-input" placeholder="butterbeer..." required />
        <input class="pointer red-background text-white" type="submit" id="searchsubmit" value="&#xf002;">
        </label>
      </div>
      <div class="row">
        <div class="col-12 center">
          <span class="text-red">By: </span>
          <input type="radio" id="byName" name="search-filter" value="name" role="checkbox">
          <label for="byName">Name</label>
          <input type="radio" id="bySeries" name="search-filter" value="series" role="checkbox">
          <label for="bySeries">Series</label>
          <input type="radio" id="byType" name="search-filter" value="type">
          <label for="byType">Type</label>
        </div>
      </div>
    </form>`;
  $('#search-section').append(searchForm);
}

/****** handle search result ******/
/***** handle search submit *****/
function handleSearchSubmit() {
  $("#search-section").on("submit", e => {
    e.preventDefault();
    $("#search-result").empty();
    $("#page").empty();
    let search = $("input[type=radio]:checked").val();
    let query = $("#search-input").val();
    //let filter = {};
    if(typeof search === "undefined") {
      alert('please select a search filter');
    }
    /*
    if(search === "name") {
      filter[search] = query;
      console.log(filter);
    }
    searchRecipes('/recipes/name', 'GET', filter, renderSearchResult)
    */

    searchRecipes('/recipes', 'GET', function(data) {
      data.forEach((item, index) => {
        if(search === "name") {
          if(item.name.toLowerCase() === query.toLowerCase()) {
            console.log(item.img);
            displaySearchResult(item);
          }
        }
        else if(search === "type") {
          if(item.type.toLowerCase() === query.toLowerCase()) {
            displaySearchResult(item);
          }
        }
        else if(search === "series") {
          if(item.series.toLowerCase() === query.toLowerCase()) {
            displaySearchResult(item);
          }
        }
      });
    });
  });
}

/***** display search result *****/
function displaySearchResult(item) {
  $("#search-result").append(`
    <div class="col-3 card">
      <img src="${item.img}" alt="${item.name}" data-id="${item.id}" class="card-img pointer">
      <div class="center card-container">
        <p class="text-red"><b>${item.name}</b></p>
        <p><b>from:</b> ${item.series}</p>
        <p><b>type:</b> ${item.type}</p>
        <p><b>by:</b> ${item.author}</p>
      </div>
    </div>
    `);
}

/****** display pagination ******/
function displayPagination(data) {
  if(data.length <= 20) {
    $("#page").append(`
      <div class="pagination text-red col-12 center">
        <div class="center">
        <a href="#" class="text-black">PREV</a>
        <a href="#" class="text-black">NEXT</a>
        </div>
      </div>`);
  }
}

/***** render search result *****/
function renderSearchResult(data) {
  data.forEach((item, index) => {
    const {
      name,
      author,
      series,
      type,
      img,
    } = item;
    displaySearchResult(item)
  });
  displayPagination(data);
}

/***** ajax call for search query *****/
//function searchRecipes(url, type, data, callback)
function searchRecipes(url, type, callback) {
  return $.ajax({
    url,
    type,
    //data,
    dataType: 'json',
  })
  .done(callback)
  .fail(handleError);
}

/******* handle ajax error *******/
function handleError(err) {
  const status = err.status;
  const statusText = err.statusText;
  if(status !== 200 || statusText !== 200) {
    alert(`status code: ${status}, ${statusText}`);
  }
}

/****** handle card click ********/
function handleCardClick() {
  $("#search-result").on("click", ".card img", e => {
    e.preventDefault();
    const id = $(".card img").attr("data-id");
    console.log(id);
    $("search-section").empty();
    $("search-result").empty();
    const setting = {
      url: '/recipes/:id',
      data: {id: id},
      dataType: 'json',
      type: 'GET',
      success: renderRecipe,
      error: handleError
    };
    $.ajax(setting);
  })
}

function renderRecipe(item) {
  return `<div class="tab col-12 left rose-background">
    <button class="tablinks rose-background pointer" id="basic-tab">Basic Info</button>
    <button class="tablinks rose-background pointer" id="ingredient-tab">Ingredients </button>
    <button class="tablinks rose-background pointer" id="instruction tab">Instructions</button>
  </div>

  <div id="basic-info" class="tabcontent col-12">
    <h4 class="col-12 center"><b>${item.name}</b> from <b>${item.series}<b></h4>
    <p class="col-12 center"> by <b>${item.author}</b></p>
    <p class="col-3 center"><b>Type: </b> ${item.type}</p>
    <p class="col-3 center"><b>Serving: </b> ${item.serving}</p>
    <p class="col-3 center"><b>Prep: </b> ${item.prepTime}</p>
    <p class="col-3 center"><b>Cook: </b> ${item.cookTime}</p>
  </div>

  <div id="Ingred-supp" class="tabcontent col-12 hidden">
    <p class="col-4 center"><b>Supplies: </b> ${item.supplies}</p>
    <p class="col-4 center"><b>Ingredients: </b> ${item.ingredients}</p>
    <div class="col-4 center">img</div>
  </div>

  <div id="instructions" class="tabcontent col-12 hidden">
    <h4 class="col-12 left">Instructions</h4>
    <ul class="col-6 center">
      <li class="left">1</li>
      <li class="left">2</li>
    </ul>
    <ul class = "col-6 center">
      <li class="left">3</li>
      <li class="left">4</li>
    </ul>
  </div>`;
}

/******* handle create recipes *******/
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

/****** ingredients and supplies form ******/
function clearIngredientsSupplies() {
  $("#create-section").on("click", "#ingredients-clear", e => {
    e.preventDefault();
    const selector = $("#supplies, #ingredients");
    clearForm(selector);
  });
}

function saveIngredientsSupplies() {
  $("#create-section").on("click", "#ingredients-save", e => {
    e.preventDefault();
    console.log('save ingredients clicked');
    const supplies = $("#supplies").val();
    const supArray = trimStringArray(supplies);
    const ingredients = $("#ingredients").val();
    const ingArray = trimStringArray(ingredients);
    console.log(supArray);
    console.log(ingArray);
  })
}

/****** instructions form *****/
function saveInstructions() {
  $("#create-section").on("click", "#save-instructions", e => {
    e.preventDefault();
    console.log("save instructions clicked");
    const instructions = $("textarea#instructions").val();
    console.log(instructions);
    const instructArray = trimStringArray(instructions);
    console.log(instructArray);
  })
}

function clearInstructions() {
  $("#create-section").on("click", "#clear-instructions", e => {
    e.preventDefault();
    const selector = $("textarea");
    console.log("clear instructions clicked");
    clearForm(selector);
  });
}

/****** handle cancel button on create page ******/
function cancelCreateClick() {
  $("#create-section").on("click", "#cancel", e => {
    e.preventDefault();
    window.location.href="/recipes.html";
    return false;
  })
}

/****** handle file upload *******/
function fileUpload(){
  $()
  $('#fileupload').fileupload({
    url: 'http://localhost:8080/upload',
    dataType: 'json',
    done: function (e, data) {
        $.each(data.result.files, function (index, file) {
          $('<p/>').text(file.name).appendTo('#fileupload');
      });
    },
  })
}

/****** tab *******/
function openTab() {}


/****** handle create click *******/
function renderCreateForm() {
  const createForm = `  <h2 class="col-12 center">Create Recipes</h2>
    <!-- basic recipe info -->
    <button class="col-12 accordion rose-background text-black pointer left" type="button" role="button"><i class="fa fa-caret-down fa-lg" aria-hidden="true"></i>Basic Recipe Info</button>
    <div class="row panel white-background hidden">
      <form class="col-12">
        <div class="row center">
          <div class="col-6">
            <label for="title">Title</label>
            <input type="text" class="create-recipes" placeholder="butterbeer" id="title" required/>
          </div>
          <div class="col-3">
            <label for="serving">Serve</label>
            <input type="text" class="create-recipes" placeholder="2" id="serve" />
          </div>
          <div class="col-3">
            <label for="type">Type</label>
            <input type="text" class="create-recipes" placeholder="low fat" id="type"/>
          </div>
        </div>
        <div class="row center">
          <div class="col-6">
            <label for="series">Series</label>
            <input type="text" class="create-recipes" placeholder="harry potter" id="series" required/>
          </div>
          <div class="col-3">
            <label for="prep">Prep</label>
            <input type="text" class="create-recipes" placeholder="1 hr 15min" id="prep"/>
          </div>
          <div class="col-3">
            <label for="cook">Cook</label>
            <input type="text" class="create-recipes" placeholder="2 hr" id="cook"/>
          </div>
        </div>
        <div class="row right">
          <div class="col-12 right">
            <button type="button" role="button" class="create-recipe-buttons terracotta-background text-white pointer" id="image">Image</button>
            <button type="button" role="button" class="create-recipe-buttons coffee-background text-white pointer" id="basic-save">Save</button>
            <button type="button" role="button" class="create-recipe-buttons burgundy-background text-white pointer" id="basic-clear">Clear</button>
          </div>
        </div>
      </form>
    </div>

    <!-- ingredients and supplies -->
    <button class="col-12 accordion rose-background text-black pointer left" type="button" role="button"><i class="fa fa-caret-down fa-lg" aria-hidden="true"></i>Ingredients and Supplies</button>
    <div class="col-12 panel white-background hidden">
      <form class="row">
        <div class="col-12 center ing-sup-container">
          <label class="col-12 left" for="supplies">Supplies</label>
          <textarea class="col-12 low-textarea" name="supplies" form="ingreidents-supplies" wrap="hard" placeholder="4 (16-ounce) glasses,1 blender...(separated by commas)" id="supplies"></textarea>
        </div>
        <div class="col-12 center ing-sup-container">
          <label class="col-12 left" for="ingredients">Ingredients</label>
          <textarea class="col-12 high-textarea" name="ingredients" form="ingreidents-supplies" wrap="hard" placeholder="1 quartreduced fat vanilla ice cream, 100 ml Butterscotch syrup...(separated by commas)" id="ingredients" required /></textarea>
        </div>
        <div class="col-12" id="fileupload">
          <p>Share a picture of your recipe. Note: only .png format is accepted</p>
          <input class="center" type="file" id="file" accept=".png" name="file">
        </div>
        <div class="row right">
          <div class="col-12 right">
            <button type="button" role="button" class="create-recipe-buttons terracotta-background text-white pointer" id="ingredients-save">Save</button>
            <button type="button" role="button" class="create-recipe-buttons coffee-background text-white pointer" id="ingredients-clear">Clear</button>
          </div>
        </div>
      </form>
    </div>

    <!-- instructions -->
    <button class="col-12 accordion rose-background text-black pointer left" type="button" role="button"><i class="fa fa-caret-down fa-lg" aria-hidden="true"></i>Instructions</button>
      <div class="col-12 panel white-background hidden">
        <form class="row">
          <div class="col-12 center ing-sup-container">
            <label class="col-12 left" for="instructions"></label>
            <textarea class="col-12 high-textarea" name="iinstructions" form="instructions" wrap="hard" placeholder="Chill glasses in fridge for at least half an hour.,Mix ice cream and root bear in a blender.,Pour into chilled glasses.,Optional: top with whipped cream...(separated by commas)" id="instructions" required /></textarea>
          </div>
          <div class="row right">
            <div class="col-12 right">
              <button type="button" role="button" class="create-recipe-buttons terracotta-background text-white pointer" id="save-instructions">Save</button>
              <button type="button" role="button" class="create-recipe-buttons coffee-background text-white pointer" id="clear-instructions">Clear</button>
            </div>
          </div>
        </form>
      </div>
    <div class="row">
      <div class="col-12 right">
        <button type="button" role="button" class="create-recipe-buttons coffee-background text-white pointer">Submit</button>
        <button type="button" role="button" class="create-recipe-buttons burgundy-background text-white pointer" id="cancel">Cancel</button>
      </div>
    </div>`;
  $("#create-section").append(createForm);
}

function handleCreateClick() {
  $("#create, .fa-file-text-o").on("click", e => {
    e.preventDefault();
    e.stopPropagation();
    console.log('create clicked');
    $("#intro-section").remove();
    $("#create-section").empty();
    renderCreateForm();
  });
}

function createForm() {
  handleCreateClick();
  handleAccordionClicks();
  clearBasicInfo();
  saveBasicInfo();
  clearIngredientsSupplies();
  saveIngredientsSupplies();
  clearInstructions();
  saveInstructions();
  cancelCreateClick();
}

$(function() {
  responsiveMenuBar();
  handleSearchClick();
  setPlaceholder();
  handleSearchSubmit();
  handleCardClick()
  handleMenuBarClicks();
  createForm();
  fileUpload();
});
