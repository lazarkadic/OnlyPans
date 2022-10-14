import Navbar from '../components/Navbar';
import bg1 from "../assets/img/bg5.jpg";
import logo from "../assets/img/intro-logo.png";
import "../styles/Home.css";


function Home({ removeToken }) {
  return (
    <>
      <div style={myStyle} className='img-container-bg'>
        <Navbar active={'home'} removeToken={removeToken} style={''} />
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          {/* <h3 style={{color: 'whitesmoke'}}>WELCOME TO HOME PAGE</h3> */}
          <img src={logo} alt="" width="175" height="173" className='img-logo'></img>
          <div className='reflected'>
            <div>Welcome</div>
            <div>Welcome</div>
          </div>
          <p style={{marginTop: '-70px', color: 'white', fontSize: '106%'}}>OnlyPans is a simple library of all your recipes.
            <br />
          Add one in just a few taps, find it in seconds later – anywhere. </p>
        </div>
      </div>
    </>
  )
}

const myStyle={
  backgroundImage:`url(${bg1})`,
  height:'100vh',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

export default Home