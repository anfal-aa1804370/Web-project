import User from "../models/user.js";

export default class UserRepo {
  constructor() {
    this.userFile = "./database/users.json";
  }

  async login(username, password) {
    try {
      let response = await fetch(this.userFile);  
      let users = await response.json();

      for (let u in users) {
        Object.setPrototypeOf(u, User.prototype);
      }

      localStorage.setItem("users", JSON.stringify(users));

      let user = users.find((user) => user.username === username && user.password === password);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "index.html";

      } else {
        alert("User not found");
      }

    } catch (error) {
      console.log(error);
    }
  }

  getUser(id) {
    let users = localStorage.getItem("users");
    let user = users.find((user) => user.id === id);
    return user;
  }

  updateMoney(id, amount, type) {
    let users = JSON.parse(localStorage.getItem("users"));
    console.log(users);

    let index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
      if (type === "add") {
        users[index].money += amount;
      } else {
        users[index].money -= amount;
      }
    }
    
    localStorage.setItem("users", JSON.stringify(users));
    this.updateCurrentUser();
  }

  updateCurrentUser() {
    let currentUser = JSON.parse(localStorage.getItem("user"));
    let users = JSON.parse(localStorage.getItem("users"));
    let user = users.find((user) => user.id === currentUser.id);
    console.log(user);
    localStorage.setItem("user", JSON.stringify(user));
  }
}