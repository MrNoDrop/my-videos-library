import { default as preconfiguration } from "./get/preconfiguration.mjs";
import { default as language } from "./get/language.0.mjs";
import { default as category } from "./get/category.1.mjs";
import { default as movie } from "./get/movie.2.mjs";
import { default as simpleManifest } from "./get/simple/manifest.3.mjs";
import { default as manifest } from "./get/manifest.3.mjs";
import { default as info } from "./get/info.3.mjs";
import { default as thumbnail } from "./get/thumbnail.3.mjs";
import { default as subtitles } from "./get/subtitles.2.mjs";
import { default as subtitle } from "./get/subtitle.3.mjs";
import { default as audios } from "./get/audios.3.mjs";
import { default as audio } from "./get/audio.4.mjs";
import { default as videos } from "./get/videos.2.mjs";
import { default as video } from "./get/video.3.mjs";

export default {
  preconfiguration,
  simple: { manifest: simpleManifest },
  language,
  category,
  movie,
  manifest,
  info,
  thumbnail,
  subtitles,
  subtitle,
  audios,
  audio,
  videos,
  video,
};
