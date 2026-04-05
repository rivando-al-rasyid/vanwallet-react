import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../layouts/Dashboard/Header";
import Sidebar from "../../layouts/Dashboard/Sidebar";
import { getSession, updateUser } from "../../services/auth";

export default function ChangePin() {
  const { id } = getSession();
  const navigate = useNavigate();

  const [pin, setPin] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    if (!pin) {
      setError("PIN wajib diisi.");
      setSaving(false);
      return;
    }

    if (!/^[0-9]{6}$/.test(pin)) {
      setError("PIN harus 6 digit angka.");
      setSaving(false);
      return;
    }

    try {
      await updateUser(id, { pin });
      setSuccess("PIN berhasil diupdate!");
      setPin("");

      setTimeout(() => {
        navigate("/profile");
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPin(value);
  };

  return (
    <>
      <Header />
      <main className="flex pt-16 min-h-screen">
        <Sidebar />
        <section className="flex-1 flex flex-col gap-6 p-8 overflow-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                  fill="#2563EB"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Profile</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="max-w-3xl mx-auto w-full text-center">
              <h2 className="text-base font-bold text-gray-800 mb-1">
                Change Pin 👋
              </h2>
              <p className="text-sm text-gray-400 mb-8">
                Please save your pin because this so important.
              </p>

              <div className="flex flex-col items-center">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={handlePinChange}
                  className="w-60 text-center text-3xl tracking-[1rem] border-0 border-b-2 border-gray-300 focus:border-blue-500 outline-none py-3 bg-transparent text-gray-800"
                  placeholder="______"
                />
              </div>

              {error && <p className="text-sm text-red-500 mt-6">{error}</p>}
              {success && (
                <p className="text-sm text-green-600 mt-6">{success}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="w-full mt-10 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 transition"
              >
                {saving ? "Menyimpan..." : "Submit"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
