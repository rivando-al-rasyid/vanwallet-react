import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import Joi from "joi";

import { updateProfile, setAvatar } from "../../store/slices/profileSlice";
import { useToast } from "../../context/toast/provider";
import { useConfirm } from "../../context/confirm/provider";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const user = useSelector((state) => state.profile.user);
  const userId = useSelector((state) => state.profile.user?.id ?? null);
  const loading = useSelector((state) => state.profile.loading);
  const avatarPath = useSelector((state) => state.profile.avatarPath);

  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState("");
  const [imgLoadError, setImgLoadError] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", phone: user.phone || "", email: user.email || "" });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUrlInputChange = (e) => {
    setUrlInput(e.target.value);
    setUrlError("");
    setImgLoadError(false);
  };

  const isValidUrl = (str) => {
    try { const url = new URL(str); return url.protocol === "http:" || url.protocol === "https:"; }
    catch { return false; }
  };

  const handleSaveUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) { setUrlError("URL tidak boleh kosong."); return; }
    if (!isValidUrl(trimmed)) { setUrlError("Format URL tidak valid. Gunakan http:// atau https://"); return; }
    dispatch(setAvatar(trimmed));
    setShowUrlInput(false);
    setUrlInput("");
    setUrlError("");
    setImgLoadError(false);
    showToast("Avatar berhasil diupdate!", "success");
  };

  const handleCancelUrl = () => {
    setShowUrlInput(false);
    setUrlInput("");
    setUrlError("");
    setImgLoadError(false);
  };

  const handleDeleteAvatar = async () => {
    const ok = await confirm({
      title: "Hapus foto profil?",
      message: "Foto profilmu akan dihapus dan diganti dengan avatar default.",
      confirmLabel: "Hapus",
      cancelLabel: "Batal",
      variant: "danger",
    });
    if (!ok) return;
    dispatch(setAvatar(null));
    showToast("Avatar berhasil dihapus.", "info");
  };

  const profileSchema = Joi.object({
    name: Joi.string().min(2).required().messages({
      "string.empty": "Nama tidak boleh kosong.",
      "string.min": "Nama minimal 2 karakter.",
      "any.required": "Nama wajib diisi.",
    }),
    phone: Joi.string().pattern(/^[0-9+\-\s]{8,15}$/).required().messages({
      "string.empty": "Nomor telepon tidak boleh kosong.",
      "string.pattern.base": "Format nomor telepon tidak valid.",
      "any.required": "Nomor telepon wajib diisi.",
    }),
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
      "string.empty": "Email tidak boleh kosong.",
      "string.email": "Format email tidak valid.",
      "any.required": "Email wajib diisi.",
    }),
  });

  const handleSubmit = async () => {
    const { error: validationError } = profileSchema.validate(form, { abortEarly: true });
    if (validationError) { showToast(validationError.message, "error"); return; }

    const result = await dispatch(updateProfile({ userId, payload: { name: form.name, phone: form.phone, email: form.email } }));

    if (updateProfile.fulfilled.match(result)) {
      showToast("Profile berhasil diupdate!", "success");
    } else {
      const msg = result.payload || result.error?.message || "Gagal mengupdate profile.";
      showToast(msg, "error");
    }
  };

  const displayAvatar = avatarPath || user?.avatar || null;

  return (
    <>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <Icon icon="lucide:user-round" width={18} height={18} color="#2563EB" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">Profile</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8">
        {!user ? (
          <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
            Memuat data profile...
          </div>
        ) : (
          <>
            {/* Avatar Section */}
            <div className="flex flex-row items-center gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                {displayAvatar && !imgLoadError ? (
                  <img
                    src={displayAvatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    onError={() => setImgLoadError(true)}
                  />
                ) : (
                  <Icon icon="lucide:user-round" width={32} height={32} color="#9CA3AF" aria-hidden="true" />
                )}
              </div>

              <div className="flex flex-col gap-2 w-auto">
                <button
                  onClick={() => { setShowUrlInput((v) => !v); setUrlError(""); setImgLoadError(false); }}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition"
                >
                  <Icon icon="lucide:pencil" width={16} height={16} aria-hidden="true" />
                  Change Profile
                </button>

                <button
                  onClick={handleDeleteAvatar}
                  disabled={!displayAvatar}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-red-400 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50 disabled:opacity-40 transition"
                >
                  <Icon icon="lucide:trash-2" width={16} height={16} aria-hidden="true" />
                  Delete Profile
                </button>
              </div>
            </div>

            {/* URL Input Panel */}
            {showUrlInput && (
              <div className="mt-4 p-4 border border-gray-100 rounded-xl bg-gray-50">
                <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Avatar URL</p>

                {urlInput && isValidUrl(urlInput) && !imgLoadError && (
                  <div className="mb-3 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 shrink-0">
                      <img src={urlInput} alt="preview" className="w-full h-full object-cover" onError={() => setImgLoadError(true)} />
                    </div>
                    <span className="text-xs text-gray-400">Preview</span>
                  </div>
                )}

                {imgLoadError && urlInput && (
                  <p className="text-xs text-red-500 mb-2">Gambar tidak dapat dimuat. Coba URL lain.</p>
                )}

                <input
                  type="url"
                  value={urlInput}
                  onChange={handleUrlInputChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition"
                />

                {urlError && <p className="text-xs text-red-500 mt-1.5">{urlError}</p>}

                <div className="flex gap-2 mt-3">
                  <button onClick={handleSaveUrl} className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition">Simpan</button>
                  <button onClick={handleCancelUrl} className="flex-1 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-100 transition">Batal</button>
                </div>
              </div>
            )}

            <div className="border-t border-gray-100 mt-6 mb-8" />

            {/* Form Fields */}
            <div className="flex flex-col gap-4 sm:gap-5 w-full">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon icon="lucide:user" width={16} height={16} aria-hidden="true" />
                  </span>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter Full Name"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon icon="lucide:phone" width={16} height={16} aria-hidden="true" />
                  </span>
                  <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="Enter Your Number Phone"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon icon="lucide:mail" width={16} height={16} aria-hidden="true" />
                  </span>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter Your Email"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <button type="button" onClick={() => navigate("/dashboard/profile/change-password")} className="text-sm text-blue-600 hover:underline font-medium">
                  Change Password
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Pin</label>
                <button type="button" onClick={() => navigate("/dashboard/profile/change-pin")} className="text-sm text-blue-600 hover:underline font-medium">
                  Change Pin
                </button>
              </div>

              <button onClick={handleSubmit} disabled={loading} className="w-full py-3 sm:py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition mt-2">
                {loading ? "Menyimpan..." : "Submit"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
