export default function getEpisodes(router, db) {
  router.get('/:language/:category/:serie/:season', (req, res) => {
    const { language, category, serie, season } = req.params;
    console.log(language, category, serie, season);
    try {
      res.json(
        db.structure[language][category][serie].season[season].episode.list()
      );
    } catch (err) {
      console.error(err);
    }
  });
}
