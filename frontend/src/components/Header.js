import React from 'react';
import logo from '../images/logo_header.svg'

function Header({email,children}) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип" />
      <div className="header__login">
        <p className="header__email">{email}</p>
        {children}
      </div>
    </header>)
};

export default Header;