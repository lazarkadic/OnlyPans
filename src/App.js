// import { GiBerriesBowl } from 'react-icons/gi';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home';
import Auth from './components/Auth';
import User from './components/User';
import Recipes from './components/Recipes';
import useToken from './components/useToken';
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';

const defaultUser = { first_name: '', email: '', password: '' }
const searchApi = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

function App() {
  const { token, setToken } = useToken();
  const [users, setUser] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [filter, setFilter] = useState('');
  const [query, setQuery] = useState('');
  const [newUser, setNewUser] = useState(defaultUser);
  const [newUserResponse, setNewUserResponse] = useState('');

  const addUser = async (e) => {
    e.preventDefault();

    const response = await fetch('https://functions-cloud1-onlypans.harperdbcloud.com/local-api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        operation: 'insert',
        schema: 'onlypans',
        table: 'user',
        records: [newUser]
      })
    });

    const result = await response.json();
    setNewUserResponse(result.message);
    setNewUser(defaultUser);
  }

  const searchRecipes = async () => {
    const url = searchApi + query
    const res = await fetch(url);
    const data = await res.json();
    setRecipes(data.meals);
    console.log(recipes);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    searchRecipes();
  }

  // const klik = ()=>{
  //   alert("GiBerriessss")
  // }

  useEffect(() => {
    const getUsers = async() => {
      const response = await fetch(filter.length ? `https://functions-cloud1-onlypans.harperdbcloud.com/local-api/user/${filter}` : `https://functions-cloud1-onlypans.harperdbcloud.com/local-api/user`)
      const newUsers = await response.json();
      setUser(newUsers);
    }
    const getRecipes = async() =>{
      const response = await fetch(`https://functions-cloud1-onlypans.harperdbcloud.com/local-api/recipe`)
      const newRecipes = await response.json();
      setRecipes(newRecipes);
    }

    getUsers();
    getRecipes();
    //searchRecipes();
  }, [filter, newUserResponse]);

  if(!token) {
    //console.log("Token: " + token)
    return <Auth setToken={setToken} />
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Auth />} /> */}
        <Route path="/home" element={<Home users={users} query={query} setQuery={setQuery} handleSubmit={handleSubmit}/>} />
        <Route path="/recipes" element={<Recipes recipes={recipes} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
