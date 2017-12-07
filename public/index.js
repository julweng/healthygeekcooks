'use strict';
/******* delcare constant variables *******/
const home = $("#home");
const modal = $(".modal");
const login1 = $("#login1");
const indexNavLinks = $("#home, #login1");
/******* responsive nav bar *******/
function responsiveNavBar() {
  $(window).on('resize', function(){
		if($(window).innerWidth() <= 640) {
      $("#icon").removeClass("hidden");
      navLinks.addClass("hidden");
    }
    else {
      $("#icon").addClass("hidden");
      navLinks.removeClass("hidden");
    }
  })
}

function handleHamburgerClick() {
  $("#icon").on("click", e => {
    e.preventDefault();
    if(navLinks.hasClass("hidden")) {
      navLinks.removeClass("hidden");
    }
    else {
      navLinks.addClass("hidden");
    }
  });
}

/******* modal events *******/
function handleLogInClick() {
	login1.on("click", e => {
		e.preventDefault();
		modal.removeClass("hidden");
	})
}

function handleSignupClick() {
	$("#signup1").on("click", e => {
		e.preventDefault();
		modal.removeClass("hidden");
	})
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
	handleLogInClick();
	handleSignupClick();
	handleCloseClick();
	handleWindowClick();
}

/******* make ajax call to server via api ******/
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
		alert("Thank you for signing up. Please log in.");
	} else if (status === 200) {
		// successful authentication
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
	const username = $("form #username").val();
	const password = $("form #password").val();
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
	$("#login2").click(e => {
		e.preventDefault();
		const formInfo = [...getForm()];
		login(formInfo[0], formInfo[1]);
    let username = formInfo[0];
    // set username to localStorage
    localStorage.setItem('username', username);
	})
}

$(function() {
	responsiveNavBar();
	handleModalEvent();
	handleSignUpSubmit();
	handleLogInSubmit();
  handleHamburgerClick();
});
