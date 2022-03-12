import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext)
  const isOwn = props.card.owner === currentUser._id;
  const cardDeleteButtonClassName = (
    `element__trash ${!isOwn ? 'element__trash_none' : ''}`
  );

  const isLiked = props.card.likes.some(i => i === currentUser._id);
  const cardLikeButtonClassName = (`element__like ${isLiked ? 'element__like_active' : ''}`);

  function handleClick() {
    props.onCardClick(props.card);
  }
  function handleLikeClick() {
    props.onCardLike(props.card);
  }
  function handleDeleteClick() {
    props.onCardDelete(props.card);
  }

  return (
    <div className="element">
      <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
      <img className="element__photo" src={props.card.link} alt={props.card.name} onClick={handleClick} />
      <div className="element__text-block">
        <h2 className="element__text">{props.card.name}</h2>
        <div className="element__likes">
          <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
          <p className="element__number-likes">{props.card.likes.length}</p>
        </div>
      </div>
    </div>
  );
}

export default Card;