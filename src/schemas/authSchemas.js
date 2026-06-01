import Joi from "joi";

/**
 * Custom Joi email validator that additionally rejects addresses
 * containing more than one '@' character (e.g. "a@@b.com", "a@b@c.com").
 * Joi's built-in .email() already catches most malformed addresses,
 * but this explicit check makes the error message unambiguous.
 */
const emailField = Joi.string()
  .email({ tlds: { allow: false } })
  .custom((value, helpers) => {
    const atCount = (value.match(/@/g) || []).length;
    if (atCount !== 1) {
      return helpers.error("string.emailSingleAt");
    }
    return value;
  })
  .messages({
    "string.empty": "Email tidak boleh kosong.",
    "string.email": "Format email tidak valid.",
    "string.emailSingleAt": "Email hanya boleh mengandung satu karakter '@'.",
    "any.required": "Email wajib diisi.",
  });

export const loginSchema = Joi.object({
  email: emailField,
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password tidak boleh kosong.",
    "string.min": "Password minimal 8 karakter.",
    "any.required": "Password wajib diisi.",
  }),
});

export const registerSchema = Joi.object({
  email: emailField,
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
  email: emailField,
});
