export default function getEpisodeAudio(router, db) {
  router.get(
    '/:language/:category/:serie/:season/:episode/audio/:quality',
    (req, res) => {
      const {
        language,
        category,
        serie,
        season,
        episode,
        quality
      } = req.params;
      try {
        res.sendFile(
          db.structure[language][category][serie].season[season].episode[
            episode
          ].audio[quality].getAbsolutePath()
        );
      } catch (err) {
        console.error(err);
      }
    }
  );
}
