import Joi from "joi";

export const profileSchema = Joi.object({
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

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Password saat ini tidak boleh kosong.",
    "any.required": "Password saat ini wajib diisi.",
  }),
  newPassword: Joi.string().min(8).required().messages({
    "string.empty": "Password baru tidak boleh kosong.",
    "string.min": "Password baru minimal 8 karakter.",
    "any.required": "Password baru wajib diisi.",
  }),
  confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "string.empty": "Konfirmasi password tidak boleh kosong.",
    "any.only": "Konfirmasi password baru tidak cocok.",
    "any.required": "Konfirmasi password wajib diisi.",
  }),
});

export const avatarUrlSchema = Joi.object({
  avatarUrl: Joi.string().uri({ scheme: ["http", "https"] }).required().messages({
    "string.empty": "URL tidak boleh kosong.",
    "string.uri": "Format URL tidak valid. Gunakan http:// atau https://",
    "any.required": "URL wajib diisi.",
  }),
});
