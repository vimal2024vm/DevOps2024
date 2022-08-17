import { useState, useRef } from "react";
import Slider, { Settings } from "react-slick";
import { motion } from "framer-motion";

import { styled, Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import CustomNavigation from "./CustomNavigation";
import { CommonTitle, Genre, Movie } from "types/Movie";
import VideoItemWithHover from "components/VideoItemWithHover";
import { ARROW_MAX_WIDTH } from "constant";
import NetflixNavigationLink from "components/NetflixNavigationLink";
import MotionContainer from "components/animate/MotionContainer";
import { varFadeIn } from "components/animate/variants/fade/FadeIn";

const RootStyle = styled("div")(() => ({
  position: "relative",
  overflow: "inherit",
}));

const StyledSlider = styled(Slider)(
  ({ theme, padding }: { theme: Theme; padding: number }) => ({
    display: "flex !important",
    justifyContent: "center",
    overflow: "initial !important",
    "& > .slick-list": {
      overflow: "visible",
    },
    [theme.breakpoints.up("sm")]: {
      "& > .slick-list": {
        width: `calc(100% - ${2 * padding}px)`,
      },
      "& .slick-list > .slick-track": {
        margin: "0px !important",
      },
      "& .slick-list > .slick-track > .slick-current > div > .MuiBox-root > .MuiPaper-root:hover":
        {
          transformOrigin: "0% 50% !important",
        },
      // "& .slick-list > .slick-track > .slick-slide.slick-active:nth-of-type(6) > div > .MuiBox-root > .MuiPaper-root:hover":
      //   {
      //     transformOrigin: "0% 50% !important",
      //   },
    },
    [theme.breakpoints.down("sm")]: {
      "& > .slick-list": {
        width: `calc(100% - ${padding}px)`,
      },
    },
  })
);

interface SlideItemProps {
  item: Movie;
}

function SlideItem({ item }: SlideItemProps) {
  return (
    <Box sx={{ pr: { xs: 0.5, sm: 1 } }}>
      <VideoItemWithHover video={item} />
    </Box>
  );
}

interface SlickSliderProps {
  videos: Movie[];
  genre: Genre | CommonTitle;
}
export default function SlickSlider({ videos, genre }: SlickSliderProps) {
  const sliderRef = useRef<Slider>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showExplore, setShowExplore] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const theme = useTheme();

  const beforeChange = async (currentIndex: number, nextIndex: number) => {
    if (currentIndex < nextIndex) {
      setActiveSlideIndex(nextIndex);
    } else if (currentIndex > nextIndex) {
      setIsEnd(false);
    }
    setActiveSlideIndex(nextIndex);
  };

  const settings: Settings = {
    speed: 500,
    arrows: false,
    infinite: false,
    lazyLoad: "ondemand",
    slidesToShow: 6,
    slidesToScroll: 6,
    // afterChange: (current) => {
    //   console.log("After Change", current);
    // },
    beforeChange,
    // onEdge: (direction) => {
    //   console.log("Edge: ", direction);
    // },
    responsive: [
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const handlePrevious = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  return (
    <Box sx={{ overflow: "hidden", height: "100%", zIndex: 1 }}>
      {videos.length && (
        <>
          <Stack
            direction="row"
            spacing={2}
            sx={{ mb: 2 }}
            alignItems="center"
            onMouseOver={() => {
              setShowExplore(true);
            }}
            onMouseLeave={() => {
              console.log("Leave");
              setShowExplore(false);
            }}
          >
            <NetflixNavigationLink
              variant="h5"
              to={`/genre/${
                genre.id || genre.name.toLowerCase().replace(" ", "_")
              }`}
              sx={{
                display: "inline-block",
                pl: { xs: "30px", sm: "60px" },
                fontWeight: 700,
              }}
            >
              {`${genre.name} Movies `}
              <MotionContainer
                open={showExplore}
                initial="initial"
                sx={{ display: "inline", color: "success.main" }}
              >
                {"Explore All".split("").map((letter, index) => (
                  <motion.span key={index} variants={varFadeIn}>
                    {letter}
                  </motion.span>
                ))}
              </MotionContainer>
            </NetflixNavigationLink>
            {/* <NetflixNavigationLink
              variant="h6"
              to={`/genre/${
                genre.id || genre.name.toLowerCase().replace(" ", "_")
              }`}
              sx={{
                color: "success.main",
                fontWeight: 600,
              }}
            >
              <MotionContainer open={showExplore} initial="initial">
                {"Explore All".split("").map((letter, index) => (
                  <motion.span key={index} variants={varFadeIn}>
                    {letter}
                  </motion.span>
                ))}
              </MotionContainer>
            </NetflixNavigationLink> */}
          </Stack>

          <RootStyle>
            <CustomNavigation
              isEnd={isEnd}
              arrowWidth={ARROW_MAX_WIDTH}
              onNext={handleNext}
              onPrevious={handlePrevious}
              activeSlideIndex={activeSlideIndex}
            >
              <StyledSlider
                ref={sliderRef}
                {...settings}
                padding={ARROW_MAX_WIDTH}
                theme={theme}
              >
                {videos.map((item, idx) => (
                  <SlideItem key={idx} item={item} />
                ))}
              </StyledSlider>
            </CustomNavigation>
          </RootStyle>
        </>
      )}
    </Box>
  );
}
