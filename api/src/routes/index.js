const { Router } = require('express');
const recipesRouter = require('../routes/internalRoutes/recipes');




// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

router.use('/recipes', recipesRouter);


// router.post('/recipes', createRecipe);
// router.get('/diets', getDiets);


// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

// GET /recipes/:idRecipe

module.exports = router;
