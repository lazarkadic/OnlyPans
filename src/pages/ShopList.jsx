import Navbar from '../components/Navbar';

function ShopList({ removeToken }) {
  return (
    <div>
      <Navbar active={'recipes'} removeToken={removeToken}/>
      <h3>Welcome To ShopList Page</h3>
    </div>
  )
}

export default ShopList