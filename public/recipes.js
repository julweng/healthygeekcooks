'use strict';
let username = localStorage.getItem("username");

/******* hamburger ********/
function handleHamburgerClick() {
	$("#hamburger").click(e => {
		e.preventDefault();
		$("#smallscreen-nav").slideToggle("slow", () => {
			$("#hamburger").hide();
		 	$("#cross").show();
		});
	})
}

function handleCrossClick() {
	$("#cross").click(e => {
		e.preventDefault();
		$("#smallscreen-nav").slideToggle("slow", () => {
			$("#cross").hide();
			$("#hamburger").show();
		})
	})
}
function handleSmallScreenNavClick() {
  $("#search2, #create2, #edit2").click(e => {
		e.preventDefault();
		$("#smallscreen-nav").slideToggle("slow", () => {
			$("#cross").hide();
			$("#hamburger").show();
		})
	})
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
  $("#search, #search2, .fa-search-plus").on("click", e => {
    e.preventDefault();
    e.stopPropagation();
    $("section.row").empty();
    renderSearchForm();
  });
}

function renderSearchForm() {
  $('#search-section').empty();
  const searchForm = `
    <form action="#" role="form" accept-charset="UTF-8" method="get" class="col-12" id="search-form" aria-live="assertive">
      <div class="row">
        <label class="text-red search-label col-12 center" for="search"><span id="search-span">Search:</span>
        <input type="text" id="search-input" placeholder="butterbeer" required aria-labelledby="search" />
        <input class="pointer red-background text-white" type="submit" id="searchsubmit" value="&#xf002;" role="submit" aria-label="search">
        </label>
      </div>
      <div class="row">
        <div class="col-12 center">
          <span class="text-red">By: </span>
          <input type="radio" id="byName" name="search-filter" value="name" role="checkbox" aria-labelledby="name" checked>
          <label for="byName">Name</label>
          <input type="radio" id="bySeries" name="search-filter" value="series" role="checkbox" aria-labelledby="series">
          <label for="bySeries">Series</label>
          <input type="radio" id="byType" name="search-filter" value="type">
          <label for="byType" aria-labelledby="series">Type</label>
        </div>
      </div>
    </form>`;
  $('#search-section').append(searchForm);
  window.setTimeout(() => {
    setPlaceholder();
  }, 0);
}

/****** handle search result ******/
function handleSearchSubmit() {
  $("#search-section").on("submit", e => {
    e.preventDefault();
    $("section.row").not("#search-section").empty();
    let search = $("#search-section input[type=radio]:checked").val();
    let query = $("#search-input").val();

    $("#search-input").val('');
    if(search === "name") {
      ajaxGetOrDelete(`/recipename?name=${query}`, "GET", renderSearchResult);
    }
    else if(search === "type") {
      ajaxGetOrDelete(`/recipetype?type=${query}`, "GET", renderSearchResult);
    }
    else if(search === "series") {
      ajaxGetOrDelete(`/recipeseries?series=${query}`, "GET", renderSearchResult);
    }
  });
}

/***** display search result *****/
function displaySearchResult(selector, item) {
  selector.append(`
    <div class="col-3 card" aria-live="assertive" aria-labelledby="search results">
      <img src="${item.img}" alt="${item.name}" data-id="${item._id}" class="card-img pointer">
      <div class="center card-container">
        <p class="text-red"><b>${item.name}</b></p>
        <p><b>from:</b> ${item.series}</p>
        <p><b>type:</b> ${item.type}</p>
        <p><b>by:</b> ${item.author}</p>
      </div>
    </div>`);
}

/***** render search result *****/
function renderSearchResult(data) {
  if(data.length === 0) {
    $("#search-result").append(
      `<div class="col-12 center" aria-live="assertive">
        <p>The recipe does not exist in the database.</p>
        <p>Check your spelling and try again.</p>
        <p>Or, Create one of your own!</p>
      </div>`);
  }
  else {
    data.forEach((item, index) => {
      const {
        _id,
        name,
        author,
        series,
        type,
        img,
      } = item;
      displaySearchResult($("#search-result"),item)
    });
  }
}

