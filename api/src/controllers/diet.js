const { Diet } = require("../db");
const axios = require('axios');

// GET /diets
const getDiets = async (req, res) => {
  try {
    let [diets, created] = await Diet.findOrCreate({
      where: {},
      defaults: { name: 'Default Diet' }
    });

    if (created) {
      const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true`);
      const { diets: apiDiets } = response.data;

      // Crear registros de dietas adicionales
      for (let dietName of apiDiets) {
        await Diet.findOrCreate({ where: { name: dietName } });
      }

      // Obtener todas las dietas actualizadas desde la base de datos
      diets = await Diet.findAll();
    }

    res.json(diets);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getDiets,
};