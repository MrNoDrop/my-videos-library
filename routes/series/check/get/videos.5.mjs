import response from '../../../predefined/responses.mjs';

export default function checkLanguageCategorySerieSeasonEpisodeVideo(
  db,
  req,
  res,
  next
) {
  const { category, serie, season, episode } = req.parameters;

  if (
    db.structure.shared[category][serie].season[season].episode[episode].video
  ) {
    next();
  } else {
    db.structure.shared[category][serie].season[season].episode[episode]
      .new('video')
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
            .video
        ) {
          next();
        } else {
          res
            .status(500)
            .json(
              response.error.unknown(
                { index: 6, value: 'audio' },
                ['series', 'shared', ...Object.values(req.parameters), 'video'],
                null,
                'Missing video folder.',
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
