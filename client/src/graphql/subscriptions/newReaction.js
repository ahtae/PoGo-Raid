import { gql } from '@apollo/client';

const NEW_REACTION = gql`
  subscription newReaction {
    newReaction {
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

export default NEW_REACTION;
