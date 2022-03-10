class Api {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }
  checkResponse(res) {
    if(res.ok) {return res.json()} else {return Promise.reject(res)}
  }

  getInitialCards() {
    return fetch(this._url + '/cards', {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
      .then((res) => this.checkResponse(res))
  };
  getInitialProfile() {
    return fetch(this._url + '/users/me', {
      method: 'GET',
      headers: this._headers,
      credentials: 'include'
    })
      .then((res) => {
        return this.checkResponse(res)})
  };
  sendDataProfile({ name, about }) {
    return fetch(this._url + '/users/me', {
      method: 'PATCH',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
      .then((res) => this.checkResponse(res))
  };
  sendNewCard(formData) {
    return fetch(this._url + '/cards', {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        name: formData.name,
        link: formData.link
      })
    })
      .then((res) => this.checkResponse(res))
  };
  deleteCards(cardId) {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include'
    })
      .then((res) => this.checkResponse(res))
  };
  sendAvatarProfile(avatar) {
    return fetch(this._url + '/users/me/avatar', {
      method: 'PATCH',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        avatar
      })
    })
      .then((res) => this.checkResponse(res))
  };
  changeLikeCardStatus(cardId, callbackIsLiked) {
    return fetch(`${this._url}/cards/${cardId}/likes/`, {
      method: callbackIsLiked ? 'DELETE' : 'PUT',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
      })

    })
      .then((res) => this.checkResponse(res))
  }
}

const api = new Api({
  url: "https://api.olgagrigel.students.nomoredomains.work",
  headers: {
    authorization: '991e328d-0927-45d2-8b32-8b35ae054b8c',
    'Content-Type': 'application/json'
  }
});

export default api;