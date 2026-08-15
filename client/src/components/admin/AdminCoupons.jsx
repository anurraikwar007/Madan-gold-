import {  useCallback, useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
} from "lucide-react";

import {
  getAdminCoupons,
  createAdminCoupon,
  updateAdminCoupon,
  deleteAdminCoupon,
} from "../../api/admin.api";

import {
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminModal,
  AdminConfirm,
  AdminPage,
} from "./AdminUI";

const initialForm = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  minimumOrderAmount: "0",
  maximumDiscount: "0",
  usageLimit: "",
  validFrom: "",
  validTill: "",
  isActive: true,
};

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState(
    []
  );

  const [form, setForm] =
    useState(initialForm);

  const [editing, setEditing] =
    useState(null);

  const [open, setOpen] =
    useState(false);

  const [deleteId, setDeleteId] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const load =  useCallback(async () => {
    setLoading(true);

    try {
      const response =
        await getAdminCoupons({
          page: 1,
          limit: 100,
          search,
        });

      const data =
        response?.data?.data;

      setCoupons(
        data?.docs ||
          data?.coupons ||
          (Array.isArray(data)
            ? data
            : [])
      );
    } catch (error) {
      console.error(
        "Coupons load failed:",
        error
      );
    } finally {
      setLoading(false);
    }
  },[search]);

  useEffect(() => {
  const timer = setTimeout(() => {
    load();
    }, 0);

    return () => clearTimeout(timer);
  }, [load]);

  const updateField = (
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openCreate = () => {
    setEditing(null);
    setForm(initialForm);
    setOpen(true);
  };

  const formatDateForInput = (
    value
  ) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const local = new Date(
      date.getTime() -
        date.getTimezoneOffset() *
          60000
    );

    return local
      .toISOString()
      .slice(0, 16);
  };

  const openEdit = (coupon) => {
    setEditing(coupon);

    setForm({
      code: coupon.code || "",
      description:
        coupon.description || "",
      discountType:
        coupon.discountType ||
        "percentage",
      discountValue:
        coupon.discountValue ?? "",
      minimumOrderAmount:
        coupon.minimumOrderAmount ??
        0,
      maximumDiscount:
        coupon.maximumDiscount ??
        0,
      usageLimit:
        coupon.usageLimit ?? "",
      validFrom:
        formatDateForInput(
          coupon.validFrom
        ),
      validTill:
        formatDateForInput(
          coupon.validTill
        ),
      isActive:
        coupon.isActive !== false,
    });

    setOpen(true);
  };

  const save = async (event) => {
    event.preventDefault();

    setSaving(true);

    try {
      const payload = {
        code: form.code
          .trim()
          .toUpperCase(),

        description:
          form.description.trim(),

        discountType:
          form.discountType,

        discountValue:
          Number(
            form.discountValue
          ) || 0,

        minimumOrderAmount:
          Number(
            form.minimumOrderAmount
          ) || 0,

        maximumDiscount:
          Number(
            form.maximumDiscount
          ) || 0,

        usageLimit:
          form.usageLimit === ""
            ? null
            : Number(
                form.usageLimit
              ),

        validFrom: form.validFrom
          ? new Date(
              form.validFrom
            ).toISOString()
          : null,

        validTill: form.validTill
          ? new Date(
              form.validTill
            ).toISOString()
          : null,

        isActive: form.isActive,
      };

      if (editing) {
        await updateAdminCoupon(
          editing._id,
          payload
        );
      } else {
        await createAdminCoupon(
          payload
        );
      }

      setOpen(false);
      setEditing(null);
      setForm(initialForm);

      await load();
    } catch (error) {
      console.error(
        "Coupon save failed:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteId) return;

    setSaving(true);

    try {
      await deleteAdminCoupon(
        deleteId
      );

      setDeleteId(null);

      await load();
    } catch (error) {
      console.error(
        "Coupon delete failed:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPage
      title="Coupons"
      description="Manage discount codes and promotional offers"
      action={
        <AdminButton
          variant="gold"
          onClick={openCreate}
        >
          <Plus size={17} />
          Add Coupon
        </AdminButton>
      }
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                load();
              }
            }}
            placeholder="Search coupon code..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#B88A44]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-4">
                  Code
                </th>

                <th className="px-5 py-4">
                  Discount
                </th>

                <th className="px-5 py-4">
                  Min Order
                </th>

                <th className="px-5 py-4">
                  Usage
                </th>

                <th className="px-5 py-4">
                  Validity
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="border-t border-slate-100"
                >
                  <td className="px-5 py-4">
                    <p className="font-bold tracking-wide text-slate-800">
                      {coupon.code}
                    </p>

                    {coupon.description && (
                      <p className="mt-1 max-w-[220px] truncate text-xs text-slate-400">
                        {
                          coupon.description
                        }
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4 font-semibold text-[#B88A44]">
                    {coupon.discountType ===
                    "percentage"
                      ? `${coupon.discountValue}%`
                      : `₹${Number(
                          coupon.discountValue ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}`}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    ₹
                    {Number(
                      coupon.minimumOrderAmount ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {coupon.usedCount ||
                      0}
                    {" / "}
                    {coupon.usageLimit ||
                      "∞"}
                  </td>

                  <td className="px-5 py-4 text-xs text-slate-500">
                    <div>
                      {coupon.validFrom
                        ? new Date(
                            coupon.validFrom
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "—"}
                    </div>

                    <div className="mt-1">
                      {coupon.validTill
                        ? new Date(
                            coupon.validTill
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "—"}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        coupon.isActive !==
                        false
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {coupon.isActive !==
                      false
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          openEdit(coupon)
                        }
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      >
                        <Pencil
                          size={17}
                        />
                      </button>

                      <button
                        onClick={() =>
                          setDeleteId(
                            coupon._id
                          )
                        }
                        className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2
                          size={17}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!coupons.length &&
                !loading && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-12 text-center text-slate-400"
                    >
                      No coupons found.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>

      <AdminModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
        title={
          editing
            ? "Edit Coupon"
            : "Create Coupon"
        }
        width="max-w-3xl"
      >
        <form
          onSubmit={save}
          className="space-y-5"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <AdminInput
              label="Coupon Code"
              value={form.code}
              onChange={(e) =>
                updateField(
                  "code",
                  e.target.value
                )
              }
              placeholder="WELCOME10"
              required
            />

            <AdminSelect
              label="Discount Type"
              value={
                form.discountType
              }
              onChange={(e) =>
                updateField(
                  "discountType",
                  e.target.value
                )
              }
            >
              <option value="percentage">
                Percentage
              </option>

              <option value="flat">
                Flat Amount
              </option>
            </AdminSelect>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <AdminInput
              label={
                form.discountType ===
                "percentage"
                  ? "Discount %"
                  : "Discount Amount"
              }
              type="number"
              min="0"
              value={
                form.discountValue
              }
              onChange={(e) =>
                updateField(
                  "discountValue",
                  e.target.value
                )
              }
              required
            />

            <AdminInput
              label="Minimum Order"
              type="number"
              min="0"
              value={
                form.minimumOrderAmount
              }
              onChange={(e) =>
                updateField(
                  "minimumOrderAmount",
                  e.target.value
                )
              }
            />

            <AdminInput
              label="Maximum Discount"
              type="number"
              min="0"
              value={
                form.maximumDiscount
              }
              onChange={(e) =>
                updateField(
                  "maximumDiscount",
                  e.target.value
                )
              }
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <AdminInput
              label="Usage Limit"
              type="number"
              min="1"
              value={form.usageLimit}
              onChange={(e) =>
                updateField(
                  "usageLimit",
                  e.target.value
                )
              }
              placeholder="Unlimited"
            />

            <AdminInput
              label="Valid From"
              type="datetime-local"
              value={
                form.validFrom
              }
              onChange={(e) =>
                updateField(
                  "validFrom",
                  e.target.value
                )
              }
              required
            />

            <AdminInput
              label="Valid Till"
              type="datetime-local"
              value={
                form.validTill
              }
              onChange={(e) =>
                updateField(
                  "validTill",
                  e.target.value
                )
              }
              required
            />
          </div>

          <AdminInput
            label="Description"
            value={form.description}
            onChange={(e) =>
              updateField(
                "description",
                e.target.value
              )
            }
            placeholder="Festival discount..."
          />

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
            <span className="text-sm font-medium text-slate-700">
              Active Coupon
            </span>

            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                updateField(
                  "isActive",
                  e.target.checked
                )
              }
              className="h-4 w-4 accent-[#B88A44]"
            />
          </label>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <AdminButton
              variant="soft"
              onClick={() =>
                setOpen(false)
              }
            >
              Cancel
            </AdminButton>

            <AdminButton
              type="submit"
              variant="gold"
              loading={saving}
            >
              {editing
                ? "Update Coupon"
                : "Create Coupon"}
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      <AdminConfirm
        open={!!deleteId}
        onCancel={() =>
          setDeleteId(null)
        }
        onConfirm={remove}
        loading={saving}
        title="Delete Coupon?"
        message="This coupon will no longer be available for customers."
      />
    </AdminPage>
  );
}