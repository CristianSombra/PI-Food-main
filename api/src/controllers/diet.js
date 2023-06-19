require('dotenv').config();
const { API_KEY } = process.env;
const { Diet } = require('../db');
const axios = require("axios");


async function getDiets(req, res) {
  try {
    const dietsApi = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true`);
    // console.log(dietsApi.data.results[0].diets);
    
    const diets = Object.values(dietsApi.data.results).flatMap((el) => el.diets);
    console.log(diets);
    const dietNames = diets.map((el) => el.diet);
    const uniqueDietNames = [...new Set(dietNames)];
    
    await Promise.all(
      uniqueDietNames.map(async (el) => {
        if (el !== undefined) {
          await Diet.findOrCreate({ where: { name: el } });
        }
      })
    );
      
    const allDiets = await Diet.findAll();
    res.send(allDiets);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = { getDiets };








// opción B



// async function getDiets(req, res) {
//   try {
//     const existingDiets = await Diet.findAll();

//     if (existingDiets.length === 0) {
//       const dietsApi = await axios.get(
//         `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&addRecipeInformation=true`
//       );

//       const diets = Object.values(dietsApi.data).map((el) => el);

//       const dietNames = diets.map((el) => el.diet);
//       console.log('dietNames:', dietNames);

//       await Promise.all(
//         dietNames.map((name) => {
//           if (name) { 
//             return Diet.create({ name });
//           }
//         })
//       );
//     }

//     const allDiets = await Diet.findAll();


//     res.send(allDiets);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error occurred while retrieving diets');
//   }
// }

// module.exports = { getDiets };




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























