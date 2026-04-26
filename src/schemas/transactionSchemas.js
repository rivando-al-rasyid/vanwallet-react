import Joi from "joi";

export const topUpSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    "number.base": "Nominal harus berupa angka.",
    "number.positive": "Nominal harus lebih dari 0.",
    "any.required": "Nominal wajib diisi.",
  }),
  selectedMethod: Joi.string().required().messages({
    "any.required": "Pilih metode pembayaran.",
  }),
});

export const newsletterSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "Email tidak boleh kosong.",
      "string.email": "Format email tidak valid.",
      "any.required": "Email wajib diisi.",
    }),
});

export const transferNominalSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    "number.base": "Nominal harus berupa angka.",
    "number.positive": "Nominal transfer harus lebih dari 0.",
    "any.required": "Nominal wajib diisi.",
  }),
  notes: Joi.string().allow("").max(200).messages({
    "string.max": "Catatan maksimal 200 karakter.",
  }),
});
