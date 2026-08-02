import Admin from "../models/admin.model.js";
import Customer from "../models/customer.model.js";
import cloudinary from "../config/cloudinary.js";
import { generateToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";

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

  

  const directMatch = await bcrypt.compare(password, customer.password);
  

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

// ======================================================
// Update Profile
// ======================================================

export const updateProfile = async (
    customerId,
    payload
) => {

    const customer =
        await CustomerRepository.findById(customerId);

    if (!customer) {

        throw new Error(
            "Customer not found."
        );

    }

    if (
        payload.phone &&
        payload.phone !== customer.phone
    ) {

        const exists =
            await CustomerRepository.findOne({

                phone: payload.phone,

                _id: {
                    $ne: customerId,
                },

            });

        if (exists) {

            throw new Error(
                "Phone already exists."
            );

        }

    }

    Object.assign(
        customer,
        payload
    );

    await customer.save();

    customer.password = undefined;

    return customer;

};

   // =========================
  // Update Customer Avatar
 // =========================

  export const updateAvatar = async (
    customerId,
    avatar
) => {

    const customer =
        await Customer.findById(customerId);

    if (!customer) {
        throw new Error("Customer not found");
    }

    // Delete old avatar
    if (customer.avatar?.public_id) {

        await cloudinary.uploader.destroy(
            customer.avatar.public_id
        );

    }

    customer.avatar = avatar;

    await customer.save();

    customer.password = undefined;

    return customer;

 };
 
   // =========================
  // Get Customer Addresses
 // =========================

    export const getAddresses = async (
        customerId
    ) => {

        const customer =
            await Customer.findById(customerId);

        if (!customer) {
            throw new Error("Customer not found");
        }

        return customer.addresses;

    };

     // =========================
    // Add Customer Address
   // =========================

    export const addAddress = async (
        customerId,
        payload
    ) => {

        const customer =
            await Customer.findById(customerId);

        if (!customer) {
            throw new Error("Customer not found");
        }

        if (payload.isDefault) {

            customer.addresses.forEach(address => {
                address.isDefault = false;
            });

        }

        customer.addresses.push(payload);

        await customer.save();

        return customer.addresses;

    };
     // =========================
    // Update Customer Address
   // =========================

    export const updateAddress = async (
        customerId,
        addressId,
        payload
    ) => {

        const customer =
            await Customer.findById(customerId);

        if (!customer) {
            throw new Error("Customer not found");
        }

        const address =
            customer.addresses.id(addressId);

        if (!address) {
            throw new Error("Address not found");
        }

        if (payload.isDefault) {

            customer.addresses.forEach(item => {
                item.isDefault = false;
            });

        }

        Object.assign(address, payload);

        await customer.save();

        return customer.addresses;

    };
   
    // =========================
    // Delete Customer Address
    // =========================

    export const deleteAddress = async (
        customerId,
        addressId
    ) => {

        const customer =
            await Customer.findById(customerId);

        if (!customer) {
            throw new Error("Customer not found");
        }

        const address =
            customer.addresses.id(addressId);

        if (!address) {
            throw new Error("Address not found");
        }

        address.deleteOne();

        await customer.save();

        return customer.addresses;

    };

    // =========================
    // Admin Functions
    // =========================

    export const findAdminByEmail = async (email) => {
      return await Admin.findOne({ email }).select("+password");
    };
    
    // =========================
    // Update Admin Last Login
    // =========================
    
    export const updateLastLogin = async (id) => {
      return await Admin.findByIdAndUpdate(id, {
        lastLogin: new Date(),
      });
};