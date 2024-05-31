import response from "../../../predefined/responses.mjs";
import urlToFields from "../../../tools/urlToFields.mjs";

export default function checkLanguage(moviesDB, seriesDB, req, res, next) {
  const { language } = req.parameters;
  if (
    moviesDB.isSupportedLanguage(language) ||
    seriesDB.isSupportedLanguage(language)
  ) {
    next();
  } else {
    res.status(400).json(
      response.error.unknownField(
        { index: 3, value: language },
        urlToFields(req.originalUrl),
        {
          existing: {
            languages: [
              ...moviesDB.structure.languages(),
              ...seriesDB.structure.languages(),
            ].filter(onlyUnique),
          },
        },
        "Language does not exist."
      )
    );
  }
}

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}
