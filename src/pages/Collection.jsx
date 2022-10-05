import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { BsPlusCircle } from 'react-icons/bs'
import "../styles/Collections.css";


function Collection({ removeToken }) {
  const formInitialDetails = {
    name: '',
    description: '',
    color: '#29335c',
    user_id: JSON.parse(localStorage.getItem('token'))[0].id
  }

  const [collections, setCollections] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [formDetails, setFormDetails] = useState(formInitialDetails);


  const getCollections = async () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    const response = await fetch(`https://functions-cloud1-onlypans.harperdbcloud.com/local-api/collections/${userToken[0].id}`)
    const newCollections = await response.json();
    setCollections(newCollections);
  };

  useEffect(() => {
    getCollections();
  }, []);

  const onFormUpdate = (category, value) => {
    setFormDetails({
      ...formDetails,
      [category]: value
    })
  }

  const handleCollectionSubmit = async (event) => {
    event.preventDefault();
    setModalShow(false)
    if (formDetails.name === '') {
      alert('Please enter name.')
      return
    }

    if (formDetails.description === '') {
      alert('Please enter description.')
      return
    }

    await fetch('https://functions-cloud1-onlypans.harperdbcloud.com/local-api/collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        operation: 'insert',
        schema: 'onlypans',
        table: 'collections',
        records: [formDetails]
      })
    });

    setFormDetails(formInitialDetails);
    getCollections();
  }

  return (
    <div>
      <Navbar active={'collection'} removeToken={removeToken} />
      <div className='img-wrapper'>
        <div className="container">
          {collections.length === 0 &&
            <div className='no-collections'>
              <h2>Let's make some collections!</h2>
              <p>Collections help you organize your recipes into groups,
                <br />
                such as pastas, snacks, or breakfast foods.</p>
              <button className="card-button" style={{ width: '40%', marginLeft: '30%' }} onClick={() => setModalShow(true)}>Make a collection</button>
            </div>
          }
          {collections.length !== 0 &&
            <div className='has-collections'>
              <aside className='col-aside'>
                <h1>Collections</h1>
                <button className="card-button" style={{ width: '60%', marginLeft: '20%', marginTop: '15px' }} onClick={() => setModalShow(true)}><BsPlusCircle size={25} /> New collection</button>
              </aside>
              <article className='col-article'>
                {collections.map((el) => {
                  return <div key={el.id} className='col-div' style={{ backgroundColor: el.color, opacity: '0.9' }}>
                    <a href="" style={{ textDecoration: 'none', color: 'white', textShadow: '2px 2px 4px #000000' }}>
                      <h2 className='left-style'>{el.name}</h2>
                      <p className='left-style'>{el.description}</p>
                    </a>
                  </div>
                })}
              </article>
            </div>
          }
          <Modal show={modalShow} onHide={() => setModalShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Make your collection</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form style={{ flexWrap: 'wrap' }} onSubmit={handleCollectionSubmit}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Collection name</Form.Label>
                  <Form.Control
                    value={formDetails.name}
                    type="text"
                    placeholder="Breakfast"
                    autoFocus
                    onChange={(e) => onFormUpdate('name', e.target.value)}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    value={formDetails.description}
                    type="text"
                    placeholder="Low fat recipes"
                    onChange={(e) => onFormUpdate('description', e.target.value)}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    value={formDetails.color}
                    type="color"
                    onChange={(e) => onFormUpdate('color', e.target.value)}
                  />
                </Form.Group>
                {/* {console.log(formDetails)} */}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" type="submit" onClick={() => setModalShow(false)}>
                Close
              </Button>
              <Button variant="primary" type="submit" onClick={handleCollectionSubmit}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default Collection