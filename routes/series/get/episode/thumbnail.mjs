import check from '../../check/get.mjs';

export default function getEpisodeThumbnail(router, db) {
  router.get(
    '/shared/:category/:serie/:season/:episode/thumbnail',
    check.preconfiguration,
    check.category.bind(this, db),
    check.serie.bind(this, db),
    check.seasons.bind(this, db),
    check.season.bind(this, db),
    check.episodes.bind(this, db),
    check.episode.bind(this, db),
    check.thumbnail.bind(this, db),
    async (req, res) => {
      const { category, serie, season, episode } = req.params;
      try {
        res.sendFile(
          await db.structure.shared[category][serie].season[season].episode[
            episode
          ].thumbnails.getRandomPath()
        );
      } catch (error) {
        res
          .status(500)
          .json(
            response.error.send.file(
              { index: 6, value: 'thumbnail' },
              ['series', 'shared', ...Object.values(req.params), 'thumbnail'],
              null,
              'Could not send thumbnail file.'
            )
          );
      }
    }
  );
}
