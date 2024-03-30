import Product from "../models/product.js";

export default class ProductRepo {
  constructor() {
    this.productFile = "../database/products.json";
  }

  deserializeProducts(products) {
    for (const product in products) {
      Object.setPrototypeOf(product, Product.prototype);
    }
    return products;
  }

  //  Get products from json file
  async getProducts() {
    let products = localStorage.getItem("products");
    if (products) {
      products = this.deserializeProducts(products);
      return JSON.parse(products);
    } else {
      try {
        let response = await fetch(this.productFile);
        let products = await response.json();
        products = this.deserializeProducts(products);
        this.setProductsLS(products);
        return products;
      } catch (error) {
        console.log(error);
      }
    }
  }

  // add produts in local storage
  setProductsLS(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  // get produts from local storage
  getProductsLS() {
    let products = localStorage.getItem("products");
    return JSON.parse(products);
  }

  // get product by name
  getProduct(name) {
    let products = this.getProductsLS();
    let product = products.find((product) => product.name === name);
    if (product) {
      return product;
    } else {
      alert("Product not found");
    }
  }

  // add product
  addProduct(product) {
    let products = this.getProductsLS();
    products.push(product);
    this.setProductsLS(products);
    alert("Product added");
    window.location.reload();
  }

  // update product
  updateProduct(name, stock) {
    let products = this.getProductsLS();
    let index = products.findIndex((product) => product.name === name);
    console.log(index);
    if (index !== -1) {
      products[index].stock = stock;
      this.setProductsLS(products);
      window.location.reload();
    } else {
      alert("Product Not Found");
    }
  }

  // reduce stock on sell
  sellProduct(name, quantity) {
    let products = this.getProductsLS();
    let index = products.findIndex((product) => product.name === name);
    if (index !== -1) {
      products[index].stock -= quantity;
      this.setProductsLS(products);
    } else {
      alert("Product Not Found");
    }
  }
}
