export default function getEpisodeThumbnail(router, db) {
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
}
