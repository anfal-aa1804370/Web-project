import Order from "../models/order.js";

export default class OrderRepo {

  getOrders() {
    let orders = localStorage.getItem("orders");

    for (let order in orders) {
      Object.setPrototypeOf(order, Order.prototype);
    }

    return JSON.parse(orders);
  }

  addOrder(order) {
    let orders = this.getOrders();

    if (!orders) {
      orders = [];
    }
    
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
  }

}