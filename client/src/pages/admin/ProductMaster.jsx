import { useState, useRef } from "react";
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
};

function validate(form) {
  const errs = {};
  if (!form.productName.trim()) errs.productName = "Product name is required";
  if (!form.productCategoryId) errs.productCategoryId = "Category is required";
  if (form.productPrice !== "" && isNaN(Number(form.productPrice)))
    errs.productPrice = "Must be a number";
  if (form.originalPrice !== "" && isNaN(Number(form.originalPrice)))
    errs.originalPrice = "Must be a number";
  if (form.discountPrice !== "" && isNaN(Number(form.discountPrice)))
    errs.discountPrice = "Must be a number";
  return errs;
}

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
      if (value.startsWith("data:") || value.startsWith("http:") || value.startsWith("https:")) {
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

  const {
    data: categories = [],
    isLoading: isCatsLoading,
  } = useGetProductCategoriesQuery();

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
      ? String(r.productCategoryId) === filterCat
      : true;
    return matchSearch && matchCat;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getCategoryName = (id) =>
    categories.find((c) => c.id === Number(id))?.name || "—";

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
      productCategoryId: String(row.productCategoryId),
      productLabel: row.productLabel || "",
      productDesc: row.productDesc || "",
      productPrice: String(row.productPrice),
      originalPrice: String(row.originalPrice),
      discountPrice: String(row.discountPrice),
      productStatus: row.productStatus,
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
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
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

    if (form.productImage instanceof File) {
      formData.append("productImage", form.productImage);
    } else {
      formData.append("productImage", form.productImage || "");
    }

    try {
      if (editId !== null) {
        await updateProduct({ id: editId, body: formData }).unwrap();
      } else {
        await createProduct(formData).unwrap();
        setPage(1);
      }
      closeForm();
    } catch (err) {
      setApiError(
        err?.data?.message || "Something went wrong. Please try again.",
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteId).unwrap();
      setDeleteId(null);
      if (paged.length === 1 && page > 1) setPage((p) => p - 1);
    } catch (err) {
      setDeleteId(null);
      setApiError(err?.data?.message || "Failed to delete product.");
    }
  };

  const toggleStatus = async (row) => {
    try {
      const formData = new FormData();
      formData.append("productStatus", String(!row.productStatus));
      await updateProduct({ id: row.id, body: formData }).unwrap();
    } catch (err) {
      setApiError(err?.data?.message || "Failed to update product status.");
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
            {/* Row 1: Name + Label */}
            <div className="pm-grid-2">
              <div className="pcm-field">
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

              <div className="pcm-field">
                <label htmlFor="pm-productLabel" className="pcm-label">
                  Product Label
                </label>
                <input
                  id="pm-productLabel"
                  name="productLabel"
                  className="pcm-input"
                  placeholder="e.g. Organic, Premium, New"
                  value={form.productLabel}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 2: Category + Status */}
            <div className="pm-grid-2">
              <div className="pcm-field">
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

              <div className="pcm-field">
                <label className="pcm-label">Status</label>
                <div className="pm-status-toggle">
                  <label className="pm-toggle-label">
                    <input
                      type="checkbox"
                      name="productStatus"
                      checked={form.productStatus}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div
                      className={`pm-toggle-track ${form.productStatus ? "pm-toggle-on" : ""}`}
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          productStatus: !p.productStatus,
                        }))
                      }
                    >
                      <div className="pm-toggle-thumb" />
                    </div>
                    <span className="pm-toggle-text">
                      {form.productStatus ? "Active" : "Inactive"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Row 3: Prices */}
            <div className="pm-grid-3">
              <div className="pcm-field">
                <label htmlFor="pm-productPrice" className="pcm-label">
                  Selling Price (₹)
                </label>
                <input
                  id="pm-productPrice"
                  name="productPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`pcm-input ${errors.productPrice ? "pcm-input-err" : ""}`}
                  placeholder="0.00"
                  value={form.productPrice}
                  onChange={handleChange}
                />
                {errors.productPrice && (
                  <span className="pcm-err-msg">{errors.productPrice}</span>
                )}
              </div>

              <div className="pcm-field">
                <label htmlFor="pm-originalPrice" className="pcm-label">
                  Original Price (₹)
                </label>
                <input
                  id="pm-originalPrice"
                  name="originalPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`pcm-input ${errors.originalPrice ? "pcm-input-err" : ""}`}
                  placeholder="0.00"
                  value={form.originalPrice}
                  onChange={handleChange}
                />
                {errors.originalPrice && (
                  <span className="pcm-err-msg">{errors.originalPrice}</span>
                )}
              </div>

              <div className="pcm-field">
                <label htmlFor="pm-discountPrice" className="pcm-label">
                  Discount Amount (₹)
                </label>
                <input
                  id="pm-discountPrice"
                  name="discountPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`pcm-input ${errors.discountPrice ? "pcm-input-err" : ""}`}
                  placeholder="0.00"
                  value={form.discountPrice}
                  onChange={handleChange}
                />
                {errors.discountPrice && (
                  <span className="pcm-err-msg">{errors.discountPrice}</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="pcm-field">
              <label htmlFor="pm-productDesc" className="pcm-label">
                Description
              </label>
              <textarea
                id="pm-productDesc"
                name="productDesc"
                rows={3}
                className="pcm-input pcm-textarea"
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

            {/* Actions */}
            <div className="pcm-form-actions">
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
              <button type="submit" className="pcm-btn-save" disabled={isSaving}>
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
          <table className="pcm-table">
            <thead>
              <tr>
                <th className="pcm-th pcm-th-num">#</th>
                <th className="pcm-th">Image</th>
                <th className="pcm-th">Product Name</th>
                <th className="pcm-th pm-th-hide-sm">Category</th>
                <th className="pcm-th pm-th-hide-sm">Label</th>
                <th className="pcm-th pm-th-price">Price (₹)</th>
                <th className="pcm-th pm-th-hide-sm">Orig. (₹)</th>
                <th className="pcm-th pm-th-hide-sm">Disc. (₹)</th>
                <th className="pcm-th" style={{ textAlign: "center" }}>
                  Status
                </th>
                <th className="pcm-th pcm-th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((row, idx) => (
                <tr key={row.id} className="pcm-tr">
                  <td className="pcm-td pcm-td-num">
                    {(page - 1) * PAGE_SIZE + idx + 1}
                  </td>
                  <td className="pcm-td">
                    {row.productImage ? (
                      <img
                        src={row.productImage.startsWith('http') || row.productImage.startsWith('data:') ? row.productImage : `/${row.productImage}`}
                        alt={row.productName}
                        className="pcm-table-img"
                      />
                    ) : (
                      <div className="pcm-table-img-placeholder">
                        <Package size={16} />
                      </div>
                    )}
                  </td>
                  <td className="pcm-td pcm-td-name">{row.productName}</td>
                  <td className="pcm-td pm-td-hide-sm">
                    {getCategoryName(row.productCategoryId)}
                  </td>
                  <td className="pcm-td pm-td-hide-sm">
                    {row.productLabel ? (
                      <span className="pm-label-badge">{row.productLabel}</span>
                    ) : (
                      <span className="pcm-no-data">—</span>
                    )}
                  </td>
                  <td className="pcm-td pm-td-price">
                    ₹{Number(row.productPrice).toLocaleString("en-IN")}
                  </td>
                  <td className="pcm-td pm-td-hide-sm pm-td-original">
                    ₹{Number(row.originalPrice).toLocaleString("en-IN")}
                  </td>
                  <td className="pcm-td pm-td-hide-sm pm-td-discount">
                    {Number(row.discountPrice) > 0
                      ? `₹${Number(row.discountPrice).toLocaleString("en-IN")}`
                      : <span className="pcm-no-data">—</span>}
                  </td>
                  <td className="pcm-td" style={{ textAlign: "center" }}>
                    <button
                      className={`pm-status-badge ${row.productStatus ? "pm-status-active" : "pm-status-inactive"}`}
                      onClick={() => toggleStatus(row)}
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
                  <td className="pcm-td pcm-td-actions">
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
