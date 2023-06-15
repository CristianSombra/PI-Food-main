require('dotenv').config();
const { Recipe, Diet } = require('../db.js');
const axios = require('axios');
const { API_KEY } = process.env;

function getRecipeByName(req, res, next) {
	const nameQuery = req.query.name;
	var remoteRecipes = [];
	var localRecipes = [];
	if (nameQuery) {
	  axios
		.get(
		  `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&query=${nameQuery}&number=100`
		)
		.then((apiResponse) => {
		  remoteRecipes = apiResponse.data.results.filter((recipe) => {
			return recipe.title.toLowerCase().includes(nameQuery);
		  }).map((recipe) => {
			return {
			  id: recipe.id,
			  name: recipe.title,
			  image: recipe.image,
			  summary: recipe.summary,
			  healthScore: recipe.healthScore,
			  steps: recipe.analyzedInstructions[0]?.steps.map(step => step.step),
			};
		  });
		  return Recipe.findAll({ include: [Diet] });
		})
		.then((localResponse) => {
		  localRecipes = localResponse.filter((recipe) => {
			return recipe.title.toLowerCase().includes(nameQuery);
		  }).map((recipe) => {
			return {
			  id: recipe.id,
			  name: recipe.title,
			  image: recipe.image,
			  summary: recipe.summary,
			  healthScore: recipe.healthScore,
			  steps: recipe.steps
			};
		  });
		  return res.json([...localRecipes, ...remoteRecipes].slice(0, 9));
		})
		.catch((error) => next(error));
	} else {
	  axios
		.get(
		  `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true&number=100`
		)
		.then((apiResponse) => {
		  remoteRecipes = apiResponse.data.results.map((recipe) => {
			return {
			  id: recipe.id,
			  name: recipe.title,
			  image: recipe.image,
			  summary: recipe.summary,
			  healthScore: recipe.healthScore,
			  steps: recipe.analyzedInstructions[0]?.steps.map(step => step.step),
			};
		  });
		  return Recipe.findAll({ include: [Diet] });
		})
		.then((localResponse) => {
		  localRecipes = localResponse.map((recipe) => {
			return {
			  id: recipe.id,
			  name: recipe.title,
			  image: recipe.image,
			  summary: recipe.summary,
			  healthScore: recipe.healthScore,
			  steps: recipe.steps
			};
		  });
		  return res.json([...localRecipes, ...remoteRecipes]);
		})
		.catch((error) => next(error));
	}
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
				});
			})
			.catch((error) => next(error));
	}
}

function createRecipe(req, res, next) {
	const { title, summary, score, healthScore, instructions, diets } = req.body;
	Recipe.create({
		title,
		image: '',
		summary,
		score: parseFloat(score),
		healthScore: parseFloat(healthScore),
		instructions,
	})
		.then((recipeCreated) => {
			return recipeCreated.setDiets(diets);
		})
		.then(newRecipe => {
			return res.json({
				message: 'Recipe created successfully',
			});
		})
		.catch((error) => next(error));
}

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
