import React from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({ isOpen, onClose, onPopupClick, onUpdateUser }) {
  const avatarRef = React.useRef();

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({avatar: avatarRef.current.value, event:e});
  }

  return (
    <PopupWithForm
      title={'Обновить аватар'}
      namePopup={'changeAvatar'}
      isOpen={isOpen}
      onClose={onClose}
      onPopupClick={onPopupClick}
      onSubmit={handleSubmit}
      children={
        <>
          <label className="popup__field">
            <input id="popup__linkavatar" ref={avatarRef} type="url" name="linkavatar" className="popup__name popup__name_type_changeAvatar" placeholder="Ссылка" required autoComplete="off" />
            <span className="popup__name-error popup__linkavatar-error"></span>
          </label>
        </>
      }
    />
  )
};

export default EditAvatarPopup;