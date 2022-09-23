import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';

function NavBar({query, setQuery, handleSubmit }) {
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/home">OnlyPans</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="/home">Home</Nav.Link>
            <Link to="/recipes">Recipes</Link>
            <NavDropdown title="Link" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action4">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action5">
                Something else here
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <form onSubmit={handleSubmit}>
            <input 
                value={query}
                className="d-flex"
                placeholder="Search Recipe"
                name="query"
                onChange={(event) => setQuery(event.target.value)}
            />   
            <input
                disabled={!query}
                type="submit"
                className="outline-success"
                value="Search"
            />
        </form>
          {/* <Form className="d-flex" onSubmit={handleSubmit}>
            <Form.Control
                value={query}
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                onChange={event => setQuery(event.target.value)}
            />
            <Button variant="outline-success" >Search</Button>
          </Form> */}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;