import { default as preconfiguration } from "./get/preconfiguration.mjs";
import { default as choosenTrailersDB } from "./get/choosenTrailersDB.2.mjs";
import { default as language } from "./get/language.3.mjs";
import { default as category } from "./get/category.4.mjs";
import { default as trailer } from "./get/trailer.5.mjs";
import { default as simpleManifest } from "./get/simple/manifest.6.mjs";
import { default as thumbnail } from "./get/thumbnail.6.mjs";
import { default as audios } from "./get/audios.6.mjs";
import { default as audio } from "./get/audio.7.mjs";
import { default as videos } from "./get/videos.6.mjs";
import { default as video } from "./get/video.7.mjs";

export default {
  preconfiguration,
  choosenTrailersDB,
  simple: { manifest: simpleManifest },
  language,
  category,
  trailer,
  thumbnail,
  audios,
  audio,
  videos,
  video,
};
