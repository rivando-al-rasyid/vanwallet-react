import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";

import { updateProfile, setAvatar } from "../../store/slices/profileSlice";
import { useToast } from "../../context/toast/provider";
import { useConfirm } from "../../context/confirm/provider";
import { avatarUrlSchema, profileSchema } from "../../schemas/profileSchemas";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const user = useSelector((state) => state.profile.user);
  const userId = useSelector((state) => state.profile.user?.id ?? null);
  const loading = useSelector((state) => state.profile.loading);
  const avatarPath = useSelector((state) => state.profile.avatarPath);

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imgLoadError, setImgLoadError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: joiResolver(profileSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
    },
  });
  const {
    register: registerAvatar,
    handleSubmit: handleAvatarSubmit,
    watch: watchAvatar,
    reset: resetAvatar,
    formState: { errors: avatarErrors },
  } = useForm({
    resolver: joiResolver(avatarUrlSchema),
    defaultValues: {
      avatarUrl: "",
    },
  });
  const avatarUrl = watchAvatar("avatarUrl");

  useEffect(() => {
    if (user) {
      reset({ name: user.name || "", phone: user.phone || "", email: user.email || "" });
    }
  }, [reset, user]);

  const handleAvatarInputChange = (event) => {
    const nextValue = event.target.value;
    registerAvatar("avatarUrl").onChange(event);
    if (nextValue) {
      setImgLoadError(false);
    }
  };

  const isValidUrl = (inputValue) => {
    if (!inputValue) return false;
    try {
      const parsed = new URL(inputValue);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSaveUrl = ({ avatarUrl: nextAvatarUrl }) => {
    dispatch(setAvatar(nextAvatarUrl.trim()));
    setShowUrlInput(false);
    resetAvatar({ avatarUrl: "" });
    setImgLoadError(false);
    showToast("Avatar berhasil diupdate!", "success");
  };

  const handleCancelUrl = () => {
    setShowUrlInput(false);
    resetAvatar({ avatarUrl: "" });
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

  const onSubmit = async (formValues) => {
    const result = await dispatch(
      updateProfile({
        userId,
        payload: { name: formValues.name, phone: formValues.phone, email: formValues.email },
      }),
    );

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
                  onClick={() => {
                    setShowUrlInput((v) => !v);
                    resetAvatar({ avatarUrl: "" });
                    setImgLoadError(false);
                  }}
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
              <form
                onSubmit={handleAvatarSubmit(handleSaveUrl)}
                className="mt-4 p-4 border border-gray-100 rounded-xl bg-gray-50"
              >
                <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Avatar URL</p>

                {avatarUrl && isValidUrl(avatarUrl) && !imgLoadError && (
                  <div className="mb-3 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-100 shrink-0">
                      <img src={avatarUrl} alt="preview" className="w-full h-full object-cover" onError={() => setImgLoadError(true)} />
                    </div>
                    <span className="text-xs text-gray-400">Preview</span>
                  </div>
                )}

                {imgLoadError && avatarUrl && (
                  <p className="text-xs text-red-500 mb-2">Gambar tidak dapat dimuat. Coba URL lain.</p>
                )}

                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition"
                  {...registerAvatar("avatarUrl")}
                  onChange={handleAvatarInputChange}
                />

                {avatarErrors.avatarUrl?.message && (
                  <p className="text-xs text-red-500 mt-1.5">{avatarErrors.avatarUrl.message}</p>
                )}

                <div className="flex gap-2 mt-3">
                  <button type="submit" className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition">Simpan</button>
                  <button type="button" onClick={handleCancelUrl} className="flex-1 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-100 transition">Batal</button>
                </div>
              </form>
            )}

            <div className="border-t border-gray-100 mt-6 mb-8" />

            {/* Form Fields */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 sm:gap-5 w-full">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon icon="lucide:user" width={16} height={16} aria-hidden="true" />
                  </span>
                  <input type="text" placeholder="Enter Full Name"
                    {...register("name")}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition" />
                </div>
                {errors.name?.message && (
                  <p className="text-sm text-red-500 mt-1.5">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon icon="lucide:phone" width={16} height={16} aria-hidden="true" />
                  </span>
                  <input type="text" placeholder="Enter Your Number Phone"
                    {...register("phone")}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition" />
                </div>
                {errors.phone?.message && (
                  <p className="text-sm text-red-500 mt-1.5">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Icon icon="lucide:mail" width={16} height={16} aria-hidden="true" />
                  </span>
                  <input type="email" placeholder="Enter Your Email"
                    {...register("email")}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 placeholder-gray-400 text-gray-700 transition" />
                </div>
                {errors.email?.message && (
                  <p className="text-sm text-red-500 mt-1.5">{errors.email.message}</p>
                )}
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

              <button type="submit" disabled={loading} className="w-full py-3 sm:py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition mt-2">
                {loading ? "Menyimpan..." : "Submit"}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
