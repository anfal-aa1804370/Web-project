import ProductRepo from "../repositories/product-repo.js";
import UserRepo from "../repositories/user-repo.js";
import OrderRepo from "../repositories/order-repo.js";

const productRepo = new ProductRepo();
const userRepo = new UserRepo();
const orderRepo = new OrderRepo();

window.loadProduct = loadProduct;
window.getNameParam = getNameParam;
window.navManipulator = navManipulator;
window.navManipulatorAuthenticated = navManipulatorAuthenticated;
window.loadSellerProducts = loadSellerProducts;
window.getCheckoutParam = getCheckoutParam;
window.loadOrders = loadOrders;
window.RenderProfile = RenderProfile;
navbar();

document.addEventListener("DOMContentLoaded", () => {
  window.searchProduct = searchProduct;
  window.login = login;
  window.logout = logout;
  window.addProductButton = addProductButton;
  window.addProduct = addProduct;
  window.gotoHome = gotoHome;
});

// Responsive navbar
function navbar() {
  let openHam = document.querySelector("#openHam");
  let closeHam = document.querySelector("#closeHam");
  let navigationItems = document.querySelector("#nav-items");

  const hamburgerEvent = (navigation, close, open) => {
    navigationItems.style.display = navigation;
    closeHam.style.display = close;
    openHam.style.display = open;
  };

  openHam.addEventListener("click", () =>
    hamburgerEvent("flex", "block", "none")
  );
  closeHam.addEventListener("click", () =>
    hamburgerEvent("none", "none", "block")
  );
}

// Render Profile HTML
function RenderProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { name, surname, username, shipping_address, type, money } = user;
  let profileTable = document.getElementById("profile-table");

  if (type === "customer") {
    profileTable.innerHTML =
      "<tr>" +
      "<th>" +
      "Name" +
      "</th>" +
      "<td>" +
      name +
      " " +
      surname +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<th>" +
      "Username" +
      "</th>" +
      "<td>" +
      username +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<th>" +
      "Address" +
      "</th>" +
      "<td>" +
      shipping_address +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<th>" +
      "User Type" +
      "</th>" +
      "<td>" +
      type +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<th>" +
      "Money" +
      "</th>" +
      "<td>" +
      "$ " +
      money +
      "</td>" +
      "</tr>";
  } else if (type === "seller") {
    profileTable.innerHTML =
      "<tr>" +
      "<th>" +
      "Name" +
      "</th>" +
      "<td>" +
      name +
      " " +
      surname +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<th>" +
      "Username" +
      "</th>" +
      "<td>" +
      username +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<th>" +
      "User Type" +
      "</th>" +
      "<td>" +
      type +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<th>" +
      "Money" +
      "</th>" +
      "<td>" +
      "$ " +
      money +
      "</td>" +
      "</tr>";
  } else {
    profileTable.innerHTML =
      "<tr>" +
      "<th>" +
      "Name" +
      "</th>" +
      "<td>" +
      name +
      " " +
      surname +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<th>" +
      "Username" +
      "</th>" +
      "<td>" +
      username +
      "</td>" +
      "</tr>" +
      "<tr>" +
      "<th>" +
      "User Type" +
      "</th>" +
      "<td>" +
      type +
      "</td>" +
      "</tr>";
  }
}

// Redirect to Home page
function gotoHome() {
  window.location.href = "/";
}

// Load Products
async function loadProduct() {
  let products = await productRepo.getProducts();
  renderProduct(products);
}

// Seacrh Products
function searchProduct() {
  var searchInput = document.getElementById("search");
  var searchTerm = searchInput.value.toLowerCase();
  const products = productRepo.getProductsLS();
  var searchedProducts = products.filter(function (product) {
    return product.name.toLowerCase().includes(searchTerm);
  });
  renderProduct(searchedProducts);
}

// Load Sellers product list
async function loadSellerProducts() {
  try {
    var { type } = JSON.parse(localStorage.getItem("user"));

    var products = productRepo.getProductsLS();

    if (type == "seller") {
      var { id } = JSON.parse(localStorage.getItem("user"));
      var products = products.filter((p) => p.sellerId === id);
    }

    renderProduct(products);
  } catch (error) {
    console.log(error);
  }
}

