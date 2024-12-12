import notificationsModel from "../models/notificationsModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import fs from "fs";
import path from "path";
import { Parser } from "json2csv";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import orderModel from "./models/orderModel.js";
const generateCSV = async () => {
  try {
    const orders = await orderModel.find({}, { userId: 1, items: 1, date: 1 });
    const allMedicines = new Set();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        allMedicines.add(item.name); // Add medicine name to the Set
      });
    });

    // Convert the Set to an array of unique medicine names
    const uniqueMedicines = Array.from(allMedicines);

    // Prepare the data for CSV
    const csvData = orders.map((order) => {
      const row = {
        userId: order.userId,
        date: order.date,
      };

      // Add columns for each unique medicine
      uniqueMedicines.forEach((medicine) => {
        // Find the medicine in the order's items
        const foundItem = order.items.find((item) => item.name === medicine);
        row[medicine] = foundItem ? foundItem.quantity : 0; // Set the quantity or 0 if not found
      });

      return row;
    });

    // Define fields (columns) for CSV
    const fields = ["userId", "date", ...uniqueMedicines];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(csvData);
    const filePath = path.join(__dirname, "exports", "products.csv");
    // Save CSV to file
    fs.writeFileSync(filePath, csv);
    console.log("CSV file generated successfully:", filePath);
  } catch (error) {
    console.error("Error generating CSV:", error);
  }
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// place order function
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:3000";
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    const order = await newOrder.save();
    let notify = new notificationsModel({
      userId: req.body.userId,
      orderId: order._id,
    });

    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
    await notify.save();
    await generateCSV();
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });
    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });

      res.json({
        success: true,
        message: "Paid",
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({
        success: false,
        message: "Not Paid",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

// user orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};
const getOrder = async (req, res) => {
  try {
    const response = await orderModel.findById(req.body.orderId);

    const item = response.items;
    res.json({
      success: true,
      item,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};
// All the orders of all the users for admin panel
const Listorders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    await generateCSV();
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

// Update order status

const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

export {
  placeOrder,
  verifyOrder,
  userOrders,
  Listorders,
  updateStatus,
  getOrder,
};
