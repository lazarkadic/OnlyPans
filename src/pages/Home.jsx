import styled from 'styled-components';
import Navbar from '../components/Navbar';
import bg3 from "../assets/img/bg3.jpg";


function Home({ removeToken }) {
  return (
    <>
      <div>
        <Navbar active={'home'} removeToken={removeToken}/>
        <div style={myStyle}>
          <h3>WELCOME TO HOME PAGE</h3>
        </div>
      </div>
    </>
  )
}

const Wrapper = styled.div`
  background: palevioletred;
`;

const myStyle={
  backgroundImage:`url(${bg3})`,
  height:'100vh',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

// const style = {
//   width: '100%',
//   height: undefined,
//   aspectRatio: 1
// };

export default Home