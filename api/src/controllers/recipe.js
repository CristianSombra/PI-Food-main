const { Recipe, Diet } = require("../db");
const { Op } = require("sequelize");

// GET /recipes/:idRecipe
const getRecipeById = async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findByPk(id, { include: Diet });
    if (recipe) {
      res.json(recipe);
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /recipes/name?="..."
const getRecipesByName = async (req, res) => {
  const { name } = req.query;
  try {
    const recipes = await Recipe.findAll({
      where: { name: { [Op.iLike]: `%${name}%` } },
      include: Diet,
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
