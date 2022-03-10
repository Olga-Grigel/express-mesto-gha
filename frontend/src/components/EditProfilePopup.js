import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup({ isOpen, onClose, onPopupClick, onUpdateUser}) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  function handleChangeName(e) {
    setName(e.target.value);
  }
  function handleChangeDescription(e) {
    setDescription(e.target.value)
  }

  const currentUser = React.useContext(CurrentUserContext);
  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  function handleSubmit(e) {
    e.preventDefault();

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name: name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      title={'Редактировать профиль'}
      namePopup={'changeProfile'}
      isOpen={isOpen}
      onClose={onClose}
      onPopupClick={onPopupClick}
      onSubmit={handleSubmit}
      children={
        <>
          <label className="popup__field">
            <input id="popup__name" type="text" value={name || ''} onChange={handleChangeName} name="main" className="popup__name popup__name_type_changeProfile popup__name_main" placeholder="ФИО" required minLength="2" maxLength="40" autoComplete="off" />
            <span className="popup__name-error"></span>
          </label>
          <label className="popup__field">
            <input id="popup__activiti" type="text" value={description || ''} onChange={handleChangeDescription} name="activiti" className="popup__name popup__name_type_changeProfile popup__name_activiti" placeholder="Род деятельности" required minLength="2" maxLength="200" autoComplete="off" />
            <span className="popup__name-error popup__activiti-error"></span>
          </label>
        </>
      }
    />
  )
};

export default EditProfilePopup;