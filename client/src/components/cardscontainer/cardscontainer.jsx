import Card from "../card/card"
import style from "./cardscontainer.module.css";
import { useSelector } from "react-redux"; 


const CardsContainer = () => {
    
    const recipes = useSelector(state => state.recipes);
    
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


export default CardsContainer;




// Este componente debe tomar un array de usuarios, y por cada usuario, renderizar  un componente Card