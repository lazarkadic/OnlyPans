import { useState } from 'react';
import Badge from 'react-bootstrap/Badge';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import VerticalLinearStepper from './VerticalLinearStepper';

function MyVerticallyCenteredModal(props) {
  const ingredients = props.ingr.split(",");
  const instructions = props.inst.split(", ");
  const items = [];
  instructions.map((el, ind) => {
    return items.push({ label: ind, description: el })
  })

  const addToCollection = async (id, recipes) => {
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
  }

  const removeFromCollection = async (id, recipes) => {
    if(recipes != null){
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
        {props.collections.length !== 0 && <>
          <br />
          <h5 style={{ fontWeight: 'bold' }}>Collections:</h5>
          <div style={{ display: 'flex' }}>
            {props.collections.map((el) => {

              if (el.recipes_id != null && el.recipes_id.length > 0 && el.recipes_id.includes(`${props.id}`)) {
                return <button key={el.id} className="collection-button" style={{backgroundColor: '#1565c0', color: 'white'}} onClick={() => removeFromCollection(el.id, el.recipes_id)}>{el.name}</button>
              } else {
                return <button key={el.id} className="collection-button" onClick={() => addToCollection(el.id, el.recipes_id)}>{el.name}</button>
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