// Redirect to Add Product Page
function addProductButton() {
  window.location.href = "add_product.html";
}

// Render product HTML
function renderProduct(products) {
  var productContainer = document.getElementById("product-container");
  productContainer.innerHTML = "";

  products.forEach((element) => {
    var productDiv = document.createElement("div");
    productDiv.className = "product";
    productDiv.addEventListener("click", function () {
      window.location.href =
        "product.html?name=" + encodeURIComponent(element.name);
    });

    productDiv.innerHTML =
      '<img class="product-image" src="' +
      element.image +
      '" alt="' +
      element.name +
      '">' +
      '<h1 class="product-name" > ' +
      element.name +
      "</h1>" +
      '<p class="product-price">$' +
      element.price +
      "</p>";
    productContainer.appendChild(productDiv);
  });
}

// Add new product
function addProduct() {
  document
    .getElementById("addProductForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const name = document.getElementById("name").value.trim();
      const image = document.getElementById("image").value.trim();
      const price = parseInt(document.getElementById("price").value);
      const stock = parseInt(document.getElementById("stock").value);
      const description = document.getElementById("description").value.trim();

      let product = {
        name: name,
        image: image,
        price: price,
        stock: stock,
        description: description,
        sellerId: 2,
      };

      productRepo.addProduct(product);
    });
}

// Get the product name from the query parameter
function getCheckoutParam() {
  var quaryParam = new URLSearchParams(window.location.search);
  let product = quaryParam.get("name");
  checkoutDetail(product);
}

// Render Checout page with full functionality
async function checkoutDetail(name) {
  try {
    const product = productRepo.getProduct(name);

    if (product) {
      var productContainer = document.getElementById("product-container");

      var total = product.price;

      productContainer.innerHTML =
        "<div class='product'>" +
        "<img class='product-image'" +
        " src=" +
        product.image +
        " alt =" +
        product.name +
        " >" +
        "</div> " +
        "<div class='checkout-text'>" +
        "<h1 class='margin-tb'>" +
        product.name +
        "</h1>" +
        "<form id='checkoutform'>" +
        "<div class='input-container'>" +
        "<label for= 'address' >House No/Lane No</label >" +
        "<input class='checkout-input' type='text' id='address' required/> " +
        "</div>" +
        "<div class='input-container'>" +
        "<label for= 'city' >City</label >" +
        "<input class='checkout-input' type='text' id='city' required/> " +
        "</div>" +
        "<div class='input-container'>" +
        "<label for= 'state' >State</label >" +
        "<input class='checkout-input' type='text' id='state' required/> " +
        "</div>" +
        "<div class='input-container'>" +
        "<label for= 'pincode' >Pincode</label >" +
        "<input class='checkout-input' type='text' id='pincode' required/> " +
        "</div>" +
        "<div class='input-container'>" +
        "<label for='quantity'>Quantity</label>" +
        "<input class='checkout-input' type='number' name='quantity' value='1' min='1' " +
        "max='" +
        product.stock +
        "'" +
        " id='quantity'>" +
        "</div>" +
        "<p class='margin-tb fw-bold'>Price: $" +
        product.price +
        "</p>" +
        "<hr class='margin-tb'> " +
        "<p class='margin-tb fw-bold' id='total'>Total: $" +
        total +
        "</p>" +
        "<button class='login-button w-full' id='checkout-button'>Checkout</button>" +
        "</form>" +
        "</div>";

      var quantityInput = document.getElementById("quantity");
      quantityInput.addEventListener("change", function () {
        let price = parseInt(product.price);
        let qrt = parseInt(quantityInput.value);
        total = price * qrt;

        var totalOutput = document.getElementById("total");
        totalOutput.textContent = "Total: $" + total;
      });

      document
        .getElementById("checkoutform")
        .addEventListener("submit", async function (event) {
          event.preventDefault();
          let user = JSON.parse(localStorage.getItem("user"));

          let money = parseInt(user.money);
          let username = user.username;
          let address = document.getElementById("address").value.trim();
          let city = document.getElementById("city").value.trim();
          let state = document.getElementById("state").value.trim();
          let pincode = document.getElementById("pincode").value.trim();
          let quantity = parseInt(quantityInput.value);
          let name = product.name;
          let price = product.price;
          let currentStock = product.stock;

          if (address === "") {
            alert("Please enter address");
            return;
          }

          if (quantity > currentStock) {
            alert("Stock is insufficient for this order");
            return;
          }

          if (total > money) {
            alert("Can not checkout insuficent Fund");
            return;
          }

          let order = {
            username: username,
            address: address,
            city: city,
            state: state,
            pincode: pincode,
            quantity: quantity,
            name: name,
            price: price,
            total: total,
          };

          orderRepo.addOrder(order);
          productRepo.sellProduct(product.name, quantity);
          userRepo.updateMoney(user.id, total, "sub");
          userRepo.updateMoney(product.sellerId, total, "add");
          alert("Order placed successfully");
          window.location.reload();
        });
    } else {
      console.error("Product not found");
      var productContainer = document.getElementById("product-container");
      productContainer.innerHTML = "<h1>T-Shirt Not Found</h1>";
    }
  } catch (error) {}
}

