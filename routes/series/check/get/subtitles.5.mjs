import response from '../../../predefined/responses.mjs';

export default function checkLanguageCategorySerieSeasonEpisodeSubtitles(
  db,
  req,
  res,
  next
) {
  const { category, serie, season, episode } = req.parameters;

  if (
    db.structure.shared[category][serie].season[season].episode[episode]
      .subtitles
  ) {
    next();
  } else {
    db.structure.shared[category][serie].season[season].episode[episode]
      .new('subtitles')
      .then(() => next())
      .catch(async error => {
        if (error.type === db.errors.OPERATION_LOCKED) {
          let refresh = 0;
          while (db.operationIsLocked(error.lock.key) && refresh < 10) {
            await sleep(10);
            ++refresh;
          }
        }
        if (
          db.structure.shared[category][serie].season[season].episode[episode]
            .subtitles
        ) {
          next();
        } else {
          res
            .status(500)
            .json(
              response.error.unknown(
                { index: 6, value: 'subtitles' },
                ['series', ...Object.values(req.parameters)],
                null,
                'Missing subtitles folder.',
                error.type !== db.errors.OPERATION_LOCKED && error
              )
            );
        }
      });
  }
}

function sleep(millis) {
  return new Promise(resolve => setTimeout(() => resolve(), millis));
}
