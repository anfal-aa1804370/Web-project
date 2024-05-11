export default class User {
  
  constructor(id, name, surname, username, password, shipping_address, type, money) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.username = username;
    this.password = password;
    this.shipping_address = shipping_address;
    this.type = type;
    this.money = money;
  }

  addMoney(money) {
    this.money += money;
  }

  deductMoney(money) {
    this.money -= money;
  }
}