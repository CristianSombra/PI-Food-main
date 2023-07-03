require('dotenv').config();
const { API_KEY } = process.env;
const { Recipe, Diet } = require('../db.js');
const axios = require('axios');
const { Op } = require('sequelize');

function getRecipeByName(req, res, next) {
	const nameQuery = req.query.name;
	var remoteRecipes = [];
	var localRecipes = [];
  
	if (!nameQuery) {
	  return res.status(400).json({ error: 'La búsqueda no puede estar vacía' });
	}
	axios
	  .get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&query=${nameQuery}`)
	  .then((apiResponse) => {
		remoteRecipes = apiResponse.data.results.filter((recipe) => {
			return recipe.title.toLowerCase().indexOf(nameQuery.toLowerCase()) !== -1;
		}).map((recipe) => {
		  return {
			id: recipe.id,
			name: recipe.title,
			image: recipe.image,
			summary: recipe.summary,
			healthScore: recipe.healthScore,
			steps: recipe.analyzedInstructions[0]?.steps.map(step => step.step),
			diets: recipe.diets
		  };
		});
		return Recipe.findAll({ include: [Diet], where: { name: { [Op.iLike]: `%${nameQuery}%` } } });
	  })
	  .then((localResponse) => {
		localRecipes = localResponse.map((recipe) => {
		  return {
			id: recipe.id,
			name: recipe.name,
			image: recipe.image,
			summary: recipe.summary,
			healthScore: recipe.healthScore,
			steps: recipe.steps,
			diets: recipe.diets
		  };
		});
  
		const combinedRecipes = [...localRecipes, ...remoteRecipes].slice(0, 9);
  
		if (combinedRecipes.length === 0) {
		  return res.status(404).json({ message: "No se encontró la receta solicitada." });
		} else {
		  return res.json(combinedRecipes);
		}
	  })
	  .catch((error) => next(error));
}
 

function getRecipeById(req, res, next) {
	const id = req.params.idReceta;
	if (id.includes('-')) {
		Recipe.findByPk(id, { include: Diet }).then((recipe) => {
			return res.json(recipe);
		});
	} else {
		axios
			.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`)
			.then((response) => {
				return res.json({
					id: response.data.id,
					name: response.data.title,
					image: response.data.image,
					summary: response.data.summary,
					healthScore: response.data.healthScore,
					steps: response.data.instructions,
					diets: response.data.diets
				});
			})
			.catch((error) => next(error));
	}
}

async function createRecipe(req, res) {
	const { name, image, summary, healthScore, steps, diets } = req.body;
	const recipeCreated = await Recipe.create({
		name,
		image,
		summary,
		healthScore,
		steps,
	})
	console.log(recipeCreated);
	const dietDB = await Diet.findAll({
		where: { name: diets }
	})
	recipeCreated.addDiet(dietDB)
	res.send('Recipe created successfully')
};


module.exports = {
	getRecipeByName,
	getRecipeById,
	createRecipe,
};


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
