import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Stack, Button, TextField, Avatar, IconButton, Card, CardContent } from "@mui/material";
import { Favorite, Send, Delete } from "@mui/icons-material";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import reviewApi from "../../api/modules/review.api";

const ReviewItem = ({ review, onRemoved }) => {
  const { user } = useSelector((state) => state.user);
  const [likes, setLikes] = useState(0);

  const handleLike = () => setLikes(likes + 1);

  const onRemove = async () => {
    const { response, err } = await reviewApi.remove({ reviewId: review.id });
    if (err) toast.error(err.message);
    if (response) onRemoved(review.id);
  };

  return (
    <Card
      sx={{
        marginBottom: 2,
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        borderRadius: "10px",
        transition: "0.3s",
        "&:hover": { transform: "scale(1.02)" },
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={review.user?.avatar} sx={{ bgcolor: "primary.main" }}>
            {review.user?.displayName[0]}
          </Avatar>
          <Stack>
            <Typography variant="h6" fontWeight="bold">
              {review.user?.displayName}
            </Typography>
            <Typography variant="caption" color="gray">
              {dayjs(review.createdAt).format("DD MMM YYYY | hh:mm A")}
            </Typography>
          </Stack>
        </Stack>
        <Typography variant="body1" mt={2} color="text.primary">
          {review.content}
        </Typography>

        <Stack direction="row" justifyContent="space-between" mt={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton onClick={handleLike} color="primary">
              <Favorite />
            </IconButton>
            <Typography>{likes}</Typography>
          </Stack>
          {user?.id === review.user.id && (
            <IconButton onClick={onRemove} color="error">
              <Delete />
            </IconButton>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

const MediaReview = ({ reviews, media }) => {
  const { user } = useSelector((state) => state.user);
  const [content, setContent] = useState("");
  const [listReviews, setListReviews] = useState([]);

  useEffect(() => {
    setListReviews(reviews);
  }, [reviews]);

  const onAddReview = async () => {
    if (!content.trim()) return;
    const newReview = { content, user, createdAt: new Date().toISOString() };
    setListReviews([newReview, ...listReviews]);
    setContent("");
    toast.success("Review added!");
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Reviews
      </Typography>

      {user && (
        <Stack spacing={2} mb={3}>
          <TextField
            label="Write your review..."
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button
            variant="contained"
            startIcon={<Send />}
            onClick={onAddReview}
            sx={{ alignSelf: "flex-end" }}
          >
            Post Review
          </Button>
        </Stack>
      )}

      {listReviews.length > 0 ? (
        listReviews.map((review, index) => <ReviewItem key={index} review={review} onRemoved={() => {}} />)
      ) : (
        <Typography color="gray" textAlign="center">
          No reviews yet. Be the first to share your thoughts!
        </Typography>
      )}
    </Box>
  );
};

export default MediaReview;
