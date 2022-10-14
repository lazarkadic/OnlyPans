import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Navbar from '../components/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import VerticalLinearStepper from '../components/VerticalLinearStepper';
import Spinner from 'react-bootstrap/Spinner';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "../styles/CollectionPage.css";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function MyVerticallyCenteredModal(props) {
    const ingredients = props.ingr.split(",");
    const instructions = props.inst.split(", ");
    const items = [];
    instructions.map((el, ind) => {
        return items.push({ label: ind, description: el })
    })

    const removeFromCollection = async (id, recipes) => {
        if (recipes != null) {
            recipes.pop(`${props.id}`)
            const editCollection = {
                id: id,
                recipes_id: recipes
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
                    records: [editCollection]
                })
            });
        }
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 style={{ fontWeight: 'bold' }}>Description:</h5>
                <p style={{ textAlign: 'left' }}>
                    {props.desc}
                </p>
            </Modal.Body>
            <hr />
            <Modal.Body style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div>
                    <h5 style={{ fontWeight: 'bold' }}>Ingredients:</h5>
                    <ListGroup variant="flush">
                        {ingredients.map((el, index) => { return <ListGroup.Item key={index}>{el}</ListGroup.Item> })}
                    </ListGroup>
                </div>
                <div>
                    <h5 style={{ fontWeight: 'bold' }}>Instructions:</h5>
                    <VerticalLinearStepper steps={items}></VerticalLinearStepper>
                </div>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: 'space-between' }}>
                <p style={{ color: '#688dc4' }}>Created on {new Intl.DateTimeFormat('sr', { year: 'numeric', day: '2-digit', month: '2-digit' }).format(props.createdat)}</p>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

function CollectionPage({ removeToken }) {
    const firebaseConfig = {
        apiKey: process.env.REACT_APP_API_KEY,
        authDomain: process.env.REACT_APP_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_PROJECT_ID,
        storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_APP_ID
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    // Initialize Cloud Storage and get a reference to the service
    const storage = getStorage(app);


    const formInitialDetails = {
        id: '',
        name: '',
        description: '',
        color: '#29335c',
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
    const showModalDefault = {
        id: '',
        title: '',
        description: '',
        ingredients: '',
        instructions: '',
        author: '',
        tags: '',
        __createdtime__: ''
    }

    const [collections, setCollections] = useState({});
    const [recipes, setRecipes] = useState({});
    const [showRecipe, setShowRecipe] = useState(showModalDefault);
    const [modalShow, setModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [editFormDetails, setEditFormDetails] = useState(formInitialDetails);
    const [addModalShow, setAddModalShow] = useState(false);
    const [addFormDetails, setAddFormDetails] = useState(formAddInitialDetails);
    const [spinner, setSpinner] = useState(0);
    const [open, setOpen] = useState(false);
    let { id } = useParams();


    // SNACKBAR CLOSE HANDLE
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    // GET COLLCETION WITH ID = id
    const getCollections = async () => {
        const response = await fetch(`https://functions-cloud1-onlypans.harperdbcloud.com/local-api/collections/page/${id}`)
        const newCollections = await response.json();
        setCollections(newCollections[0]);
        setEditFormDetails({
            ...editFormDetails,
            'id': newCollections[0].id,
            'name': newCollections[0].name,
            'description': newCollections[0].description,
            'color': newCollections[0].color,
            'recipes_id': newCollections[0].recipes_id ? newCollections[0].recipes_id : []
        })

        const responseRecipes = await fetch('https://functions-cloud1-onlypans.harperdbcloud.com/local-api/recipe/ids', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                operation: 'search_by_hash',
                schema: 'onlypans',
                table: 'recipe',
                hash_values: newCollections[0].recipes_id,
                get_attributes: ["*"]
            })
        }).catch((error) => {
            console.log(error);
        });
        const newRecipes = await responseRecipes.json();
        setRecipes(newRecipes);
    };

    useEffect(() => {
        getCollections();
    }, []);

    function timeout(delay) {
        return new Promise(res => setTimeout(res, delay));
    }

    // RECIPE MODAL OPEN
    const openModal = (id) => {
        const recipe = recipes.find(el => el.id == id)
        setShowRecipe(recipe);
        setModalShow(true);
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

        // LOADING
        setSpinner(1);
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

        setSpinner(0);

        setAddFormDetails(formAddInitialDetails);
        getCollections();
        setOpen(true);
    }

    // --TODO-- onClick={() => deleteItem(element.id)} da se ubaci
    
    // REMOVE RECIPE FROM COLLCETION
    // const deleteItem = async (id) => {
    //     removeElement(shopList, item);
    //     const data = {
    //       id: userToken[0].id,
    //       shop_list: shopList
    //     }
    //     await fetch('https://functions-cloud1-onlypans.harperdbcloud.com/local-api/user', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       body: JSON.stringify({
    //         operation: 'update',
    //         schema: 'onlypans',
    //         table: 'user',
    //         records: [data]
    //       })
    //     });
    
    //     setItem('');
    //     getShopList();
    //   }

    return (
        <div className='img-wrapper'>
            <Navbar active={'collection'} removeToken={removeToken} style={'30px'} />
            {/* <div className='img-wrapper'> */}
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
                                <Link to='/recipes' className="card-button" >Find recipe</Link>
                            </div>
                        </div>}
                    {(collections.recipes_id != null && collections.recipes_id.length > 0) &&
                        <div className='collection-recipes-div'>
                            {recipes.length && recipes.map(element => {
                                return <div key={element.id} className='collection-recipes' onClick={() => openModal(element.id)}>
                                    {/* <div><RiDeleteBin6Line size={20} color='red' className='delete-icon' /></div> */}
                                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <h4 style={{ textAlign: 'left', display: 'inline' }}>{element.title}</h4>
                                        <div style={{ display: 'inline' }} ><RiDeleteBin6Line size={20} color='red' className='delete-icon' /></div>
                                    </div>
                                    <p style={{ textAlign: 'left' }}>{element.description}</p>
                                </div>
                            })}
                        </div>}
                    <Spinner animation="border" variant="primary" className='spinner' style={{ opacity: `${spinner}` }} />
                    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                            New recipe created!
                        </Alert>
                    </Snackbar>
                </div>
                <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    title={showRecipe.title}
                    desc={showRecipe.description}
                    ingr={showRecipe.ingredients}
                    inst={showRecipe.instructions}
                    tags={showRecipe.tags}
                    createdat={showRecipe.__createdtime__}
                    id={showRecipe.id}
                />

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
                            {/* {console.log(editFormDetails)} */}
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
                                <textarea
                                    value={addFormDetails.instructions}
                                    type="textarea"
                                    placeholder="Boil eggs, fry bacon, add salt and pepper..."
                                    onChange={(e) => onAddFormUpdate('instructions', e.target.value)}
                                    className='form-control'
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
                                        style={{ width: '200px', marginRight: '10px' }}
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
                                        placeholder="In minutes"
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
            {/* </div> */}
        </div>
    )
}
export default CollectionPage