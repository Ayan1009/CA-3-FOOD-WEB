const searchForm = document.getElementById("sub");
const searchInput = document.getElementById("search");
const randomButton = document.getElementById("random");
const randomHeading = document.getElementById("random-heading");
const categoryHeading = document.getElementById("category-heading");
const searchResults = document.getElementById("search-results");
const randomMeal = document.getElementById("random-meal");
const modalContainer = document.getElementById("modal-container");
const modalTitle = document.getElementById("modal-title");
const modalIngredients = document.getElementById("modal-ingredients");

searchForm.addEventListener("submit", findMeal);
randomButton.addEventListener("click", getRandomMeal);

async function findMeal(event) {
    event.preventDefault();
    const item = searchInput.value.trim();

    if (item) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${item}`);
            const data = await response.json();

            if (!data.meals) {
                categoryHeading.textContent = "No category found";
                searchResults.innerHTML = '';
            } else {
                categoryHeading.textContent = `Search Results: ${item.toUpperCase()}`;
                displayMeals(data.meals);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    } else {
        alert("Please enter a food category");
    }
}

function displayMeals(meals) {
    randomHeading.textContent = ""; 
    let html = '';
    for (let meal of meals) {
        html += `
            <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="meal-info">${meal.strMeal}</div>
            </div>
        `;
    }
    searchResults.innerHTML = html;
}

async function getRandomMeal() {
    try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
        const data = await response.json();
        displayRandomMeal(data.meals[0]);
    } catch (error) {
        console.error('Error fetching random meal:', error);
    }
}

function displayRandomMeal(meal) {
    categoryHeading.textContent = ""; 
    randomHeading.textContent = `Random Meal: ${meal.strCategory.toUpperCase()}`;
    randomMeal.innerHTML = `
        <div class="meal" id="random-meal-item">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <div class="meal-info">${meal.strMeal}</div>
        </div>
    `;

    const randomMealItem = document.getElementById("random-meal-item");
    if (randomMealItem) {
        randomMealItem.addEventListener("click", function(event) {
            if (event.target.tagName === "IMG") {
                modalTitle.textContent = meal.strMeal;
                modalIngredients.innerHTML = getIngredientsList(meal);
                modalContainer.style.display = "flex";
            }
        });
    } 
}

function getIngredientsList(meal) {
    let ingredientsList = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal['strIngredient' + i];
        if (ingredient) {
            ingredientsList += `<li>${ingredient}</li>`;
        }
    }
    return ingredientsList;
}

const closeModal = document.querySelector(".close");
closeModal.addEventListener("click", function() {
    modalContainer.style.display = "none";
});
