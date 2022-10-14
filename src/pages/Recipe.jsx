import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CardItem from '../components/CardItem';
import { FaSearch } from 'react-icons/fa';
import { RiArrowGoBackFill } from 'react-icons/ri'
import Pagination from '@mui/material/Pagination';
import "../styles/Cards.css"


function Recipe({ removeToken }) {
  const [recipes, setRecipes] = useState([]);
  const [collections, setCollections] = useState([]);
  const [showRecipes, setShowRecipes] = useState([]);
  const [query, setQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(8);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = showRecipes.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(showRecipes.length / recordsPerPage)

  const getCollections = async () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    const response = await fetch(`https://functions-cloud1-onlypans.harperdbcloud.com/local-api/collections/${userToken[0].id}`)
    const newCollections = await response.json();
    setCollections(newCollections);
  };

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

    setCurrentPage(1);
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

    setCurrentPage(1);
    setShowRecipes(pomRecipes)
  }

  useEffect(() => {
    getRecipes();
    getCollections();
  }, []);

  return (
    <div className='img-wrapper'>
      <Navbar active={'recipes'} removeToken={removeToken} style={'30px'} />
      {/* <div className='img-wrapper'>       */}
      <div className="container">
        {showRecipes ? <h3>Search for your favourite recipe!</h3> : <h3>No Recipes Yet</h3>}
        {showRecipes.length !== recipes.length && <h6><RiArrowGoBackFill 
          size={30}
          style={{cursor: 'pointer'}} 
          onClick={() => setShowRecipes(recipes)}>
        </RiArrowGoBackFill> back to all recipes</h6>}
        <form className='form-cards' onSubmit={handleSubmit}>
          <input 
            className='input-cards'
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
                    createdat={recipe.__createdtime__}
                    collections={collections}
                    id={recipe.id}
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
      {/* </div> */}
    </div>
  )
}


export default Recipe