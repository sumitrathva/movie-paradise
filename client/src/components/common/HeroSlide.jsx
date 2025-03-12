import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Box, Button, Chip, Divider, Stack, Typography, useTheme, IconButton } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from "react-toastify";
import SwiperCore, { Navigation } from "swiper"; // Import Navigation module

import { setGlobalLoading } from "../../redux/features/globalLoadingSlice";
import { routesGen } from "../../routes/routes";

import uiConfigs from "../../configs/ui.configs";
import CircularRate from "./CircularRate";

import tmdbConfigs from "../../api/configs/tmdb.configs";
import genreApi from "../../api/modules/genre.api";
import mediaApi from "../../api/modules/media.api";

// Install Swiper modules
SwiperCore.use([Navigation]);

const HeroSlide = ({ mediaType, mediaCategory }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const swiperRef = useRef(null); // Ref to store the Swiper instance

  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const getMedias = async () => {
      const { response, err } = await mediaApi.getList({
        mediaType,
        mediaCategory,
        page: 1
      });

      if (response) setMovies(response.results);
      if (err) toast.error(err.message);
      dispatch(setGlobalLoading(false));
    };

    const getGenres = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await genreApi.getList({ mediaType });

      if (response) {
        setGenres(response.genres);
        getMedias();
      }
      if (err) {
        toast.error(err.message);
        setGlobalLoading(false);
      }
    };

    getGenres();
  }, [mediaType, mediaCategory, dispatch]);

  return (
    <Box sx={{ position: "relative", color: "primary.contrastText" }}>
      <Swiper
        loop={true}
        grabCursor={true}
        onSwiper={(swiper) => (swiperRef.current = swiper)} // Store swiper instance
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={index}>
            {/* Background Clickable */}
            <Box
              sx={{
                width: "100%",
                height: "100vh",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundImage: `url(${tmdbConfigs.backdropPath(movie.backdrop_path || movie.poster_path)})`,
                cursor: "pointer"
              }}
              onClick={() => navigate(routesGen.mediaDetail(mediaType, movie.id))}
            />

            {/* Movie Details */}
            <Box sx={{
              position: "absolute",
              top: "50%",
              left: "10%",
              transform: "translateY(-50%)",
              color: "white"
            }}>
              <Typography variant="h3" fontWeight="700">
                {movie.title || movie.name}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" mt={2}>
                <CircularRate value={movie.vote_average} />
                <Divider orientation="vertical" sx={{ bgcolor: "white" }} />
                {movie.genre_ids.slice(0, 2).map((genreId, index) => (
                  <Chip
                    key={index}
                    label={genres.find(e => e.id === genreId)?.name}
                    color="primary"
                  />
                ))}
              </Stack>

              <Typography variant="body1" mt={2} sx={{ maxWidth: "500px" }}>
                {movie.overview}
              </Typography>

              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                component={Link}
                to={routesGen.mediaDetail(mediaType, movie.id)}
                sx={{ mt: 2 }}
              >
                Watch Now
              </Button>
            </Box>

            {/* Custom Navigation Buttons (Now Working) */}
            <IconButton
              sx={{
                position: "absolute",
                left: "2%",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" }
              }}
              onClick={() => swiperRef.current?.slidePrev()} // Moves to previous slide
            >
              <ArrowBackIos />
            </IconButton>

            <IconButton
              sx={{
                position: "absolute",
                right: "2%",
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" }
              }}
              onClick={() => swiperRef.current?.slideNext()} // Moves to next slide
            >
              <ArrowForwardIos />
            </IconButton>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default HeroSlide;
