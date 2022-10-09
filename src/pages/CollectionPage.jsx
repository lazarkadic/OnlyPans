import Navbar from '../components/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../styles/CollectionPage.css";

function CollectionPage({ removeToken }) {
    const firebaseConfig = {
        apiKey: "AIzaSyAIdmXdNZtCpoEFbd2cJpky-JK3jMTv5n0",
        authDomain: "harperdb-a2c72.firebaseapp.com",
        projectId: "harperdb-a2c72",
        storageBucket: "harperdb-a2c72.appspot.com",
        messagingSenderId: "355885458807",
        appId: "1:355885458807:web:3502a7e3dfbf5b6b5aed72"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Cloud Storage and get a reference to the service
    const storage = getStorage(app);


    const formInitialDetails = {
        id: '',
        name: '',
        description: '',
        color: '',
        user_id: JSON.parse(localStorage.getItem('token'))[0].id
    }
    const formAddInitialDetails = {
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        photo: null,
        author: '',
        tags: '',
        time: '',
        user_id: JSON.parse(localStorage.getItem('token'))[0].id
    }

    const [collections, setCollections] = useState({});
    const [editModalShow, setEditModalShow] = useState(false);
    const [editFormDetails, setEditFormDetails] = useState(formInitialDetails);
    const [addModalShow, setAddModalShow] = useState(false);
    const [addFormDetails, setAddFormDetails] = useState(formAddInitialDetails);
    let { id } = useParams();


    // GET COLLCETION WITH ID = id
    const getCollections = async () => {
        const response = await fetch(`https://functions-cloud1-onlypans.harperdbcloud.com/local-api/collections/page/${id}`)
        const newCollections = await response.json();
        // console.log(newCollections[0])
        setCollections(newCollections[0]);
        setEditFormDetails({
            ...editFormDetails,
            'id': newCollections[0].id,
            'name': newCollections[0].name,
            'description': newCollections[0].description,
            'color': newCollections[0].color,
            'recipes_id': newCollections[0].recipes_id ? newCollections[0].recipes_id : []
        })
    };

    useEffect(() => {
        getCollections();
    }, []);

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    // EDIT COLLECTION MODAL INPUTS
    const onEditFormUpdate = (category, value) => {
        setEditFormDetails({
            ...editFormDetails,
            [category]: value
        })
    }

    // ADD RECIPE MODAL INPUTS
    const onAddFormUpdate = (category, value) => {
        setAddFormDetails({
            ...addFormDetails,
            [category]: value
        })
    }

    // EDIT COLLECTION MODAL SUBMIT
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
                operation: 'update',
                schema: 'onlypans',
                table: 'collections',
                records: [editFormDetails]
            })
        });


        setEditFormDetails(formInitialDetails);
        getCollections();
    }

    // ADD RECIPE MODAL SUBMIT
    const handleRecipeSubmit = async (event) => {
        event.preventDefault();
        setAddModalShow(false)
        if (addFormDetails.title === '') {
            alert('Please enter title.')
            return
        }

        if (addFormDetails.description === '') {
            alert('Please enter description.')
            return
        }

        if (addFormDetails.ingredients === '') {
            alert('Please enter ingredients.')
            return
        }

        if (addFormDetails.instructions === '') {
            alert('Please enter instructions.')
            return
        }

        if (addFormDetails.author === '') {
            alert('Please enter author.')
            return
        }

        if (addFormDetails.tags === '') {
            alert('Please enter tags.')
            return
        }

        if (addFormDetails.time === '') {
            alert('Please enter time.')
            return
        }

        if (addFormDetails.photo === null) {
            alert('Please select photo.')
            return
        }


        const data = {
            title: addFormDetails.title,
            description: addFormDetails.description,
            ingredients: addFormDetails.ingredients,
            instructions: addFormDetails.instructions,
            photo: '',
            author: addFormDetails.author,
            tags: addFormDetails.tags,
            time: addFormDetails.time,
            user_id: addFormDetails.user_id
        }


        // Create a child reference
        const imagesRef = ref(storage, `recipeImages/${addFormDetails.title}`);

        uploadBytes(imagesRef, addFormDetails.photo).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            getDownloadURL(ref(storage, `recipeImages/${addFormDetails.title}`))
            .then((url) => {
                // `url` is the download URL for 'images/stars.jpg'
                data.photo = url
            })
            .catch((error) => {
                // Handle any errors
                console.log(error)
            });
        });

        // LOADING KRUZIC
        await timeout(4000);

        await fetch('https://functions-cloud1-onlypans.harperdbcloud.com/local-api/recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                operation: 'insert',
                schema: 'onlypans',
                table: 'recipe',
                records: [data]
            })
        });

        const response = await fetch(`https://functions-cloud1-onlypans.harperdbcloud.com/local-api/recipe/title/${addFormDetails.title}`)
        const newRecipe = await response.json();

        setEditFormDetails({
            ...editFormDetails,
            'recipes_id': editFormDetails.recipes_id ? editFormDetails.recipes_id.push(newRecipe[0].id) : [newRecipe[0].id]
        })

        await fetch('https://functions-cloud1-onlypans.harperdbcloud.com/local-api/collections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                operation: 'update',
                schema: 'onlypans',
                table: 'collections',
                records: [editFormDetails]
            })
        });

        setAddFormDetails(formAddInitialDetails);
        getCollections();
    }

    return (
        <div>
            <Navbar active={'collection'} removeToken={removeToken} />
            <div className='img-wrapper'>
                <div className="container">
                    <div className='img-details' style={{ backgroundColor: collections.color }}>
                        <p style={{ fontSize: '52px' }}>{collections.name}</p>
                        <p>{collections.description}</p>
                        <p>{(collections.recipes_id != null && collections.recipes_id.length > 0) && `${collections.recipes_id.length} recipes`}</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div style={{ width: '25%' }}>
                            {(collections.recipes_id != null && collections.recipes_id.length > 0) && <button className="card-button-edit" style={{ backgroundColor: '#2776ff' }} onClick={() => setAddModalShow(true)}>Add new recipe</button>}
                            <button className="card-button-edit" style={{ width: '85%' }} onClick={() => setEditModalShow(true)}>Edit collcetion</button>
                            <Link to='/collections' className="card-button-edit" style={{ backgroundColor: '#ff2776', width: '70%' }}>Delete collcetion</Link>
                            <p style={{ color: '#688dc4', textAlign: 'left' }}>Created on {new Intl.DateTimeFormat('sr', { year: 'numeric', day: '2-digit', month: '2-digit' }).format(collections.__createdtime__)}</p>
                        </div>
                        {(collections.recipes_id == null || collections.recipes_id.length == 0) &&
                            <div className='no-collections'>
                                <h2>No recipes in this collection yet.</h2>
                                <p>Create a new recipe, or add an existing one from its page.</p>
                                <div style={{ display: 'flex' }}>
                                    <button className="card-button" style={{ marginRight: '10px' }} onClick={() => setAddModalShow(true)}>New recipe</button>
                                    <button className="card-button" >Find recipe</button>
                                </div>
                            </div>}
                    </div>

                    {/* EDIT COLLECTION MODAL */}
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

                    {/* ADD RECIPE MODAL */}
                    <Modal show={addModalShow} onHide={() => setAddModalShow(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Make your recipe</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form style={{ flexWrap: 'wrap' }} onSubmit={handleRecipeSubmit}>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        value={addFormDetails.title}
                                        type="text"
                                        placeholder="Recipe title..."
                                        autoFocus
                                        onChange={(e) => onAddFormUpdate('title', e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        value={addFormDetails.description}
                                        type="text"
                                        placeholder="Low fat breakfast..."
                                        onChange={(e) => onAddFormUpdate('description', e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Ingredients <small>(comma separated ingredients)</small></Form.Label>
                                    <Form.Control
                                        value={addFormDetails.ingredients}
                                        type="text"
                                        placeholder="Chicken, garlic, salt..."
                                        onChange={(e) => onAddFormUpdate('ingredients', e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Instructions <small>(comma separated instructions)</small></Form.Label>
                                    <Form.Control
                                        value={addFormDetails.instructions}
                                        type="text"
                                        placeholder="Boil eggs, fry bacon, add salt and pepper..."
                                        onChange={(e) => onAddFormUpdate('instructions', e.target.value)}
                                    />
                                </Form.Group>
                                <div style={{ display: 'flex' }}>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="exampleForm.ControlTextarea1"
                                        style={{}}
                                    >
                                        <Form.Label>Photo</Form.Label>
                                        <Form.Control
                                            // value={addFormDetails.photo}
                                            type="file"
                                            placeholder="Low fat recipes"
                                            onChange={(e) => onAddFormUpdate('photo', e.target.files[0])}
                                            style={{ width: 'auto', marginRight: '10px' }}
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="exampleForm.ControlTextarea1"
                                    >
                                        <Form.Label>Author</Form.Label>
                                        <Form.Control
                                            value={addFormDetails.author}
                                            type="text"
                                            placeholder="Melisa"
                                            onChange={(e) => onAddFormUpdate('author', e.target.value)}
                                            style={{ width: 'auto' }}
                                        />
                                    </Form.Group>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="exampleForm.ControlTextarea1"
                                    >
                                        <Form.Label>Tags <small>(comma separated tags)</small></Form.Label>
                                        <Form.Control
                                            value={addFormDetails.tags}
                                            type="text"
                                            placeholder="breakfast, protein, carbs"
                                            onChange={(e) => onAddFormUpdate('tags', e.target.value)}
                                            style={{ width: 'auto', marginRight: '10px' }}
                                        />
                                    </Form.Group>
                                    <Form.Group
                                        className="mb-3"
                                        controlId="exampleForm.ControlTextarea1"
                                    >
                                        <Form.Label>Time</Form.Label>
                                        <Form.Control
                                            value={addFormDetails.time}
                                            type="text"
                                            placeholder="15 minutes"
                                            onChange={(e) => onAddFormUpdate('time', e.target.value)}
                                            style={{ width: 'auto' }}
                                        />
                                    </Form.Group>
                                </div>
                                {/* {console.log(addFormDetails)} */}
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" type="submit" onClick={() => setAddModalShow(false)}>
                                Close
                            </Button>
                            <Button variant="primary" type="submit" onClick={handleRecipeSubmit}>
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