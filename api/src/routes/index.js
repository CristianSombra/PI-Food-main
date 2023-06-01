const { Router } = require('express');
const { getRecipeById, getRecipesByName, createRecipe } = require('../controllers/recipe');
const { getDiets } = require('../controllers/diet');


// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');



const router = Router();

router.get('/recipes/:id', getRecipeById);
router.get('/recipes/name', getRecipesByName);
router.post('/recipes', createRecipe);
router.get('/diets', getDiets);


// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

// GET /recipes/:idRecipe

module.exports = router;
