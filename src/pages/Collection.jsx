import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import "../styles/Collections.css";



function ExampleModal(props) {

  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Make your collection</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form style={{ flexWrap: 'wrap' }} onSubmit={props.onSubmit}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Collection name</Form.Label>
            <Form.Control
              value={props.formDetails.name}
              type="text"
              placeholder="Breakfast"
              autoFocus
              onChange={(e) => props.formDetails.name += e.target.value}
            />
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="exampleForm.ControlTextarea1"
          >
            <Form.Label>Description</Form.Label>
            <Form.Control 
              value={props.formDetails.description}
              type="text" 
              placeholder="Low fat recipes"
              onChange={(e) => props.formDetails.description += e.target.value}
            />
          </Form.Group>
          <Form.Group
            className="mb-3"
            controlId="exampleForm.ControlTextarea1"
          >
            <Form.Label>Color</Form.Label>
            <Form.Control 
              value={props.formDetails.color}
              type="color"
              onChange={(e) => props.formDetails.color = e.target.value}
            />
          </Form.Group>
          {console.log(props.formDetails)}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" type="submit" onClick={props.onHide}>
          Close
        </Button>
        <Button variant="primary" type="submit" onClick={props.onSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function Collection({ removeToken }) {
  const formInitialDetails = {
    name: '',
    description: '',
    color: '#29335c'
  }

  const [collections, setCollections] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [formDetails, setFormDetails] = useState(formInitialDetails);
  

  const getCollections = async () => {
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

  const handleCollectionSubmit = () => {
    setModalShow(false)
    alert("Name: " + formDetails.name + " Desc: " + formDetails.description + " Color: " + formDetails.color);
  }

  return (
    <div>
      <Navbar active={'collection'} removeToken={removeToken} />
      <div className='img-wrapper'>
        <div className="container">
          {/* <h3>Welcome To Collection Page</h3>
          {collections.length == 0 ? <h3>Let's make some new collections!</h3> : <h3>You alredy have collections</h3>} */}
          {/* {collections.length !== 0 && collections.map((el) => {
            return (<div key={el.id} >
              <p>{el.name}</p>
              <p>{el.description}</p>
              <p>{el.color}</p>
            </div>) 
          })} */}
          {collections.length == 0 && 
          <div className='no-collections'>
            <h2>Let's make some collections!</h2>
            <p>Collections help you organize your recipes into groups,
              <br />
            such as pastas, snacks, or breakfast foods.</p>
            <button className="card-button" style={{width: '40%', marginLeft: '30%'}} onClick={() => setModalShow(true)}>Make a collection</button>

          </div>}
          <ExampleModal
            show={modalShow}
            onHide={() => setModalShow(false)}
            onSubmit={handleCollectionSubmit}
            formDetails={formDetails}
          />
        </div>
      </div>
    </div>
  )
}

export default Collection