function updatePreview() {
  const productName = document.getElementById("productName").value;
  const price = document.getElementById("price").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  document.getElementById("previewName").textContent =
    productName || "Product Name";
  document.getElementById("previewPrice").textContent = `Price: \$${
    price ? Number(price).toFixed(2) : "0.00"
  }`;
  document.getElementById("previewCategory").textContent = `Category: ${
    category && category !== "selectCategory" ? category : ""
  }`;
  document.getElementById("previewDescription").innerHTML = `Description: ${
    description || ""
  }`;

  const imagePreview = document.getElementById("previewImage");
  const image = getImageForCategory(category);
  if (image !== "") {
    imagePreview.src = image;
    imagePreview.style.display = "block";
  } else {
    imagePreview.style.display = "none";
  }

  if(checkFields()) {
    document.getElementById("addProductButton").removeAttribute("disabled");
  } else {
    document.getElementById("addProductButton").setAttribute("disabled", "disabled");
  }
}

// Get the image location for each category
function getImageForCategory(category) {
  switch (category) {
    case "Electronics":
      return "./images/electronics.jpeg";
    case "Furniture":
      return "./images/furniture.jpeg";
    case "DIY/Hardware Items":
      return "./images/drill.jpeg";
    case "Sports":
      return "./images/sports.jpeg";
    case "Outside":
      return "./images/outdoor.jpeg";
    case "Personal Care":
      return "./images/personalcare.jpg";
    case "Fashion":
      return "./images/fashion.jpg";
    case "Food/Beverage":
      return "./images/foodbeverage.jpg";
    default:
      return "";
  }
}

function updateImagePreview() {
  const file = document.getElementById("imageUpload").files[0];
  const previewImage = document.getElementById("previewImage");

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
      previewImage.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    previewImage.src = "";
    previewImage.style.display = "none";
  }
}

document.getElementById("productName").addEventListener("input", updatePreview);
document.getElementById("price").addEventListener("input", updatePreview);
document.getElementById("category").addEventListener("change", updatePreview);
document.getElementById("description").addEventListener("input", updatePreview);

const priceInput = document.getElementById("price");

priceInput.addEventListener("beforeinput", (event) => {
  const currentValue = event.target.value;
  const newChar = event.data;

  if (newChar && !/[0-9.]/.test(newChar)) {
    event.preventDefault();
    return;
  }

  if (newChar === "." && currentValue.includes(".")) {
    event.preventDefault();
    return;
  }

  const decimalIndex = currentValue.indexOf(".");
  if (
    decimalIndex !== -1 &&
    currentValue.length - decimalIndex > 2 &&
    newChar !== null
  ) {
    event.preventDefault();
  }
});

// Function to check if all fields have content
function checkFields() {
  const name = document.getElementById("productName").value.trim();
  const price = document.getElementById("price").value.trim();
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value.trim();

  // Check if all fields are filled and if category is not "selectCategory"
  return name !== "" && price !== "" && category !== "" && description !== "";
}

// Function to handle button click
document.getElementById("addProductButton").addEventListener("click", () => {
  if (checkFields()) {
    // All fields have content, proceed to add the product
    const newProduct = {
      name: document.getElementById("productName").value,
      price: parseFloat(document.getElementById("price").value),
      category: document.getElementById("category").value,
      description: document.getElementById("description").value,
      image: getImageForCategory(document.getElementById("category").value),
    };

    if (isDuplicateProduct(newProduct)) {
      alert("This product already exists.");
    } else {
      saveProduct(newProduct);
      alert("Product added successfully!");
      clearForm(); // Clear form fields after saving
      updatePreview();
    }
  } else {
    // Display an error message if any field is empty or category is "selectCategory"
    alert("Please fill in all fields and select a valid category.");
  }
});

// Update the clearForm function to reset the category to "Select Category"
function clearForm() {
  document.getElementById("productName").value = "";
  document.getElementById("price").value = "";
  document.getElementById("category").value = ""; // Reset to "Select Category"
  document.getElementById("description").value = "";
  updatePreview();
}

// Function to check for duplicate products
function isDuplicateProduct(newProduct) {
  const products = getProducts();
  return products.some(
    (product) =>
      product.name === newProduct.name &&
      product.price === newProduct.price &&
      product.category === newProduct.category &&
      product.description === newProduct.description
  );
}

// Function to save the product
function saveProduct(product) {
  let products = JSON.parse(localStorage.getItem("products")) || [];
  product.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
  products.push(product);
  localStorage.setItem("products", JSON.stringify(products));
}

// Function to retrieve products
function getProducts() {
  return JSON.parse(localStorage.getItem("products")) || [];
}

updatePreview();
