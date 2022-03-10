import React from 'react';

function ImagePopup({ card, onClose, onPopupClick }) {
  return (
    <section className={`popup popup_open_photo ${card.link === '' ? '' : 'popup_opened'}`} onClick={onPopupClick}>
      <div className="popup__container popup__container_open_photo">
        <button type="button" className="popup__close popup__close_open_photo" onClick={onClose}></button>
        <img className="popup__photo popup__photo_open_photo" src={card.link} alt={card.name} />
        <h2 className="popup__text popup__text_open_photo">{card.name}</h2>
      </div>
    </section>
  )
};

export default ImagePopup;