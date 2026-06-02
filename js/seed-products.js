import { db, collection, addDoc } from "./firebase.js";

const products = JSON.parse(localStorage.getItem("mamxanh_products") || "[]");

async function uploadProducts() {
  try {
    for (const product of products) {
      await addDoc(collection(db, "products"), product);
      console.log("Uploaded:", product.name);
    }

    console.log("Upload hoàn tất!");
  } catch (error) {
    console.error(error);
  }
}

uploadProducts();
