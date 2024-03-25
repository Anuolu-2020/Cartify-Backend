//Joi messages
const joiOptions = {
  messages: {
    "string.base": "{{#label}} must be a string.",
    "string.alphanum": "{{#label}} must only contain alpha-numeric characters.",
    "string.min": "{{#label}} should have a minimum length of {#limit}.",
    "string.max": "{{#label}} should have a maximum length of {#limit}.",
    "string.email": "Please provide a valid email address for {{#label}}.",
    "number.min": "{{#label}} must be at least {#limit} characters",
    "number.max": "{{#label}} must not exceed {#limit} characters",
  },
};

export = joiOptions;
