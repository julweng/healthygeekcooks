'use strict';
let username = localStorage.getItem("username");
const recipeObj = {};
const icon = $("#icon");
const modal = $(".modal");
const navLinks = $("#home, #search, #create, #edit, #logout");

/******* responsive menu bar, search bar, and create recipe buttons*******/
function responsiveMenuBarButton() {
  $(window).on("resize", function(){
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
  });
}

function handleHomeClick() {
  $("#home").on("click", e => {
    e.preventDefault();
    if($(window).innerWidth() <= 640) {
      navLinks.addClass("hidden");
      window.location.href = "index.html";
    }
  })
}

function handleDiffWindowSize() {
  if($(window).innerWidth() <= 640) {
    $("#icon").removeClass("hidden");
    navLinks.addClass("hidden");
  }
  else {
    $("#icon").addClass("hidden");
    navLinks.removeClass("hidden");
  }
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
  handleDiffWindowSize();
  responsiveMenuBarButton();
  handleHamburgerClick();
  handleSearchClick();
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
function handleAccordionClicks(selector) {
  selector.on("click", "button.accordion", function(e) {
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

/***** handle search  *****/
function handleSearchClick() {
  $("#search, .fa-search-plus").on("click", e => {
    e.preventDefault();
    e.stopPropagation();
    if($(window).innerWidth() <= 640) {
      navLinks.addClass("hidden");
    }
    $("#intro-section, #search-section, #create-section, #edit-section").empty();
    renderSearchForm();
    setPlaceholder();
  });
}

function renderSearchForm() {
  $('#search-section').empty();
  const searchForm = `
    <form action="#" role="form" accept-charset="UTF-8" method="get" class="col-12" id="search-form">
      <div class="row">
        <label class="text-red search-label col-12 center" for="search"><span id="search-span">Search:</span>
        <input type="text" id="search-input" placeholder="butterbeer" required />
        <input class="pointer red-background text-white" type="submit" id="searchsubmit" value="&#xf002;">
        </label>
      </div>
      <div class="row">
        <div class="col-12 center">
          <span class="text-red">By: </span>
          <input type="radio" id="byName" name="search-filter" value="name" role="checkbox" checked>
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
function handleSearchSubmit() {
  $("#search-section").on("submit", e => {
    e.preventDefault();
    $("#search-result, #browse-section").empty();
    $("#page").empty();
    let name, type, series = '';
    let search = $("input[type=radio]:checked").val();
    let query = $("#search-input").val();
    $("#search-input").val('');
    if(search === "name") {
      ajaxGetDelete(`/recipename?name=${query}`, "GET", renderSearchResult);
    }
    else if(search === "type") {
      ajaxGetDelete(`/recipetype?type=${query}`, "GET", renderSearchResult);
    }
    else if(search === "series") {
      ajaxGetDelete(`/recipeseries?series=${query}`, "GET", renderSearchResult);
    }
  });
}

/***** display search result *****/
function displaySearchResult(item) {
  $("#search-result").append(`
    <div class="col-3 card">
      <img src="${item.img}" alt="${item.name}" data-id="${item._id}" class="card-img pointer">
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
function displayPagination(selector) {
  selector.append(`
    <div class="pagination text-red col-12 center">
      <div class="center">
      <a href="#" class="text-black">PREV</a>
      <a href="#" class="text-black">NEXT</a>
      </div>
    </div>`);
}

/***** render search result *****/
function renderSearchResult(data) {
  const selector = $("#page");
  data.forEach((item, index) => {
    const {
      _id,
      name,
      author,
      series,
      type,
      img,
    } = item;
    displaySearchResult(item)
  });
  if(data.length >= 19) {
    displayPagination(selector);
  }
}

function handleSearch() {
  handleSearchSubmit();
  handleSearchCardClick();
}

/***** ajax call *****/
function ajaxGetDelete(url, type, callback) {
  return $.ajax({
    url,
    type,
    dataType: 'json',
  })
  .done(callback)
  .fail(handleError);
}

function ajaxPostPut(url, type, data, callback) {
	return $.ajax({
			url,
			type,
			data,
    	contentType: "application/json",
    	dataType: 'json',
		})
		.done(callback)
		.fail(handleError);
}

/******* handle ajax error *******/
function handleError(err) {
  const status = err.status;
  const statusText = err.statusText;
  console.log(err);
  if(status !== 200 || statusText !== 200) {
    alert(`status code: ${status}, ${statusText}`);
  }
}

/****** handle card click ********/
function handleSearchCardClick() {
  $("#search-result").on("click", ".card img", e => {
    e.preventDefault();
    const id = $(".card img").attr("data-id");
    $("#search-result").empty();
    $("#page").empty();
    ajaxGetDelete(`/recipes/${id}`, "GET", renderRecipe);
  })
}

function renderRecipe(item) {
  let recipe = `<div class="tab col-12 left rose-background">
    <button class="tablinks rose-background pointer active" id="basic-tab">Basic Info</button>
    <button class="tablinks rose-background pointer" id="ingredient-tab">Ingredients </button>
    <button class="tablinks rose-background pointer" id="instruction-tab">Instructions</button>
  </div>

  <div id="basic-info" class="tabcontent col-12">
    <h4 class="col-12 center"><span class="text-red"><b>${item.name}</b></span> from <b>${item.series}<b></h4>
    <p class="col-12 center"> by <b>${item.author}</b></p>
    <p class="col-3 center"><b>Type: </b> ${item.type}</p>
    <p class="col-3 center"><b>Serving: </b> ${item.serving}</p>
    <p class="col-3 center"><b>Prep: </b> ${item.prepTime}</p>
    <p class="col-3 center"><b>Cook: </b> ${item.cookTime}</p>
  </div>
  <div id="ingred-supp" class="tabcontent col-12 hidden">
    <div class="col-6 left">
      <p><span class="text-red"><b>Supplies: </span></b> ${item.supplies}</p>
      <p><span class="text-red"><b>Ingredients: </span></b></p>
      <p>${item.ingredients}</p>
    </div>
    <div class="col-6 center"><img src="${item.img}" alt="${item.name}"></div>
  </div>
  <div id="instructions" class="tabcontent col-12 hidden">`;

  const instructions = item.instructions;
  let leftInstruction = `<h3 class="col-12 left text-red">Instructions</h3>
  <ul class="col-5 center fa-ul">`;
  for(let i = 0; i < Math.floor(instructions.length/2) + 1; i++){
    leftInstruction += `<li class="left"><i class="fa-li fa fa-circle text-red" aria-hidden="true"></i>  ${item.instructions[i]}</li>`
  }
  leftInstruction += `</ul>`;
  let rightInstruction = `<ul class = "col-5 center fa-ul">`;
  for(let i = Math.floor(instructions.length/2) + 1; i < instructions.length; i++) {
    rightInstruction += `<li class="left"><i class="fa-li fa fa-circle text-red" aria-hidden="true"></i>  ${item.instructions[i]}</li>`
  }
  rightInstruction += `</ul>`;

  recipe += leftInstruction + rightInstruction + `</div>`;

  $("#browse-section").append(recipe);
}

/******* handle create recipes *******/
/***** clear recipe create form *****/
function clearForm(selector) {
  selector.val('');
}

/***** get user input , convert to array, and trim outer spaces *****/
function trimStringArray(str, sep) {
  return (str.split(sep)).map(s => s.trim());
}

function clearBasicInfo(selector) {
  selector.on("click", "#basic-clear", e => {
    e.preventDefault();
    const selector = $("#title, #series, #serve, #type, #prep, #cook");
    clearForm(selector);
  })
}

function clearIngredientsSupplies(selector) {
  selector.on("click", "#ingredients-clear", e => {
    e.preventDefault();
    const selector = $("#supplies, #ingredients");
    clearForm(selector);
    $("#fileupload p:nth-child(3)").empty();
  });
}

function clearInstructions(selector) {
  selector.on("click", "#clear-instructions", e => {
    e.preventDefault();
    const selector = $("textarea#instructions");
    clearForm(selector);
  });
}

/****** handle cancel button on create page ******/
function handleCancelCreateClick(selector) {
  selector.on("click", "#cancel-create", e => {
    e.preventDefault();
    window.location.href="/recipes.html";
    return false;
  })
}

/****** handle file upload *******/
function fileUpload() {
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


/****** handle create click *******/
function renderCreateForm(selector) {
  const createForm = `
  <h2 class="col-12 center">Create Recipes</h2>
    <p class="col-12 center">(<sup> *</sup> = required fields)</p>
    <!-- basic recipe info -->
    <button class="col-12 accordion rose-background text-black pointer left" type="button" role="button"><i class="fa fa-caret-down fa-lg" aria-hidden="true"></i>Basic Recipe Info</button>
    <div class="row panel white-background hidden">
      <form class="col-12" id="basic-info-form" data-id="">
        <div class="row center">
          <div class="col-6">
            <label for="title">Title<sup>*</sup></label>
            <input type="text" class="create-recipes" name="title" placeholder="butterbeer" id="title" required/>
          </div>
          <div class="col-3">
            <label for="serving">Serve</label>
            <input type="text" class="create-recipes" placeholder="2" name="serving" id="serve" />
          </div>
          <div class="col-3">
            <label for="type">Type<sup>*</sup></label>
            <input type="text" class="create-recipes" name="type" placeholder="low fat" id="type" required/>
          </div>
        </div>
        <div class="row center">
          <div class="col-6">
            <label for="series">Series<sup>*</sup></label>
            <input type="text" class="create-recipes" name="series" placeholder="harry potter" id="series" required/>
          </div>
          <div class="col-3">
            <label for="prep">Prep</label>
            <input type="text" class="create-recipes" name="prep" placeholder="1 hr 15min" id="prep"/>
          </div>
          <div class="col-3">
            <label for="cook">Cook</label>
            <input type="text" class="create-recipes" name="cook" placeholder="2 hr" id="cook"/>
          </div>
        </div>
        <div class="row right">
          <div class="col-12 right">
            <button type="button" role="button" class="create-recipe-buttons terracotta-background text-white pointer" id="basic-clear">Clear</button>
          </div>
        </div>
      </form>
    </div>

    <!-- ingredients and supplies -->
    <button class="col-12 accordion rose-background text-black pointer left" type="button" role="button"><i class="fa fa-caret-down fa-lg" aria-hidden="true"></i>Ingredients and Supplies</button>
    <div class="col-12 panel white-background hidden">
      <form class="row" id="ing-sup-form">
        <div class="col-12 center ing-sup-container">
          <label class="col-12 left" for="supplies">Supplies</label>
          <textarea class="col-12 low-textarea" name="supplies" form="ingreidents-supplies" wrap="hard" placeholder="4 (16-ounce) glasses,1 blender...(separated by commas)" id="supplies" required></textarea>
        </div>
        <div class="col-12 center ing-sup-container">
          <label class="col-12 left" for="ingredients">Ingredients<sup>*</sup></label>
          <textarea class="col-12 high-textarea" name="ingredients" form="ingreidents-supplies" wrap="hard" placeholder="1 quartreduced fat vanilla ice cream, 100 ml Butterscotch syrup...(separated by commas)" id="ingredients" required></textarea>
        </div>
        <div class="col-12" id="fileupload">
          <p>Share a picture of your recipe. Note: only .png format is accepted</p>
          <input class="center" type="file" id="file" accept=".png" name="file">
        </div>
        <div class="row right">
          <div class="col-12 right">
            <button type="button" role="button" class="create-recipe-buttons terracotta-background text-white pointer" id="ingredients-clear">Clear</button>
          </div>
        </div>
      </form>
    </div>

    <!-- instructions -->
    <button class="col-12 accordion rose-background text-black pointer left" type="button" role="button"><i class="fa fa-caret-down fa-lg" aria-hidden="true"></i>Instructions</button>
      <div class="col-12 panel white-background hidden">
        <form class="row">
          <div class="col-12 center ing-sup-container">
            <label class="col-12 left" for="instructions">Instructions<sup>*</sup></label>
            <textarea class="col-12 high-textarea" name="instructions" form="instructions" wrap="hard" placeholder="Chill glasses in fridge for at least half an hour.,Mix ice cream and root bear in a blender.,Pour into chilled glasses.,Optional: top with whipped cream...(separated by periods)" id="instructions" required /></textarea>
          </div>
          <div class="row right">
            <div class="col-12 right">
              <button type="button" role="button" class="create-recipe-buttons terracotta-background text-white pointer" id="clear-instructions">Clear</button>
            </div>
          </div>
        </form>
      </div>
    <div class="row">
      <div class="col-12 right" id="options">
        <button type="button" role="button" class="create-recipe-buttons red-background text-white pointer" id="submit-create">Submit</button>
        <button type="button" role="button" class="create-recipe-buttons burgundy-background text-white pointer" id="cancel-create">Cancel</button>
      </div>
    </div>`;
  selector.append(createForm);
  window.setTimeout(() => {
    fileUpload();
  }, 0);
}

function handleCreateClick() {
  $("#create, .fa-file-text-o").on("click", e => {
    e.preventDefault();
    e.stopPropagation();
    const selector = $("#create-section")
    if($(window).innerWidth() <= 640) {
      navLinks.addClass("hidden");
    }
    $('section.row').not('#create-section').empty();
    renderCreateForm(selector);
    handleSubmitCreateClick($("#create-section"), "/recipes/post", "POST", ajaxPostPut);
    handleAccordionClicks($("#create-section"));
    clearBasicInfo($("#create-section"));
    clearIngredientsSupplies($("#create-section"));
    clearInstructions($("#create-section"));
    handleCancelCreateClick($("#create-section"));
  });
}

function createSuccess(message) {
  alert(message)
}

function handleSubmitCreateClick(selector, url, httpMethod) {
  selector.on("click", "#submit-create", e => {
    e.preventDefault();
      let img = '';
      if($("#fileupload p:nth-child(3)").text()) {
        img = `/uploads/` + $("#fileupload p:nth-child(3)").text();
      }
      else {
        img = 'img/nopic.png';
      }
      const name = $("#title").val().trim();
      const series = $("#series").val().trim();
      const serving = parseInt($("#serve").val());
      const type = trimStringArray($("#type").val());
      const prepTime = $("#prep").val().trim();
      const cookTime = $("#cook").val().trim();
      const supplies = trimStringArray($("#supplies").val());
      const ingredients = trimStringArray($("#ingredients").val());
      const instructions = trimStringArray($("textarea#instructions").val());
      const author = username;

      if(!(name && series && type && ingredients && instructions)) {
        alert('missing required fields')
      }
      else {
      ajaxPostPut(url, httpMethod, JSON.stringify({
    		name,
        series,
        serving,
        type,
        prepTime,
        cookTime,
        supplies,
        ingredients,
        img,
        instructions,
        author,
    	}), createSuccess(`recipe created`));
      window.location.href = "recipes.html";
    }
  });
}

/****** handle tab events ******/
function handleBasicTabClick() {
  $("#browse-section").on("click", "#basic-tab", e => {
    e.preventDefault();
    if($("#ingredient-tab").hasClass("active") || $("#instruction-tab").hasClass("active")) {
      $("#ingredient-tab, #instruction-tab").removeClass("active");
    }
    if(!$("#ingred-supp").hasClass("hidden") || !$("#instructions").hasClass("hidden")) {
      $("#ingred-supp, #instructions").addClass("hidden");
    }
    if(!$("#basic-tab").hasClass("active")) {
      $("#basic-tab").addClass("active");
    }
    if($("#basic-info").hasClass("hidden")) {
      $("#basic-info").removeClass("hidden");
    }
  });
}

function handleIngredientTabClick() {
  $("#browse-section").on("click", "#ingredient-tab", e => {
    e.preventDefault();
    if($("#basic-tab").hasClass("active") || $("#instruction-tab").hasClass("active")) {
      $("#basic-tab, #instruction-tab").removeClass("active");
    }
    if(!$("#basic-info").hasClass("hidden") || !$("#instructions").hasClass("hidden")) {
      $("#basic-info, #instructions").addClass("hidden");
    }
    if(!$("#ingredient-tab").hasClass("active")) {
      $("#ingredient-tab").addClass("active");
    }
    if($("#ingred-supp").hasClass("hidden")) {
      $("#ingred-supp").removeClass("hidden");
    }
  });
}

function handleInstructionTabClick() {
  $("#browse-section").on("click", "#instruction-tab", e => {
    e.preventDefault();
    if($("#basic-tab").hasClass("active") || $("#ingredient-tab").hasClass("active")) {
      $("#basic-tab, #ingredient-tab").removeClass("active");
    }
    if(!$("#basic-info").hasClass("hidden") || !$("#ingred-supp").hasClass("hidden")) {
      $("#basic-info, #ingred-supp").addClass("hidden");
    }
    if(!$("#instruction-tab").hasClass("active")) {
      $("#iinstruction-tab").addClass("active");
    }
    if($("#instructions").hasClass("hidden")) {
      $("#instructions").removeClass("hidden");
    }
  });
}

function openTab() {
  handleBasicTabClick();
  handleIngredientTabClick();
  handleInstructionTabClick();
}

/****** handle edit ******/
function handleEditClick() {
  $("#edit, .fa-pencil-square-o").on("click", e => {
    e.preventDefault();
    e.stopPropagation();
    $("#edit-section").empty();
    if($(window).innerWidth() <= 640) {
      navLinks.addClass("hidden");
    }
    $("section.row").not("#edit-section").empty();
    ajaxGetDelete(`/recipeauthor?author=${username}`, "GET", renderUserRecipes);
  });
}

function renderUserRecipes(data) {
  const selector = $("#edit-page");
  if(data.length === 0) {
    $("#edit-section").append(`
      <div class="col-12">
        <p>You currently have no recipes in your collection.</p>
        <p>Create your own recipes or browse others' recipes for inspiration.</p>
      </div>`);
  }
  else {
    $("#edit-section").append(`<div class="col-12 center text-black">
      <p>Select the recipe you would like to edit</p>
    </div>`);
  }
    data.forEach((item, index) => {
      const {
        _id,
        name,
        author,
        series,
        type,
        img,
      } = item;
      displayUserRecipes(item)
    });
    if(data.length >= 19) {
      displayPagination(selector);
    }
  }

function displayUserRecipes(item) {
  $("#edit-section").append(`
    <div class="col-3 card">
      <img src="${item.img}" alt="${item.name}" data-id="${item._id}" class="card-img pointer">
      <div class="center card-container">
        <p class="text-red"><b>${item.name}</b></p>
        <p><b>from:</b> ${item.series}</p>
        <p><b>type:</b> ${item.type}</p>
        <p><b>by:</b> ${item.author}</p>
      </div>
    </div>`);
}

function handleEditCardClick() {
  $("#edit-section").on("click", ".card img", function(e) {
    e.preventDefault();
    e.stopPropagation();
    const id = $(this).attr("data-id");
    console.log(id);
    const img = $(this).attr("src");
    console.log(img);
    $("edit-search").empty();
    $("section.row").not("#edit-search").empty()
    ajaxGetDelete(`/recipes/${id}`, "GET", renderEditForm);
  })
}

function arrayToString(arr, sep) {
  let str = "";
  for(let i = 0; i < arr.length - 1; i++) {
    str += (arr[i] + sep);
  }
  return str += arr[arr.length - 1];
}

function setEditInput(item) {
  $("#edit-section #title").val(item.name);
  $("#edit-section #serve").val(item.serving);
  $("#edit-section #type").val(arrayToString(item.type, ','));
  $("#edit-section #series").val(item.series);
  $("#edit-section #prep").val(item.prepTime);
  $("#edit-section #cook").val(item.cookTime);
  $("#edit-section #supplies").val(arrayToString(item.supplies, ','));
  $("#edit-section #ingredients").val(arrayToString(item.ingredients, ','));
  $("#edit-section #instructions").val(arrayToString(item.instructions, '.'));
}

function renderEditForm(item) {
  const {
    id,
    name,
    series,
    type,
    serving,
    prepTime,
    cookTime,
    supplies,
    ingredients,
    instructions,
  } = item;
  const selector = $("#edit-section");
  renderCreateForm(selector);
  $("#edit-section h2").empty().text("Edit Recipe");
  $("#edit-section #basic-info-form").attr("data-id", item.id);
  window.setTimeout(() => {
    selector.on("click", "button.accordion", function(e) {
      e.preventDefault();
      e.stopPropagation();
      const panel = $(e.target).next();
      if(panel.hasClass("hidden")) {
        panel.removeClass("hidden");
        setEditInput(item);
      }
      else {
        panel.addClass("hidden");
      }
    });
    $("#edit-section #options").append(`
      <button type="button" role="button" class="create-recipe-buttons coffee-background text-white pointer" id="delete-recipe">Delete</button>`)
    window.setTimeout(() => {
      clearBasicInfo(selector);
      clearIngredientsSupplies(selector);
      clearInstructions(selector);
      console.log(item.id);
      handleSubmitEditClick(selector, `/recipes/${item.id}`, "PUT", item.id);
      handleCancelEditClick(selector);
      handleDeleteEditClick();
    }, 0);
  }, 0);
}

function handleCancelEditClick(selector) {
  selector.on("click", "#cancel-create", e => {
    e.preventDefault();
    e.stopPropagation();
    $("section.row").empty();
    window.location.href="/recipes.html"
  });
}

function handleSubmitEditClick(selector, url, httpMethod, id, image) {
  selector.on("click", "#submit-create", e => {
    e.preventDefault();
    e.stopPropagation();
      let imgFile = '';
      if($("#fileupload p:nth-child(3)").text()) {
        imgFile = `/uploads/` + $("#fileupload p:nth-child(3)").text();
      }
      else {
        imgFile = image;
      }
      const name = $("#title").val().trim();
      const series = $("#series").val().trim();
      const serving = parseInt($("#serve").val());
      const type = trimStringArray($("#type").val());
      const prepTime = $("#prep").val().trim();
      const cookTime = $("#cook").val().trim();
      const supplies = trimStringArray($("#supplies").val());
      const ingredients = trimStringArray($("#ingredients").val());
      const instructions = trimStringArray($("textarea#instructions").val());
      const author = username;
      const img = imgFile;

      if(!(name && series && type && ingredients && instructions)) {
        alert('missing required fields')
      }
      else {
        ajaxPostPut(url, httpMethod, JSON.stringify({
          id,
          name,
          series,
          serving,
          type,
          prepTime,
          cookTime,
          supplies,
          ingredients,
          img,
          instructions,
          author,
      	}), createSuccess(`recipe updated`));
        window.location.href="/recipes.html";
      }
  })
}

function handleDeleteEditClick(){
  $("#edit-section").on("click", "#delete-recipe", e => {
    e.preventDefault();
    const id = $("#edit-section #basic-info-form").attr("data-id");
    console.log(id);
    ajaxGetDelete(`/recipes/${id}`, 'DELETE', function() {
      $("section.row").empty();
      alert("recipe deleted");
      window.location.href="/recipes.html"
    });
  });
}

$(function() {
  responsiveMenuBar();
  handleSearch();
  openTab();
  handleCreateClick();
  handleEditClick();
  handleEditCardClick();
});
