import express from 'express';
import seriesDB from '../db/series.mjs';
const router = express.Router();
router.get('/:language', (req, res) => {
  const { language } = req.params;
  try {
    const categories = seriesDB.structure[language].list();
    res.json(categories);
  } catch (err) {
    console.error(err);
  }
});
router.get('/:language/:category', (req, res) => {
  const { language, category } = req.params;
  try {
    res.json(seriesDB.structure[language][category].list());
  } catch (err) {
    console.error(err);
    res.json({
      error: `category missing`,
      category,
      categories: seriesDB.structure.list()
    });
  }
});
router.get('/:language/:category/:serie', (req, res) => {
  const { language, category, serie } = req.params;
  if (!seriesDB.structure[language][category]) {
    res.json({
      error: `category missing`,
      category,
      categories: seriesDB.structure.list()
    });
    return;
  }
  if (!seriesDB.structure[language][category][serie]) {
    res.json({
      error: `serie missing`,
      serie,
      series: seriesDB.structure[language][category].list()
    });
    return;
  }
  try {
    res.json(seriesDB.structure[language][category][serie].season.list());
  } catch (err) {
    console.error(err);
  }
});
router.get('/shared/:category/:serie/cover/:orientation', async (req, res) => {
  const { category, serie, orientation } = req.params;
  try {
    res.sendFile(
      seriesDB.structure.shared[category][serie].cover[
        orientation
      ].getAbsolutePath()
    );
  } catch (err) {
    console.error(err);
  }
});
router.get('/:language/:category/:serie/:season', (req, res) => {
  const { language, category, serie, season } = req.params;
  try {
    res.json(
      seriesDB.structure[language][category][serie].season[
        season
      ].episode.list()
    );
  } catch (err) {
    console.error(err);
  }
});
router.get('/:language/:category/:serie/:season/:episode', (req, res) => {
  const { language, category, serie, season, episode } = req.params;
  try {
    res.sendFile(
      seriesDB.structure[language][category][serie].season[season].episode[
        episode
      ].manifest.getAbsolutePath()
    );
  } catch (err) {
    console.error(err);
  }
});
router.get(
  '/:language/:category/:serie/:season/:episode/info',
  async (req, res) => {
    const { language, category, serie, season, episode } = req.params;
    try {
      res.json(
        await seriesDB.structure[language][category][serie].season[
          season
        ].episode[episode].info.read()
      );
    } catch (err) {
      console.error(err);
    }
  }
);
router.get(
  '/shared/:category/:serie/:season/:episode/thumbnail',
  (req, res) => {
    const { category, serie, season, episode } = req.params;
    try {
      res.sendFile(
        seriesDB.structure.shared[category][serie].season[season].episode[
          episode
        ].thumbnails.getRandomPath()
      );
    } catch (err) {
      console.error(err);
    }
  }
);
router.get(
  '/shared/:category/:serie/:season/:episode/subtitles',
  (req, res) => {
    const { category, serie, season, episode } = req.params;
    try {
      res.json(
        seriesDB.structure.shared[category][serie].season[season].episode[
          episode
        ].subtitles.list()
      );
    } catch (err) {
      console.error(err);
    }
  }
);
router.get(
  '/shared/:category/:serie/:season/:episode/subtitles/:subtitle',
  (req, res) => {
    const { category, serie, season, episode, subtitle } = req.params;
    try {
      res.sendFile(
        seriesDB.structure.shared[category][serie].season[season].episode[
          episode
        ].subtitles[subtitle].getAbsolutePath()
      );
    } catch (err) {
      console.error(err);
    }
  }
);
router.get('/shared/:category/:serie/:season/:episode/video', (req, res) => {
  const { category, serie, season, episode } = req.params;
  try {
    res.json(
      seriesDB.structure.shared[category][serie].season[season].episode[
        episode
      ].video.list()
    );
  } catch (err) {
    console.error(err);
  }
});
router.get(
  '/shared/:category/:serie/:season/:episode/video/:quality',
  (req, res) => {
    const { language, category, serie, season, episode, quality } = req.params;
    try {
      res.sendFile(
        seriesDB.structure.shared[category][serie].season[season].episode[
          episode
        ].video[quality].getAbsolutePath()
      );
    } catch (err) {
      console.error(err);
    }
  }
);
router.get('/:language/:category/:serie/:season/:episode/audio', (req, res) => {
  const { language, category, serie, season, episode } = req.params;
  try {
    res.json(
      seriesDB.structure[language][category][serie].season[season].episode[
        episode
      ].audio.list()
    );
  } catch (err) {
    console.error(err);
  }
});
router.get(
  '/:language/:category/:serie/:season/:episode/audio/:quality',
  (req, res) => {
    const { language, category, serie, season, episode, quality } = req.params;
    try {
      res.sendFile(
        seriesDB.structure[language][category][serie].season[season].episode[
          episode
        ].audio[quality].getAbsolutePath()
      );
    } catch (err) {
      console.error(err);
    }
  }
);
export default router;
