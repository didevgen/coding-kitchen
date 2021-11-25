import { useMutation } from '@apollo/client';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import { LIKE_POST } from '../graphql/mutations/post';
import { GET_USER_INFO } from '../graphql/queries/userQuery';

export function Favorite({ post }) {
  const [like] = useMutation(LIKE_POST);
  return (
    <IconButton
      color={post.isLiked ? 'secondary' : 'default'}
      aria-label="add to favorites"
      onClick={async () => {
        await like({
          variables: {
            postId: post.id,
            isLiked: !post.isLiked
          },
          update: proxy => {
            // Read the data from our cache for this query.
            const data: any = proxy.readQuery({ query: GET_USER_INFO });
            // Write our data back to the cache with the new comment in it
            proxy.writeQuery({
              query: GET_USER_INFO,
              data: {
                // @ts-ignore
                ...data,
                posts: data.posts.map(cachedPost => {
                  if (cachedPost.id === post.id) {
                    return {
                      ...cachedPost,
                      isLiked: !post.isLiked
                    };
                  }

                  return cachedPost;
                })
              }
            });
          }
        });
      }}
    >
      <FavoriteIcon />
    </IconButton>
  );
}
