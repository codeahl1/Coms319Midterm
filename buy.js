// Updates the products in browser local storage
function setProducts(products) {
  window.localStorage.setItem("products", JSON.stringify(products));
}

// Gets the products from local storage, if available, or fetches them from a JSON file if not
async function getProducts() {
  // First check to see if the products are in local storage
  const localProducts = JSON.parse(window.localStorage.getItem("products"));
  if (localProducts != null) {
    return localProducts;
  }

  // If not, then get them from the json file
  const remoteProducts = await fetch("products.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });

  // Then put them into local storage
  setProducts(remoteProducts);

  // and return them
  return remoteProducts;
}

// Fetch products immediately
const productsPromise = getProducts();
// Variable for products when available
let products;

function displayProducts(products) {
  const productContainer = document.getElementById("product-container");
  productContainer.innerHTML = "";

  if (products.length === 0) {
    productContainer.innerHTML = "<p>No products found.</p>";
    return;
  }

  // console.log(products.length);

  products.forEach((product) => {
    // console.log(product.name);
    const productCard = document.createElement("div");
    productCard.className = "col-md-4 mb-3";
    
    productCard.innerHTML = `
      <div class="card product">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body">
          <p class="card-text">
            ${product.name} <br>
            <span class="price">$${Number(product.price).toFixed(2)}</span>
          </p>
          <a href="./product.html?id=${product.id}" class="btn btn-sm btn-outline-dark">View Details</a>
        </div>
      </div>
    `;

    productContainer.appendChild(productCard);
  });
}

async function filterAndSortProducts() {
  let filteredProducts = [...products];

  // Get search input and filter products based on it
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  if (searchTerm) {
    filteredProducts = filteredProducts.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );
  }

  // Get selected price filter
  const priceFilter = document.getElementById("price-filter").value;
  if (priceFilter !== "all") {
    filteredProducts = filteredProducts.filter((product) => {
      if (priceFilter === "under-25") return product.price < 25;
      if (priceFilter === "25-50")
        return product.price >= 25 && product.price < 50;
      if (priceFilter === "50-100")
        return product.price >= 50 && product.price < 100;
      if (priceFilter === "100+") return product.price >= 100;
    });
  }

  // Get selected category filter
  const categoryFilter = document.getElementById("category-filter").value;
  if (categoryFilter !== "All") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === categoryFilter
    );
  }

  // Get selected sort option
  const sortOption = document.getElementById("sort-option").value;
  if (sortOption === "name-az") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === "name-za") {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sortOption === "price-low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  displayProducts(filteredProducts);
}

document.getElementById("search-button").addEventListener("click", filterAndSortProducts);
document.getElementById("search-input").addEventListener("input", filterAndSortProducts);
document.getElementById("price-filter").addEventListener("change", filterAndSortProducts);
document.getElementById("category-filter").addEventListener("change", filterAndSortProducts);
document.getElementById("sort-option").addEventListener("change", filterAndSortProducts);

//Temporary button to clear the JSON file in local storage for testing
document.getElementById("clearProductsBtn").addEventListener("click", async () => {
  // Reset products to an empty array, thus clearing it
  localStorage.setItem("products", "[]");
  products = await getProducts();
  alert("Products have been cleared.");
  displayProducts(products);
});

document.getElementById("resetProductsBtn").addEventListener("click", async () => {
  localStorage.removeItem("products");
  // Reset products to what's in the JSON file
  products = await getProducts();
  alert("Products have been reset.");
  displayProducts(products);
});

document.getElementById("downloadBtn").addEventListener("click", async () => {
  const products = await getProducts();
  const jsonString = JSON.stringify(products, null, 2);
  
  const element = document.createElement("a");
  element.setAttribute("href", "data:application/json;charset=utf-8, " + encodeURIComponent(jsonString));
  element.setAttribute("download", "products-download.json");

  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
});

// window.onload = displayProducts(products);
document.addEventListener("DOMContentLoaded", async function (e) {
  products = await productsPromise;
  displayProducts(products);
});
