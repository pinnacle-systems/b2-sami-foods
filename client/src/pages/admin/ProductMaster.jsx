import { useState, useRef } from "react";
import Swal from "sweetalert2";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
  ImagePlus,
  Search,
  ChevronLeft,
  ChevronRight,
  Save,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../redux/services/productApi";
import { useGetProductCategoriesQuery } from "../../redux/services/productCategoryApi";

/* ── helpers ── */
const EMPTY_FORM = {
  productName: "",
  productImage: "",
  productCategoryId: "",
  productLabel: "",
  productDesc: "",
  productPrice: "",
  originalPrice: "",
  discountPrice: "",
  productStatus: true,
  ratings: "",
};

function validate(form) {
  const errs = {};
  if (!form.productName.trim()) errs.productName = "Product name is required";
  if (!form.productCategoryId) errs.productCategoryId = "Category is required";
  if (!form.originalPrice) errs.originalPrice = "Original price is required";
  if (form.productPrice !== "" && isNaN(Number(form.productPrice)))
    errs.productPrice = "Must be a number";
  if (form.originalPrice !== "" && isNaN(Number(form.originalPrice)))
    errs.originalPrice = "Must be a number";
  if (form.discountPrice !== "" && isNaN(Number(form.discountPrice)))
    errs.discountPrice = "Must be a number";
  if (
    form.ratings !== "" &&
    (isNaN(Number(form.ratings)) ||
      !Number.isInteger(Number(form.ratings)) ||
      Number(form.ratings) < 0)
  )
    errs.ratings = "Must be a positive integer";
  return errs;
}

const formatPrice = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const PAGE_SIZE = 6;

