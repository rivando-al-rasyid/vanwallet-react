import Joi from "joi";

export const PIN_LENGTH = 6;

/** Default field-array-like value for a blank PIN. */
export const DEFAULT_PIN_VALUE = Array.from({ length: PIN_LENGTH }, () => ({ value: "" }));

/** Joi schema that validates the PIN field array. */
export const pinFieldSchema = Joi.object({
  pin: Joi.array()
    .items(
      Joi.object({
        value: Joi.string().length(1).pattern(/^\d$/).required(),
      }),
    )
    .length(PIN_LENGTH)
    .required(),
});
