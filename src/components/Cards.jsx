import './Cards.css';
import CardItem from './CardItem';

function Cards({title, recipes}) {
    console.log(recipes)
  return (
    <div className='cards'>
      <h1>{title}</h1>
      <div className='cards__container'>
        {/* <div className='cards__wrapper'> */}
          {/* <ul className='cards__items'> */}
            {recipes.map(recipe => (
            <CardItem 
                key={recipe.id}
                src={recipe.photo}
                text={recipe.title}
                label={recipe.tags}
                path={recipe.id}
            />))}
          {/* </ul> */}
        {/* </div> */}
      </div>
    </div>
  );
}

export default Cards;