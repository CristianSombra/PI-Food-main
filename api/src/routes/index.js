const { Router } = require('express');
const router = Router();

const { getRecipeByName, getRecipeById, createRecipe } = require('../controllers/recipe');
const { getDiets } = require('../controllers/diet')

router.get('/recipes', getRecipeByName);
router.get('/recipes/:idReceta', getRecipeById);
router.post('/recipe', createRecipe);
router.get('/diets', getDiets);

module.exports = router;









// const { Router } = require('express');
// const recipesRouter = require('../routes/internalRoutes/recipes');




// // Importar todos los routers;
// // Ejemplo: const authRouter = require('./auth.js');

// const router = Router();

// router.use('/recipes', recipesRouter);


// // router.post('/recipes', recipesRouter);
// // router.get('/diets', getDiets);


// // Configurar los routers
// // Ejemplo: router.use('/auth', authRouter);

// // GET /recipes/:idRecipe

// module.exports = router;
