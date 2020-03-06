export default function getEpisodeInfo(router, db) {
  router.get(
    '/:language/:category/:serie/:season/:episode/info',
    async (req, res) => {
      const { language, category, serie, season, episode } = req.params;
      try {
        res.json(
          await db.structure[language][category][serie].season[season].episode[
            episode
          ].info.read()
        );
      } catch (err) {
        console.error(err);
      }
    }
  );
}
