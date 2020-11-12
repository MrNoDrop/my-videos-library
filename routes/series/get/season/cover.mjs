export default function getSeasonCover(router, db) {
  router.get(
    '/shared/:category/:serie/:season/cover/:orientation',
    async (req, res) => {
      const { category, serie, season, orientation } = req.params;
      try {
        res.sendFile(
          db.structure.shared[category][serie].season[season].cover[
            orientation
          ].getRandomPath()
        );
      } catch (err) {
        console.error(err);
      }
    }
  );
}
