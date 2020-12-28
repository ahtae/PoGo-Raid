import { gql } from '@apollo/client';

const REACT_TO_MESSAGE = gql`
  mutation reactToMessage($uuid: String!, $content: String!) {
    reactToMessage(uuid: $uuid, content: $content) {
      content
      uuid
      message {
        to
        from
        uuid
      }
      user {
        username
      }
    }
  }
`;

export default REACT_TO_MESSAGE;
