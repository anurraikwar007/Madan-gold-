import Admin from "../models/admin.model.js";
import Customer from "../models/customer.model.js";
import { generateToken } from "../utils/jwt.js";

// =========================
// Customer Register
// =========================

export const registerCustomer = async (data) => {
  const { name, email, phone, password, gender } = data;

  const emailExists = await Customer.findOne({ email });

  if (emailExists) {
    throw new Error("Email already registered");
  }

  const phoneExists = await Customer.findOne({ phone });

  if (phoneExists) {
    throw new Error("Phone already registered");
  }

  return await Customer.create({
    name,
    email,
    phone,
    password,
    gender,
  });
};

// =========================
// Customer Login
// =========================

export const loginCustomer = async (email, password) => {
  const customer = await Customer.findOne({ email }).select("+password");

  if (!customer) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await customer.comparePassword(password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  customer.lastLogin = new Date();

  await customer.save();

  const token = generateToken({
    id: customer._id,
    role: "Customer",
  });

  return {
    customer,
    token,
  };
};

// =========================
// Admin Functions
// =========================

export const findAdminByEmail = async (email) => {
  return await Admin.findOne({ email }).select("+password");
};

export const updateLastLogin = async (id) => {
  return await Admin.findByIdAndUpdate(id, {
    lastLogin: new Date(),
  });
};