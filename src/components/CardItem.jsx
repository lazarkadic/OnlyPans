import { Link } from "react-router-dom";

const CardItem = ({ src, text, label, path }) => {    
    return (
        <div className="card">
            <img
              src={src}
              alt={text}
              className="card-image"
            />
            <div className="card-body">
              <h3>{text}</h3>
              <Link className="card-button" to={"/recipes/" + path}>Instructions</Link>
            </div>
            <div className="author">
              <span className="category">Made by: {label}</span>
            </div>
        </div>
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