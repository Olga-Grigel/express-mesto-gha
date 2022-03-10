import React from 'react';
import {Link} from 'react-router-dom';
import Header from './Header';

function Login({onInfoTooltip}) {
  const [values, setValues] = React.useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const {name, value} = e.target;

    setValues(v => ({
      ...v,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onInfoTooltip({email:values.email, password:values.password});
  }
  return (
    <div className="login__page page">
      <Header email={''} children={<Link to='/signup' className="header__button" >{'Регистрация'}</Link>} />
      <div className="login__container">
      <h2 className='login__title popup__title'>Вход</h2>
      <form className='login__form popup__form' name='login__form' onSubmit={handleSubmit}>
        <input id="email" type="email" name="email" className="login__email login__input popup__name" placeholder="Email" value={values.email} onChange={handleChange} />
        <input id="password" type="password" name="password" className="login__password login__input popup__name" placeholder="Пароль" value={values.password} onChange={handleChange}/>
        <button type="submit" className="login__link popup__save" >Войти</button>
      </form>
      </div>
    </div>)
};

export default Login;