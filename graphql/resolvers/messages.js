const {
  UserInputError,
  AuthenticationError,
  ForbiddenError,
  PubSub,
  withFilter,
} = require('apollo-server');
const { Op } = require('sequelize');
const { User, Message, Reaction } = require('../../models');

const pubsub = new PubSub();

module.exports = {
  Query: {
    getMessages: async (_, { from }, { user }) => {
      try {
        if (!user) {
          throw new AuthenticationError('Unauthenticated!');
        }

        const otherUser = await User.findOne({ where: { username: from } });

        if (!otherUser) {
          throw new UserInputError('User not found!');
        }

        const usernames = [user.username, otherUser.username];

        const messages = await Message.findAll({
          where: {
            from: { [Op.in]: usernames },
            to: { [Op.in]: usernames },
          },
          order: [['createdAt', 'DESC']],
          include: [{ model: Reaction, as: 'reactions' }],
        });

        return messages;
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    sendMessage: async (_, { to, content }, { user, pubsub }) => {
      try {
        if (!user) {
          throw new AuthenticationError('Unauthenticated!');
        }

        const recipient = await User.findOne({
          where: {
            username: to,
          },
        });

        if (!recipient) {
          throw new UserInputError('User is not found!');
        } else if (recipient.username === user.username) {
          throw new UserInputError('You cannot message yourself!');
        }

        if (content.trim() === '') {
          throw new UserInputError('Message is empty!');
        }

        const message = await Message.create({
          to,
          content,
          from: user.username,
        });

        pubsub.publish('NEW_MESSAGE', { newMessage: message });

        return message;
      } catch (err) {
        throw err;
      }
    },
    reactToMessage: async (_, { uuid, content }, { user, pubsub }) => {
      try {
        const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎'];

        if (!reactions.includes(content)) {
          throw new UserInputError('Invalid reaction!');
        }

        const username = user ? user.username : '';

        user = await User.findOne({ where: { username } });

        if (!user) {
          throw new AuthenticationError('Unauthenticated!');
        }

        const message = await Message.findOne({ where: { uuid } });

        if (!message) {
          throw new UserInputError('Message not found!');
        }

        if (message.from !== user.username && message.to !== user.username) {
          throw new ForbiddenError('Unauthorized!');
        }

        let reaction = await Reaction.findOne({
          where: {
            messageId: message.id,
            userId: user.id,
          },
        });

        if (reaction) {
          reaction.content = content;

          await reaction.save();
        } else {
          reaction = await Reaction.create({
            messageId: message.id,
            userId: user.id,
            content,
          });
        }

        pubsub.publish('NEW_REACTION', { newReaction: reaction });

        return reaction;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    unreactToMessage: async (_, { uuid }, { user }) => {
      try {
        const username = user ? user.username : '';

        user = await User.findOne({ where: { username } });

        if (!user) {
          throw new AuthenticationError('Unauthenticated!');
        }

        const reaction = await Reaction.findOne({ where: { uuid } });

        if (!reaction) {
          throw new UserInputError('Reaction not found!');
        }

        if (reaction.userId !== user.id) {
          throw new ForbiddenError('Unauthorized!');
        }

        await Reaction.destroy({
          where: {
            uuid,
          },
        });

        return reaction;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) {
            throw new AuthenticationError('Unauthenticated!');
          }

          return pubsub.asyncIterator('NEW_MESSAGE');
        },
        ({ newMessage }, _, { user }) => {
          if (
            newMessage.from === user.username ||
            newMessage.to === user.username
          ) {
            return true;
          }

          return false;
        }
      ),
    },
    newReaction: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) {
            throw new AuthenticationError('Unauthenticated!');
          }

          return pubsub.asyncIterator('NEW_REACTION');
        },
        async ({ newReaction }, _, { user }) => {
          const message = await newReaction.getMessage();

          if (message.from === user.username || message.to === user.username) {
            return true;
          }

          return false;
        }
      ),
    },
  },
};
