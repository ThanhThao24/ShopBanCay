import { db, collection, addDoc } from "./firebase.js";

const categories = JSON.parse(
  localStorage.getItem("mamxanh_categories") || "[]",
);

async function uploadCategories() {
  try {
    for (const category of categories) {
      await addDoc(collection(db, "categories"), category);
      console.log("Uploaded:", category.name);
    }

    console.log("Categories upload hoàn tất!");
  } catch (error) {
    console.error(error);
  }
}

uploadCategories();
