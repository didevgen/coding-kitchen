import { useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Grid } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import { TransitionProps } from '@mui/material/transitions';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { GET_POST } from '../graphql/queries/postQuery';
import { Comments } from './Comments';

const PostImage = styled.img``;

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface PostDialogProps {
  post: any;
}

export function PostDialog({ post }: PostDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { data, loading, refetch } = useQuery(GET_POST, {
    variables: {
      postId: post.id
    }
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton aria-label="settings" onClick={handleClickOpen}>
        <MoreVertIcon />
      </IconButton>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Post
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid container>
          <Grid item xs={8}>
            <PostImage src={post.imageUrl} />
          </Grid>
          <Grid item xs={4}>
            {!loading && data.post && (
              <Comments
                comments={data.post.lazyComments}
                postId={post.id}
                onComment={() => {
                  refetch();
                }}
              />
            )}
          </Grid>
        </Grid>
      </Dialog>
    </>
  );
}
