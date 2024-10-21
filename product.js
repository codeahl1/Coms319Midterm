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

function updateProductInfo(product) {
  const productImage = document.getElementById("product-image");
  const productName = document.getElementById("product-name");
  const productPrice = document.getElementById("product-price");
  const productDesc = document.getElementById("product-desc");
  const buyButton = document.getElementById("buy-button");

  productImage.src = product.image;
  productName.innerText = product.name;
  productPrice.innerText = `\$${product.price.toFixed(2)}`;
  buyButton.disabled = false;

  if (product.description) {
    productDesc.innerHTML = product.description;
  } else {
    productDesc.innerHTML = "No description available.";
  }

  document.title = `${product.name} | E-Commerce Project`;
}

function setRelatedProducts(allProducts, product) {
  const relatedContainer = document.getElementById("related");

  const related = allProducts.filter(value => value.category === product.category && value.id !== product.id);

  let newProductsString = "";

  for(const product of related) {
    newProductsString += `
      <div class="col-md-4 mb-3">
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
      </div>
    `;
  }

  if(newProductsString === "") {
    relatedContainer.innerHTML = "<p>No related products found.</p>";
  } else {
    relatedContainer.innerHTML = newProductsString;
  }
}

document.addEventListener("DOMContentLoaded", async function (e) {
  // Get the products when available
  const products = await productsPromise;

  // Get the ID from the URL
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const productID = urlParams.get("id");

  for (const product of products) {
    // Find the product ID in the list of products returned
    // TODO: Implement binary search?
    if (product.id == productID) {
      updateProductInfo(product);

      setRelatedProducts(products, product);

      break;
    }
  }
});
