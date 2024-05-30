import response from "../../../predefined/responses.mjs";

export default function checkLanguage(moviesDB, seriesDB, req, res, next) {
  const { language } = req.parameters;
  let url = undefined;
  if (req.originalUrl.indexOf("?") !== -1) {
    url = req.originalUrl.substring(1, req.originalUrl.indexOf("?")).split("/");
  } else {
    url = req.originalUrl.substring(1, req.originalUrl.length).split("/");
  }
  if (
    moviesDB.isSupportedLanguage(language) ||
    seriesDB.isSupportedLanguage(language)
  ) {
    next();
  } else {
    res.status(400).json(
      response.error.unknownField(
        { index: 3, value: language },
        [...url],
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
