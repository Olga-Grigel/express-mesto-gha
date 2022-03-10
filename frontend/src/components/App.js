import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup'
import api from '../utils/Api';
import * as auth from '../utils/auth';
import { CurrentUserContext } from '../../src/contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup'
import imageNo from '../images/no.svg';
import imageOk from '../images/ok.svg';
import InfoTooltip from './InfoTooltip'

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false)
  const navigate = useNavigate()

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [infoTooltip, setInfoTooltip] = React.useState({ onStatus: false, image: "", title: "" });
  const [selectedCard, setSelectedCard] = React.useState({ name: "", link: "" });
  const [cards, setCards] = React.useState([]);
  const [currentUser, setcurrentUser] = React.useState({});

  React.useEffect(() => {
    handleTokenCheck('/')
  }, [])

  const handleTokenCheck = (path) => {
    console.log(localStorage.getItem('jwt'))
    if (localStorage.getItem('jwt')) {
      auth
        .checkToken()
        .then(res => {
          if (res) {
            setLoggedIn(true)
            localStorage.setItem('email', res.email);
            navigate(path)
          }
        })
        .catch(err => console.log(`Ошибка: ${err.status}`))
    }
  }

  //получили данные профиля
  React.useEffect(() => {
    Promise.all([api.getInitialProfile(), api.getInitialCards()])
      .then((data) => {
        setcurrentUser(data[0]);
        setCards(data[1])
      })
      .catch(err => console.log(`Ошибка: ${err.status}`))
  }, []);

  function handleCardLike(card) {
    // проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i === currentUser._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, isLiked)

      .then((newCard) => {
        setCards((prewCards) => prewCards.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => console.log(`Ошибка: ${err.status}`));
  }
  function handleCardDelete(card) {
    // Отправляем запрос в API и получаем обновлённые данные карточек
    api.deleteCards(card._id)
      .then(() => {
        setCards((prewCards) => prewCards.filter((c) => c._id !== card._id));
      })
      .catch(err => console.log(`Ошибка: ${err.status}`));
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setInfoTooltip({ onStatus: false })
    setSelectedCard({ name: "", link: "" })
  }

  React.useEffect(() => {
    if (isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard) {
      function handleEsc(event) {
        if (event.key === 'Escape') {
          closeAllPopups()
        }
      }
      document.addEventListener("keydown", handleEsc)
      return () => {
        document.removeEventListener("keydown", handleEsc)
      }
    }
  }, [isEditAvatarPopupOpen, isEditProfilePopupOpen, isAddPlacePopupOpen, selectedCard])

  function handlePopupClick(event) {
    if (event.target === event.currentTarget) {
      closeAllPopups()
    }
  }

  function handleUpdateUser(data) {
    api.sendDataProfile(data)
      .then(res => {
        setcurrentUser(res);
        closeAllPopups()
      })
      .catch(err => console.log(`Ошибка: ${err.status}`))
  }

  function handleUpdateAvatar(data) {
    api.sendAvatarProfile(data.avatar)
      .then(res => {
        setcurrentUser(res);
        closeAllPopups();
        data.event.target.reset()
      })
      .catch(err => console.log(`Ошибка: ${err.status}`))
  }

  function handleAddPlaceSubmit(data) {
    api.sendNewCard(data)
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups()
        data.event.target.reset()
      })
      .catch(err => console.log(`Ошибка: ${err.status}`))
  }

  const handleInfoTooltipSubmitRegister = (data) => {
    auth
      .signup(data)
      .then(res => {
        if (res.status !== 400) {
          setInfoTooltip({ onStatus: true, image: imageOk, title: "Вы успешно зарегистрировались!" })
          navigate('/signin')
        } else {
          setInfoTooltip({ onStatus: true, image: imageNo, title: "Что-то пошло не так! Попробуйте ещё раз." })
        }
      })
      .catch(() => {
        setInfoTooltip({ onStatus: true, image: imageNo, title: "Что-то пошло не так! Попробуйте ещё раз." })
      })
  }

  const handleInfoTooltipSubmitLogin = (data) => {
    if (!data.email || !data.password) {
      return setInfoTooltip({ onStatus: true, image: imageNo, title: "Что-то пошло не так! Попробуйте ещё раз." })
    }
    auth
      .signin(data)
      .then(res => {
        if (res?.data._id) {
          localStorage.setItem('jwt', res?.data._id);
          setcurrentUser(res.data);
          setLoggedIn(true);
          handleTokenCheck('/');
        }
      })
      .catch(() => {
        setInfoTooltip({ onStatus: true, image: imageNo, title: "Что-то пошло не так! Попробуйте ещё раз." })
      })
  }

  const handleLogout = (event) => {
    auth
      .signout()
      .then(res => {
        event.preventDefault()
        localStorage.removeItem('jwt')
        setLoggedIn(false)
        navigate('/signin')
      })
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Routes>
        <Route path="/signin" element={<Login onInfoTooltip={handleInfoTooltipSubmitLogin} />} />
        <Route path="/signup" element={<Register onInfoTooltip={handleInfoTooltipSubmitRegister} />} />
        <Route exact path="/" element={
          <ProtectedRoute
            loggedIn={loggedIn}
            component={
              <div className="page" >
                <Header
                  email={localStorage.getItem('email')}
                  children={<button type='button' className="header__button" onClick={handleLogout} >{'Выйти'}</button>} />
                <Main
                  onEditProfile={() => setIsEditProfilePopupOpen(true)}
                  onAddPlace={() => setIsAddPlacePopupOpen(true)}
                  onEditAvatar={() => setIsEditAvatarPopupOpen(true)}
                  onCardClick={card => handleCardClick(card)}
                  cards={cards}
                  onCardLike={card => handleCardLike(card)}
                  onCardDelete={card => handleCardDelete(card)}
                />
                <Footer />
              </div>
            }>
          </ProtectedRoute>} />
      </Routes>
      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onPopupClick={handlePopupClick} onUpdateUser={handleUpdateUser} />
      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onPopupClick={handlePopupClick} onUpdateUser={handleUpdateAvatar} />
      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onPopupClick={handlePopupClick} onUpdateCard={handleAddPlaceSubmit} />
      <ImagePopup card={selectedCard} onClose={closeAllPopups} onPopupClick={handlePopupClick} />
      <InfoTooltip image={infoTooltip.image} title={infoTooltip.title} isOpen={infoTooltip.onStatus} onClose={closeAllPopups} onPopupClick={handlePopupClick} infoTooltip={infoTooltip} />
    </CurrentUserContext.Provider>
  );
}
export default App;
