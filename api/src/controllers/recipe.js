require('dotenv').config();
const { API_KEY } = process.env;
const { Recipe } = require("../db");
const { Op } = require("sequelize");
const axios = require("axios");

// GET /recipes/:idRecipe
const getRecipeById = async (req, res) => {
  const { idRecipe } = req.params;
  const URL = `https://api.spoonacular.com/recipes/${idRecipe}/information?apiKey=${API_KEY}`;
  console.log('URL:', URL)
  try {
    const response = await axios.get(URL);
    const recipe = response.data;

    const recipeData = {
      id: recipe.id,
      name: recipe.name,
      image: recipe.image,
      summary: recipe.summary,
      healthScore: recipe.healthScore
    };

    res.status(200).json(recipeData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ha ocurrido un error al obtener la receta.' });
  }
};


// GET /recipes/name?="..."
const getRecipesByName = async (req, res) => {
  const { name } = req.query;
  try {
    const recipes = await Recipe.findAll({
      where: { name: { [Op.iLike]: `%${name}%` } }
    });
    if (recipes.length > 0) {
      res.json(recipes);
    } else {
      res.status(404).json({ message: 'No recipes found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /recipes
const createRecipe = async (req, res) => {
  const { name, image, summary, healthScore, steps, diets } = req.body;
  try {
    const recipe = await Recipe.create({
      name,
      image,
      summary,
      healthScore,
      steps,
    });
    await recipe.setDiets(diets);
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getRecipeById,
  getRecipesByName,
  createRecipe,
};
