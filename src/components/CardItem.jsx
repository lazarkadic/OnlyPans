import { useState } from 'react';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

function MyVerticallyCenteredModal(props) {
  const ingredients = props.ingr.split(",");
  const instructions = props.inst.split(",");
  // const tags = props.tags.split(",");

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
        <h5 style={{fontWeight: 'bold'}}>Description:</h5>
        <p style={{ textAlign: 'left'}}>
          {props.desc}
        </p>
        {/* {tags.map((el, index) => { return <Badge pill bg="warning" text="dark" key={index}>{el}</Badge> })} */}
      </Modal.Body>
      <hr />
      <Modal.Body style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <h5 style={{fontWeight: 'bold'}}>Ingredients:</h5>
          <ListGroup variant="flush">
            {ingredients.map((el, index) => { return <ListGroup.Item key={index}>{el}</ListGroup.Item> })}
          </ListGroup>
        </div>
        <div>
          <h5 style={{fontWeight: 'bold'}}>Instructions:</h5>
          <ListGroup variant="flush">
            {instructions.map((el, index) => { return <ListGroup.Item key={index}>{el}</ListGroup.Item> })}
          </ListGroup>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

const CardItem = ({ src, title, author, desc, ingr, inst, tags }) => {    
  const [modalShow, setModalShow] = useState(false);
  const tagsa = tags.split(",");
  // const bgColor = ['danger', 'secondary', 'success', 'dark'];

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
              {tagsa.map((el, index) => { return <div key={index} style={{display: 'inline'}}> <Badge pill bg="warning" text='dark' >{el}</Badge> {" "}</div> })}
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
        />
      </>
    )
};

export default CardItem;


// import React from 'react';
// import { Link } from 'react-router-dom';

// function CardItem(props) {
//   return (
//     <>
//       <li className='cards__item'>
//         <Link className='cards__item__link' to={`/recipes/${props.path}`}>
//           <figure className='cards__item__pic-wrap' data-category={props.label}>
//             <img
//               className='cards__item__img'
//               alt='Recipe Image'
//               src={props.src}
//             />
//           </figure>
//           <div className='cards__item__info'>
//             <h5 className='cards__item__text'>{props.text}</h5>
//           </div>
//         </Link>
//       </li>
//     </>
//   );
// }

// export default CardItem;