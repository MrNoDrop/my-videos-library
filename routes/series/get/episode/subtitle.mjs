export default function getEpisodeSubtitle(router, db) {
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
}
