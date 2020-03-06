export default function getCategory(router, db) {
  router.get('/:language/:category', (req, res) => {
    const { language, category } = req.params;
    try {
      res.json(db.structure[language][category].list());
    } catch (err) {
      console.error(err);
      res.json({
        error: `category missing`,
        category,
        categories: db.structure.list()
      });
    }
  });
}