/***** ajax call *****/
function ajaxGetOrDelete(url, type, callback) {
  return $.ajax({
    url,
    type,
    dataType: 'json',
  })
  .done(callback)
  .fail(handleError);
}

function ajaxPostOrPut(url, type, data, callback) {
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
function handleError(xhr) {
	let err = xhr.status;
	if(err !== 204) {
		alert(JSON.parse(xhr.responseText).message);
	}
}

/****** handle card click ********/
function handleSearchCardClick() {
  $("#search-result").on("click", ".card img", function(e) {
    e.preventDefault();
    const id = $(this).attr("data-id");
    $("#search-result").empty();
    ajaxGetOrDelete(`/recipes/${id}`, "GET", renderRecipe);
  })
}

function renderRecipe(item) {
  let recipe = `<div class="tab col-12 left rose-background" aria-live="assertive" aria-labelledby="recipe">
    <button class="tablinks rose-background pointer active" id="basic-tab" role="button">Basic Info</button>
    <button class="tablinks rose-background pointer" id="ingredient-tab" role="button">Ingredients </button>
    <button class="tablinks rose-background pointer" id="instruction-tab" role="button">Instructions</button>
  </div>

  <div id="basic-info" class="tabcontent col-12">
    <h4 class="col-12 center"><span class="text-red"><b>${item.name}</b></span> from <b>${item.series}<b></h4>
    <p class="col-12 center"> by <b>${item.author}</b></p>
    <p class="col-3 center"><b>Type: </b> ${item.type}</p>
    <p class="col-3 center"><b>Serving: </b> ${item.serving}</p>
    <p class="col-3 center"><b>Prep: </b> ${item.prepTime}</p>
    <p class="col-3 center"><b>Cook: </b> ${item.cookTime}</p>
  </div>
  <div id="ingred-supp" class="tabcontent col-12 hidden" aria-assertive="live">
    <div class="col-6 left">
      <p><span class="text-red"><b>Supplies: </span></b> ${item.supplies}</p>
      <p><span class="text-red"><b>Ingredients: </span></b></p>
      <p>${item.ingredients}</p>
    </div>
    <div class="col-6 center"><img src="${item.img}" alt="${item.name}"></div>
  </div>
  <div id="instructions" class="tabcontent col-12 hidden" aria-live="assertive">`;

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
    const selector = $("#title, #series, #serving, #type, #prep, #cook");
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
    add: function(e, data) {
        let uploadErrors = [];
        if (data.originalFiles[0]['size'] > 500000) {
          uploadErrors.push('Filesize too big');
        }
        if(uploadErrors.length > 0) {
          alert(uploadErrors.join("\n"));
        }
        else {
          data.submit();
        }
    },
    done: function (e, data) {
        $.each(data.result.files, function (index, file) {
          $('<p/>').text(file.name).appendTo('#fileupload');
      })
    }
  });
}

