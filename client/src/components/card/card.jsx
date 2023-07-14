import style from "./card.module.css";

const card = (props) => {
    return(
        <div className={style.card}>
            <p>Name:{props.name}</p>
            <p>Summary:{props.summary}</p>
            <p>Steps:{props.steps}</p>
        </div>
    )
};

export default card;


// Este componente debe mostrar la info de cada usuario mapeado, pero ademas darnos un link para ir al detalle del usuario en cuestion.