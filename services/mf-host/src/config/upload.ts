const GiB = 1024 ** 3;
const MiB = 1024 ** 3;

export const THUMBNAIL_MAX_SIZE = 5 * MiB;
export const VIDEO_MAX_SIZE = 16 * GiB;

export const ACCEPT_VIDEO_TYPES = {
  "video/mp4": [".mp4"],
  "video/mpeg": [".mpeg"],
  "video/webm": [".webm"],
};

export const ACCEPT_IMAGE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};
