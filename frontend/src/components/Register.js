import React from 'react';
import { Link} from 'react-router-dom';
import Header from './Header';

function Register({onInfoTooltip}) {
  const [values, setValues] = React.useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
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
    <div className="register__page login__page page">
      <Header email={''} children={<Link to='/signin' className="header__button" >{'Войти'}</Link>} />
      <div className="register__container login__container">
        <h2 className='register__title login__title popup__title'>Регистрация</h2>
        <form className='register__form popup__form' name='login__form' onSubmit={handleSubmit}>
          <input id="email" name="email" type="email" className="register__email login__input popup__name" placeholder="Email" value={values.email} onChange={handleChange} />
          <input id="password" type="password" name="password" className="register__password login__input popup__name" placeholder="Пароль" value={values.password} onChange={handleChange} />
          <button type="submit" className="register__link login__link popup__save" >Зарегистрироваться</button>
        </form>
        <p className="register__text" >Уже зарегистрированы? <Link to='/signin' className="register__signin">Войти</Link></p>
      </div>
    </div>)
};

export default Register;