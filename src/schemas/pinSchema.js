import Joi from "joi";

export const PIN_LENGTH = 6;

/** Default field-array-like value for a blank PIN. */
export const DEFAULT_PIN_VALUE = Array.from({ length: PIN_LENGTH }, () => ({ value: "" }));

/** Joi schema that validates the PIN field array. */
export const pinFieldSchema = Joi.object({
  pin: Joi.array()
    .items(
      Joi.object({
        value: Joi.string().length(1).pattern(/^\d$/).required().messages({
          "string.empty": `Masukkan PIN lengkap (${PIN_LENGTH} digit).`,
          "string.length": `Masukkan PIN lengkap (${PIN_LENGTH} digit).`,
          "string.pattern.base": `Masukkan PIN lengkap (${PIN_LENGTH} digit).`,
          "any.required": `Masukkan PIN lengkap (${PIN_LENGTH} digit).`,
        }),
      }),
    )
    .length(PIN_LENGTH)
    .required()
    .messages({
      "array.length": `Masukkan PIN lengkap (${PIN_LENGTH} digit).`,
      "array.base": `Masukkan PIN lengkap (${PIN_LENGTH} digit).`,
      "any.required": `Masukkan PIN lengkap (${PIN_LENGTH} digit).`,
    }),
});
