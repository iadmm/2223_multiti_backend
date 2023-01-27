export const removeSlideFromPlaylist = (playlist, slideId) => {
  return playlist.slides.filter((slide) => {
    return slide && slide.toString() !== slideId;
  });
};