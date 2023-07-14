import Card from "../card/card"
import style from "./cardscontainer.module.css";

// const recipes = useSelector(state=>state.recipes);

const cardsContainer = () => {
    
    
    const recipes = [{
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
    ];
    
    return(
        <div className={style.container}>
            {recipes.map(recipe => {
                return <Card 
                    id={recipe.id}
                    name={recipe.name}
                    image={recipe.image}
                    summary={recipe.summary}
                    healthScore={recipe.healthScore}
                    steps={recipe.steps}
                    diets={recipe.diets}
                />
            })}
        </div>
    )
};


export default cardsContainer;




// Este componente debe tomar un array de usuarios, y por cada usuario, renderizar  un componente Card