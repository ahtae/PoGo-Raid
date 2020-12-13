const { UserInputError, AuthenticationError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User } = require('../../models');
const { JWT_SECRET } = require('../../config/env.json');
const signUpValidator = require('../../validation/signUpValidator');
const loginValidator = require('../../validation/loginValidator');

module.exports = {
  Query: {
    getUsers: async (_, __, { user }) => {
      try {
        if (!user) {
          throw new AuthenticationError('Unauthenticated!');
        }

        const users = await User.findAll({
          where: {
            username: {
              [Op.ne]: user.username,
            },
          },
        });

        return users;
      } catch (err) {
        throw err;
      }
    },
    login: async (_, args) => {
      const { username, password } = args;
      const errors = loginValidator(args);

      try {
        if (Object.keys(errors).length > 0) {
          throw new UserInputError('Bad input!', {
            errors,
          });
        }

        const user = await User.findOne({
          where: { username },
        });

        if (!user) {
          errors.username = 'User not found!';

          throw new UserInputError('User not found!', {
            errors,
          });
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if (!isCorrectPassword) {
          errors.password = 'Password is incorrect!';

          throw new UserInputError('Password is incorrect!', {
            errors,
          });
        }

        const token = jwt.sign(
          {
            username,
          },
          JWT_SECRET,
          {
            expiresIn: 60 * 60,
          }
        );

        user.token = token;

        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        };
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      const { username, email, password } = args;
      const errors = signUpValidator(args);

      try {
        const userByUsername = await User.findOne({
          where: { username },
        });
        const userByEmail = await User.findOne({
          where: { email },
        });

        if (userByUsername) {
          errors.username = 'Username is already taken!';
        }

        if (userByEmail) {
          errors.email = 'Email is already taken!';
        }

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        const hashedPassword = await bcrypt.hash(password, 6);

        const user = await User.create({
          username,
          email,
          password: hashedPassword,
        });

        const token = jwt.sign(
          {
            username,
          },
          JWT_SECRET,
          {
            expiresIn: 60 * 60,
          }
        );

        user.token = token;

        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        };
      } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
          err.errors.forEach(
            (e) => (errors[e.path] = `${e.path} is already taken!`)
          );
        } else if (err.name === 'SequelizeValidationError') {
          err.errors.forEach((e) => (errors[e.path] = e.msg));
        }

        throw new UserInputError('Bad input!', {
          errors,
        });
      }
    },
  },
};
