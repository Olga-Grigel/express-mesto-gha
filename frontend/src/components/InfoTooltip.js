import React from 'react';

function InfoTooltip({ image, title, isOpen, onClose, onPopupClick, infoTooltip}) {
  return (
    <section className={`popup ${isOpen ? 'popup_opened' : ''}`} onClick={onPopupClick}>
      <div className="popup__container popup__container_type_tooltip">
        <button type="button" className="popup__close" onClick={onClose}></button>
        <img className="popup__image" src={image} alt="картинка"/>
        <h2 className="popup__title popup__title_type_tooltip">{title}</h2>
      </div>
    </section>
  )
};

export default InfoTooltip;