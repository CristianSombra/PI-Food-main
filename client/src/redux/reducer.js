
const initialState = {
    recipes: [{
        "id": "96c744a0-dd73-41d4-9d54-d7ffc6e0abab",
        "name": "chipa",
        "image": "ruta/de/la/imagen.jpg",
        "summary": "las originales son las de mandioca",
        "healthScore": 10,
        "steps": "comer calentitas",
        "diets": [
            {
                "name": "dairy free"
            }
        ]
        },
        {
        "id": "a30e721c-f3c1-493c-859c-a9c2a6e91fbc",
        "name": "chips de cholocale",
        "image": "ruta/de/la/imagen.jpg",
        "summary": "Los mejores son los de Tante Sara",
        "healthScore": 14,
        "steps": "Geniales para la merienda",
        "diets": [
            {
                "name": "gluten free"
            }
        ]}
        ],
};


const rootReducer = (state = initialState, action) => {
    switch(action.type) {
        default:
            return { ...state }
    }
};


export default rootReducer;