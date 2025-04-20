
document.addEventListener('DOMContentLoaded', function() {
  const titreInput = document.getElementById('titre');
  const ingredientsInput = document.getElementById('ingredients');
  const instructionsInput = document.getElementById('instructions');
  const tempsInput = document.getElementById('temps');
  const saveButton = document.getElementById('saveButton');
  const recipeList = document.getElementById('recipeList');
  
  let recipes = [];
  let currentEditId = null;
  
  function loadRecipes() {
    const savedRecipes = localStorage.getItem('recipes');
    if (savedRecipes) {
      recipes = JSON.parse(savedRecipes);
      displayRecipes();
    } else {
      recipeList.innerHTML = '<div class="no-recipes">Aucune recette pour le moment.</div>';
    }
  }
  
  function saveRecipes() {
    localStorage.setItem('recipes', JSON.stringify(recipes));
    displayRecipes();
  }
  
  function generateId() {
    return 'r' + Date.now();
  }
  
  
  function displayRecipes() {
    if (recipes.length === 0) {
      recipeList.innerHTML = '<div class="no-recipes">Aucune recette pour le moment.</div>';
      return;
    }
    
    recipeList.innerHTML = '';
    recipes.forEach(recipe => {
      const recipeItem = document.createElement('li');
      recipeItem.className = 'recipe-item';
      
      let ingredientsList;
      try {
        ingredientsList = JSON.parse(recipe.ingredients);
      } catch (e) {
        ingredientsList = recipe.ingredients.split(',').map(item => item.trim());
      }
      
      const ingredientsHtml = ingredientsList.map(ingredient => 
        `<li>${ingredient}</li>`
      ).join('');
      
      recipeItem.innerHTML = `
        <div class="recipe-header">
          <h3 class="recipe-title">${recipe.titre}</h3>
          <div class="recipe-time">⏱️ ${recipe.temps}</div>
        </div>
        <div class="recipe-content">
          <div class="recipe-section">
            <h4>Ingrédients</h4>
            <ul class="ingredient-list">
              ${ingredientsHtml}
            </ul>
          </div>
          <div class="recipe-section">
            <h4>Instructions</h4>
            <p>${recipe.instructions}</p>
          </div>
        </div>
        <div class="recipe-actions">
          <button class="btn btn-warning edit-btn" data-id="${recipe.id}">Modifier</button>
          <button class="btn btn-danger delete-btn" data-id="${recipe.id}">Supprimer</button>
        </div>
      `;
      
      recipeList.appendChild(recipeItem);
    });
    
    document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', editRecipe);
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', deleteRecipe);
    });
  }
  
  function addOrUpdateRecipe() {
    const titre = titreInput.value.trim();
    const ingredients = ingredientsInput.value.trim();
    const instructions = instructionsInput.value.trim();
    const temps = tempsInput.value.trim();
    
    if (!titre || !ingredients || !instructions || !temps) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    const ingredientsArray = ingredients.split(',').map(item => item.trim());
    const ingredientsString = JSON.stringify(ingredientsArray);
    
    if (currentEditId) {
      const index = recipes.findIndex(recipe => recipe.id === currentEditId);
      if (index !== -1) {
        recipes[index] = {
          id: currentEditId,
          titre,
          ingredients: ingredientsString,
          instructions,
          temps
        };
        currentEditId = null;
        saveButton.textContent = 'Ajouter la recette';
      }
    } else {
      const newRecipe = {
        id: generateId(),
        titre,
        ingredients: ingredientsString,
        instructions,
        temps
      };
      recipes.push(newRecipe);
    }
    
    titreInput.value = '';
    ingredientsInput.value = '';
    instructionsInput.value = '';
    tempsInput.value = '';
    
    saveRecipes();
  }
  
  function editRecipe(event) {
    const recipeId = event.target.dataset.id;
    const recipe = recipes.find(r => r.id === recipeId);
    
    if (recipe) {
      titreInput.value = recipe.titre;
      
      let ingredientsList;
      try {
        ingredientsList = JSON.parse(recipe.ingredients);
        ingredientsInput.value = ingredientsList.join(', ');
      } catch (e) {
        ingredientsInput.value = recipe.ingredients;
      }
      
      instructionsInput.value = recipe.instructions;
      tempsInput.value = recipe.temps;
      
      currentEditId = recipeId;
      saveButton.textContent = 'Mettre à jour la recette';
      
      document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  function deleteRecipe(event) {
    const recipeId = event.target.dataset.id;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette recette?')) {
      recipes = recipes.filter(recipe => recipe.id !== recipeId);
      saveRecipes();
    }
  }
  
  saveButton.addEventListener('click', addOrUpdateRecipe);
  
  loadRecipes();
});