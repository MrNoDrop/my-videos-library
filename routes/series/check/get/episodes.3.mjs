import response from '../../../predefined/responses.mjs';

export default function checkLanguageCategorySerieSeasonEpisodes(
  db,
  req,
  res,
  next
) {
  const { language, category, serie, season } = req.parameters;

  if (db.structure[language][category][serie].season[season].episode) {
    next();
  } else {
    db.structure[language][category][serie].season[season]
      .new('episode')
      .then(() => next())
      .catch(async error => {
        if (error.type === db.errors.OPERATION_LOCKED) {
          let refresh = 0;
          while (db.operationIsLocked(error.lock.key) && refresh < 10) {
            await sleep(10);
            ++refresh;
          }
        }
        if (db.structure[language][category][serie].season[season].episode) {
          next();
        } else {
          res
            .status(500)
            .json(
              response.error.unknown(
                { index: 6, value: season },
                ['series', ...Object.values(req.parameters)],
                null,
                'Missing episodes folder.',
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
