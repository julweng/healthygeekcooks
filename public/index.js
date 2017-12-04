/******* modal events *******/
function modalClose() {
	$(".modal").addClass("hidden");
}

function modalOpen() {
	$(".modal").removeClass("hidden");
}

function handleLogInClick() {
	$('#login1').on("click", e => {
		e.preventDefault();
		modalOpen();
	})
}

function handleSignupClick() {
	$('#signup1').on("click", e => {
		e.preventDefault();
		modalOpen();
	})
}

function handleCloseClick() {
	$('.close').on("click", e => {
		modalClose();
	})
}

function handleWindowClick() {
	$(window).on("click", e => {
		if(e.target.className == "modal") {
			modalClose();
		}
	})
}

function handleModalEvent() {
	handleLogInClick();
	handleSignupClick();
	handleCloseClick();
	handleWindowClick();
}

/******* handle signup *******/
function addUser(username, password, callback) {
  $.ajax({
    url: "/users",
    contentType: 'application/json',
    type: 'POST',
    dataType: 'json',
    data: JSON.stringify(
      {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password
      }
    ),
    success: function(data) {
      callback();
    },
    error: function(error) {
      let errorString = error.responseText.split(':')[1];
      let errorStringEdit = errorString.substring(1).slice(0, errorString.length -3)
      alert(errorStringEdit);
    }
  });
}
/*
$('#signup').submit(function(event) {
  const username = $('#signup2').find('#username').val();
  const password = $('#signup2').find('#password').val();
  addUser(username, password);
  return false;
});
*/

$(handleModalEvent());




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
