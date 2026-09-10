import ApiError from "../utils/apiError.js";

const normalizeEmail = (email) =>
  String(email)
    .trim()
    .toLowerCase();

const normalizePhone = (phone) =>
  String(phone).trim();

export const CustomerDTO = {
  create(payload = {}) {
    if (
      !payload.name ||
      !payload.email ||
      !payload.phone ||
      !payload.password
    ) {
      throw new ApiError(
        400,
        "Name, email, phone and password are required."
      );
    }

    return {
      name: String(
        payload.name
      ).trim(),

      email: normalizeEmail(
        payload.email
      ),

      phone: normalizePhone(
        payload.phone
      ),

      password: String(
        payload.password
      ),

      gender:
        payload.gender || "Other",

      dob:
        payload.dob || null,
    };
  },

  update(payload = {}) {
    const allowedFields = [
      "name",
      "email",
      "phone",
      "gender",
      "dob",
      "avatar",
    ];

    const result = {};

    for (const field of allowedFields) {
      if (
        payload[field] !== undefined
      ) {
        result[field] =
          payload[field];
      }
    }

    if (result.name) {
      result.name =
        String(
          result.name
        ).trim();
    }

    if (result.email) {
      result.email =
        normalizeEmail(
          result.email
        );
    }

    if (result.phone) {
      result.phone =
        normalizePhone(
          result.phone
        );
    }

    if (
      Object.keys(result)
        .length === 0
    ) {
      throw new ApiError(
        400,
        "No valid customer fields provided."
      );
    }

    return result;
  },
};

export default CustomerDTO;