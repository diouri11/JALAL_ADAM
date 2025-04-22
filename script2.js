document.addEventListener('DOMContentLoaded', function() {
// DOM elements
const titreInput = document.getElementById('titre');
const ingredientsInput = document.getElementById('ingredients');
const instructionsInput = document.getElementById('instructions');
const tempsInput = document.getElementById('temps');
const saveButton = document.getElementById('saveButton');
const recipeList = document.getElementById('recipeList');
const noRecipes = document.getElementById('noRecipes');

let recipes = [];
let currentEditId = null;

//load recipes from localStorage
function loadRecipes() {
    const savedRecipes = localStorage.getItem('recipes');
    if (savedRecipes) {
    recipes = JSON.parse(savedRecipes);
    displayRecipes();
    }
}

//save recipes to localStorage
function saveRecipes() {
    localStorage.setItem('recipes', JSON.stringify(recipes));
    displayRecipes();
}

//generate id
function generateId() {
    return 'r' + Date.now();
}

//display all recipes
function displayRecipes() {
    if (recipes.length === 0) {
    recipeList.innerHTML = '';
    noRecipes.style.display = 'block';
    return;
    }
    
    noRecipes.style.display = 'none';
    recipeList.innerHTML = '';
    
    recipes.forEach(recipe => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${recipe.titre}</td>
        <td>${recipe.ingredients}</td>
        <td>${recipe.instructions}</td>
        <td>${recipe.temps}</td>
        <td>
        <button class="btn btn-sm btn-warning edit-btn me-1" data-id="${recipe.id}">
            <i class="bi bi-pencil"></i> Modifier
        </button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${recipe.id}">
            <i class="bi bi-trash"></i> Supprimer
        </button>
        </td>
    `;
    
    recipeList.appendChild(row);
    });
    
    //edit and delete event listeners
    document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', editRecipe);
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', deleteRecipe);
    });
}

//add or update recipe
function addOrUpdateRecipe() {
    const titre = titreInput.value.trim();
    const ingredients = ingredientsInput.value.trim();
    const instructions = instructionsInput.value.trim();
    const temps = tempsInput.value.trim();
    
    if (!titre || !ingredients || !instructions || !temps) {
    alert('Veuillez remplir tous les champs');
    return;
    }
    
    if (currentEditId) {
    //update existing recipe
    const index = recipes.findIndex(recipe => recipe.id === currentEditId);
    if (index !== -1) {
        recipes[index] = {
        id: currentEditId,
        titre,
        ingredients,
        instructions,
        temps
        };
        currentEditId = null;
        saveButton.textContent = 'Ajouter la recette';
        saveButton.classList.remove('btn-success');
        saveButton.classList.add('btn-primary');
    }
    } else {
    //add new recipe
    const newRecipe = {
        id: generateId(),
        titre,
        ingredients,
        instructions,
        temps
    };
    recipes.push(newRecipe);
    }
    
    //clear form
    titreInput.value = '';
    ingredientsInput.value = '';
    instructionsInput.value = '';
    tempsInput.value = '';
    
    //save updated recipes
    saveRecipes();
}

//edit recipe
function editRecipe(event) {
    const recipeId = event.target.closest('.edit-btn').dataset.id;
    const recipe = recipes.find(r => r.id === recipeId);
    
    if (recipe) {
    titreInput.value = recipe.titre;
    ingredientsInput.value = recipe.ingredients;
    instructionsInput.value = recipe.instructions;
    tempsInput.value = recipe.temps;
    
    currentEditId = recipeId;
    saveButton.textContent = 'Mettre à jour la recette';
    saveButton.classList.remove('btn-primary');
    saveButton.classList.add('btn-success');
    
    document.querySelector('.bg-light').scrollIntoView({ behavior: 'smooth' });
    }
}

//delete a recipe
function deleteRecipe(event) {
    const recipeId = event.target.closest('.delete-btn').dataset.id;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cette recette?')) {
    recipes = recipes.filter(recipe => recipe.id !== recipeId);
    saveRecipes();
    }
}

//event listeners
saveButton.addEventListener('click', addOrUpdateRecipe);

loadRecipes();
});