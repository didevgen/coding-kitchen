import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query getPosts {
    posts {
      id
      imageUrl
      description
      isLiked
      author {
        id
        name
      }
    }
  }
`;

export const GET_POST = gql`
  query getPost($postId: String) {
    currentUser @client
    post(postId: $postId) {
      id
      imageUrl
      description
      author {
        id
        name
      }
      lazyComments {
        id
        comment
        author {
          id
          name
        }
      }
    }
  }
`;
