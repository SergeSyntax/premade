import { Route } from "@/routes/_dashboard/watch/$mediaId";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useMediaItem } from "../hooks/useMediaItem";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ReactPlayer from "react-player";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ShareIcon from "@mui/icons-material/Share";
import { useCreateDonation } from "../hooks/useCreateDonation";

const MediaWatch = () => {
  const { mediaId } = Route.useParams();
  const { data, isLoading } = useMediaItem(mediaId);
  const { mutate } = useCreateDonation(mediaId);
  const media = data?.data.media;

  return (
    <Container sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            {/* Video player */}
            <CardMedia>
              <Box className="player-wrapper" sx={{ position: "relative", pt: "56.25%" }}>
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <ReactPlayer
                    className="react-player"
                    url={media?.videoUrl}
                    style={{ top: 0, left: 0, position: "absolute" }}
                    width="100%"
                    height="100%"
                    fallback={<CircularProgress />}
                    playing
                    controls
                    stopOnUnmount
                  />
                )}
              </Box>
            </CardMedia>

            <CardHeader
              title={media?.title}
              subheader={
                <Grid sx={{ fontWeight: "bold" }} container spacing={1}>
                  <Typography variant="caption">9,000 Views</Typography>
                  <Typography variant="caption">5 hours ago</Typography>
                </Grid>
              }
            />

            <Grid container alignItems="center">
              <Grid>
                <Box display="flex" alignItems="center">
                  <Avatar
                    alt="Profile Avatar"
                    src="https://via.placeholder.com/150"
                    sx={{ width: 64, height: 64, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6">Media Muches</Typography>
                    <Typography variant="subtitle1">10.6k subscribers</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: "grow" }}></Grid>
              <Grid container spacing={1}>
                <Chip
                  onClick={() => mutate()}
                  clickable
                  icon={<SupportAgentIcon />}
                  label="Support"
                />
                <Chip clickable icon={<ShareIcon />} label="Share" />

                <IconButton>
                  <MoreHorizIcon />
                </IconButton>
              </Grid>
            </Grid>

            <Grid container spacing="2" columns={2}>
              <Grid size={{ xs: 4 }}>
                <Grid size={{ xs: 5 }}></Grid>
              </Grid>
            </Grid>
            <Divider />

            <CardContent>
              <Typography variant="body2">{media?.description}</Typography>
            </CardContent>

            <CardActions>
              <Grid container justifyContent="space-between">
                <Grid>
                  <IconButton aria-label="like">
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MediaWatch;
