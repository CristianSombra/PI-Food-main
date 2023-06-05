const { Recipe } = require("../db");
const { Op } = require("sequelize");
const { API_KEY } = process.env;
const axios = require("axios");

// GET /recipes/:idRecipe
const getRecipeById = async (req, res) => {
  const { id } = req.params;

  const URL = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`;
  try {
    const response = await axios.get(URL);
    if (response.data) {
      const { id, title, image, summary, healthScore, analyzedInstructions } = response.data;

      const recipe = {
        id,
        name: title,
        image,
        summary,
        healthScore,
        steps: analyzedInstructions.map((instruction) => instruction.step),
      };

      res.json(recipe);
    } else {
      res.status(404).json({ message: "Recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
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
