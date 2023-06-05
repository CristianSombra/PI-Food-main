const axios = require('axios');
const { API_KEY } = process.env;


const getAllRecipes = async (req, res) => {
    try {
      const response = await axios.get(`http://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true`);
      const recipes = response.data.results;
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  module.exports = { getAllRecipes };