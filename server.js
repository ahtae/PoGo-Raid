const { ApolloServer } = require('apollo-server');
const { sequelize } = require('./models');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const contextMiddleware = require('./utils/contextMiddleware');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
  introspection: true,
  playground: true,
});

server.listen({ port: process.env.PORT || 8000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);

  sequelize
    .authenticate()
    .then(() => console.log('Database is connected!'))
    .catch((err) => console.log(err));
});
