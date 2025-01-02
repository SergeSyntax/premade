import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useMediaList } from "../hooks/useMediaList";
import { DateTime } from "luxon";
import { Link } from "@tanstack/react-router";

// const sampleVideos = [
//   {
//     id: "test",
//     title: "WORLD’S SPICIEST TUNA POKE BOWL CHALLENGE",
//     channel: "Magic Mitch",
//     daysAgo: "6 days ago",
//     thumbnail:
//       "https://thumbnails.odycdn.com/optimize/s:390:220/quality:85/plain/https://thumbs.odycdn.com/e67a0263f522bf494a6412779e9d06bb.webp",
//     duration: "18:11",
//   },
//   {
//     id: "test1",
//     title: "Computer Build: Budget AMD 4650G",
//     thumbnail:
//       "https://thumbnails.odycdn.com/optimize/s:390:220/quality:85/plain/https://thumbnails.lbry.com/GWcx2m04jI8",
//     duration: "44:44",
//   },
// ];

export const MediaContent = () => {
  const { data } = useMediaList();

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" marginBottom={2}>
        Discover
      </Typography>

      <Grid container spacing={2}>
        {data?.data.medias.map((video) => {
          const createdAt = DateTime.fromISO(video.createdAt);
          const now = DateTime.now();
          const days = Math.floor(now.diff(createdAt, "days").days);
          const daysAgo = `${days} days ago`; // e.g. "6 days ago"
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={video.id}>
              <Card>
                <CardActionArea component={Link} to={`/watch/${video.id}`}>
                  <CardMedia component="img" image={video.thumbnailUrl} alt={video.title} />
                  <CardContent>
                    <Typography variant="subtitle1" noWrap>
                      {video.title}
                    </Typography>
                    <Typography variant="body2" color="grey.400">
                      {/* {video.channel} */}
                      "Graya Overload", • {daysAgo}
                    </Typography>
                    <Typography variant="caption" sx={{ float: "right" }}>
                      {/* {video.duration} */}
                      "18:11"
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Typography variant="h6" sx={{ color: "#ff4081", mt: 4 }}>
        Please Upload Content Manually
      </Typography>
    </Box>
  );
};
