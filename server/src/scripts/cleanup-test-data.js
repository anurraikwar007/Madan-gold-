import mongoose from "mongoose";
import "dotenv/config";
import connectDB from "../config/database.js";
import Customer from "../models/customer.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Coupon from "../models/coupon.model.js";

if (process.env.ALLOW_TEST_DATA_CLEANUP !== "true") {
  console.error("Refusing to delete data. Set ALLOW_TEST_DATA_CLEANUP=true for an explicit cleanup run.");
  process.exit(1);
}

const patterns = [
  /^test(?:[._ -]|$)/i,
  /^dummy(?:[._ -]|$)/i,
  /^demo(?:[._ -]|$)/i,
  /^sample(?:[._ -]|$)/i,
  /^fake(?:[._ -]|$)/i,
];

const regex = patterns.map((p) => p.source).join("|");

const run = async () => {
  await connectDB();
  const customerFilter = { $or: [{ name: { $regex: regex } }, { email: { $regex: regex } }, { phone: { $regex: regex } }] };
  const customers = await Customer.find(customerFilter).select("_id name email phone").lean();
  const ids = customers.map((c) => c._id);
  const [orders, products, coupons] = await Promise.all([
    Order.countDocuments({ $or: [{ customer: { $in: ids } }, { orderNumber: { $regex: regex, $options: "i" } }] }),
    Product.countDocuments({ $or: [{ name: { $regex: regex } }, { sku: { $regex: regex } }] }),
    Coupon.countDocuments({ $or: [{ code: { $regex: regex } }, { description: { $regex: regex } }] }),
  ]);
  console.log(`Matched before delete: customers=${customers.length}, orders=${orders}, products=${products}, coupons=${coupons}`);
  await Promise.all([
    Customer.deleteMany(customerFilter),
    Order.deleteMany({ $or: [{ customer: { $in: ids } }, { orderNumber: { $regex: regex, $options: "i" } }] }),
    Product.deleteMany({ $or: [{ name: { $regex: regex } }, { sku: { $regex: regex } }] }),
    Coupon.deleteMany({ $or: [{ code: { $regex: regex } }, { description: { $regex: regex } }] }),
  ]);
  console.log("Explicit test-data cleanup complete.");
  await mongoose.connection.close();
};
run().catch(async (error) => { console.error(error); await mongoose.connection.close().catch(()=>{}); process.exit(1); });
