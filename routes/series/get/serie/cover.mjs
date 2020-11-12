export default function getSerieCover(router, db) {
  router.get(
    '/shared/:category/:serie/cover/:orientation',
    async (req, res) => {
      const { category, serie, orientation } = req.params;
      try {
        res.sendFile(
          db.structure.shared[category][serie].cover[
            orientation
          ].getRandomPath()
        );
      } catch (err) {
        console.error(err);
      }
    }
  );
}
