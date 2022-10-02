import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import "../styles/Collections.css";

function Collection({ removeToken }) {
  const [collections, setCollections] = useState([]);

  const getCollections = async() => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    console.log(userToken[0].id)
    const response = await fetch(`https://functions-cloud1-onlypans.harperdbcloud.com/local-api/collections/${userToken[0].id}`)
    const newCollections = await response.json();
    setCollections(newCollections);
    console.log(newCollections)
  };

  useEffect(() => {
    getCollections();
  }, []);

  return (
    <div>
      <Navbar active={'collection'} removeToken={removeToken}/>
      <div className='img-wrapper'>      
        <div className="container">
          <h3>Welcome To Collection Page</h3>
          {collections.length == 0 ? <h3>Let's make some new collections!</h3> : <h3>You alredy have collections</h3>}
          {/* {collections.length !== 0 && collections.map((el) => {
            return (<div key={el.id} >
              <p>{el.name}</p>
              <p>{el.description}</p>
              <p>{el.color}</p>
            </div>) 
          })} */}
          {collections.length !== 0 && <div className={'no-collections'}>
            
          </div>}
        </div>
      </div>
    </div>
  )
}

export default Collection