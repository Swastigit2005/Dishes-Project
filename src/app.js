const apiKey = '6df3e98e11774dda8c65db3f3bf39608';

const recipes = [
    { name: "Pasta Primavera", ingredients: ["pasta", "vegetables", "olive oil"] },
    { name: "Vegetable Stir Fry", ingredients: ["vegetables", "soy sauce", "rice"] },
    { name: "Caprese Salad", ingredients: ["tomatoes", "mozzarella", "basil"] },
    { name: "Omelette", ingredients: ["eggs", "cheese", "vegetables"] },
    { name: "Smoothie", ingredients: ["banana", "yogurt", "honey"] },
    { name: "Butter Chicken", ingredients: ["chicken", "butter", "cream", "tomatoes"] },
    { name: "Palak Paneer", ingredients: ["spinach", "paneer", "cream", "spices"] },
    { name: "Chole Bhature", ingredients: ["chickpeas", "flour", "spices", "yogurt"] },
    { name: "Biryani", ingredients: ["rice", "chicken", "spices", "yogurt"] },
    { name: "Masala Dosa", ingredients: ["rice", "potatoes", "spices", "lentils"] },
    { name: "Samosa", ingredients: ["potatoes", "peas", "flour", "spices"] },
    { name: "Gulab Jamun", ingredients: ["milk powder", "flour", "sugar", "rose water"] },
    { name: "Paneer Tikka", ingredients: ["paneer", "yogurt", "spices", "vegetables"] },
    { name: "Rajma", ingredients: ["kidney beans", "tomatoes", "spices", "onions"] },
    { name: "Aloo Gobi", ingredients: ["potatoes", "cauliflower", "spices", "tomatoes"] },
    { name: "Aloo Paratha", ingredients: ["potatoes", "flour", "spices", "butter"] },
    { name: "Aloo Tikki", ingredients: ["potatoes", "peas", "spices", "breadcrumbs"] },
    { name: "Aloo Matar", ingredients: ["potatoes", "peas", "spices", "tomatoes"] },
    { name: "Aloo Puri", ingredients: ["potatoes", "flour", "spices", "oil"] },
    { name: "Aloo Bhindi", ingredients: ["potatoes", "okra", "spices", "onions"] },
    { name: "Chicken Tikka Masala", ingredients: ["chicken", "yogurt", "spices", "tomatoes"] },
    { name: "Dal Makhani", ingredients: ["lentils", "butter", "cream", "spices"] },
    { name: "Pav Bhaji", ingredients: ["potatoes", "peas", "tomatoes", "spices"] },
    { name: "Kheer", ingredients: ["rice", "milk", "sugar", "cardamom"] },
    { name: "Rogan Josh", ingredients: ["lamb", "yogurt", "spices", "tomatoes"] },
    { name: "Pani Puri", ingredients: ["flour", "potatoes", "chickpeas", "spices"] },
    { name: "Dhokla", ingredients: ["gram flour", "yogurt", "spices", "lemon"] },
    { name: "Malai Kofta", ingredients: ["paneer", "potatoes", "cream", "spices"] },
    { name: "Chicken Korma", ingredients: ["chicken", "yogurt", "cream", "spices"] },
    { name: "Fish Curry", ingredients: ["fish", "coconut milk", "spices", "tomatoes"] }
];

async function fetchRecipesFromAPI(ingredients) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(',')}&number=10&apiKey=${apiKey}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.map(recipe => ({
            name: recipe.title,
            ingredients: recipe.usedIngredients.map(ingredient => ingredient.name).concat(recipe.missedIngredients.map(ingredient => ingredient.name))
        }));
    } catch (error) {
        console.error('Error fetching recipes from API:', error);
        return [];
    }
}

function findLocalRecipesByIngredients(ingredients) {
    const lowerCaseIngredients = ingredients.map(ingredient => ingredient.toLowerCase());
    return recipes.filter(recipe => 
        lowerCaseIngredients.every(ingredient => 
            recipe.ingredients.map(ing => ing.toLowerCase()).includes(ingredient)
        )
    );
}

function clearHistory() {
    document.getElementById('recipe-results').innerHTML = '';
}

async function findRecipes() {
    const ingredientInput = document.getElementById('ingredient-input').value;
    const ingredients = ingredientInput.split(',').map(ingredient => ingredient.trim());
    const localRecipes = findLocalRecipesByIngredients(ingredients);
    const apiRecipes = await fetchRecipesFromAPI(ingredients);
    const foundRecipes = [...localRecipes, ...apiRecipes];
    
    const recipeList = document.getElementById('recipe-results');
    recipeList.innerHTML = "";
    if (foundRecipes.length > 0) {
        foundRecipes.forEach(recipe => {
            const listItem = document.createElement("div");
            listItem.innerHTML = `<strong>${recipe.name}</strong><br>Ingredients: ${recipe.ingredients.join(', ')}`;
            recipeList.appendChild(listItem);
        });
    } else {
        recipeList.innerHTML = "<div>No recipes found</div>";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("find-recipes");
    searchButton.addEventListener("click", findRecipes);
});