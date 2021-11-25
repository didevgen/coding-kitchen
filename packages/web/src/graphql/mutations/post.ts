import { gql } from '@apollo/client';

export const CREATE_POST = gql`
  mutation createPost($postData: PostInput, $image: Upload!) {
    createPost(postData: $postData, image: $image) {
      id
    }
  }
`;

export const SEND_COMMENT = gql`
  mutation commentPost($postId: String, $text: String) {
    commentPost(postId: $postId, text: $text)
  }
`;

export const LIKE_POST = gql`
  mutation likePost($postId: String, $isLiked: Boolean) {
    likePost(postId: $postId, isLiked: $isLiked)
  }
`;

export const SEND_COMMENT_IMMIDIATE_UPDATE = gql`
  mutation commentPostImmidiateUpdate($postId: String, $text: String) {
    commentPostImmidiateUpdate(postId: $postId, text: $text) {
      id
      description
      lazyComments {
        id
        comment
      }
    }
  }
`;
