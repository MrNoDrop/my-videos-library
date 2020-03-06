export default function getEpisodeSubtitles(router,db){
  router.get(
    '/shared/:category/:serie/:season/:episode/subtitles',
    (req, res) => {
      const { category, serie, season, episode } = req.params;
      try {
        res.json(
          db.structure.shared[category][serie].season[season].episode[
            episode
          ].subtitles.list()
        );
      } catch (err) {
        console.error(err);
      }
    }
  );
}