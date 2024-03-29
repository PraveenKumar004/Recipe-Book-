document.addEventListener('DOMContentLoaded', function() {
    const favoriteRecipesList = document.getElementById('favorite-recipes-list');

    const userEmail = sessionStorage.getItem('email');

    const userFavoriteRecipesKey = `${userEmail}_favoriteRecipes`;
    const favoriteRecipes = JSON.parse(localStorage.getItem(userFavoriteRecipesKey)) || [];

    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];

    if (favoriteRecipes.length === 0) {
        favoriteRecipesList.innerHTML = '<p>No favorite recipes yet.</p>';
    } else {
        favoriteRecipes.forEach(recipeId => {
            const recipe = recipes.find(r => r.id === recipeId);
            if (recipe) {
                const recipeDiv = createRecipeDiv(recipe);
                favoriteRecipesList.appendChild(recipeDiv);
            }
        });
    }
});

function createRecipeDiv(recipe) {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe');

    recipeDiv.innerHTML = `
        <h3>${recipe.name}</h3>
        <img src="${recipe.imageUrl}" alt="Recipe Image">
        <p><strong>Ingredients:</strong></p>
        <ul>
            ${recipe.ingredients.map(ingr => `<li>${ingr}</li>`).join('')}
        </ul>
        <p><strong>Method:</strong></p>
        <p>${recipe.method}</p>
        <p id="average-rating-${recipe.id}">Average Rating: ${calculateAverageRating(recipe.id)}</p>
        <button class="remove-favorite-button" data-id="${recipe.id}">Remove from Favorites</button>
        <button class="rate-button" data-id="${recipe.id}">Rate</button>
    `;

    return recipeDiv;
}

function calculateAverageRating(recipeId) {
    const ratingsAndReviews = JSON.parse(localStorage.getItem('ratingsAndReviews')) || [];
    const ratingsForRecipe = ratingsAndReviews.filter(item => item.recipeId === recipeId.toString());

    if (ratingsForRecipe.length === 0) {
        return 'No ratings yet';
    }
    
    const totalRating = ratingsForRecipe.reduce((acc, curr) => acc + parseInt(curr.rating), 0);
    const averageRating = totalRating / ratingsForRecipe.length;
    return averageRating.toFixed(1);
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-favorite-button')) {
        const recipeId = parseInt(event.target.dataset.id);
        const userEmail = sessionStorage.getItem('email');
        const userFavoriteRecipesKey = `${userEmail}_favoriteRecipes`;

        let favoriteRecipes = JSON.parse(localStorage.getItem(userFavoriteRecipesKey)) || [];
        favoriteRecipes = favoriteRecipes.filter(id => id !== recipeId);
        localStorage.setItem(userFavoriteRecipesKey, JSON.stringify(favoriteRecipes));
        event.target.parentElement.remove(); // Remove the recipe div from the DOM
    } else if (event.target.classList.contains('rate-button')) {
        const recipeId = parseInt(event.target.dataset.id);
        const alreadyRated = checkIfAlreadyRated(recipeId);
        if (alreadyRated) {
            alert('You have already rated this recipe.');
        } else {
            window.location.href = `rate_review.html?recipeId=${recipeId}`;
        }
    }
});

function checkIfAlreadyRated(recipeId) {
    const ratingsAndReviews = JSON.parse(localStorage.getItem('ratingsAndReviews')) || [];
    return ratingsAndReviews.some(item => item.recipeId === recipeId.toString());
}
