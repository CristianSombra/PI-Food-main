const { Router } = require('express');
const { getAllInfo  } = require('../../controllers/recipe');
const { Diet, Recipe } = require('../../db');

const router = Router();


/* GET /recipes?name="..." */
router.get('/', async (req, res) => {
  const { name } = req.query;
  const allInfo = await getAllInfo();

  if (name) {
    const searchResults = allInfo.filter(recipe => recipe.name.toLowerCase().includes(name.toLowerCase()));
    searchResults.length 
      ? res.status(200).json(searchResults)
      : res.status(404).json('Recipe not found');
  } else {
    res.status(200).json(allInfo);
  }
});
  
  /* GET /recipes/{idReceta} */
  router.get('/:id', async (req, res) => {
    try {
      const id = req.params.id
      const allInfo = await getAllInfo()
      const detail = allInfo.find(recipe => recipe.id == id)
      detail
        ? res.status(200).json(detail)
        : res.status(404).json('Recipe not found')
    } catch (e) {
      console.log('error get /recipes/:id', e);
      res.status(400).json('Something went wrong')
    }
  })


  
  router.post('/', async (req, res) => {
    try {
        const { name, image, summary, healthScore, steps, diets } = req.body;
        const newRecipe = await Recipe.create({
            name,
            image,
            summary,
            healthScore,
            steps,
        })

        let dietTypesRecipeDb = await Diet.findAll({
            where: {name: diets}
        })
        newRecipe.addDiet(dietTypesRecipeDb)
        res.status(200).send(newRecipe)  
    } catch (error) {
      res
      .status(404)
      .json("The POST could not be done")
    };
});

    
module.exports = router;