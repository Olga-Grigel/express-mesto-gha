import React from 'react';

function PopupWithForm({ title, namePopup, children, isOpen, buttonTitle = 'Сохранить', onClose, onPopupClick, onSubmit}) {
  return (
    <section className={`popup popup_type_${namePopup} ${isOpen ? 'popup_opened' : ''}`} onClick={onPopupClick} >
      <div className={`popup__container popup__container_type_${namePopup}`}>
        <button type="button" className={`popup__close popup__close_type_${namePopup}`} onClick={onClose}></button>
        <h2 className={`popup__title popup__title_type_${namePopup}`}>{title}</h2>
        <form className={`popup__form popup__form_type_${namePopup}`} name={`popup__form_type_${namePopup}`} onSubmit={onSubmit}>
          {children}
          <button type="submit" className={`popup__save popup__save_type_${namePopup}`} >{buttonTitle}</button>
        </form>
      </div>
    </section>
  )
};

export default PopupWithForm;