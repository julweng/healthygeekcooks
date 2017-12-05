/******* delcare global variables *******/
let token = '';
const modal = $(".modal");
const logout = $("#logout");
const login1 = $("#login1");

/******* toggle hidden/show *******/
function hide(element) {
	element.addClass("hidden");
}

function show(element) {
	element.removeClass("hidden")
}

/******* modal events *******/
function handleLogInClick() {
	login1.on("click", e => {
		e.preventDefault();
		show(modal);
	})
}

function handleSignupClick() {
	$('#signup1').on("click", e => {
		e.preventDefault();
		show(modal);
	})
}

function handleCloseClick() {
	$('.close').on("click", e => {
		e.preventDefault();
		hide(modal);
	})
}

function handleWindowClick() {
	$(window).on("click", e => {
		e.preventDefault();
		if(e.target.className === "modal") {
			hide(modal);
		}
	})
}

function handleModalEvent() {
	handleLogInClick();
	handleSignupClick();
	handleCloseClick();
	handleWindowClick();
}

function api(url, type, data) {
	return $.ajax({
			url,
			type,
			data,
    	contentType: "application/json",
    	dataType: 'json',
		})
		.done(handleSuccess)
		.fail(handleError);
}

/******* handle ajax error *******/
function handleError(xhr) {
	let err = xhr.status;
	console.log(err);
	// for log in
	if(err === 401) {
		alert(`incorrect username or password`);
	}
	// for sign up
	else {
		alert(JSON.parse(xhr.responseText).message);
	}
}

/******* handle ajax done *******/
function handleSuccess(data, statusText, xhr) {
	// for successful signup
	const status = xhr.status;
	if (status === 201) {
		// successful signup
		alert('Thank you for signing up. Please log in.');
	} else if (status === 200) {
		// successful authentication
		let res = JSON.parse(xhr.responseText);
		token = res.authToken;
		// show log out link on navigation bar
		show(logout);
		hide(login1);
		// direct to recipes.html
		setTimeout(function() {
  	window.location.href = "recipes.html";
	}, 300);
	}
}

/******* handle login *******/
function login(username, password) {
	api("api/auth/login", "POST", JSON.stringify({
		username,
		password,
	}));
}

/******* handle signup *******/
function signup(username, password) {
	return api("api/users", "POST", JSON.stringify({
		username,
		password,
	}));
}

function getForm() {
	const username = $('form #username').val();
	const password = $('form #password').val();
	return [username, password];
}

function handleSignUpSubmit() {
	$("#signup2").click(e => {
		e.preventDefault();
		const formInfo = [...getForm()];
		signup(formInfo[0], formInfo[1]);
	})
}

function handleLogInSubmit() {
	$('#login2').click(e => {
		e.preventDefault();
		const formInfo = [...getForm()];
		login(formInfo[0], formInfo[1]);
	})
}

$(function() {
	handleModalEvent();
	handleSignUpSubmit();
	handleLogInSubmit();
});




/*
function getRecentRecipeUpdates(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
	setTimeout(function(){callbackFn(MOCK_RECIPE_UPDATES)}, 1);
}

// this function stays the same when we connect
// to real API later
function displayRecipeUpdates(data) {
    for (index in data.recipeUpdates) {
	   $('body').append(
        `<ul>
          <li>
          <h3>${data.recipeUpdates[index].name} by <span>${data.recipeUpdates[index].author}</span></h3>
          <p>${data.recipeUpdates[index].type}</p>
          </li>
        </ul>`);
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayRecipeUpdates() {
	getRecentRecipeUpdates(displayRecipeUpdates);
  getRecentRecipeUpdates(displayIngredients)
}

//  on page load do this
$(function() {
	getAndDisplayRecipeUpdates();
})
// Get the modal
var modal = document.getElementById('myModal');
*/
