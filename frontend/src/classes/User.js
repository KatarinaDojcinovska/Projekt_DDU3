export class User {
  constructor(id, username, password, gif = []) {
    this._id = id
    this._username = username
    this._password = password 
    this._gif = gif
  }

  get id() {
    return this._id
  }

  get username() {
    return this._username
  }

  get password() {
    return this._password
  }

  get gif() {
    return this._gif
  }

  getInfo() {
    return {
      id: this.id,
      username: this.username, 
      totalGifs: this.gif.length,
    }
  }
}
