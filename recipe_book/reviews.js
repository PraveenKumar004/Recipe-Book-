document.addEventListener('DOMContentLoaded', function() {
    
    const reviewsContainer = document.getElementById('reviews-container');

    if (reviewsContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const recipeId = parseInt(urlParams.get('recipeId'));

        const ratingsAndReviews = JSON.parse(localStorage.getItem('ratingsAndReviews')) || [];

        const recipeRatingsAndReviews = ratingsAndReviews.filter(item => item.recipeId === recipeId.toString());

        if (recipeRatingsAndReviews.length > 0) {
            reviewsContainer.innerHTML = '<ul>';
            recipeRatingsAndReviews.forEach(review => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <p><strong>User:</strong> ${review.name}</p>
                    <p><strong>Rating:</strong> ${review.rating}</p>
                    <p><strong>Review:</strong> ${review.review}</p>
                `;
                reviewsContainer.querySelector('ul').appendChild(listItem);
            });
            reviewsContainer.innerHTML += '</ul>';
        } else {
            reviewsContainer.innerHTML = '<p>No reviews yet.</p>';
        }
    } else {
        console.error('Reviews container not found.');
    }
});
