import { useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { GiCookingPot } from "react-icons/gi"
import { Link } from "react-router-dom";
import "../styles/main.css";

function Navbar({active, removeToken, style}) {
	const navRef = useRef();

	const showNavbar = () => {
		navRef.current.classList.toggle("responsive_nav");
	};

	return (
		<header style={{marginTop: style}}>
			{/* <h3><GiCookingPot size={42}/>OnlyPans</h3> */}
			<h3><img src="data:image/png;base64,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"/> OnlyPans</h3>
			<nav ref={navRef}>
				<Link to="/" className={`${active === 'home' ? "active" : ""}`}>Home</Link>
				<Link to="/recipes" className={`${active === 'recipes' ? "active" : ""}`}>Recipes</Link>
				<Link to="/collections" className={`${active === 'collection' ? "active" : ""}`}>Collection</Link>
				<Link to="/shop-list" className={`${active === 'shop-list' ? "active" : ""}`}>Shop List</Link>
				<button className="btn--primary" onClick={removeToken}>Sign Out</button>
				<button
					className="nav-btn nav-close-btn"
					onClick={showNavbar}>
					<FaTimes />
				</button>
			</nav>
			<button className="nav-btn" onClick={showNavbar}>
				<FaBars />
			</button>
		</header>
	);
}

export default Navbar;


// import Button from 'react-bootstrap/Button';
// // import Container from 'react-bootstrap/Container';
// // import Form from 'react-bootstrap/Form';
// // import Nav from 'react-bootstrap/Nav';
// // import Navbar from 'react-bootstrap/Navbar';
// // import NavDropdown from 'react-bootstrap/NavDropdown';
// // import { Link } from 'react-router-dom';

// // function NavBar({query, setQuery, handleSubmit, removeToken }) {
// //   return (
// //     <Navbar bg="light" expand="lg">
// //       <Container fluid>
// //         <Navbar.Brand href="/">OnlyPans</Navbar.Brand>
// //         <Navbar.Toggle aria-controls="navbarScroll" />
// //         <Navbar.Collapse id="navbarScroll">
// //           <Nav
// //             className="me-auto my-2 my-lg-0"
// //             style={{ maxHeight: '100px' }}
// //             navbarScroll
// //           >
// //             <Link to="/">Home</Link>
// //             <Link to="/recipes">Recipes</Link>
// //             <NavDropdown title="Link" id="navbarScrollingDropdown">
// //               <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
// //               <NavDropdown.Item href="#action4">
// //                 Another action
// //               </NavDropdown.Item>
// //               <NavDropdown.Divider />
// //               <NavDropdown.Item href="#action5">
// //                 Something else here
// //               </NavDropdown.Item>
// //             </NavDropdown>
// //             <Button variant="outline-primary" size="sm" onClick={removeToken}>Log Out</Button>
// //           </Nav>
// //           <form onSubmit={handleSubmit}>
// //             <input 
// //                 value={query}
// //                 className="d-flex"
// //                 placeholder="Search Recipe"
// //                 name="query"
// //                 onChange={(event) => setQuery(event.target.value)}
// //             />   
// //             <input
// //                 disabled={!query}
// //                 type="submit"
// //                 className="outline-success"
// //                 value="Search"
// //             />
// //         </form>
// //           {/* <Form className="d-flex" onSubmit={handleSubmit}>
// //             <Form.Control
// //                 value={query}
// //                 type="search"
// //                 placeholder="Search"
// //                 className="me-2"
// //                 aria-label="Search"
// //                 onChange={event => setQuery(event.target.value)}
// //             />
// //             <Button variant="outline-success" >Search</Button>
// //           </Form> */}
// //         </Navbar.Collapse>
// //       </Container>
// //     </Navbar>
// //   );
// // }

// // export default NavBar;