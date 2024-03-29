document.addEventListener('DOMContentLoaded', function() {

    const form = document.querySelector('#recipe-form');
    const searchBox = document.getElementById('search-box');
    const categorySelect = document.getElementById('category-select');
    let recipes = [];
    const recipeListContainer = document.getElementById('recipe-list');
    const noRecipesMessage = document.getElementById('no-recipes');
    let recipeIdCounter = 0;

    const defaultRecipes = [
        {
            name: 'Avocado Toast',
            imageUrl: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS_7j8PUtELsyNaYhKeWquURvUTO8av_cQQnwowdHOWR_3kZCuoV9sOnfIHddRU',
            ingredients: ['Avocado', 'Bread slices', 'Salt', 'Black pepper', 'Optional toppings: tomatoes, eggs, cheese'],
            method: '1. Toast the bread slices until golden brown.\n2. Mash the avocado in a bowl and season with salt and black pepper.\n3. Spread the mashed avocado onto the toasted bread slices.\n4. Add desired toppings like sliced tomatoes, fried eggs, or cheese.\n5. Serve immediately.',
            category: 'Breakfast',
            userEmail: 'example@example.com',
            ratings: []
        },
        {
            name: 'Quinoa Salad',
            imageUrl: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSxe5qVlWpKgKEy_pAwFYHEaQLrDmt20brA2Y7yfd8Ne8YoGmI4rQydC5tlRxkb',
            ingredients: ['Cooked quinoa', 'Cherry tomatoes, halved', 'Cucumber, diced', 'Red onion, finely chopped', 'Fresh parsley, chopped', 'Lemon juice', 'Olive oil', 'Salt', 'Black pepper'],
            method: '1. In a large bowl, combine cooked quinoa, cherry tomatoes, cucumber, red onion, and parsley.\n2. Drizzle with lemon juice and olive oil.\n3. Season with salt and black pepper to taste.\n4. Toss everything together until well combined.\n5. Chill in the refrigerator for at least 30 minutes before serving.',
            category: 'Lunch',
            userEmail: 'example@example.com',
            ratings: []
        },
        {
            name: 'Baked Salmon',
            imageUrl: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTWB11ndqupHlxAML-tD6nL8JvEUzDffgVU4KcpRjRa5WbN0Qi0VmvTTh6Fbx38',
            ingredients: ['Salmon fillets', 'Lemon slices', 'Fresh dill', 'Garlic, minced', 'Olive oil', 'Salt', 'Black pepper'],
            method: '1. Preheat the oven to 375°F (190°C).\n2. Place salmon fillets on a baking sheet lined with parchment paper.\n3. Drizzle olive oil over the salmon and season with minced garlic, salt, and black pepper.\n4. Place lemon slices on top of the salmon and sprinkle with fresh dill.\n5. Bake in the preheated oven for 12-15 minutes, or until the salmon is cooked through and flakes easily with a fork.\n6. Serve hot with your favorite side dishes.',
            category: 'Dinner',
            userEmail: 'example@example.com',
            ratings: []
        }
    ];
    if (localStorage.getItem('recipes')) {
        try {
            recipes = JSON.parse(localStorage.getItem('recipes'));
            recipes.forEach((recipe, index) => {
                if (!('id' in recipe) || typeof recipe.id !== 'number') {
                    recipe.id = recipeIdCounter++;
                } else {
                    recipeIdCounter = Math.max(recipeIdCounter, recipe.id + 1);
                }
            });
            
        } catch (error) {
            console.error('Error loading recipes from local storage:', error);
        }
    } else {
        recipes = defaultRecipes;
        localStorage.setItem('recipes', JSON.stringify(recipes));
    }
    displayRecipes();

    

    if (form) {
        form.addEventListener('submit', handleSubmit);
    }

    if (searchBox) {
        searchBox.addEventListener('input', handleSearch);
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', handleCategoryChange);
    }
    if (recipeListContainer) {
        recipeListContainer.addEventListener('click', function(event) {
            if (event.target.classList.contains('edit-button')) {
                handleEdit(event);
            } else if (event.target.classList.contains('delete-button')) {
                handleDelete(event);
            } else if (event.target.classList.contains('share-button')) {
                shareRecipe(event);
            }
        });
    }
    const showMyRecipesButton = document.getElementById('show-recipes-btn');
    if (showMyRecipesButton) {
        showMyRecipesButton.addEventListener('click', function() {
            const userEmail = sessionStorage.getItem('email');
            if (userEmail) {
                const userRecipes = recipes.filter(recipe => recipe.userEmail === userEmail);
                displayRecipes(userRecipes, true); // Pass true to indicate showing user's recipes
            }
        });
    }

    function handleSubmit(event) {
        event.preventDefault();

        const nameInput = document.querySelector('#recipe-name');
        const imageInput = document.querySelector('#recipe-image');
        const ingrInput = document.querySelector('#recipe-ingredients');
        const methodInput = document.querySelector('#recipe-method');
        const categorySelect = document.querySelector('#category-select');

        const name = nameInput.value.trim();
        const imageUrl = imageInput.value.trim();
        const ingredients = ingrInput.value.trim().split(',').map(i => i.trim());
        const method = methodInput.value.trim();
        const category = categorySelect.value.trim();
        const userEmail = sessionStorage.getItem('email');

        if (name && imageUrl && ingredients.length > 0 && method && category && userEmail) {
            const newRecipe = {
                id: recipeIdCounter++,
                name,
                imageUrl,
                ingredients,
                method,
                category,
                userEmail,
                ratings: []
            };
            
            recipes.push(newRecipe);
            nameInput.value = '';
            imageInput.value = '';
            ingrInput.value = '';
            methodInput.value = '';

            localStorage.setItem('recipes', JSON.stringify(recipes));
            
            displayRecipes();

            console.log('Your recipe has been added! Recipe ID:', newRecipe.id);
            localStorage.setItem('recipess', newRecipe.id);
            window.location.href = 'index.html';
        }
    }


    function handleCategoryChange(event) {
        const selectedCategory = event.target.value;
        if(selectedCategory === "All"){
            displayRecipes();
        }
        else{
            const filteredRecipes = recipes.filter(recipe => recipe.category === selectedCategory);
            displayRecipes(filteredRecipes);
        }
    }

    function handleSearch(event) {
        const query = event.target.value.trim();
        const filteredRecipes = recipes.filter(recipe => {
            return recipe.name.includes(query);
        });
        displayRecipes(filteredRecipes);
    }

    function displayRecipes(recipesToDisplay = recipes, showDeleteButton = false) {
        if (!recipeListContainer) {
            console.error('Recipe list container not found.');
            return;
        }

        recipeListContainer.innerHTML = '';

        if (recipesToDisplay.length === 0) {
            noRecipesMessage.style.display = 'block';
        } else {
            noRecipesMessage.style.display = 'none';

            recipesToDisplay.forEach(recipe => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');
                recipeDiv.style.width="300px";
                recipeDiv.style.height="500px";
                recipeDiv.style.overflowX="hidden";
                recipeDiv.innerHTML = `
                    <h2>${recipe.name}</h2>
                    <img src="${recipe.imageUrl}" alt="Recipe Image">
                    <p><strong>Ingredients:</strong></p>
                    <ul><span class='ingredients'>
                        ${recipe.ingredients.map(ingr => `<li>${ingr}</li>`).join('')}
                        </span></ul>
                    <p><strong>Method:</strong></p><span class='method'>
                    ${recipe.method.split('\n').map(step => `<p>${step}</p>`).join('')}
                    </span>
                    <p id="average-rating-${recipe.id}">Average Rating: ${calculateAverageRating(recipe.id)}</p>
                    <div class="interaction-buttons">
                        ${showDeleteButton ? `<button class="delete-button" data-id="${recipe.id}">Delete</button>` : ''}
                        <button class="rate-button" data-id="${recipe.id}">Rate</button>
                        <button class="show-reviews-button" data-id="${recipe.id}">Reviews</button>
                        <button class="add-favorite-button" data-id="${recipe.id}">Add Favorites</button>
                        ${showDeleteButton ? `<button class="edit-button" data-id="${recipe.id}">Edit</button>` : ''}
                    </div>
                `;

                recipeListContainer.appendChild(recipeDiv);
                
            });
            
            const rateButtons = document.querySelectorAll('.rate-button');
            rateButtons.forEach(button => {
                button.addEventListener('click', handleRate);
            });
            const deleteButtons = document.querySelectorAll('.delete-button');
            deleteButtons.forEach(button => {
                button.addEventListener('click', handleDelete);
            });
            const showReviewsButtons = document.querySelectorAll('.show-reviews-button');
            showReviewsButtons.forEach(button => {
                button.addEventListener('click', handleShowReviews);
            });
            const addFavoriteButtons = document.querySelectorAll('.add-favorite-button');
            addFavoriteButtons.forEach(button => {
                button.addEventListener('click', handleAddFavorite);
            });
            const editButtons = document.querySelectorAll('.edit-button');
            editButtons.forEach(button => {
                button.addEventListener('click', handleEdit);
            });
            
        }
    }

    const closeModalButton = document.getElementById('closeModal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', function() {
            const modal = document.getElementById('myModal');
            modal.style.display = 'none';
        });
    }

    window.onclick = function(event) {
        const modal = document.getElementById('myModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    window.redirectTo = function(url) {
        window.open(url, '_blank');
    };
        
    function printRecipe(recipeDiv) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
                                .map(link => link.outerHTML)
                                .join('');

            const contentToPrint = `
                <html>
                <head>
                    <title>Recipe</title>
                    ${styles}
                </head>
                <body>
                    ${recipeDiv.innerHTML}
                </body>
                </html>
            `;
            
            printWindow.document.open();
            printWindow.document.write(contentToPrint);
            printWindow.document.close();

            printWindow.print();
        } else {
            console.error('Could not open print window');
        }
    }

    function handleAddFavorite(event) {
        const recipeId = parseInt(event.target.dataset.id);
        const userEmail = sessionStorage.getItem('email');
        console.log('User Email:', userEmail);

        let favoriteRecipes = JSON.parse(localStorage.getItem(userEmail + '_favoriteRecipes')) || [];
        console.log('Current Favorite Recipes:', favoriteRecipes);

        if (!favoriteRecipes.includes(recipeId)) {
            favoriteRecipes.push(recipeId);
            localStorage.setItem(userEmail + '_favoriteRecipes', JSON.stringify(favoriteRecipes));
            console.log('Recipe added to favorites:', recipeId);
            alert('Recipe added to favorites!');
        } else {
            alert('Recipe is already in favorites!');
        }

        window.location.href = 'favorite_recipes.html';
    }


    function handleShowReviews(event) {
        const recipeId = parseInt(event.target.dataset.id);
        window.location.href = `reviews.html?recipeId=${recipeId}`;
    }

    function handleRate(event) {
        const recipeId = parseInt(event.target.dataset.id);
        const userEmail = sessionStorage.getItem('email');
        let ratingsAndReviews = JSON.parse(localStorage.getItem('ratingsAndReviews')) || [];
        
        // Check if the user has already rated the recipe
        const userRating = ratingsAndReviews.find(item => item.recipeId === recipeId.toString() && item.userEmail === userEmail);
        if (userRating) {
            alert('You have already rated this recipe.');
            return;
        }
    
        console.log('Rate button clicked for Recipe ID:', recipeId);
        // Proceed to the rate review page for the recipe
        window.location.href = `rate_review.html?recipeId=${recipeId}`;
    }
    
    
    
    
    

    function handleEdit(event) {
        var recipeDiv = event.target.closest('.recipe');
        if (!recipeDiv) {
            console.error('Recipe div not found for editing.');
            return;
        }
    
        var nameElement = recipeDiv.querySelector('h2');
        var imageElement = recipeDiv.querySelector('img');
        var ingredientsElement = recipeDiv.querySelector('.ingredients');
        var methodElement = recipeDiv.querySelector('.method');
    
        if (!nameElement || !imageElement || !ingredientsElement || !methodElement) {
            console.error('One or more elements not found for editing.');
            return;
        }
    
        var name = nameElement.textContent;
        var imageUrl = imageElement.getAttribute('src');
        var ingredients = Array.from(ingredientsElement.querySelectorAll('li')).map(li => li.textContent);
        var method = methodElement.textContent;
    
        nameElement.innerHTML = `<input type='text' value='${name}'>`;
        ingredientsElement.innerHTML = ingredients.map(ingr => `<input type='text' value='${ingr}'>`).join('<br>');
        methodElement.innerHTML = `<textarea>${method}</textarea>`;
    
        var imageUrlInput = document.createElement('input');
        imageUrlInput.type = 'text';
        imageUrlInput.value = imageUrl;
        imageElement.parentNode.replaceChild(imageUrlInput, imageElement);
    
        var recipeId = event.target.dataset.id;
    
        var saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.dataset.id = recipeId; 
        saveButton.addEventListener('click', function() {
            var newName = nameElement.querySelector('input').value;
            var newImageUrl = imageUrlInput.value;
            var newIngredients = Array.from(ingredientsElement.querySelectorAll('input')).map(input => input.value);
            var newMethod = methodElement.querySelector('textarea').value;
    
            nameElement.innerHTML = newName;
            imageElement.src = newImageUrl;
            ingredientsElement.innerHTML = newIngredients.map(ingr => `<li>${ingr}</li>`).join('');
            methodElement.innerHTML = `<p>${newMethod}</p>`;
    
            saveButton.remove();
    
            var recipeIndex = recipes.findIndex(recipe => recipe.id === parseInt(recipeId));
            
            if (recipeIndex !== -1) {
                recipes[recipeIndex].imageUrl = newImageUrl;
                recipes[recipeIndex].ingredients = newIngredients;
                recipes[recipeIndex].method = newMethod;
    
                localStorage.setItem('recipes', JSON.stringify(recipes));
            } else {
                console.error('Recipe not found for editing.');
            }
        });
    
        recipeDiv.appendChild(saveButton);
    }
    function handleDelete(event) {
        const recipeId = parseInt(event.target.dataset.id);
        
        recipes = recipes.filter(recipe => recipe.id !== recipeId);
        
        localStorage.setItem('recipes', JSON.stringify(recipes));

        const recipeDiv = event.target.closest('.recipe');
        if (recipeDiv) {
            recipeDiv.remove();
        } else {
            console.error('Recipe div not found for deletion.');
        }
    }
    

    function calculateAverageRating(recipeId) {
        const ratingsAndReviews = JSON.parse(localStorage.getItem('ratingsAndReviews')) || [];
        console.log('Ratings and Reviews:', ratingsAndReviews);
        
        const ratingsForRecipe = ratingsAndReviews.filter(item => item.recipeId === recipeId.toString());
        console.log('Ratings for Recipe', recipeId, ':', ratingsForRecipe);

        if (ratingsForRecipe.length === 0) {
            return 'No ratings yet';
        }
        
        const totalRating = ratingsForRecipe.reduce((acc, curr) => acc + parseInt(curr.rating), 0);
        const averageRating = totalRating / ratingsForRecipe.length;
        return averageRating.toFixed(1);
    }
    console.log(recipes)
});

