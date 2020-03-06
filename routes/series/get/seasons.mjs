export default function getSeasons(router, db) {
  router.get('/:language/:category/:serie', (req, res) => {
    const { language, category, serie } = req.params;
    if (!db.structure[language][category]) {
      res.json({
        error: `category missing`,
        category,
        categories: db.structure.list()
      });
      return;
    }
    if (!db.structure[language][category][serie]) {
      res.json({
        error: `serie missing`,
        serie,
        series: db.structure[language][category].list()
      });
      return;
    }
    try {
      res.json(db.structure[language][category][serie].season.list());
    } catch (err) {
      console.error(err);
    }
  });
}
