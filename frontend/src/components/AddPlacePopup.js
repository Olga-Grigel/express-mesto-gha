import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({ isOpen, onClose, onPopupClick, onUpdateCard }) {
  const titleRef = React.useRef();
  const linkRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateCard({
      name: titleRef.current.value,
      link: linkRef.current.value,
      event:e
    });
  }

  return (
    <PopupWithForm
      title={'Новое место'}
      namePopup={'addElement'}
      isOpen={isOpen}
      onClose={onClose}
      onPopupClick={onPopupClick}
      onSubmit={handleSubmit}
      buttonTitle={'Создать'}
      children={
        <>
          <label className="popup__field">
            <input id="popup__title" type="text" ref={titleRef} name="name" className="popup__name popup__name_type_addElement"
              placeholder="Название" required minLength="2" maxLength="30" autoComplete="off" />
            <span className="popup__name-error popup__title-error"></span>
          </label>
          <label className="popup__field">
            <input id="popup__link" type="url" ref={linkRef} name="link" className="popup__name popup__name_type_addElement"
              placeholder="Ссылка на картинку" required autoComplete="off" />
            <span className="popup__name-error popup__link-error"></span>
          </label>
        </>
      }
    />
  )
};

export default AddPlacePopup;