/****** handle create click *******/
function renderCreateForm(selector) {
  const createForm = `
  <h2 class="col-12 center" aria-live="assertive">Create Recipes</h2>
    <p class="col-12 center">(<sup> *</sup> = required fields)</p>
    <!-- basic recipe info -->
    <button class="col-12 accordion rose-background text-black pointer left" type="button" role="button"><i class="fa fa-caret-down fa-lg" aria-hidden="true"></i>Basic Recipe Info</button>
    <div class="row panel white-background hidden">
      <form class="col-12" id="basic-info-form" role="form" data-id="" data-img="">
        <div class="row center">
          <div class="col-6">
            <label for="title">Title<sup>*</sup></label>
            <input type="text" class="create-recipes" name="title" placeholder="butterbeer" id="title" aria-labelledby="title" required/>
          </div>
          <div class="col-3">
            <label for="serving">Serve</label>
            <input type="text" class="create-recipes" placeholder="2" name="serving" aria-labelledby="serve" id="serving" />
          </div>
          <div class="col-3">
            <label for="type">Type<sup>*</sup></label>
            <input type="text" class="create-recipes" name="type" placeholder="low fat" id="type" aria-labelledby="type" required/>
          </div>
        </div>
        <div class="row center">
          <div class="col-6">
            <label for="series">Series<sup>*</sup></label>
            <input type="text" class="create-recipes" name="series" placeholder="harry potter" id="series" aria-labelledby="series" required/>
          </div>
          <div class="col-3">
            <label for="prep">Prep</label>
            <input type="text" class="create-recipes" name="prep" placeholder="1 hr 15min" aria-labelledby="prep time" id="prep"/>
          </div>
          <div class="col-3">
            <label for="cook">Cook</label>
            <input type="text" class="create-recipes" name="cook" placeholder="2 hr" aria-labelledby="cook time" id="cook"/>
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
    <div class="col-12 panel white-background hidden" aria-live="assertive">
      <form class="row" id="ing-sup-form">
        <div class="col-12 center ing-sup-container">
          <label class="col-12 left" for="supplies">Supplies</label>
          <textarea class="col-12 low-textarea" name="supplies" form="ingreidents-supplies" wrap="hard" placeholder="4 (16-ounce) glasses,1 blender...(separated by commas)" id="supplies" role="textbox" contenteditable="true" aria-multiline="true"></textarea>
        </div>
        <div class="col-12 center ing-sup-container">
          <label class="col-12 left" for="ingredients">Ingredients<sup>*</sup></label>
          <textarea class="col-12 high-textarea" name="ingredients" form="ingreidents-supplies" wrap="hard" placeholder="1 quart reduced fat vanilla ice cream, 100 ml Butterscotch syrup...(separated by commas)" id="ingredients" role="textbox" contenteditable="true" aria-multiline="true" required></textarea>
        </div>
        <div class="col-12" id="fileupload">
          <p>Optional: Share a picture of your recipe. Only .png < 500kb is accepted</p>
          <input class="center" type="file" id="file" accept=".png" name="files[]">
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
      <div class="col-12 panel white-background hidden" aria-live="assertive">
        <form class="row">
          <div class="col-12 center ing-sup-container">
            <label class="col-12 left" for="instructions">Instructions<sup>*</sup></label>
            <textarea class="col-12 high-textarea" name="instructions" form="instructions" wrap="hard" placeholder="Chill glasses in fridge for at least half an hour.,Mix ice cream and root bear in a blender.,Pour into chilled glasses.,Optional: top with whipped cream...(separated by periods)" id="instructions" role="textbox" contenteditable="true" aria-multiline="true" required /></textarea>
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
  $("#create, #create2, .fa-file-text-o").on("click", e => {
    e.preventDefault();
    e.stopPropagation();
    $('section.row').empty();
    renderCreateForm($("#create-section"));
    window.setTimeout(() => {
      handleSubmitCreateClick("/recipes/post", "POST");
      handleAccordionClicks($("#create-section"));
      clearBasicInfo($("#create-section"));
      clearIngredientsSupplies($("#create-section"));
      clearInstructions($("#create-section"));
      handleCancelCreateClick($("#create-section"));
    }, 0);
  });
}

function createSuccess(message) {
  console.log(message);
}

function handleSubmitCreateClick(url, httpMethod) {
  $("#create-section").on("click", "#submit-create", e => {
    e.preventDefault();
    e.stopPropagation();
      let img = '';
      if($("#create-section #fileupload p:nth-child(3)").text()) {
        img = `/uploads/` + $("#create-section #fileupload p:nth-child(3)").text();
      }
      else {
        img = 'img/nopic.png';
      }
      const name = $("#create-section #title").val().trim();
      const series = $("#create-section #series").val().trim();
      const serving = Number($("#create-section #serving").val().trim());
      const type = trimStringArray($("#create-section #type").val(), ",");
      const prepTime = $("#create-section #prep").val().trim();
      const cookTime = $("#create-section #cook").val().trim();
      const supplies = trimStringArray($("#create-section #supplies").val(), ",");
      const ingredients = trimStringArray($("#create-section #ingredients").val(), ",");
      const instructions = trimStringArray($("#create-section textarea#instructions").val(), ".");
      const author = username;
      if(!(name && series && type && ingredients && instructions)) {
        alert('missing required fields')
      }
      else {
      ajaxPostOrPut(url, httpMethod, JSON.stringify({
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
      window.setTimeout(() => {
        window.location.href = "recipes.html";
      }, 0)
    }
  });
}

/****** handle tab events ******/
function handleBasicTabClick() {
  $("#browse-section").on("click", "#basic-tab", e => {
    e.preventDefault();
    if($("#browse-section #ingredient-tab").hasClass("active") || $("#browse-section #instruction-tab").hasClass("active")) {
      $("#browse-section #ingredient-tab, #browse-section #instruction-tab").removeClass("active");
    }
    if(!$("#browse-section #ingred-supp").hasClass("hidden") || !$("#browse-section #instructions").hasClass("hidden")) {
      $("#browse-section #ingred-supp, #browse-section #instructions").addClass("hidden");
    }
    if(!$("#browse-section #basic-tab").hasClass("active")) {
      $("#browse-section #basic-tab").addClass("active");
    }
    if($("#browse-section #basic-info").hasClass("hidden")) {
      $("#browse-section #basic-info").removeClass("hidden");
    }
  });
}

function handleIngredientTabClick() {
  $("#browse-section").on("click", "#ingredient-tab", e => {
    e.preventDefault();
    if($("#browse-section #basic-tab").hasClass("active") || $("#browse-section #instruction-tab").hasClass("active")) {
      $("#browse-section #basic-tab, #browse-section #instruction-tab").removeClass("active");
    }
    if(!$("#browse-section #basic-info").hasClass("hidden") || !$("#browse-section #instructions").hasClass("hidden")) {
      $("#browse-section #basic-info, #browse-section #instructions").addClass("hidden");
    }
    if(!$("#browse-section #ingredient-tab").hasClass("active")) {
      $("#browse-section #ingredient-tab").addClass("active");
    }
    if($("#browse-section #ingred-supp").hasClass("hidden")) {
      $("#browse-section #ingred-supp").removeClass("hidden");
    }
  });
}

function handleInstructionTabClick() {
  $("#browse-section").on("click", "#instruction-tab", e => {
    e.preventDefault();
    if($("#browse-section #basic-tab").hasClass("active") || $("#browse-section #ingredient-tab").hasClass("active")) {
      $("#browse-section #basic-tab, #browse-section #ingredient-tab").removeClass("active");
    }
    if(!$("#browse-section #basic-info").hasClass("hidden") || !$("#browse-section #ingred-supp").hasClass("hidden")) {
      $("#browse-section #basic-info, #browse-section #ingred-supp").addClass("hidden");
    }
    if(!$("#browse-section #instruction-tab").hasClass("active")) {
      $("#browse-section #iinstruction-tab").addClass("active");
    }
    if($("#browse-section #instructions").hasClass("hidden")) {
      $("#browse-section #instructions").removeClass("hidden");
    }
  });
}

/****** handle edit ******/
function handleEditClick() {
  $("#edit, #edit2, .fa-pencil-square-o").on("click", e => {
    e.preventDefault();
    e.stopPropagation();
    $("section.row").empty();
    ajaxGetOrDelete(`/recipeauthor?author=${username}`, "GET", renderUserRecipes);
  });
}

function renderUserRecipes(data) {
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
      displaySearchResult($("#edit-section"),item)
    });
  }

function handleEditCardClick() {
  $("#edit-section").on("click", ".card img", function(e) {
    e.preventDefault();
    e.stopPropagation();
    const selector = $("#edit-section");
    const id = $(this).attr("data-id");
    const img = $(this).attr("src");
    $("section.row").empty();
    ajaxGetOrDelete(`/recipes/${id}`, "GET", renderEditForm);
    window.setTimeout(() => {
      handleAccordionClicks($("#edit-section"));
      clearBasicInfo($("#edit-section"));
      clearIngredientsSupplies($("#edit-section"));
      clearInstructions($("#edit-section"));
    }, 0);
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
  $("#edit-section #serving").val(item.serving);
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
    img
  } = item;

  renderCreateForm($("#edit-section"));
  window.setTimeout(() => {
    setEditInput(item);
    $("#edit-section h2").empty().text("Edit Recipe");
    $("#edit-section #basic-info-form").attr("data-id", item.id);
    $("#edit-section #basic-info-form").attr("data-img", item.img);
    $("#edit-section #options").append(`
      <button type="button" role="button" class="create-recipe-buttons coffee-background text-white pointer" id="delete-recipe">Delete</button>`);
  },0)
}

function handleCancelEditClick() {
  $("#edit-section").on("click", "#cancel-create", e => {
    e.preventDefault();
    e.stopPropagation();
    $("section.row").empty();
    window.setTimeout(() => {
      window.location.href = "/recipes.html";
    }, 0);
  });
}

function handleSubmitEditClick() {
  $("#edit-section").on("click", "#submit-create", e => {
    e.preventDefault();
    e.stopPropagation();
      let img = '';
      if($("#fileupload p:nth-child(3)").text()) {
        img = `/uploads/` + $("#fileupload p:nth-child(3)").text();
      }
      else {
        img = $("#edit-section #basic-info-form").attr("data-img");
      }
      let id = $("#edit-section #basic-info-form").attr("data-id");

      const name = $("#edit-section #title").val().trim();
      const series = $("#edit-section #series").val().trim();
      const serving = parseInt($("#edit-section #serving").val());
      const type = trimStringArray($("#edit-section #type").val(), ",");
      const prepTime = $("#edit-section #prep").val().trim();
      const cookTime = $("#edit-section #cook").val().trim();
      const supplies = trimStringArray($("#edit-section #supplies").val(), ",");
      const ingredients = trimStringArray($("#edit-section #ingredients").val(), ",");
      const instructions = trimStringArray($("#edit-section #instructions").val(), ".");
      const author = username;

      if(!(name && series && type && ingredients && instructions)) {
        alert('missing required fields')
      }
      else {
        ajaxPostOrPut(`/recipes/${id}`, "PUT", JSON.stringify({
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
      	}), createSuccess(`update request received`));
        window.location.href="/recipes.html";
      }
  })
}

function handleDeleteEditClick(){
  $("#edit-section").on("click", "#delete-recipe", e => {
    e.preventDefault();
    const id = $("#edit-section #basic-info-form").attr("data-id");
    ajaxGetOrDelete(`/recipes/${id}`, 'DELETE', function() {
      $("section.row").empty();
      alert("recipe deleted");
      window.location.href = "/recipes.html";
    });
  });
}

$(function() {
  $("#cross").hide();
	$("#smallscreen-nav").hide();
  handleHamburgerClick();
	handleCrossClick();
  handleSmallScreenNavClick();
  handleSearchClick()
  handleSearchSubmit();
  handleSearchCardClick();
  handleBasicTabClick();
  handleIngredientTabClick();
  handleInstructionTabClick();
  handleCreateClick();
  handleEditClick();
  handleEditCardClick();
  handleSubmitEditClick();
  handleCancelEditClick();
  handleDeleteEditClick();
});
