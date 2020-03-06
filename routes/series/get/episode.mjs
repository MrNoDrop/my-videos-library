export default function getEpisode(router, db) {
  router.get('/:language/:category/:serie/:season/:episode', (req, res) => {
    const { language, category, serie, season, episode } = req.params;
    try {
      res.sendFile(
        db.structure[language][category][serie].season[season].episode[
          episode
        ].manifest.getAbsolutePath()
      );
    } catch (err) {
      console.error(err);
      res.json({
        error: `episode missing`,
        episode,
        episodes: db.structure[language][category][serie].season[
          season
        ].episode.list()
      });
    }
  });
}