/* ── ImageUpload component ── */
function ImageUpload({ label, value, onChange }) {
  const ref = useRef();

  // Resolve preview url
  const previewUrl = (() => {
    if (!value) return "";
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }
    if (typeof value === "string") {
      if (
        value.startsWith("data:") ||
        value.startsWith("http:") ||
        value.startsWith("https:")
      ) {
        return value;
      }
      return `/${value}`; // resolves through Vite proxy
    }
    return "";
  })();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) onChange(file);
  };

  return (
    <div className="pcm-img-upload-wrap">
      <span className="pcm-label">{label}</span>
      <div className="pcm-img-upload-box" onClick={() => ref.current?.click()}>
        {previewUrl ? (
          <div className="pcm-img-preview-wrap">
            <img src={previewUrl} alt="preview" className="pcm-img-preview" />
            <button
              type="button"
              className="pcm-img-remove"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="pcm-img-placeholder">
            <ImagePlus size={22} className="pcm-img-placeholder-icon" />
            <span>Click to upload</span>
          </div>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

/* ════════════════════════════════════════
   Main Page
   ════════════════════════════════════════ */
export default function ProductMaster() {
  /* ── RTK Query hooks ── */
  const {
    data: products = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
    error: productsError,
    refetch: refetchProducts,
  } = useGetProductsQuery();

  const { data: categories = [], isLoading: isCatsLoading } =
    useGetProductCategoriesQuery();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  /* ── local UI state ── */
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [apiError, setApiError] = useState("");

  /* ── filtered / paged ── */
  const filtered = products.filter((r) => {
    const matchSearch =
      r.productName.toLowerCase().includes(search.toLowerCase()) ||
      (r.productLabel || "").toLowerCase().includes(search.toLowerCase()) ||
      (r.productDesc || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat
      ? parseInt(r.productCategoryId) === parseInt(filterCat)
      : true;
    return matchSearch && matchCat;
  });
  const totalPages = Math.max(1, Math.ceil(filtered?.length / PAGE_SIZE));
  const paged = filtered?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ── form handlers ── */
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setApiError("");
    setEditId(null);
    setShowForm(true);
  };
  const openEdit = (row) => {
    setForm({
      productName: row.productName,
      productImage: row.productImage || "",
      productCategoryId: parseInt(row.productCategoryId),
      productLabel: row.productLabel || "",
      productDesc: row.productDesc || "",
      productPrice: row.productPrice?.toFixed(2),
      originalPrice: row.originalPrice?.toFixed(2),
      discountPrice: row.discountPrice?.toFixed(2),
      productStatus: row.productStatus,
      ratings:
        row.ratings !== null && row.ratings !== undefined
          ? String(row.ratings)
          : "",
    });
    setErrors({});
    setApiError("");
    setEditId(row.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setErrors({});
    setApiError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => {
      const next = { ...p, [name]: type === "checkbox" ? checked : value };
      if (name === "originalPrice" || name === "discountPrice") {
        const orig = parseFloat(next.originalPrice) || 0;
        const disc = parseFloat(next.discountPrice) || 0;
        next.productPrice = Math.max(0, orig - disc).toFixed(2);
      }
      return next;
    });
    setErrors((p) => ({ ...p, [name]: "" }));
    setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const formData = new FormData();
    formData.append("productName", form.productName.trim());
    formData.append("productCategoryId", form.productCategoryId);
    formData.append("productLabel", (form.productLabel || "").trim());
    formData.append("productDesc", (form.productDesc || "").trim());
    formData.append("productPrice", form.productPrice || "0");
    formData.append("originalPrice", form.originalPrice || "0");
    formData.append("discountPrice", form.discountPrice || "0");
    formData.append("productStatus", String(form.productStatus));
    formData.append("ratings", form.ratings);

    if (form.productImage instanceof File) {
      formData.append("productImage", form.productImage);
    } else {
      formData.append("productImage", form.productImage || "");
    }

    try {
      if (editId !== null) {
        await updateProduct({ id: editId, body: formData }).unwrap();
        Swal.fire({
          icon: "success",
          title: "Updated Successfully",
          text: `Product "${form.productName}" has been updated successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await createProduct(formData).unwrap();
        Swal.fire({
          icon: "success",
          title: "Saved Successfully",
          text: `Product "${form.productName}" has been saved successfully.`,
          timer: 2000,
          showConfirmButton: false,
        });
        setPage(1);
      }
      closeForm();
    } catch (err) {
      const actionText = editId !== null ? "update" : "save";
      setApiError(
        err?.data?.message || "Something went wrong. Please try again.",
      );
      Swal.fire({
        icon: "error",
        title: "Failed to Save",
        text: err?.data?.message || `Failed to ${actionText} product.`,
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteId).unwrap();
      Swal.fire({
        icon: "success",
        title: "Deleted Successfully",
        text: "Product has been deleted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      setDeleteId(null);
      if (paged.length === 1 && page > 1) setPage((p) => p - 1);
    } catch (err) {
      setDeleteId(null);
      setApiError(err?.data?.message || "Failed to delete product.");
      Swal.fire({
        icon: "error",
        title: "Failed to Delete",
        text: err?.data?.message || "Failed to delete product.",
      });
    }
  };

  const toggleStatus = async (row) => {
    try {
      const formData = new FormData();
      formData.append("productStatus", String(!row.productStatus));
      await updateProduct({ id: row.id, body: formData }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Product status set to ${!row.productStatus ? "Active" : "Inactive"}.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      setApiError(err?.data?.message || "Failed to update product status.");
      Swal.fire({
        icon: "error",
        title: "Failed to Update Status",
        text: err?.data?.message || "Failed to update product status.",
      });
    }
  };

  const isSaving = isCreating || isUpdating;

  /* ── Loading state ── */
  if (isProductsLoading || isCatsLoading) {
    return (
      <div className="pcm-loading-state">
        <Loader2 size={32} className="pcm-spinner" />
        <p>Loading products…</p>
      </div>
    );
  }

  /* ── Error state ── */
  if (isProductsError) {
    return (
      <div className="pcm-error-state">
        <AlertCircle size={32} className="pcm-error-icon" />
        <p>{productsError?.data?.message || "Failed to load products"}</p>
        <button className="pcm-add-btn" onClick={refetchProducts}>
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pcm-root">
      {/* ── Header ── */}
      <div className="pcm-header">
        <div className="pcm-header-left">
          <div className="pcm-header-icon">
            <Package size={20} />
          </div>
          <div>
            <h2 className="pcm-title">Product Master</h2>
            <p className="pcm-subtitle">Manage your product catalogue</p>
          </div>
        </div>
        <button className="pcm-add-btn" onClick={openAdd}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* ── API error banner ── */}
      {apiError && (
        <div className="pcm-api-error mb-4">
          <AlertCircle size={15} />
          <span>{apiError}</span>
          <button onClick={() => setApiError("")}>
            <X size={13} />
          </button>
        </div>
      )}

      {/* ── Search + Category filter ── */}
      <div className="pcm-search-row">
        <div className="pcm-search-wrap">
          <Search size={15} className="pcm-search-icon" />
          <input
            className="pcm-search-input"
            placeholder="Search products…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          {search && (
            <button className="pcm-search-clear" onClick={() => setSearch("")}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Category filter */}
        <select
          className="pm-cat-filter"
          value={filterCat}
          onChange={(e) => {
            setFilterCat(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>

        <span className="pcm-count">
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Add / Edit Form Panel ── */}
      {showForm && (
        <div className="pcm-form-panel">
          <div className="pcm-form-panel-header">
            <span className="pcm-form-panel-title">
              {editId !== null ? "Edit Product" : "Add New Product"}
            </span>
            <button className="pcm-form-close" onClick={closeForm}>
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="pcm-form" noValidate>
            {/* Single row of fields (Product Name, Category, Product Label, Selling Price, Original Price, Discount Amount) */}
            <div className="pm-form-row">
              {/* Product Name */}
              <div className="pcm-field pm-flex-name w-60">
                <label htmlFor="pm-productName" className="pcm-label">
                  Product Name <span className="pcm-required">*</span>
                </label>
                <input
                  id="pm-productName"
                  name="productName"
                  className={`pcm-input ${errors.productName ? "pcm-input-err" : ""}`}
                  placeholder="e.g. Turmeric Powder 100g"
                  value={form.productName}
                  onChange={handleChange}
                />
                {errors.productName && (
                  <span className="pcm-err-msg">{errors.productName}</span>
                )}
              </div>

              {/* Category */}
              <div className="pcm-field pm-flex-category w-40">
                <label htmlFor="pm-productCategoryId" className="pcm-label">
                  Category <span className="pcm-required">*</span>
                </label>
                <select
                  id="pm-productCategoryId"
                  name="productCategoryId"
                  className={`pcm-input pm-select ${errors.productCategoryId ? "pcm-input-err" : ""}`}
                  value={form.productCategoryId}
                  onChange={handleChange}
                >
                  <option value="">Select category…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.productCategoryId && (
                  <span className="pcm-err-msg">
                    {errors.productCategoryId}
                  </span>
                )}
              </div>

              {/* Product Label */}
              <div className="pcm-field pm-flex-label w-36">
                <label htmlFor="pm-productLabel" className="pcm-label">
                  Product Label
                </label>
                <input
                  id="pm-productLabel"
                  name="productLabel"
                  className="pcm-input"
                  placeholder="e.g. Organic,New"
                  value={form.productLabel}
                  onChange={handleChange}
                />
              </div>

              {/* Original Price */}
              <div className="pcm-field pm-flex-price w-32">
                <label htmlFor="pm-originalPrice" className="pcm-label">
                  Original Price (₹)
                </label>
                <input
                  id="pm-originalPrice"
                  name="originalPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`pcm-input font-semibold  text-right pr-1 ${errors.originalPrice ? "pcm-input-err" : ""}`}
                  placeholder="0.00"
                  value={form.originalPrice}
                  onChange={handleChange}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value !== "") {
                      setForm((prev) => {
                        const orig = Number(value).toFixed(2);
                        const disc = parseFloat(prev.discountPrice) || 0;
                        const productPrice = Math.max(
                          0,
                          Number(orig) - disc,
                        ).toFixed(2);
                        return {
                          ...prev,
                          originalPrice: orig,
                          productPrice,
                        };
                      });
                    }
                  }}
                />
                {errors.originalPrice && (
                  <span className="pcm-err-msg">{errors.originalPrice}</span>
                )}
              </div>

              {/* Discount Amount */}
              <div className="pcm-field pm-flex-price  w-36">
                <label htmlFor="pm-discountPrice" className="pcm-label">
                  Discount Amount (₹)
                </label>
                <input
                  id="pm-discountPrice"
                  name="discountPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`pcm-input font-semibold  text-right text-red-600 pr-1 ${errors.discountPrice ? "pcm-input-err" : ""}`}
                  placeholder="0.00"
                  value={form.discountPrice}
                  onChange={handleChange}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value !== "") {
                      setForm((prev) => {
                        const disc = Number(value).toFixed(2);
                        const orig = parseFloat(prev.originalPrice) || 0;
                        const productPrice = Math.max(
                          0,
                          orig - Number(disc),
                        ).toFixed(2);
                        return {
                          ...prev,
                          discountPrice: disc,
                          productPrice,
                        };
                      });
                    }
                  }}
                />
                {errors.discountPrice && (
                  <span className="pcm-err-msg">{errors.discountPrice}</span>
                )}
              </div>
              {/* Selling Price */}
              <div className="pcm-field pm-flex-price  w-32">
                <label htmlFor="pm-productPrice" className="pcm-label">
                  Selling Price (₹)
                </label>
                <input
                  id="pm-productPrice"
                  name="productPrice"
                  type="number"
                  className="pcm-input font-semibold  text-right pr-1 pcm-readonly-input"
                  placeholder="0.00"
                  value={form.productPrice}
                  readOnly
                />
              </div>

              {/* Ratings */}
              <div className="pcm-field pm-flex-price w-20">
                <label htmlFor="pm-ratings" className="pcm-label">
                  Ratings
                </label>
                <input
                  id="pm-ratings"
                  name="ratings"
                  type="number"
                  min="0"
                  className={`pcm-input font-semibold text-right pr-1 ${errors.ratings ? "pcm-input-err" : ""}`}
                  placeholder="e.g. 89"
                  value={form.ratings}
                  onChange={handleChange}
                />
                {errors.ratings && (
                  <span className="pcm-err-msg">{errors.ratings}</span>
                )}
              </div>
            </div>

            {/* Description + Image side-by-side */}
            <div className="pm-bottom-row">
              {/* Description */}
              <div className="pcm-field">
                <label htmlFor="pm-productDesc" className="pcm-label">
                  Description
                </label>
                <textarea
                  id="pm-productDesc"
                  name="productDesc"
                  rows={4}
                  className="pcm-input pcm-textarea pm-desc-textarea"
                  placeholder="Short product description…"
                  value={form.productDesc}
                  onChange={handleChange}
                />
              </div>

              {/* Product Image */}
              <ImageUpload
                label="Product Image"
                value={form.productImage}
                onChange={(v) => setForm((p) => ({ ...p, productImage: v }))}
              />
            </div>

            {/* Actions */}
            <div className="pcm-form-actions">
              {/* Status toggler aligned to the left (in front of Cancel) */}
              <div className="pm-status-actions-toggle">
                <span className="pm-toggle-text">Status:</span>
                <label className="pm-toggle-label cursor-pointer">
                  <input
                    type="checkbox"
                    name="productStatus"
                    checked={form.productStatus}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div
                    className={`pm-toggle-track ${form.productStatus ? "pm-toggle-on" : ""}`}
                  >
                    <div className="pm-toggle-thumb" />
                  </div>
                  <span className="pm-toggle-text font-semibold">
                    {form.productStatus ? "Active" : "Inactive"}
                  </span>
                </label>
              </div>
              <div className="flex gap-x-4">
                <button
                  type="button"
                  className="pcm-btn-cancel"
                  onClick={closeForm}
                  disabled={isSaving}
                >
                  <X size={14} /> Cancel
                </button>
                <button
                  type="button"
                  className="pcm-btn-reset"
                  onClick={() => {
                    setForm(EMPTY_FORM);
                    setErrors({});
                    setApiError("");
                  }}
                  disabled={isSaving}
                >
                  <RefreshCw size={14} /> Reset
                </button>
                <button
                  type="submit"
                  className="pcm-btn-save"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 size={14} className="pcm-btn-spinner" />
                  ) : (
                    <Save size={14} />
                  )}
                  {isSaving
                    ? editId !== null
                      ? "Updating…"
                      : "Saving…"
                    : editId !== null
                      ? "Update Product"
                      : "Save Product"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ── Table ── */}
      <div className="pcm-table-wrap">
        {paged.length === 0 ? (
          <div className="pcm-empty">
            <Package size={40} className="pcm-empty-icon" />
            <p>
              {search || filterCat
                ? "No products match your filters."
                : "No products added yet."}
            </p>
            {!search && !filterCat && (
              <button className="pcm-add-btn mt-4" onClick={openAdd}>
                <Plus size={15} /> Add First Product
              </button>
            )}
          </div>
        ) : (
          <table className="pcm-table w-[80vw] rounded-lg bg-transparent overflow-x-auto table-fixed">
            <thead>
              <tr>
                <th className="pcm-th pcm-th-num w-6">#</th>
                <th className="pcm-th w-24">Image</th>
                <th className="pcm-th w-60">Product Name</th>
                <th className="pcm-th pm-th-hide-sm w-20">Category</th>

                <th className="pcm-th pm-th-hide-sm w-20">Orig. (₹)</th>
                <th className="pcm-th pm-th-hide-sm w-20">Disc. (₹)</th>
                <th className="pcm-th pm-th-price w-20">Price (₹)</th>

                <th className="pcm-th w-28" style={{ textAlign: "center" }}>
                  Status
                </th>
                <th className="pcm-th pcm-th-actions w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged?.map((row, idx) => (
                <tr key={row.id} className="pcm-tr">
                  <td className="pcm-td pcm-td-num border-r border-gray-300">
                    {(page - 1) * PAGE_SIZE + idx + 1}
                  </td>
                  <td className="pcm-td border-r text-center border-gray-300">
                    {row?.productImage ? (
                      <img
                        src={
                          row?.productImage.startsWith("http") ||
                          row?.productImage.startsWith("data:")
                            ? row?.productImage
                            : `/${row?.productImage}`
                        }
                        alt={row?.productName}
                        className="pcm-table-img justify-center"
                      />
                    ) : (
                      <div className="pcm-table-img-placeholder">
                        <Package size={16} />
                      </div>
                    )}
                  </td>
                  <td className="pcm-td pcm-td-name border-r border-gray-300">
                    {row?.productName}
                  </td>
                  <td className="pcm-td pm-td-hide-sm border-r border-gray-300">
                    {row?.productcategory?.name || "-"}
                  </td>

                  <td className="pcm-td pm-td-hide-sm pm-td-original font-bold text-right pr-1 border-r border-gray-300">
                    ₹{formatPrice(row?.originalPrice)}
                  </td>
                  <td className="pcm-td pm-td-hide-sm pm-td-discount font-bold text-right pr-1 border-r border-gray-300">
                    {Number(row?.discountPrice) > 0 ? (
                      `₹${formatPrice(row?.discountPrice)}`
                    ) : (
                      <span className="pcm-no-data">—</span>
                    )}
                  </td>
                  <td className="pcm-td pm-td-price text-right pr-1 border-r border-gray-300">
                    ₹{formatPrice(row?.productPrice)}{" "}
                  </td>

                  <td
                    className="pcm-td border-r border-gray-300 justify-start"
                    style={{ textAlign: "center" }}
                  >
                    <button
                      className={`pm-status-badge ${row.productStatus ? "pm-status-active" : "pm-status-inactive"}`}
                      // onClick={() => toggleStatus(row)}
                      title="Click to toggle status"
                      disabled={isUpdating}
                    >
                      {row.productStatus ? (
                        <ToggleRight size={14} />
                      ) : (
                        <ToggleLeft size={14} />
                      )}
                      {row.productStatus ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="pcm-td pcm-td-actions flex justify-center">
                    <button
                      className="pcm-action-btn pcm-edit-btn"
                      onClick={() => openEdit(row)}
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="pcm-action-btn pcm-delete-btn"
                      onClick={() => setDeleteId(row.id)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="pcm-pagination">
          <button
            className="pcm-page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft size={15} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`pcm-page-btn ${p === page ? "pcm-page-active" : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="pcm-page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteId !== null && (
        <div className="pcm-modal-overlay">
          <div className="pcm-modal">
            <div className="pcm-modal-icon">
              <Trash2 size={24} />
            </div>
            <h3 className="pcm-modal-title">Delete Product?</h3>
            <p className="pcm-modal-text">
              This will permanently remove{" "}
              <strong>
                "{products.find((r) => r.id === deleteId)?.productName}"
              </strong>
              . This action cannot be undone.
            </p>
            <div className="pcm-modal-actions">
              <button
                className="pcm-btn-cancel"
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="pcm-btn-delete-confirm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 size={14} className="pcm-btn-spinner" />
                ) : null}
                {isDeleting ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
