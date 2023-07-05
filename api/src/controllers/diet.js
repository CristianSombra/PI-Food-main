require('dotenv').config();
const { API_KEY } = process.env;
const { Diet } = require('../db');
const axios = require("axios");

async function getDiets(req, res) {
  try {
    const dietsApi = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true`);
    const diets = dietsApi.data.results.map((el) => el.diets || []).flat();
    
    const uniqueDietNames = [...new Set(diets)];
    const sortedUniqueDietNames = uniqueDietNames.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
    
    await Promise.all(
      sortedUniqueDietNames.map(async (el) => {
        if (el !== undefined) {
          await Diet.findOrCreate({ where: { name: el } });
        }
      })
    );
      
    const allDiets = await Diet.findAll({ order: [['name', 'ASC']] });
    res.send(allDiets);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}



module.exports = { getDiets };