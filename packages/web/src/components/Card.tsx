import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import { red } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import { Favorite } from './Favorite';
import { PostDialog } from './PostDialog';

interface PostCardProps {
  post: any;
}
export default function PostCard({ post }: PostCardProps) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={<Avatar alt={post.author.name} sx={{ bgcolor: red[500] }} aria-label="recipe" />}
        action={<PostDialog post={post} />}
        subheader={post.author.name}
      />
      <CardMedia component="img" height="194" image={post.imageUrl} alt="Paella dish" />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Favorite post={post} />
      </CardActions>
    </Card>
  );
}
