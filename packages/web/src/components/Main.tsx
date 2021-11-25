import CameraIcon from '@mui/icons-material/PhotoCamera';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useQuery } from '@apollo/client';
import { Navigate } from 'react-router-dom';
import { GET_USER_INFO } from '../graphql/queries/userQuery';
import { currentUserGlobal } from '../localState/typePolicies';
import RecipeReviewCard from './Card';
import { NewPhoto } from './PhotoDialog/PhotoDialog';

const theme = createTheme();

export function Main() {
  const { data, loading } = useQuery(GET_USER_INFO);

  if (loading) {
    return <span>Loading</span>;
  }
  if (!data || !data.getUserInfo) {
    return <Navigate to="/login" />;
  }

  if (data.getUserInfo) {
    currentUserGlobal(data.getUserInfo);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            Album
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Container sx={{ py: 8 }} maxWidth="lg">
          <Grid container spacing={4}>
            <Grid xs={12}>
              <NewPhoto uuid="123" />
            </Grid>
            {data.posts.map(post => (
              <Grid item key={post.id} xs={12} sm={6} md={3}>
                <RecipeReviewCard post={post} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </ThemeProvider>
  );
}
