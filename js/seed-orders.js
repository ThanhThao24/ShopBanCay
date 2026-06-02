import { db, collection, addDoc } from "./firebase.js";

const orders = JSON.parse(localStorage.getItem("mamxanh_orders") || "[]");

async function uploadOrders() {
  try {
    for (const order of orders) {
      await addDoc(collection(db, "orders"), order);
      console.log("Uploaded:", order.id);
    }

    console.log("Orders upload hoàn tất!");
  } catch (error) {
    console.error(error);
  }
}

uploadOrders();
