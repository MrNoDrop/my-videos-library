export default function getCategories(router, db) {
  router.get('/:language', (req, res) => {
    const { language } = req.params;
    try {
      const categories = db.structure[language].list();
      res.json(categories);
    } catch (err) {
      console.error(err);
    }
  });
}
