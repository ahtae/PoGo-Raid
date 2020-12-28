import { gql } from '@apollo/client';

const GET_MESSAGES = gql`
  query getMessages($from: String!) {
    getMessages(from: $from) {
      uuid
      from
      to
      content
      createdAt
      reactions {
        uuid
        content
        user {
          username
        }
      }
    }
  }
`;

export default GET_MESSAGES;
