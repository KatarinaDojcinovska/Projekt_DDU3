export class CreateUser { //Hantera användardata
    
    constructor(id, name, password, gif = []) {
      this.id = id;
      this.username = name;
      this.password = password;
      this.gif = gif; 
    }
  
    getInfo() {
      return {
        id: this.id,
        name: this.name,
        totalGifs: this.gif.length,
      };
    }
}