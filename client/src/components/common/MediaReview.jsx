import { LoadingButton } from "@mui/lab";
import { Box, Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import Container from "./Container";
import reviewApi from "../../api/modules/review.api";
import TextAvatar from "./TextAvatar";

const ReviewItem = ({ review, onRemoved }) => {
  const { user } = useSelector((state) => state.user);
  const [onRequest, setOnRequest] = useState(false);

  const onRemove = async () => {
    if (onRequest) return;
    setOnRequest(true);

    const { response, err } = await reviewApi.remove({ reviewId: review.id || review._id });

    if (err) {
      toast.error(err.message);
      setOnRequest(false);
    }

    if (response) {
      onRemoved(review.id);
      toast.success("Review removed successfully");
      setOnRequest(false);
    }
  };

  return (
    <Box sx={{
      padding: 2,
      borderRadius: "5px",
      position: "relative",
      opacity: onRequest ? 0.6 : 1,
      "&:hover": { backgroundColor: "background.paper" }
    }}>
      <Stack direction="row" spacing={2}>
        <TextAvatar text={review.user?.displayName} />
        <Stack spacing={2} flexGrow={1}>
          <Stack spacing={1}>
            <Typography variant="h6" fontWeight="700">
              {review.user?.displayName}
            </Typography>
            <Typography variant="caption">
              {dayjs(review.createdAt).format("DD-MM-YYYY HH:mm:ss")}
            </Typography>
          </Stack>
          <Typography variant="body1" textAlign="justify">
            {review.content}
          </Typography>
          {user && user.id === review.user.id && (
            <LoadingButton
              variant="contained"
              startIcon={<DeleteIcon />}
              loadingPosition="start"
              loading={onRequest}
              onClick={onRemove}
              sx={{
                position: { xs: "relative", md: "absolute" },
                right: { xs: 0, md: "10px" },
                marginTop: { xs: 2, md: 0 },
                width: "max-content"
              }}
            >
              remove
            </LoadingButton>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

const MediaReview = ({ reviews, media, mediaType }) => {
  const { user } = useSelector((state) => state.user);
  const [listReviews, setListReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [onRequest, setOnRequest] = useState(false);
  const [content, setContent] = useState("");
  const [reviewCount, setReviewCount] = useState(0);

  const skip = 4;

  useEffect(() => {
    setListReviews([...reviews]);
    setFilteredReviews([...reviews].slice(0, skip));
    setReviewCount(reviews.length);
  }, [reviews]);

  const onAddReview = async () => {
    if (onRequest) return;
    setOnRequest(true);

    if (!media.id) {
      toast.error("Movie ID is required.");
      setOnRequest(false);
      return;
    }

    if (!content.trim()) {
      toast.error("Review content cannot be empty.");
      setOnRequest(false);
      return;
    }

    const body = {
      content,
      mediaId: String(media.id || media.mediaId),
      mediaType,
      mediaTitle: media.title || media.name,
      mediaPoster: media.poster_path
    };

    const { response, err } = await reviewApi.add(body);
    setOnRequest(false);

    if (err) {
      toast.error(err.message);
      return;
    }

    if (response) {
      toast.success("Review posted successfully");

      // ✅ Ensure React detects the state update
      setListReviews((prevReviews) => {
        const updatedReviews = [response, ...prevReviews];
        return [...updatedReviews];
      });

      setFilteredReviews((prevReviews) => {
        const updatedFiltered = [response, ...prevReviews].slice(0, page * skip);
        return [...updatedFiltered];
      });

      setReviewCount((prevCount) => prevCount + 1);
      setContent("");
    }
  };

  const onRemoved = (id) => {
    setListReviews((prevReviews) => {
      const updatedReviews = prevReviews.filter((review) => review.id !== id);
      return [...updatedReviews];
    });

    setFilteredReviews((prevReviews) => {
      const updatedFiltered = prevReviews.filter((review) => review.id !== id).slice(0, page * skip);
      return [...updatedFiltered];
    });

    setReviewCount((prevCount) => prevCount - 1);
    toast.success("Review removed successfully");
  };

  const onLoadMore = () => {
    setFilteredReviews((prevFiltered) => {
      const moreReviews = listReviews.slice(page * skip, (page + 1) * skip);
      return [...prevFiltered, ...moreReviews];
    });
    setPage((prevPage) => prevPage + 1);
  };

  // ✅ Debugging: Log state updates
  useEffect(() => {
    console.log("Updated Reviews List:", listReviews);
    console.log("Filtered Reviews:", filteredReviews);
  }, [listReviews, filteredReviews]);

  return (
    <Container header={`Reviews (${reviewCount})`}>
      <Stack spacing={4} marginBottom={2}>
        {filteredReviews.map((item) => (
          item.user ? (
            <Box key={item.id}>
              <ReviewItem review={item} onRemoved={onRemoved} />
              <Divider sx={{ display: { xs: "block", md: "none" } }} />
            </Box>
          ) : null
        ))}
        {filteredReviews.length < listReviews.length && (
          <Button onClick={onLoadMore}>Load more</Button>
        )}
      </Stack>

      {user && (
        <>
          <Divider />
          <Stack direction="row" spacing={2}>
            <TextAvatar text={user.displayName} />
            <Stack spacing={2} flexGrow={1}>
              <Typography variant="h6" fontWeight="700">
                {user.displayName}
              </Typography>
              <TextField
                value={content}
                onChange={(e) => setContent(e.target.value)}
                multiline
                rows={4}
                placeholder="Write your review"
                variant="outlined"
              />
              <LoadingButton
                variant="contained"
                size="large"
                sx={{ width: "max-content" }}
                startIcon={<SendOutlinedIcon />}
                loadingPosition="start"
                loading={onRequest}
                onClick={onAddReview}
              >
                Post
              </LoadingButton>
            </Stack>
          </Stack>
        </>
      )}
    </Container>
  );
};

export default MediaReview;
