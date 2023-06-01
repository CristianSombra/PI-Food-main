const { Diet } = require("../db");
const axios = require('axios');

// GET /diets
const getDiets = async (req, res) => {
  try {
    const diets = await Diet.findAll();
    if (diets.length > 0) {
      res.json(diets);
    } else {
      const response = await axios.get('https://spoonacular.com/food-api/docs#Diets');
      const apiDiets = response.data;
      await Diet.bulkCreate(apiDiets);
      res.json(apiDiets);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getDiets,
};