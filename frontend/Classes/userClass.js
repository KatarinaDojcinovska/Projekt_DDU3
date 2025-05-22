export class CreateUserClass {
  //Hantera användardata

  constructor(id, username, password, gif = []) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.gif = gif;
  }

  getInfo() {
    return {
      id: this.id,
      name: this.username,
      totalGifs: this.gif.length,
    };
  }
}
