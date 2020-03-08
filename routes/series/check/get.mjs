import { default as preconfiguration } from './get/preconfiguration.mjs';
import { default as language } from './get/language.0.mjs';
import { default as category } from './get/category.1.mjs';
import { default as serie } from './get/serie.2.mjs';
import { default as season } from './get/season.3.mjs';
import { default as episode } from './get/episode.4.mjs';
import { default as simpleManifest } from './get/simple/manifest.5.mjs';
import { default as manifest } from './get/manifest.5.mjs';
import { default as info } from './get/info.5.mjs';
import { default as thumbnail } from './get/thumbnail.5.mjs';
import { default as subtitles } from './get/subtitles.5.mjs';
import { default as subtitle } from './get/subtitle.6.mjs';
import { default as audios } from './get/audios.5.mjs';
import { default as audio } from './get/audio.6.mjs';
import { default as videos } from './get/videos.5.mjs';
import { default as video } from './get/video.6.mjs';

export default {
  preconfiguration,
  simple: { manifest: simpleManifest },
  language,
  category,
  serie,
  season,
  episode,
  manifest,
  info,
  thumbnail,
  subtitles,
  subtitle,
  audios,
  audio,
  videos,
  video
};
