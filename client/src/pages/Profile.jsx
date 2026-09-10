import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as AuthAPI from "../api/auth.api";

const Profile = () => {
  const { user, loadProfile } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [addresses, setAddresses] = useState([]);

const [addressForm, setAddressForm] = useState({
  fullName: "",
  phone: "",
  pincode: "",
  house: "",
  area: "",
  landmark: "",
  city: "",
  state: "",
  country: "India",
  type: "Home",
  isDefault: false,
});

const [editingAddressId, setEditingAddressId] =
  useState(null);

const [addressSaving, setAddressSaving] =
  useState(false);

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [passwordSaving, setPasswordSaving] =
  useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadAddresses = async () => {
  try {
    const { data } =
      await AuthAPI.getAddresses();

    setAddresses(data?.data || []);
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Unable to load addresses."
    );
  }
};

const handleAddressChange = (e) => {
  const { name, value, type, checked } =
    e.target;

  setAddressForm((prev) => ({
    ...prev,
    [name]:
      type === "checkbox"
        ? checked
        : value,
  }));
};

const resetAddressForm = () => {
  setAddressForm({
    fullName: "",
    phone: "",
    pincode: "",
    house: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    country: "India",
    type: "Home",
    isDefault: false,
  });

  setEditingAddressId(null);
};

const handleAddressSubmit = async (e) => {
  e.preventDefault();

  setAddressSaving(true);
  setMessage("");
  setError("");

  try {
    if (editingAddressId) {
      await AuthAPI.updateAddress(
        editingAddressId,
        addressForm
      );

      setMessage(
        "Address updated successfully."
      );
    } else {
      await AuthAPI.addAddress(
        addressForm
      );

      setMessage(
        "Address added successfully."
      );
    }

    await loadAddresses();
    resetAddressForm();
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Address operation failed."
    );
  } finally {
    setAddressSaving(false);
  }
};

