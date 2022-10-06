import Navbar from '../components/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "../styles/CollectionPage.css";

function CollectionPage({ removeToken }) {
    const formInitialDetails = {
        name: '',
        description: '',
        color: '',
        user_id: JSON.parse(localStorage.getItem('token'))[0].id
    }

    const [collections, setCollections] = useState({});
    const [editModalShow, setEditModalShow] = useState(false);
    const [editFormDetails, setEditFormDetails] = useState(formInitialDetails);
    let { id } = useParams();


    // MORA DA SE NAPRAVI /page/id RUTA 
    const getCollections = async () => {
        const response = await fetch(`https://functions-cloud1-onlypans.harperdbcloud.com/local-api/collections/page/${id}`)
        const newCollections = await response.json();
        // console.log(newCollections[0])
        setCollections(newCollections[0]);
        setEditFormDetails({
            ...editFormDetails,
            'name': newCollections[0].name,
            'description': newCollections[0].description,
            'color': newCollections[0].color
        })
    };

    useEffect(() => {
        getCollections();
    }, []);

    const onEditFormUpdate = (category, value) => {
        setEditFormDetails({
            ...editFormDetails,
            [category]: value
        })
    }

    const handleCollectionSubmit = async (event) => {
        event.preventDefault();
        setEditModalShow(false)
        if (editFormDetails.name === '') {
            alert('Please enter name.')
            return
        }

        if (editFormDetails.description === '') {
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
                records: [editFormDetails]
            })
        });

        setEditFormDetails(formInitialDetails);
        getCollections();
    }

    return (
        <div>
            {/* {console.log(collections.recipes_id == null)} */}
            <Navbar active={'collection'} removeToken={removeToken} />
            <div className='img-wrapper'>
                <div className="container">
                    <div className='img-details' style={{ backgroundColor: collections.color }}>
                        <p style={{ fontSize: '52px' }}>{collections.name}</p>
                        <p>{collections.description}</p>
                        <p>{collections.recipes_id != null && `${collections.recipes_id.length} recipes`}</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div style={{ width: '25%' }}>
                            {collections.recipes_id !== null && <button className="card-button-edit" style={{ backgroundColor: '#2776ff' }}>Add new recipe</button>}
                            <button className="card-button-edit" style={{ width: '85%' }} onClick={() => setEditModalShow(true)}>Edit collcetion</button>
                            <Link to='/collections' className="card-button-edit" style={{ backgroundColor: '#ff2776', width: '70%' }}>Delete collcetion</Link>
                        </div>
                        {collections.recipes_id == null &&
                            <div className='no-collections'>
                                <h2>No recipes in this collection yet.</h2>
                                <p>Create a new recipe, or add an existing one from its page.</p>
                                <div style={{ display: 'flex' }}>
                                    <button className="card-button" style={{ marginRight: '10px' }}>New recipe</button>
                                    <button className="card-button" >Find recipe</button>
                                </div>
                            </div>}
                    </div>
                    <Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Make your collection</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form style={{ flexWrap: 'wrap' }} onSubmit={handleCollectionSubmit}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Collection name</Form.Label>
                                    <Form.Control
                                        value={editFormDetails.name}
                                        type="text"
                                        placeholder="Breakfast"
                                        autoFocus
                                        onChange={(e) => onEditFormUpdate('name', e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        value={editFormDetails.description}
                                        type="text"
                                        placeholder="Low fat recipes"
                                        onChange={(e) => onEditFormUpdate('description', e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Color</Form.Label>
                                    <Form.Control
                                        value={editFormDetails.color}
                                        type="color"
                                        onChange={(e) => onEditFormUpdate('color', e.target.value)}
                                    />
                                </Form.Group>
                                {/* {console.log(formDetails)} */}
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" type="submit" onClick={() => setEditModalShow(false)}>
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
export default CollectionPage