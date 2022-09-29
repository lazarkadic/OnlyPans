import Navbar from '../components/Navbar';

function Collection({ removeToken }) {
  return (
    <div>
      <Navbar active={'collection'}/>
      <h3>Welcome To Collection Page</h3>
    </div>
  )
}

export default Collection