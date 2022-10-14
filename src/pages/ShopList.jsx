import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { BsPlusSquare } from 'react-icons/bs';
import { MdCheckBoxOutlineBlank } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import "../styles/ShopList.css";

function ShopList({ removeToken }) {
  const [shopList, setShopList] = useState([]);
  const [item, setItem] = useState("");
  const userToken = JSON.parse(localStorage.getItem('token'));

  const getShopList = async () => {
    const response = await fetch(`https://functions-cloud1-onlypans.harperdbcloud.com/local-api/user/id/${userToken[0].id}`)
    const newShopList = await response.json();
    setShopList(newShopList[0].shop_list);
  };

  useEffect(() => {
    getShopList();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      id: userToken[0].id,
      shop_list: [item]
    }
    await fetch('https://functions-cloud1-onlypans.harperdbcloud.com/local-api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        operation: 'update',
        schema: 'onlypans',
        table: 'user',
        records: [data]
      })
    });

    setItem('');
    getShopList();
  }

  const addItem = async (event) => {
    event.preventDefault();

    shopList.push(item);
    const data = {
      id: userToken[0].id,
      shop_list: shopList
    }
    await fetch('https://functions-cloud1-onlypans.harperdbcloud.com/local-api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        operation: 'update',
        schema: 'onlypans',
        table: 'user',
        records: [data]
      })
    });

    setItem('');
    getShopList();
  }

  function removeElement(array, elem) {
    var index = array.indexOf(elem);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

  const deleteItem = async (item) => {
    removeElement(shopList, item);
    const data = {
      id: userToken[0].id,
      shop_list: shopList
    }
    await fetch('https://functions-cloud1-onlypans.harperdbcloud.com/local-api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        operation: 'update',
        schema: 'onlypans',
        table: 'user',
        records: [data]
      })
    });

    setItem('');
    getShopList();
  }

  return (
    <div className='img-wrapper'>
      <Navbar active={'shop-list'} removeToken={removeToken} style={'30px'}/>
      {/* <div className='img-wrapper'> */}
        <div className='document'>
          <main className='main-shoplist'>
            <h1 className='h1-shoplist'><strong>Shop list</strong></h1>
            {shopList == null ? <div className='noelement-shoplist'>
              <h3>No groceries yet.</h3>
              <p>Keep a list of all the groceries you need to buy here.</p>
              <form onSubmit={handleSubmit} style={{ alignItems: 'center', marginTop: '20px' }}>
                <BsPlusSquare />
                <input
                  className='form-input-sl'
                  type="search"
                  value={item}
                  onChange={(event) => setItem(event.target.value)}
                  placeholder='Add an item...'
                  required
                />
                <input type="submit" className="card-button" value="Save" style={{ width: '20%', padding: '0.25rem 0.75rem' }}></input>
              </form>
            </div>
              :
              <div>
                {shopList.map((el, ind) => {
                  return <div key={ind} className='item-div' onClick={() => deleteItem(el)}>
                    <MdCheckBoxOutlineBlank size={20} style={{ marginRight: '0.5rem' }} />
                    <span style={{ fontSize: '1.125rem', width: '100%' }}>{el}</span>
                    <div><RiDeleteBin6Line size={20} color='red' className='delete-icon' /></div>
                  </div>
                })}
                <form onSubmit={addItem} style={{ alignItems: 'center', marginTop: '20px' }}>
                  <BsPlusSquare />
                  <input
                    className='form-input-sl'
                    type="search"
                    value={item}
                    onChange={(event) => setItem(event.target.value)}
                    placeholder='Add an item...'
                    required
                  />
                  <input type="submit" className="card-button" value="Save" style={{ width: '20%', padding: '0.25rem 0.75rem' }}></input>
                </form>
              </div>
            }
          </main>
        </div>
      {/* </div> */}
    </div>
  )
}

export default ShopList