// Fetch Order data
async function loadOrders() {
  const orders = orderRepo.getOrders();
  const user = JSON.parse(localStorage.getItem("user"));

  if (user.type === "cutomer") {
    orders = orders.filter((order) => order.username === user.username);
  }

  renderOrders(orders);
}

// Render order HTML
function renderOrders(orders) {
  var tBody = document.getElementById("table-body");
  tBody.innerHTML = "";

  orders.forEach((element) => {
    var orderRow = document.createElement("tr");

    orderRow.innerHTML =
      "<td>" +
      element.name +
      "</td>" +
      "<td>" +
      element.address +
      ", " +
      element.city +
      ", " +
      element.state +
      ", " +
      element.pincode +
      "</td>" +
      "<td>" +
      element.quantity +
      "</td>" +
      "<td>$" +
      element.price +
      "</td>" +
      "<td>$" +
      element.total +
      "</td>";
    tBody.appendChild(orderRow);
  });
}

// get the product name from the query parameter
function getNameParam() {
  var quaryParam = new URLSearchParams(window.location.search);
  let product = quaryParam.get("name");

  productDetail(product);
}

// Display the product detail page with access control
async function productDetail(name) {
  try {
    const product = productRepo.getProduct(name);

    if (product) {
      var productContainer = document.getElementById("product-container");

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        productContainer.innerHTML =
          "<div class='product-detail-image-container'>" +
          "<img class='product-detail-image'" +
          " src=" +
          product.image +
          " alt =" +
          product.name +
          " >" +
          "</div> " +
          "<div class='product-detail-text'>" +
          "<h1 class='product-detail-name'>" +
          product.name +
          "</h1>" +
          "<p class='product-detail-description'>" +
          product.description +
          "</p>" +
          "<p class='product-detail-price'> $" +
          product.price +
          "</p>" +
          "</div>";
      } else if (user.type === "customer") {
        productContainer.innerHTML =
          "<div class='product-detail-image-container'>" +
          "<img class='product-detail-image'" +
          " src=" +
          product.image +
          " alt =" +
          product.name +
          " >" +
          "</div> " +
          "<div class='product-detail-text'>" +
          "<h1 class='product-detail-name'>" +
          product.name +
          "</h1>" +
          "<p class='product-detail-description'>" +
          product.description +
          "</p>" +
          "<p class='product-detail-price'> $" +
          product.price +
          "</p>" +
          "<button class='product-detail-buy-button' id='buy-button'>Buy</button>" +
          "</div>";

        var buyButton = document.getElementById("buy-button");
        buyButton.addEventListener("click", function () {
          window.location.href =
            "checkout.html?name=" + encodeURIComponent(product.name);
        });
      } else {
        productContainer.innerHTML =
          "<div class='product-detail-image-container'>" +
          "<img class='product-detail-image'" +
          " src=" +
          product.image +
          " alt =" +
          product.name +
          " >" +
          "</div> " +
          "<div class='product-detail-text'>" +
          "<h1 class='product-detail-name'>" +
          product.name +
          "</h1>" +
          "<p class='product-detail-description'>" +
          product.description +
          "</p>" +
          "<p class='product-detail-price'> $" +
          product.price +
          "</p>" +
          "<p class='product-detail-price'> In Stock: " +
          product.stock +
          "</p>" +
          "<hr/>" +
          "<div class='input-container'>" +
          "<label for= 'stock' > T - Shirt Stock</label >" +
          "<input type='number' min='0' name='stock' id='stock'>" +
          "</div>" +
          "<button class='product-detail-buy-button' id='update-button'>Update</button>" +
          "</div>";

        let orders = orderRepo.getOrders();
        orders = orders.filter((order) => order.name === product.name);

        if (orders.length > 0) {
          var table = document.getElementById("table");
          var orderHeading = document.getElementById("order-heading");
          table.style.display = "flex";
          orderHeading.style.display = "block";

          var tBody = document.getElementById("table-body");
          tBody.innerHTML = "";

          orders.forEach((element) => {
            var orderRow = document.createElement("tr");

            orderRow.innerHTML =
              "<td>" +
              element.username +
              "</td>" +
              "<td>" +
              element.address +
              ", " +
              element.city +
              ", " +
              element.state +
              ", " +
              element.pincode +
              "</td>" +
              "<td>" +
              element.quantity +
              "</td>" +
              "<td>$" +
              element.price +
              "</td>" +
              "<td>$" +
              element.total +
              "</td>";
            tBody.appendChild(orderRow);
          });
        }

        var updateButton = document.getElementById("update-button");
        updateButton.addEventListener("click", async function () {
          var stock = parseInt(document.getElementById("stock").value);

          productRepo.updateProduct(product.name, stock);
        });
      }
    } else {
      console.error("Product not found");
      var productContainer = document.getElementById("product-container");
      productContainer.innerHTML = "<h1>T-Shirt Not Found</h1>";
    }
  } catch (error) {
    console.log(error);
  }
}

