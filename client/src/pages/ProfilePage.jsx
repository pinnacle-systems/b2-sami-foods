import { useState, useEffect } from "react";
import { 
  useGetMeQuery, useUpdateProfileMutation,
  useCreateAddressMutation, useUpdateAddressMutation, useDeleteAddressMutation 
} from "@/redux/services/authApi";
import { 
  User, Mail, Phone, Lock, Calendar, ShieldCheck, Loader2, Edit3, Save, X, 
  Eye, EyeOff, Check, AlertCircle, MapPin, Plus, ChevronDown, ChevronUp, Trash2, Home, Briefcase, Globe
} from "lucide-react";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
];

export default function ProfilePage() {
  const { data: user, isLoading, error } = useGetMeQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [createAddress, { isLoading: isCreatingAddress }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdatingAddress }] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});

  // ── Address State ──
  const [addresses, setAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [expandedAddressId, setExpandedAddressId] = useState(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "",
    mobile: "",
    alterNateMobile: "",
    pinCode: "",
    city: "",
    state: "",
    address: "",
    landMark: "",
    addressType: "Home",
  });
  const [addressErrors, setAddressErrors] = useState({});

  // Sync loaded addresses from backend
  useEffect(() => {
    if (user?.Addresses) {
      setAddresses(user.Addresses);
      // Auto expand first address if available
      if (user.Addresses.length > 0 && expandedAddressId === null) {
        setExpandedAddressId(user.Addresses[0].id);
      }
    }
  }, [user]);

  // Sync form with loaded user data
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        password: "",
        confirm: "",
      });
    }
  }, [user, isEditing]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-background">
        <div className="bg-card border border-border p-8 rounded-2xl max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">Failed to Load Profile</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Please log in to view and manage your profile settings.
          </p>
        </div>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) {
      errs.name = "Full name is required";
    }
    if (!form.mobile) {
      errs.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(form.mobile)) {
      errs.mobile = "Enter a valid 10-digit mobile number";
    }
    if (!form.email) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = "Enter a valid email";
    }
    
    // Password is only validated if the user has typed anything
    if (form.password) {
      if (form.password.length < 8) {
        errs.password = "Password must be at least 8 characters";
      }
      if (!form.confirm) {
        errs.confirm = "Please confirm your password";
      } else if (form.confirm !== form.password) {
        errs.confirm = "Passwords do not match";
      }
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    try {
      const payload = {
        name: form.name,
        email: form.email,
        mobile: form.mobile,
      };
      if (form.password) {
        payload.password = form.password;
      }

      await updateProfile(payload).unwrap();
      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
      
      // Auto dismiss success toast
      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    } catch (err) {
      const errMsg = err?.data?.message || err?.message || "Failed to update profile";
      setErrors({ apiError: errMsg });
    }
  };

  // ── Address Actions ──
  const toggleAddressAccordion = (id) => {
    setExpandedAddressId(expandedAddressId === id ? null : id);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
    setAddressErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEditAddress = (item, e) => {
    e.stopPropagation();
    setEditingAddress(item);
    setAddressForm({
      name: item.name || "",
      mobile: item.mobile || "",
      alterNateMobile: item.alterNateMobile || "",
      pinCode: item.pinCode || "",
      city: item.city || "",
      state: item.state || "",
      address: item.address || "",
      landMark: item.landMark || "",
      addressType: item.addressType || "Home",
    });
    setAddressErrors({});
    setShowAddAddress(true);
  };

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!addressForm.name.trim()) errs.name = "Name is required";
    if (!addressForm.mobile) {
      errs.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(addressForm.mobile)) {
      errs.mobile = "Enter a valid 10-digit number";
    }
    if (addressForm.alterNateMobile && !/^\d{10}$/.test(addressForm.alterNateMobile)) {
      errs.alterNateMobile = "Enter a valid 10-digit number";
    }
    if (!addressForm.address.trim()) errs.address = "Address is required";
    if (!addressForm.pinCode) {
      errs.pinCode = "PIN Code is required";
    } else if (!/^\d{6}$/.test(addressForm.pinCode)) {
      errs.pinCode = "Enter a valid 6-digit PIN code";
    }
    if (!addressForm.city.trim()) errs.city = "City is required";
    if (!addressForm.state.trim()) errs.state = "State is required";

    if (Object.keys(errs).length > 0) {
      setAddressErrors(errs);
      return;
    }

    try {
      if (editingAddress) {
        await updateAddress({ id: editingAddress.id, ...addressForm }).unwrap();
        setSuccessMsg("Address updated successfully!");
      } else {
        await createAddress(addressForm).unwrap();
        setSuccessMsg("Address added successfully!");
      }

      setShowAddAddress(false);
      setEditingAddress(null);
      setAddressForm({
        name: "",
        mobile: "",
        alterNateMobile: "",
        pinCode: "",
        city: "",
        state: "",
        address: "",
        landMark: "",
        addressType: "Home",
      });
      setAddressErrors({});

      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    } catch (err) {
      const errMsg = err?.data?.message || err?.message || "Failed to save address";
      setAddressErrors({ apiError: errMsg });
    }
  };

  const handleDeleteAddress = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(id).unwrap();
      setSuccessMsg("Address deleted successfully!");
      if (expandedAddressId === id) {
        setExpandedAddressId(null);
      }
      setTimeout(() => {
        setSuccessMsg("");
      }, 4000);
    } catch (err) {
      alert(err?.data?.message || err?.message || "Failed to delete address");
    }
  };

  const initial = user.name?.charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen pt-24 pb-12 bg-linear-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Alert */}
        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-2xl text-sm font-semibold flex items-center gap-2 shadow-xs">
            <Check className="w-5 h-5" />
            {successMsg}
          </div>
        )}

        {/* API Error Alert */}
        {errors.apiError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl text-sm font-semibold flex items-center gap-2 shadow-xs">
            <AlertCircle className="w-5 h-5" />
            {errors.apiError}
          </div>
        )}

        {/* Profile Card Header */}
        <div className="relative bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 w-full">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-3xl font-extrabold shadow-inner">
                {initial}
              </div>

              {/* Title / Welcome info */}
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{user.name}</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 capitalize">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {user.role || "User"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-medium mb-3">{user.email}</p>
                
                <div className="flex items-center justify-center sm:justify-start gap-1 text-xs text-muted-foreground/80">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "May 2026"}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-accent text-primary-foreground text-sm font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <Edit3 size={15} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* ── Main Grid Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Personal Information */}
          <form onSubmit={handleSave} className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs" noValidate>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Personal Information
              </h2>
              {isEditing && (
                <span className="text-xs text-primary font-medium bg-primary/5 px-2.5 py-1 rounded-full animate-pulse border border-primary/10">
                  Editing Mode
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* UserName */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Username <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    disabled={isUpdating}
                    className={`w-full h-11 px-4 rounded-xl border font-medium text-foreground text-sm focus:outline-hidden transition-all ${
                      !isEditing
                        ? "bg-muted/40 cursor-not-allowed border-border"
                        : errors.name
                        ? "border-destructive bg-destructive/5 focus:border-destructive"
                        : "border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  />
                </div>
                {errors.name && <span className="text-xs text-destructive font-medium">{errors.name}</span>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    disabled={isUpdating}
                    className={`w-full h-11 px-4 rounded-xl border font-medium text-foreground text-sm focus:outline-hidden transition-all ${
                      !isEditing
                        ? "bg-muted/40 cursor-not-allowed border-border"
                        : errors.email
                        ? "border-destructive bg-destructive/5 focus:border-destructive"
                        : "border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  />
                </div>
                {errors.email && <span className="text-xs text-destructive font-medium">{errors.email}</span>}
              </div>

              {/* Mobile */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    disabled={isUpdating}
                    placeholder="9876543210"
                    className={`w-full h-11 px-4 rounded-xl border font-medium text-foreground text-sm focus:outline-hidden transition-all ${
                      !isEditing
                        ? "bg-muted/40 cursor-not-allowed border-border"
                        : errors.mobile
                        ? "border-destructive bg-destructive/5 focus:border-destructive"
                        : "border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  />
                </div>
                {errors.mobile && <span className="text-xs text-destructive font-medium">{errors.mobile}</span>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> Password {isEditing && <span className="text-muted-foreground/60 lowercase font-normal">(optional)</span>}
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={isEditing ? form.password : "••••••••••••"}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    disabled={isUpdating}
                    placeholder={isEditing ? "Leave blank to keep current" : "••••••••••••"}
                    className={`w-full h-11 px-4 pr-10 rounded-xl border font-medium text-foreground text-sm focus:outline-hidden transition-all ${
                      !isEditing
                        ? "bg-muted/40 cursor-not-allowed border-border tracking-widest"
                        : errors.password
                        ? "border-destructive bg-destructive/5 focus:border-destructive"
                        : "border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                  />
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
                {errors.password && <span className="text-xs text-destructive font-medium">{errors.password}</span>}

                {/* Password strength hints */}
                {isEditing && form.password && (
                  <ul className="grid grid-cols-1 gap-1.5 mt-1 bg-muted/40 p-3 rounded-xl border border-border">
                    {PASSWORD_RULES.map((r) => (
                      <li
                        key={r.label}
                        className={`text-[10px] font-semibold flex items-center gap-1.5 transition-colors ${
                          r.test(form.password) ? "text-emerald-600" : "text-muted-foreground"
                        }`}
                      >
                        {r.test(form.password) ? (
                          <Check size={12} className="stroke-[3]" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 ml-1" />
                        )}
                        {r.label}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Confirm Password */}
              {isEditing && form.password && (
                <div className="flex flex-col gap-2 md:col-span-2 max-w-md animate-slide-down">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirm"
                      value={form.confirm}
                      onChange={handleChange}
                      disabled={isUpdating}
                      placeholder="Confirm your new password"
                      className={`w-full h-11 px-4 pr-10 rounded-xl border font-medium text-foreground text-sm focus:outline-hidden transition-all ${
                        errors.confirm
                          ? "border-destructive bg-destructive/5 focus:border-destructive"
                          : "border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirm && <span className="text-xs text-destructive font-medium">{errors.confirm}</span>}
                </div>
              )}
            </div>

            {/* Form Actions (Only visible in edit mode) */}
            {isEditing && (
              <div className="flex flex-wrap items-center justify-end gap-3 mt-8 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setErrors({});
                  }}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-muted border border-border text-foreground hover:bg-muted/80 text-sm font-semibold transition-colors cursor-pointer"
                >
                  <X size={15} /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-accent text-primary-foreground text-sm font-semibold transition-colors shadow-xs cursor-pointer"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save size={15} /> Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>

          {/* Right Column: Address Book UI Card */}
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col w-full">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-border w-full">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Saved Addresses
              </h2>
              <button
                type="button"
                onClick={() => {
                  setEditingAddress(null);
                  setAddressForm({
                    name: "",
                    mobile: "",
                    alterNateMobile: "",
                    pinCode: "",
                    city: "",
                    state: "",
                    address: "",
                    landMark: "",
                    addressType: "Home",
                  });
                  setAddressErrors({});
                  setShowAddAddress(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus size={13} /> Add Address
              </button>
            </div>

            {/* Add Address Modal Backdrop & Dialog Container */}
            {showAddAddress ? (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto transition-all animate-fade-in">
                {/* Backdrop overlay */}
                <div 
                  className="absolute inset-0 cursor-default bg-black/40" 
                  onClick={() => {
                    setShowAddAddress(false);
                    setAddressErrors({});
                  }} 
                />
                
                {/* Modal box */}
                <form 
                  onSubmit={handleAddAddressSubmit} 
                  className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl relative w-full max-w-3xl z-10 max-h-[90vh] overflow-y-auto animate-scale-in"
                  noValidate
                >
                  <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
                    <h3 className="text-sm font-extrabold text-foreground uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" /> {editingAddress ? "Edit Delivery Address" : "New Delivery Address"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddAddress(false);
                        setAddressErrors({});
                      }}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors cursor-pointer"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {addressErrors.apiError && (
                    <div className="mb-4 p-3.5 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {addressErrors.apiError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Address Type */}
                    <div className="flex flex-col gap-1.5 md:col-span-3">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                        Address Type
                      </label>
                      <div className="flex gap-2">
                        {["Home", "Work", "Other"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setAddressForm(p => ({ ...p, addressType: type }))}
                            className={`flex-1 h-9 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              addressForm.addressType === type
                                ? "bg-primary border-primary text-primary-foreground"
                                : "border-border bg-card hover:bg-muted text-muted-foreground"
                            }`}
                          >
                            {type === "Home" && <Home size={12} />}
                            {type === "Work" && <Briefcase size={12} />}
                            {type === "Other" && <MapPin size={12} />}
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recipient Name */}
                    <div className="flex flex-col gap-1.5 md:col-span-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                        Recipient Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="e.g. John Doe"
                        value={addressForm.name}
                        onChange={handleAddressChange}
                        className={`h-10 px-3 rounded-xl border text-xs font-medium bg-card focus:outline-hidden ${
                          addressErrors.name ? "border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:border-primary"
                        }`}
                      />
                      {addressErrors.name && <span className="text-[10px] text-destructive font-medium">{addressErrors.name}</span>}
                    </div>

                    {/* Mobile Number */}
                    <div className="flex flex-col gap-1.5 md:col-span-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        placeholder="e.g. 9876543210"
                        value={addressForm.mobile}
                        onChange={handleAddressChange}
                        className={`h-10 px-3 rounded-xl border text-xs font-medium bg-card focus:outline-hidden ${
                          addressErrors.mobile ? "border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:border-primary"
                        }`}
                      />
                      {addressErrors.mobile && <span className="text-[10px] text-destructive font-medium">{addressErrors.mobile}</span>}
                    </div>

                    {/* Alternate Mobile */}
                    <div className="flex flex-col gap-1.5 md:col-span-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                        Alternate Contact (optional)
                      </label>
                      <input
                        type="tel"
                        name="alterNateMobile"
                        placeholder="e.g. 9012345678"
                        value={addressForm.alterNateMobile}
                        onChange={handleAddressChange}
                        className={`h-10 px-3 rounded-xl border text-xs font-medium bg-card focus:outline-hidden ${
                          addressErrors.alterNateMobile ? "border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:border-primary"
                        }`}
                      />
                      {addressErrors.alterNateMobile && <span className="text-[10px] text-destructive font-medium">{addressErrors.alterNateMobile}</span>}
                    </div>

                    {/* Street Address */}
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="address"
                        rows={2}
                        placeholder="Flat/House No., Building Name, Street Name"
                        value={addressForm.address}
                        onChange={handleAddressChange}
                        className={`px-3 py-2 rounded-xl border text-xs font-medium bg-card focus:outline-hidden resize-none ${
                          addressErrors.address ? "border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:border-primary"
                        }`}
                      />
                      {addressErrors.address && <span className="text-[10px] text-destructive font-medium">{addressErrors.address}</span>}
                    </div>

                    {/* Landmark */}
                    <div className="flex flex-col gap-1.5 md:col-span-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                        Landmark (optional)
                      </label>
                      <textarea
                        name="landMark"
                        rows={2}
                        placeholder="e.g. Near Ganesh Temple"
                        value={addressForm.landMark}
                        onChange={handleAddressChange}
                        className="px-3 py-2 rounded-xl border border-border text-xs font-medium bg-card focus:border-primary focus:outline-hidden resize-none"
                      />
                    </div>

                    {/* PIN Code */}
                    <div className="flex flex-col gap-1.5 md:col-span-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                        PIN Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="pinCode"
                        placeholder="600001"
                        value={addressForm.pinCode}
                        onChange={handleAddressChange}
                        className={`h-10 px-3 rounded-xl border text-xs font-medium bg-card focus:outline-hidden ${
                          addressErrors.pinCode ? "border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:border-primary"
                        }`}
                      />
                      {addressErrors.pinCode && <span className="text-[10px] text-destructive font-medium">{addressErrors.pinCode}</span>}
                    </div>

                    {/* City */}
                    <div className="flex flex-col gap-1.5 md:col-span-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Chennai"
                        value={addressForm.city}
                        onChange={handleAddressChange}
                        className={`h-10 px-3 rounded-xl border text-xs font-medium bg-card focus:outline-hidden ${
                          addressErrors.city ? "border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:border-primary"
                        }`}
                      />
                      {addressErrors.city && <span className="text-[10px] text-destructive font-medium">{addressErrors.city}</span>}
                    </div>

                    {/* State */}
                    <div className="flex flex-col gap-1.5 md:col-span-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                        State <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        placeholder="Tamil Nadu"
                        value={addressForm.state}
                        onChange={handleAddressChange}
                        className={`h-10 px-3 rounded-xl border text-xs font-medium bg-card focus:outline-hidden ${
                          addressErrors.state ? "border-destructive focus:ring-1 focus:ring-destructive" : "border-border focus:border-primary"
                        }`}
                      />
                      {addressErrors.state && <span className="text-[10px] text-destructive font-medium">{addressErrors.state}</span>}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddAddress(false);
                        setAddressErrors({});
                      }}
                      className="h-9 px-4 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition-colors cursor-pointer"
                      disabled={isCreatingAddress || isUpdatingAddress}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="h-9 px-5 rounded-lg bg-primary hover:bg-accent text-primary-foreground text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-75"
                      disabled={isCreatingAddress || isUpdatingAddress}
                    >
                      {isCreatingAddress || isUpdatingAddress ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Plus size={14} /> {editingAddress ? "Save Changes" : "Add Address"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : null}

            {/* Saved Addresses Accordion List */}
            {addresses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-border rounded-2xl text-center bg-muted/10">
                <MapPin className="w-10 h-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm font-semibold text-foreground">No Saved Addresses</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                  Add a delivery address to ensure faster and smoother checkouts.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {addresses.map((item) => {
                  const isExpanded = expandedAddressId === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                        isExpanded ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-muted/10"
                      }`}
                    >
                      {/* Accordion Header */}
                      <div
                        onClick={() => toggleAddressAccordion(item.id)}
                        className="p-4 flex items-center justify-between cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Type Indicator Icon */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                            isExpanded ? "bg-primary/20 border-primary/20 text-primary" : "bg-muted border-border text-muted-foreground"
                          }`}>
                            {item.addressType === "Home" && <Home size={14} />}
                            {item.addressType === "Work" && <Briefcase size={14} />}
                            {item.addressType !== "Home" && item.addressType !== "Work" && <MapPin size={14} />}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-foreground truncate">{item.name}</span>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-muted text-muted-foreground border border-border capitalize shrink-0">
                                {item.addressType}
                              </span>
                            </div>
                            <span className="text-[10px] text-muted-foreground truncate block mt-0.5">
                              {item.address}, {item.city}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleEditAddress(item, e)}
                            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all cursor-pointer shrink-0"
                            title="Edit Address"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteAddress(item.id, e)}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all cursor-pointer shrink-0"
                            title="Delete Address"
                          >
                            <Trash2 size={13} />
                          </button>
                          <div className="text-muted-foreground shrink-0 p-1.5">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>
                      </div>

                      {/* Accordion Content Body */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-1 border-t border-border/40 text-xs text-foreground/90 grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-slide-down">
                          
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Recipient Contact</span>
                            <span className="font-semibold flex items-center gap-1">
                              <User size={12} className="text-primary" /> {item.name}
                            </span>
                            <span className="font-medium flex items-center gap-1 mt-0.5 text-muted-foreground">
                              <Phone size={12} className="text-muted-foreground" /> {item.mobile}
                            </span>
                            {item.alterNateMobile && (
                              <span className="font-medium flex items-center gap-1 mt-0.5 text-muted-foreground">
                                <Phone size={12} className="text-muted-foreground/60" /> {item.alterNateMobile} (Alt)
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Delivery Location</span>
                            <span className="font-semibold text-foreground leading-normal">
                              {item.address}
                            </span>
                            {item.landMark && (
                              <span className="font-medium text-muted-foreground mt-0.5 text-[11px]">
                                <span className="font-bold text-[9px] uppercase text-muted-foreground/60">Landmark:</span> {item.landMark}
                              </span>
                            )}
                            <span className="font-semibold text-primary mt-1 flex items-center gap-1">
                              <Globe size={12} /> {item.city}, {item.state} - {item.pinCode}
                            </span>
                          </div>

                        </div>
                      )}
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
}
