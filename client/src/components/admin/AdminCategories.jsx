import {
  useEffect,
  useState,
} from "react";

import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  toggleAdminCategory,
  deleteAdminCategory,
} from "../../api/admin.api";

import {
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminModal,
  AdminConfirm,
  AdminPage,
  AdminToggle,
  AdminStatus,
  AdminCard,
} from "./AdminUI";

const initialForm = {
  name: "",
  description: "",
  isActive: true,
  isFeatured: false,
};

export default function AdminCategories() {
  const [categories, setCategories] =
    useState([]);
   
  const [selectedIds, setSelectedIds,] = 
    useState([]);

  const [form, setForm] =
    useState(initialForm);

  const [editing, setEditing] =
    useState(null);

  const [open, setOpen] =
    useState(false);

  

  const [deleteId, setDeleteId] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const load = async () => {
    setLoading(true);

    try {
      const response =
        await getAdminCategories({
          page: 1,
          limit: 100,
        });

      const data = response?.data?.data;

      setCategories(
        data?.docs ||
          data?.categories ||
          (Array.isArray(data) ? data : [])
      );
    } catch (error) {
      console.error(
        "Failed to load categories:",
        error
      );

      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
      const timer = setTimeout(() => {
        load();
      }, 0);

      return () => clearTimeout(timer);
    }, []);

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
    setForm({
      ...initialForm,
    });
    setOpen(true);
  };

  const openEdit = (category) => {
    setEditing(category);

    setForm({
      name: category.name || "",

      description:
        category.description || "",

      isActive:
        category.isActive !== false,

      isFeatured:
        !!category.isFeatured,
    });

    setOpen(true);
  };

  const save = async (event) => {
    event.preventDefault();

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),

        description:
          form.description.trim(),

        isActive:
          form.isActive,

        isFeatured:
          form.isFeatured,
      };

      if (!payload.name) {
        throw new Error(
          "Category name is required."
        );
      }

      if (editing) {
        await updateAdminCategory(
          editing._id,
          payload
        );
      } else {
        await createAdminCategory(
          payload
        );
      }

      window.dispatchEvent(
        new Event(
          "categories-updated"
        )
      );

      setOpen(false);
      setEditing(null);
      setForm(initialForm);

      await load();
    } catch (error) {
      console.error(
        "Category save failed:",
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Category save failed."
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!deleteId) return;

    setSaving(true);

    try {
      await deleteAdminCategory(
        deleteId
      );

      window.dispatchEvent(
        new Event(
          "categories-updated"
        )
      );

      setDeleteId(null);

      await load();
    } catch (error) {
      console.error(
        "Category delete failed:",
        error
      );

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Category delete failed."
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleSelected = (id) => {
  setSelectedIds((prev) =>
    prev.includes(id)
      ? prev.filter(
          (item) => item !== id
        )
      : [...prev, id]
  );
};

const toggleSelectAll = () => {
  if (
    categories.length > 0 &&
    selectedIds.length ===
      categories.length
  ) {
    setSelectedIds([]);
    return;
  }

  setSelectedIds(
    categories.map(
      (item) => item._id
    )
  );
};

const bulkUpdateStatus = async (
  targetStatus
) => {
  if (!selectedIds.length) return;

  setSaving(true);

  try {
    const selectedCategories =
      categories.filter((category) =>
        selectedIds.includes(
          category._id
        )
      );

    const targets =
      selectedCategories.filter(
        (category) =>
          category.isActive !==
          targetStatus
      );

    await Promise.all(
      targets.map((category) =>
        toggleAdminCategory(
          category._id
        )
      )
    );

    setSelectedIds([]);

    await load();
  } catch (error) {
    console.error(
      "Category visibility update failed:",
      error
    );

    alert(
      error?.response?.data?.message ||
        "Unable to update visibility."
    );
  } finally {
    setSaving(false);
  }
};

const bulkDelete = async () => {
  if (!selectedIds.length) return;

  const confirmed = window.confirm(
    `Delete ${selectedIds.length} selected categories?`
  );

  if (!confirmed) return;

  setSaving(true);

  try {
    await Promise.all(
      selectedIds.map((id) =>
        deleteAdminCategory(id)
      )
    );

    setSelectedIds([]);

    await load();
  } catch (error) {
    console.error(
      "Bulk category delete failed:",
      error
    );

    alert(
      error?.response?.data?.message ||
        "Bulk delete failed."
    );
  } finally {
    setSaving(false);
  }
};

  return (
    <AdminPage
      title="Categories"
      description="Manage product categories used across the store"
      action={
        <AdminButton
          variant="gold"
          onClick={openCreate}
        >
          <Plus size={17} />
          Add Category
        </AdminButton>
      }
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          {selectedIds.length > 0 && (
  <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-[#eadfce] bg-[#fffaf0] p-3">
    <span className="mr-2 text-sm font-semibold">
                        {selectedIds.length} selected
                      </span>

                      <AdminButton
                        variant="soft"
                        onClick={() =>
                          bulkUpdateStatus(true)
                        }
                      >
                        Show
                      </AdminButton>

                      <AdminButton
                        variant="soft"
                        onClick={() =>
                          bulkUpdateStatus(false)
                        }
                      >
                        Hide
                      </AdminButton>

                      <AdminButton
                        variant="danger"
                        onClick={bulkDelete}
                      >
                        Delete
                      </AdminButton>
                    </div>
                  )}
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="w-12 px-5 py-4">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="text-[#8B6A48]"
                  >
                    {categories.length > 0 &&
                    selectedIds.length ===
                      categories.length ? (
                      <CheckSquare size={18} />
                    ) : (
                      <Square size={18} />
                    )}
                  </button>
                </th>
                
                <th className="px-5 py-4">
                  Category
                </th>

                <th className="px-5 py-4">
                  Description
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
                  Featured
                </th>

                <th className="px-5 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-10 text-center text-slate-400"
                  >
                    Loading categories...
                  </td>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center text-slate-400"
                  >
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length ? (
                categories.map(
                  (category) => (
                    <tr
                      key={
                        category._id
                      }
                      className="border-t border-slate-100"
                    >
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {
                          category.name
                        }
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {category.description ||
                          "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            category.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {category.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {category.isFeatured
                          ? "Yes"
                          : "No"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <AdminButton
                            variant="soft"
                            onClick={() =>
                              openEdit(
                                category
                              )
                            }
                          >
                            <Pencil
                              size={15}
                            />
                          </AdminButton>

                          <AdminButton
                            variant="danger"
                            onClick={() =>
                              setDeleteId(
                                category._id
                              )
                            }
                          >
                            <Trash2
                              size={15}
                            />
                          </AdminButton>
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-12 text-center text-slate-400"
                  >
                    No categories found.
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
          !saving && setOpen(false)
        }
        title={
          editing
            ? "Edit Category"
            : "Add Category"
        }
      >
        <form
          onSubmit={save}
          className="space-y-5"
        >
          <AdminInput
            label="Category Name"
            value={form.name}
            onChange={(e) =>
              updateField(
                "name",
                e.target.value
              )
            }
            required
          />

          <AdminTextarea
            label="Description"
            value={
              form.description
            }
            onChange={(e) =>
              updateField(
                "description",
                e.target.value
              )
            }
          />

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={
                  form.isActive
                }
                onChange={(e) =>
                  updateField(
                    "isActive",
                    e.target.checked
                  )
                }
              />
              Active
            </label>

            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={
                  form.isFeatured
                }
                onChange={(e) =>
                  updateField(
                    "isFeatured",
                    e.target.checked
                  )
                }
              />
              Featured
            </label>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <AdminButton
              variant="soft"
              type="button"
              onClick={() =>
                setOpen(false)
              }
              disabled={saving}
            >
              Cancel
            </AdminButton>

            <AdminButton
              variant="gold"
              type="submit"
              loading={saving}
            >
              {editing
                ? "Update Category"
                : "Create Category"}
            </AdminButton>
          </div>
        </form>
      </AdminModal>

      <AdminConfirm
        open={!!deleteId}
        loading={saving}
        onCancel={() =>
          !saving &&
          setDeleteId(null)
        }
        onConfirm={remove}
        title="Delete category?"
        message="This category will be removed from the active category list."
      />
    </AdminPage>
  );

   
}