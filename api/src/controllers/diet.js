require('dotenv').config();
const { API_KEY } = process.env;
const { Diet } = require('../db');
const axios = require('axios');

// let diets = [
//     {name: 'Gluten free'},
//     {name: 'Ketogenic'},
//     {name: 'Vegetarian'},
//     {name: 'Lacto-vegetarian'},
// 	{name: 'Lacto ovo vegetarian'},
//     {name: 'Vegan'},
//     {name: 'Pescatarian'},
//     {name: 'Paleolithic'},
//     {name: 'Primal'},
// 	{name: 'Whole 30'}
// ];



async function getDiets(req, res) {
    try {
      const dietsApi = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true`);
      const diets = dietsApi.data.map((el) => el.diet);
      const dietEach = diets.flatMap((el) => el);
  
      await Promise.all(
        dietEach.map(async (el) => {
          await Diet.findOrCreate({ where: { name: el } });
        })
      );
  
      const allDiets = await Diet.findAll();
      res.send(allDiets);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }
  



module.exports = {getDiets};





// opcion A:

// async function getDiets (req, res) {
//     const dietsApi = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true`)
//     const diets = dietsApi.data.map (el => el.diet)
//     const dietEach = diets.map( el => {
//         for (let i=0; i < el.length; i++) return el[i]})
//     dietEach.forEach(el => {
//         Diet.findOrCreate({
//             where: { name:el }
//         });
//     });

//     const allDiets = await Diet.findAll();
//     res.send(allDiets)
// }

