const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    username: String!
    email: String!
    createdAt: String!
    token: String
    imageUrl: String
    latestMessage: Message
  }

  type Message {
    uuid: String!
    content: String!
    to: String!
    from: String!
    createdAt: String!
    reactions: [Reaction]
  }

  type Reaction {
    uuid: String!
    content: String!
    createdAt: String!
    message: Message!
    user: User!
  }

  type Query {
    getUsers: [User]!
    getMessages(from: String!): [Message]!
  }

  type Mutation {
    login(username: String!, password: String!): User!
    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    sendMessage(to: String!, content: String!): Message!
    reactToMessage(uuid: String!, content: String!): Reaction!
    unreactToMessage(uuid: String!): Reaction!
  }

  type Subscription {
    newMessage: Message!
    newReaction: Reaction!
  }
`;
