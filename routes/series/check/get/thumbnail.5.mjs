import response from '../../../predefined/responses.mjs';

export default async function checkLanguageCategorySerieSeasonEpisodeThumbnail(
  db,
  req,
  res,
  next
) {
  const { category, serie, season, episode } = req.params;
  const thumbnails =
    db.structure.shared[category][serie].season[season].episode[episode]
      .thumbnails;
  if (thumbnails && thumbnails.list().length >= 1) {
    next();
  } else {
    res
      .status(404)
      .json(
        response.error.missing.file(
          { index: 6, value: 'thumbnail' },
          ['series', 'shared', ...Object.values(req.params), 'thumbnail'],
          null,
          'Missing thumbnail file.'
        )
      );
  }
}
