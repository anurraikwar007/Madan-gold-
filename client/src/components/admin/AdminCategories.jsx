import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
} from "lucide-react";

import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "../../api/admin.api";

import {
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminModal,
  AdminConfirm,
  AdminPage,
} from "./AdminUI";

const initialForm = {
  name: "",
  description: "",
  isActive: true,
};

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);

    try {
      const response = await getAdminCategories({
        page: 1,
        limit: 100,
        search,
      });

      const data = response?.data?.data;

      setCategories(
        data?.categories ||
          (Array.isArray(data) ? data : [])
      );
    } catch (error) {
      console.error(
        "Categories load failed:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateField = (field, value) => {
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

  const openEdit = (category) => {
    setEditing(category);

    setForm({
      name: category.name || "",
      description:
        category.description || "",
      isActive:
        category.isActive !== false,
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
        isActive: form.isActive,
      };

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

      setOpen(false);
      setEditing(null);
      setForm(initialForm);

      await load();
    } catch (error) {
      console.error(
        "Category save failed:",
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
      await deleteAdminCategory(deleteId);

      setDeleteId(null);

      await load();
    } catch (error) {
      console.error(
        "Category delete failed:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminPage
      title="Categories"
      description="Manage product categories"
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
            placeholder="Search categories..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#B88A44]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-5 py-4">
                  Category
                </th>

                <th className="px-5 py-4">
                  Description
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
              {categories.map(
                (category) => (
                  <tr
                    key={category._id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {category.name}
                      </p>
                    </td>

                    <td className="max-w-md px-5 py-4 text-slate-500">
                      <p className="truncate">
                        {category.description ||
                          "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          category.isActive !==
                          false
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {category.isActive !==
                        false
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            openEdit(
                              category
                            )
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
                              category._id
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
                )
              )}

              {!categories.length &&
                !loading && (
                  <tr>
                    <td
                      colSpan="4"
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
          setOpen(false)
        }
        title={
          editing
            ? "Edit Category"
            : "Add Category"
        }
        width="max-w-xl"
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
            placeholder="e.g. Rings"
            required
          />

          <AdminTextarea
            label="Description"
            value={form.description}
            onChange={(e) =>
              updateField(
                "description",
                e.target.value
              )
            }
            placeholder="Category description..."
          />

          <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
            <span className="text-sm font-medium text-slate-700">
              Active Category
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
                ? "Update Category"
                : "Create Category"}
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
        title="Delete Category?"
        message="This category will be removed from the admin catalogue."
      />
    </AdminPage>
  );
}