import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Card from './Card';

function Main({ onEditProfile, onAddPlace, onEditAvatar, onCardClick, cards, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext)

  return (
    <main className="content">
      <section className="profile">
        <img className="profile__avatar" src={currentUser.avatar} alt="Аватар" onClick={onEditAvatar} />
        <div className="profile__ikon" onClick={onEditAvatar}></div>
        <div className="profile__main">
          <h1 className="profile__title profile__data"> {currentUser.name} </h1>
          <button type="button" className="profile__edit-button" onClick={onEditProfile}></button>
          <h2 className="profile__subtitle profile__data"> {currentUser.about} </h2>
        </div>
        <button type="button" className="profile__add-button" onClick={onAddPlace}></button>
      </section>
      <section className="elements">
        {cards.map((item) => (<Card key={item._id} card={item} onCardClick={onCardClick} onCardLike={onCardLike} onCardDelete={onCardDelete} />))}
      </section>
    </main>
  )
};

export default Main;