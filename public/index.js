
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
