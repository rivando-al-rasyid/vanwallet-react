import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email tidak boleh kosong.",
      "string.email": "Format email tidak valid.",
      "any.required": "Email wajib diisi.",
    }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password tidak boleh kosong.",
    "string.min": "Password minimal 8 karakter.",
    "any.required": "Password wajib diisi.",
  }),
});

export const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email tidak boleh kosong.",
      "string.email": "Format email tidak valid.",
      "any.required": "Email wajib diisi.",
    }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password tidak boleh kosong.",
    "string.min": "Password minimal 8 karakter.",
    "any.required": "Password wajib diisi.",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "string.empty": "Konfirmasi password tidak boleh kosong.",
    "any.only": "Password dan konfirmasi password tidak cocok.",
    "any.required": "Konfirmasi password wajib diisi.",
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email tidak boleh kosong.",
      "string.email": "Format email tidak valid.",
      "any.required": "Email wajib diisi.",
    }),
});