const handleEditAddress = (address) => {
  setEditingAddressId(
    address._id || address.id
  );

      setAddressForm({
      fullName: address.fullName || "",
      phone: address.phone || "",
      pincode: address.pincode || "",
      house: address.house || "",
      area: address.area || "",
      landmark: address.landmark || "",
      city: address.city || "",
      state: address.state || "",
      country:
        address.country || "India",
      type:
        address.type || "Home",
      isDefault:
        Boolean(address.isDefault),
    });

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const handleDeleteAddress = async (
  addressId
) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this address?"
  );

  if (!confirmed) return;

  setError("");
  setMessage("");

  try {
    await AuthAPI.deleteAddress(
      addressId
    );

    await loadAddresses();

    if (
      editingAddressId === addressId
    ) {
      resetAddressForm();
    }

    setMessage(
      "Address deleted successfully."
    );
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Unable to delete address."
    );
  }
};
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const profile =
          await loadProfile();

        const customer =
          profile || user;

        setForm({
          name: customer?.name || "",
          phone: customer?.phone || "",
        });

        await loadAddresses();
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      await AuthAPI.updateProfile(form);

      await loadProfile();

      setMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Profile update failed."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setPasswordSaving(true);
    setMessage("");
    setError("");

    try {
      await AuthAPI.changePassword(
        passwordForm
      );

      setPasswordForm({
        oldPassword: "",
        newPassword: "",
      });

      setMessage(
        "Password changed successfully. Please login again."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Password change failed."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <p className="text-gray-500">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">

        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
            My Account
          </p>

          <h1 className="heading mt-3 text-4xl sm:text-5xl text-[#111111]">
            Profile
          </h1>
        </div>

        {message && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* PROFILE */}

          <div className="rounded-[2rem] bg-white p-6 sm:p-8 shadow-sm border border-black/5">

            <h2 className="text-xl font-semibold text-[#111111]">
              Personal Information
            </h2>

            <form
              onSubmit={handleProfileSubmit}
              className="mt-6 space-y-5"
            >

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="h-14 w-full rounded-2xl border border-black/10 bg-[#FAF9F6] px-5 outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <input
                  value={user?.email || ""}
                  disabled
                  className="h-14 w-full rounded-2xl border border-black/10 bg-gray-100 px-5 text-gray-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Phone
                </label>

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="h-14 w-full rounded-2xl border border-black/10 bg-[#FAF9F6] px-5 outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="h-14 w-full rounded-2xl bg-[#111111] font-semibold text-white transition hover:bg-[#D4AF37] hover:text-black disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </form>
          </div>

          {/* PASSWORD */}

          <div className="rounded-[2rem] bg-white p-6 sm:p-8 shadow-sm border border-black/5">

            <h2 className="text-xl font-semibold text-[#111111]">
              Change Password
            </h2>

            <form
              onSubmit={handlePasswordSubmit}
              className="mt-6 space-y-5"
            >

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Current Password
                </label>

                <input
                  type="password"
                  name="oldPassword"
                  value={
                    passwordForm.oldPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  required
                  className="h-14 w-full rounded-2xl border border-black/10 bg-[#FAF9F6] px-5 outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  New Password
                </label>

                <input
                  type="password"
                  name="newPassword"
                  value={
                    passwordForm.newPassword
                  }
                  onChange={
                    handlePasswordChange
                  }
                  required
                  minLength={8}
                  className="h-14 w-full rounded-2xl border border-black/10 bg-[#FAF9F6] px-5 outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                disabled={passwordSaving}
                className="h-14 w-full rounded-2xl border border-[#111111] font-semibold text-[#111111] transition hover:bg-[#111111] hover:text-white disabled:opacity-50"
              >
                {passwordSaving
                  ? "Updating..."
                  : "Change Password"}
              </button>

            </form>
          </div>

        </div>

        {/* ADDRESSES */}

        <div className="mt-6 rounded-[2rem] bg-white p-6 sm:p-8 shadow-sm border border-black/5">

  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

    <div>
      <h2 className="text-xl font-semibold text-[#111111]">
        Saved Addresses
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Manage your delivery addresses.
      </p>
    </div>

    <span className="text-sm text-gray-500">
      {addresses.length} saved
    </span>

  </div>

  {/* ADDRESS FORM */}

  <form
    onSubmit={handleAddressSubmit}
    className="mt-8 rounded-2xl border border-black/10 bg-[#FAF9F6] p-5 sm:p-6"
  >

    <div className="flex items-center justify-between gap-4">
      <h3 className="text-lg font-semibold text-[#111111]">
        {editingAddressId
          ? "Edit Address"
          : "Add New Address"}
      </h3>

      {editingAddressId && (
        <button
          type="button"
          onClick={resetAddressForm}
          className="text-sm font-medium text-gray-500 hover:text-[#111111]"
        >
          Cancel Edit
        </button>
      )}
    </div>

    <div className="mt-6 grid gap-4 sm:grid-cols-2">

      <div>
        <label className="mb-2 block text-sm font-medium">
          Full Name
        </label>

        <input
          name="fullName"
          value={addressForm.fullName}
          onChange={handleAddressChange}
          required
          className="h-13 w-full rounded-xl border border-black/10 bg-white px-4 outline-none focus:border-[#D4AF37]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Phone
        </label>

        <input
          name="phone"
          value={addressForm.phone}
          onChange={handleAddressChange}
          required
          className="h-13 w-full rounded-xl border border-black/10 bg-white px-4 outline-none focus:border-[#D4AF37]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          House / Flat
        </label>

        <input
          name="house"
          value={addressForm.house}
          onChange={handleAddressChange}
          required
          className="h-13 w-full rounded-xl border border-black/10 bg-white px-4 outline-none focus:border-[#D4AF37]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Area
        </label>

        <input
          name="area"
          value={addressForm.area}
          onChange={handleAddressChange}
          required
          className="h-13 w-full rounded-xl border border-black/10 bg-white px-4 outline-none focus:border-[#D4AF37]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          City
        </label>

        <input
          name="city"
          value={addressForm.city}
          onChange={handleAddressChange}
          required
          className="h-13 w-full rounded-xl border border-black/10 bg-white px-4 outline-none focus:border-[#D4AF37]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          State
        </label>

        <input
          name="state"
          value={addressForm.state}
          onChange={handleAddressChange}
          required
          className="h-13 w-full rounded-xl border border-black/10 bg-white px-4 outline-none focus:border-[#D4AF37]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Pincode
        </label>

        <input
          name="pincode"
          value={addressForm.pincode}
          onChange={handleAddressChange}
          required
          inputMode="numeric"
          maxLength={6}
          className="h-13 w-full rounded-xl border border-black/10 bg-white px-4 outline-none focus:border-[#D4AF37]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Landmark
        </label>

        <input
          name="landmark"
          value={addressForm.landmark}
          onChange={handleAddressChange}
          className="h-13 w-full rounded-xl border border-black/10 bg-white px-4 outline-none focus:border-[#D4AF37]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Address Type
        </label>

        <select
          name="type"
          value={addressForm.type || "Home"}
          onChange={handleAddressChange}
          className="h-13 w-full rounded-xl border border-black/10 bg-white px-4 outline-none focus:border-[#D4AF37]"
        >
          <option value="Home">
            Home
          </option>

          <option value="Work">
            Work
          </option>
        </select>
      </div>

      <div className="flex items-center gap-3 sm:pt-8">
        <input
          id="isDefault"
          type="checkbox"
          name="isDefault"
          checked={addressForm.isDefault}
          onChange={handleAddressChange}
          className="h-4 w-4 accent-[#D4AF37]"
        />

        <label
          htmlFor="isDefault"
          className="text-sm text-gray-700"
        >
          Make this my default address
        </label>
      </div>

    </div>

                <button
                  type="submit"
                  disabled={addressSaving}
                  className="mt-6 h-13 w-full rounded-xl bg-[#111111] font-semibold text-white transition hover:bg-[#D4AF37] hover:text-black disabled:opacity-50"
                >
                  {addressSaving
                    ? "Saving..."
                    : editingAddressId
                      ? "Update Address"
                      : "Add Address"}
                </button>

              </form>

              {/* SAVED ADDRESS LIST */}

              <div className="mt-8">

                {addresses.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-black/10 p-8 text-center">
                    <p className="text-sm text-gray-500">
                      No saved addresses yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">

                    {addresses.map((address) => {

                      const addressId =
                        address._id ||
                        address.id;

                      return (
                        <div
                          key={addressId}
                          className="rounded-2xl border border-black/10 bg-[#FAF9F6] p-5"
                        >

                          <div className="flex items-start justify-between gap-4">

                            <div>
                              <div className="flex flex-wrap items-center gap-2">

                                <p className="font-semibold text-[#111111]">
                                  {address.fullName ||
                                    user?.name}
                                </p>

                                {address.isDefault && (
                                  <span className="rounded-full bg-[#D4AF37]/15 px-3 py-1 text-xs font-medium text-[#8B7418]">
                                    Default
                                  </span>
                                )}

                              </div>

                              {address.type && (
                                <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">
                                  {address.type}
                                </p>
                              )}
                            </div>

                          </div>

                          <div className="mt-4 space-y-1 text-sm text-gray-600">

                            <p>
                              {address.house}
                              {address.area
                                ? `, ${address.area}`
                                : ""}
                            </p>

                            <p>
                              {address.city},{" "}
                              {address.state}{" "}
                              {address.pincode}
                            </p>

                            {address.landmark && (
                              <p>
                                Landmark:{" "}
                                {address.landmark}
                              </p>
                            )}

                            {address.country && (
                              <p>
                                {address.country}
                              </p>
                            )}

                            {address.phone && (
                              <p className="pt-1 font-medium text-gray-700">
                                {address.phone}
                              </p>
                            )}

                          </div>

                          <div className="mt-5 flex gap-3">

                            <button
                              type="button"
                              onClick={() =>
                                handleEditAddress(
                                  address
                                )
                              }
                              className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-[#111111] transition hover:border-[#D4AF37]"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteAddress(
                                  addressId
                                )
                              }
                              className="flex-1 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
                            >
                              Delete
                            </button>

                          </div>

                        </div>
                      );
                    })}

                  </div>
                )}

              </div>

            </div>

      </div>
    </div>
  );
};

export default Profile;