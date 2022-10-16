import { useState, useRef } from 'react';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import VerticalLinearStepper from './VerticalLinearStepper';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { BsFillPinAngleFill } from 'react-icons/bs';

function MyVerticallyCenteredModal(props) {
  const ingredients = props.ingr.split(", ");
  const instructions = props.inst.split(", ");
  const userToken = JSON.parse(localStorage.getItem('token'));
  const buttonRef = useRef();
  const items = [];
  instructions.map((el, ind) => {
    return items.push({ label: ind, description: el })
  })

  const addToCollection = async (event, id, recipes) => {
    if (recipes == null)
      recipes = []
    recipes.push(props.id)
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

    // console.log(event)
    event.target.classList.add('active-collcetion-button');
  }

  function removeElement(array, elem) {
    var index = array.indexOf(elem);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

  const removeFromCollection = async (id, recipes) => {
    if (recipes != null) {
      removeElement(recipes, `${props.id}`)
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

  const addToShopList = async (event, el) => {

    event.currentTarget.classList.remove('pin-icon');
    event.currentTarget.classList.add('pin-icon-set');

    const response = await fetch(`https://functions-cloud1-onlypans.harperdbcloud.com/local-api/user/id/${userToken[0].id}`)
    const newShopList = await response.json();

    if (newShopList[0].shop_list == null)
      newShopList[0].shop_list = [];

    newShopList[0].shop_list.push(el)

    const data = {
      id: userToken[0].id,
      shop_list: newShopList[0].shop_list
    }

    await fetch('https://functions-cloud1-onlypans.harperdbcloud.com/local-api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        operation: 'update',
        schema: 'onlypans',
        table: 'user',
        records: [data]
      })
    });
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
        {props.collections.length !== 0 && <>
          <br />
          <h5 style={{ fontWeight: 'bold' }}>Collections:</h5>
          <div style={{ display: 'flex' }}>
            {props.collections.map((el) => {
              if (el.recipes_id != null && el.recipes_id.length > 0 && el.recipes_id.includes(`${props.id}`)) {
                return <button key={el.id} className="collection-button" style={{backgroundColor: '#1565c0', color: 'white'}} onClick={() => removeFromCollection(el.id, el.recipes_id)}>{el.name}</button>
              } else {
                return <button key={el.id} ref={buttonRef} className="collection-button" onClick={(event) => addToCollection(event, el.id, el.recipes_id)}>{el.name}</button>
              }
            })}
          </div>
        </>
        }
      </Modal.Body>
      <hr />
      <Modal.Body style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <h5 style={{ fontWeight: 'bold' }}>Ingredients:</h5>
          <ListGroup variant="flush">
            {ingredients.map((el, index) => {
              return <ListGroup.Item key={index} className='ingredients-list'>{el}
              {}
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip id="tooltip-disabled">Add to your shop list!</Tooltip>}>
                  <span><BsFillPinAngleFill color='red' className='pin-icon' onClick={(event) => addToShopList(event, el)} /></span>
                </OverlayTrigger>
              </ListGroup.Item>
            })}
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

const CardItem = ({ src, title, author, desc, ingr, inst, tags, createdat, collections, id, handleBadgeClick }) => {
  const [modalShow, setModalShow] = useState(false);
  const tagsa = tags.split(", ");

  return (
    <>
      <div className="card">
        <img
          src={src}
          alt={title}
          className="card-image"
        />
        <div className="card-body">
          <h3>{title}</h3>
          <button className="card-button" onClick={() => setModalShow(true)}>Instructions</button>
          {tagsa.map((el, index) => { return <div key={index} style={{ display: 'inline' }}> <Badge pill bg="warning" text='dark' style={{ cursor: 'pointer' }} onClick={(el) => handleBadgeClick(el)}>{el}</Badge> {" "}</div> })}
        </div>
        <div className="author">
          <span className="category">Made by: {author}</span>
        </div>
      </div>
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        title={title}
        desc={desc}
        ingr={ingr}
        inst={inst}
        tags={tags}
        createdat={createdat}
        id={id}
        collections={collections}
      />
    </>
  )
};

export default CardItem;
