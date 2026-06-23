import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { updateProfile } from "../../store/slices/authSlice";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", phone: "", email: "", avatar: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", phone: user.phone || "", email: user.email || "", avatar: user.avatar || "" });
    }
  }, [user]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, avatar: reader.result }));
    reader.readAsDataURL(file);
  };
  const handleDeleteAvatar = () => {
    setForm((prev) => ({ ...prev, avatar: "" }));
    setPhotoFile(null);
  };
  const handleSubmit = async () => {
    setSuccess("");
    const result = await dispatch(updateProfile({ fullName: form.name, phone: form.phone, photoFile }));
    if (updateProfile.fulfilled.match(result)) {
      setPhotoFile(null);
      setSuccess("Profile berhasil diupdate!");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Account settings</p>
          <h1 className="mt-2 text-2xl font-black text-base-content">Profile</h1>
        </div>
        <p className="text-sm text-base-content/65">Keep your wallet identity up to date.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.4fr]">
        <aside className="rounded-[1.5rem] border border-base-300 bg-base-100 p-6 text-center shadow-sm">
          {!user ? (
            <div className="flex items-center justify-center py-20 text-sm text-base-content/50">Memuat data profile...</div>
          ) : (
            <>
              <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-[2rem] border border-base-300 bg-base-200 shadow-inner">
                {form.avatar ? (
                  <img src={form.avatar} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" className="text-base-content/40"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" fill="currentColor" /></svg>
                )}
              </div>
              <h2 className="mt-4 text-xl font-black text-base-content">{form.name || "User"}</h2>
              <p className="mt-1 text-sm text-base-content/65">{form.email}</p>
              <div className="mt-6 grid gap-3">
                <button onClick={() => fileInputRef.current?.click()} className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:from-primary/90 hover:to-secondary/90">Change Photo</button>
                <button onClick={handleDeleteAvatar} className="rounded-2xl border border-error/30 px-5 py-3 text-sm font-black text-error transition hover:bg-error/10">Delete Photo</button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </>
          )}
        </aside>

        <section className="rounded-[1.5rem] border border-base-300 bg-base-100 p-6 shadow-sm">
          <h2 className="text-lg font-black text-base-content">Personal Information</h2>
          <div className="mt-6 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-base-content/80">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter Full Name" className="w-full rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-sm text-base-content shadow-sm outline-none transition placeholder:text-base-content/50 focus:border-primary focus:ring-4 focus:ring-primary/20" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-base-content/80">Phone</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder="+628123456789" className="w-full rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-sm text-base-content shadow-sm outline-none transition placeholder:text-base-content/50 focus:border-primary focus:ring-4 focus:ring-primary/20" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-base-content/80">Email</label>
              <input type="email" name="email" value={form.email} readOnly className="w-full rounded-2xl border border-base-300 bg-base-200 px-4 py-3 text-sm text-base-content/65" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => navigate("/dashboard/profile/change-password")} className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-black text-primary transition hover:bg-primary/15">Change Password</button>
              <button type="button" onClick={() => navigate("/dashboard/profile/change-pin")} className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm font-black text-primary transition hover:bg-primary/15">Change PIN</button>
            </div>
            {error && <p className="text-sm font-bold text-error">{error}</p>}
            {success && <p className="text-sm font-bold text-success">{success}</p>}
            <button onClick={handleSubmit} disabled={loading} className="rounded-2xl bg-gradient-to-r from-primary to-secondary px-5 py-3 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:from-primary/90 hover:to-secondary/90 disabled:opacity-60">
              {loading ? "Menyimpan..." : "Save Changes"}
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
