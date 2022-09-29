import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Navbar from '../components/Navbar';

function RecipeInfo({  removeToken }) {
    const [recipe, setRecipe] = useState({});
    let urlParams = useParams();

    const getRecipe = async() => {
      const response = await fetch(`https://functions-cloud1-onlypans.harperdbcloud.com/local-api/recipe/${urlParams.id}`)
      const newRecipe = await response.json();
      setRecipe(newRecipe[0]);
    }
  
    useEffect(() => {
      getRecipe();
    }, []);
    
  return (
    <div>
      <Navbar active={'recipes'} removeToken={removeToken}/>
      <div className='img-wrapper'>
        <div className="container">
          {recipe ? <h3>Welcome To RecipeInfo Page</h3> : <h3>No Recipe Info</h3>}
          { <ul>Recipe:
              <li>Recipe ID: {recipe.id}</li>
              <li>Recipe Title: {recipe.title}</li>
              <li>Recipe Description: {recipe.description}</li>
              <li>Recipe Tags: {recipe.tags}</li>
              {/* <li>Recipe Tags: {recipe.tags && recipe.tags.map((tag) => {
                <Badge pill bg="warning" text="dark">
                  {tag}
                </Badge>
              })}</li> */}
              <li>Recipe Author: {recipe.author}</li>
          </ul> }
        </div>
      </div>
    </div>
  )
}

export default RecipeInfo