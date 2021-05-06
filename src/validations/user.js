import Joi from "joi";

const signupUserValidations = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .label("Password")
    .error(
      () =>
        new Error(
          "Password must have Minimum 8 characters, 1 letter, 1 number, and 1 special character"
        )
    ),
  name: Joi.string().required().label("Name"),
});

const loginUserValidations = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .label("Password")
    .error(
      () =>
        new Error(
          "Password must have Minimum 8 characters, 1 letter, 1 number, and 1 special character"
        )
    ),
});

module.exports = { loginUserValidations, signupUserValidations };
