import Navbar from '../components/Navbar';
import bg1 from "../assets/img/bg1.jpg";
import "../styles/Home.css";


function Home({ removeToken }) {
  return (
    <>
      <div style={myStyle}>
        <Navbar active={'home'} removeToken={removeToken} style={''} />
        <div >
          {/* <h3 style={{color: 'whitesmoke'}}>WELCOME TO HOME PAGE</h3> */}
          <div className='reflected'>
            <div>Welcome</div>
            <div>Welcome</div>
          </div>
        </div>
      </div>
    </>
  )
}

const myStyle={
  backgroundImage:`url(${bg1})`,
  height:'50vh',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

export default Home