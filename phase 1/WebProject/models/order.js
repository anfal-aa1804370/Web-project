export default class Order {

  constructor(username, address, city, state, pincode, quantity, name, price, total) {
    this.username = username;
    this.address = address;
    this.city = city;
    this.state = state;
    this.pincode = pincode;
    this.quantity = quantity;
    this.name = name;
    this.price = price;
    this.total = total;
  }
  
}