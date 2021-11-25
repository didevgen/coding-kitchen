import { useMutation } from '@apollo/client';
import styled from '@emotion/styled';
import { Grid, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import { SEND_COMMENT } from '../graphql/mutations/post';

const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  height: calc(100vh - 72px);
  .Comments__list {
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    margin-bottom: 16px;
  }
`;

export function Comments({ comments, postId, onComment }) {
  const [commentText, setCommentText] = useState('');
  const [sendComment] = useMutation(SEND_COMMENT);
  return (
    <Grid>
      <Grid item xs={12}>
        <CommentsContainer>
          <List className="Comments__list" sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {comments.map(comment => {
              return (
                <ListItem alignItems="flex-start" key={comment.id}>
                  <ListItemAvatar>
                    <Avatar alt={comment.author.name} src="/static/images/avatar/1.jpg" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={comment.author.name}
                    secondary={
                      <>
                        <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                          {comment.comment}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
          <div className="Comments__input">
            <Grid container direction="row">
              <Grid xs={10}>
                <TextField
                  id="outlined-textarea"
                  label="Multiline Placeholder"
                  fullWidth
                  rows={3}
                  value={commentText}
                  onChange={event => {
                    setCommentText(event.target.value);
                  }}
                  placeholder="Placeholder"
                  multiline
                />
              </Grid>
              <Grid xs={2}>
                <IconButton
                  aria-label="delete"
                  onClick={async () => {
                    await sendComment({
                      variables: {
                        postId,
                        text: commentText
                      }
                    });
                    onComment();
                    setCommentText('');
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Grid>
            </Grid>
          </div>
        </CommentsContainer>
      </Grid>
    </Grid>
  );
}
