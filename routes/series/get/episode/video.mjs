export default function getEpisodeVideo(router, db) {
  router.get(
    '/shared/:category/:serie/:season/:episode/video/:quality',
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
          db.structure.shared[category][serie].season[season].episode[
            episode
          ].video[quality].getAbsolutePath()
        );
      } catch (err) {
        console.error(err);
      }
    }
  );
}
