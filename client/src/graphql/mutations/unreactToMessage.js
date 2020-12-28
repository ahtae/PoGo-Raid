import { gql } from '@apollo/client';

const UNREACT_TO_MESSAGE = gql`
  mutation unreactToMessage($uuid: String!) {
    unreactToMessage(uuid: $uuid) {
      content
      uuid
      message {
        to
        from
        uuid
      }
    }
  }
`;

export default UNREACT_TO_MESSAGE;
