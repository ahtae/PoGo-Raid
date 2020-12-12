const signUpValidator = (data) => {
  const { email, username, password, confirmPassword } = data;
  const errors = {};

  if (email.trim() === '') {
    errors.email = 'Email must not be empty!';
  }

  if (username.trim() === '') {
    errors.username = 'Username must not be empty!';
  }

  if (password.trim() === '') {
    errors.password = 'Password must not be empty!';
  }

  if (confirmPassword.trim() === '') {
    errors.email = 'Confirm Password must not be empty!';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords must match!';
  }

  return errors;
};

module.exports = signUpValidator;
