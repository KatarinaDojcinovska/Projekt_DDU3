class CreateUser { //Hantera användardata
    
    constructor(id, name, password, gif = []) {
      this.id = id;
      this.name = name;
      this.password = password;
      this.gif = gif; 
    }
  
    addGif(gifUrl) {
      this.gif.push(gifUrl);
    }
  
    removeGif(gifUrl) {
      const index = this.gif.indexOf(gifUrl);
      if (index !== -1) {
        this.gif.splice(index, 1);
      }
    }
  
    getInfo() {
      return {
        id: this.id,
        name: this.name,
        totalGifs: this.gif.length,
      };
    }
}