import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CardItem from '../components/CardItem';
import "../styles/Cards.css"

function Recipe({ removeToken }) {
  const [recipes, setRecipes] = useState([]);

  const getRecipes = async() =>{
    const response = await fetch(`https://functions-cloud1-onlypans.harperdbcloud.com/local-api/recipe`)
    const newRecipes = await response.json();
    setRecipes(newRecipes);
  }

  

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <div>
      <Navbar active={'recipes'} removeToken={removeToken}/>
      <div className='img-wrapper'>      
      <div className="container">
        {recipes ? <h3>Welcome To Recipe Page</h3> : <h3>No Recipes Yet</h3>}
        <div className="recipes">
          {recipes.map(recipe => (
                <CardItem 
                    key={recipe.id}
                    src={recipe.photo}
                    title={recipe.title}
                    author={recipe.author}
                    desc={recipe.description}
                    ingr={recipe.ingredients}
                    inst={recipe.instructions}
                    tags={recipe.tags}
                />))}
        </div>
      </div>
      </div>
    </div>
  )
}

export default Recipe