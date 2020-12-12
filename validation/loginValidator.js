const loginValidator = (data) => {
  const { username, password } = data;
  const errors = {};

  if (username.trim() === '') {
    errors.username = 'Username cannot be empty!';
  }

  if (password === '') {
    errors.password = 'Password cannot be empty!';
  }

  return errors;
};

module.exports = loginValidator;
