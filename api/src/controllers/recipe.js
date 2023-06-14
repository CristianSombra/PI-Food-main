require('dotenv').config();
const axios = require("axios");
const { Diet, Recipe } = require("../db.js");
const { API_KEY } = process.env;


//TRAIGO LOS DATOS DE LA API Y LO DEVUELVO EN EN UN OBJETO JSON
const getApiInfo = async () => {
  const res = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`);
  const apiInfo = await res.data.results.map(recipe => {
    return {
      id: recipe.id,
      name: recipe.title,
      image: recipe.image,
      summary: recipe.summary,
      healthScore: recipe.healthScore,
      steps: recipe.analyzedInstructions[0]?.steps.map(step => step.step),
      diets: recipe.diets.map(diet => diet[0].toUpperCase() + diet.slice(1)).join(', '),
    }
  })
  return apiInfo
}


//TRAIGO TODOS LAS RECIPES CREADOS DESDE LA BASE DE DATOS EN LA TABLA recipe, Y QUE INCLUYA LA TABLA diets CON SU ATRIBUTO NAME
const getDBInfo = async () => {
  const recipe = await Recipe.findAll({
     include: {
         model: Diet,
         attributes: ['name'],
         through: {
             attributes: [],
         }, 
     }
 })

 const recipesDB = await recipe.map(data =>{
     return {
         id: data.id,
         name: data.title,
         image: data.image,
         healthScore: data.healthScore,
         summary: data.summary,
         steps: data.steps,
         createInDb: true,
         diets: data.diets.map(diet=> diet.name)
     }
 })
 return recipesDB
};

//TRAIGO TODOS LOS RECIPES, TANTO DE LA API COMO DE LA DB.
const getAllInfo = async () => {
  const apiInfo = await getApiInfo()
  const dbInfo = await getDBInfo()
  const allInfo = apiInfo.concat(dbInfo)
  return allInfo
}

module.exports = {
  getApiInfo,
  getDBInfo,
  getAllInfo,
}










// GET /recipes/:idRecipe
// const getRecipeById = async (req, res) => {
//   const { idRecipe } = req.params;
//   const URL = `https://api.spoonacular.com/recipes/${idRecipe}/information?apiKey=${API_KEY}`;
//   try {
//     const response = await axios.get(URL);
//     const recipe = response.data;
//     console.log(recipe);

//     const recipeData = {
//       id: recipe.id,
//       name: recipe.title,
//       image: recipe.image,
//       summary: recipe.summary,
//       healthScore: recipe.healthScore,
//       steps: recipe.instructions,
//     };

//     res.status(200).json(recipeData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Ha ocurrido un error al obtener la receta.' });
//   }
// };


// // GET /recipes/name?="..."
// const getRecipesByName = async (req, res) => {
//   const { name } = req.query;
//   const infoByName = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true=${name}`;
//   try {
//     const response = await axios.get(infoByName);
//     const recipe = response.data.name;
//     console.log(recipe);

//     const recipeData = {
//       id: recipe.id,
//       name: recipe.title,
//       image: recipe.image,
//       summary: recipe.summary,
//       healthScore: recipe.healthScore,
//       steps: recipe.analyzedInstructions.length > 0 ? recipe.analyzedInstructions[0].steps : ''
//     };

//     res.status(200).json(recipeData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Ha ocurrido un error al obtener las recetas.' });
//   }
// };


// // POST /recipes
// const createRecipe = async (req, res) => {
//   const { name, image, summary, healthScore, steps, diets } = req.body;
//   try {
//     const recipe = await Recipe.create({
//       name,
//       image,
//       summary,
//       healthScore,
//       steps,
//     });
//     await recipe.setDiets(diets);
//     res.status(201).json(recipe);
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// module.exports = {
//   getRecipeById,
//   getRecipesByName,
//   createRecipe,
// };
