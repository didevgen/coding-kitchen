import { gql } from '@apollo/client';

export const GET_USER_INFO = gql`
  fragment UserFragment on User {
    name
    email
  }

  query getUserInfo {
    getUserInfo {
      id
      ...UserFragment
    }
    posts {
      id
      imageUrl
      description
      isLiked
      author {
        id
        ...UserFragment
      }
    }
  }
`;