// Update the navbar according to the current user
function navManipulator() {
  var user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    const { id, type } = user;

    if (id) {
      var login_page = document.getElementById("login");
      var logout_page = document.getElementById("logout");
      var profile_page = document.getElementById("profile");
      login_page.style.display = "none";
      logout_page.style.display = "inline-block";
      profile_page.style.display = "inline-block";
    }

    if (type == "customer") {
      var orders_page = document.getElementById("orders");
      orders_page.style.display = "inline-block";
    } else if (type == "seller") {
      var products_page = document.getElementById("products");
      products_page.style.display = "inline-block";

      var userType = document.getElementById("user-type");
      userType.innerHTML = "Seller";
    } else if (type == "admin") {
      var orders_page = document.getElementById("orders");
      orders_page.style.display = "inline-block";
      var products_page = document.getElementById("products");
      products_page.style.display = "inline-block";

      var userType = document.getElementById("user-type");
      userType.innerHTML = "Admin";
    }
  }
}

// Update the navbar according to the current user and restrict role base access to the page
function navManipulatorAuthenticated() {
  var { id, type } = JSON.parse(localStorage.getItem("user"));

  if (id) {
    var login_page = document.getElementById("login");
    var logout_page = document.getElementById("logout");
    var profile_page = document.getElementById("profile");
    login_page.style.display = "none";
    logout_page.style.display = "inline-block";
    profile_page.style.display = "inline-block";
  } else {
    window.location.href = "/login.html";
    alert("Please Login To Continue");
  }

  if (type == "customer") {
    var orders_page = document.getElementById("orders");
    orders_page.style.display = "inline-block";
  } else if (type == "seller") {
    var products_page = document.getElementById("products");
    products_page.style.display = "inline-block";

    var userType = document.getElementById("user-type");
    userType.innerHTML = "Seller";
  } else if (type == "admin") {
    var orders_page = document.getElementById("orders");
    orders_page.style.display = "inline-block";
    var products_page = document.getElementById("products");
    products_page.style.display = "inline-block";

    var userType = document.getElementById("user-type");
    userType.innerHTML = "Admin";
  }
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  await userRepo.login(username, password);
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "/";
}
