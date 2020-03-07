import response from '../../../predefined/responses.mjs';

export default function checkLanguageCategorySerieSeasonEpisodeAudio(
  db,
  req,
  res,
  next
) {
  const { language, category, serie, season, episode } = req.params;

  if (
    db.structure[language][category][serie].season[season].episode[episode]
      .audio
  ) {
    next();
  } else {
    db.structure[language][category][serie].season[season].episode[episode]
      .new('audio')
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
          db.structure[language][category][serie].season[season].episode[
            episode
          ].audio
        ) {
          next();
        } else {
          res
            .status(500)
            .json(
              response.error.unknown(
                { index: 6, value: 'audio' },
                ['series', ...Object.values(req.params), 'audio'],
                null,
                'Missing audio folder.',
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
