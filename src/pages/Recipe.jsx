import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CardItem from '../components/CardItem';
import { FaSearch } from 'react-icons/fa';
import { RiArrowGoBackFill } from 'react-icons/ri'
import Pagination from '@mui/material/Pagination';
import "../styles/Cards.css"


function Recipe({ removeToken }) {
  const [recipes, setRecipes] = useState([]);
  const [showRecipes, setShowRecipes] = useState([]);
  const [query, setQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = showRecipes.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(showRecipes.length / recordsPerPage)


  const getRecipes = async() => {
    const response = await fetch(`https://functions-cloud1-onlypans.harperdbcloud.com/local-api/recipe`)
    const newRecipes = await response.json();
    setRecipes(newRecipes);
    setShowRecipes(newRecipes);
  }

  const searchRecipes = () => {
    const pomRecipes = recipes.filter((recipe) => {
      return recipe.title.toString().toLowerCase().includes(query.toLowerCase())
    })

    setShowRecipes(pomRecipes)
    setQuery('')
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    searchRecipes();
  }

  const handleBadgeClick = (el) => {
    const pomRecipes = recipes.filter((recipe) => {
      return recipe.tags.toString().toLowerCase().includes(el.target.textContent)
    })

    setShowRecipes(pomRecipes)
  }

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <div>
      <Navbar active={'recipes'} removeToken={removeToken}/>
      <div className='img-wrapper'>      
      <div className="container">
        {showRecipes ? <h3>Search for your favourite recipe!</h3> : <h3>No Recipes Yet</h3>}
        {showRecipes.length !== recipes.length && <RiArrowGoBackFill 
          size={30}
          style={{cursor: 'pointer'}} 
          onClick={() => setShowRecipes(recipes)}>
        </RiArrowGoBackFill>}
        <form action="" onSubmit={handleSubmit}>
          <input 
            type="search" 
            value={query} 
            onChange={(event) => setQuery(event.target.value)} 
            placeholder='e.g. pizza' 
            required
          />
          <FaSearch className="fa fa-search" onClick={handleSubmit}/>
        </form>
        <div className="recipes">
          {currentRecords.length !== 0 ? currentRecords.map(recipe => (
                <CardItem 
                    key={recipe.id}
                    src={recipe.photo}
                    title={recipe.title}
                    author={recipe.author}
                    desc={recipe.description}
                    ingr={recipe.ingredients}
                    inst={recipe.instructions}
                    tags={recipe.tags}
                    handleBadgeClick={handleBadgeClick}
                />)) 
              : <h3>Sorry, we don't have that recipe yet.</h3>}
        </div>
        {currentRecords.length !== 0 && <Pagination count={nPages}
          shape="rounded"
          onChange={(event, page) => {setCurrentPage(page)}}
          style={{position: 'relative', left: '40%'}}
        />}
      </div>
      </div>
    </div>
  )
}


export default Recipe