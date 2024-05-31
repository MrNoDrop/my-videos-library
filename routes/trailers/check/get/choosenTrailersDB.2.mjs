import response from "../../../predefined/responses.mjs";
import urlToFields from "../../../tools/urlToFields.mjs";

export default function checkLanguage(moviesDB, seriesDB, req, res, next) {
  const { choosenTrailersDB } = req.parameters;
  if (["movies", "series"].includes(choosenTrailersDB)) {
    next();
  } else {
    res.status(400).json(
      response.error.unknownField(
        { index: 2, value: choosenTrailersDB },
        urlToFields(req.originalUrl),
        {
          existing: ["series", "movies"],
        },
        "Database does not exist."
      )
    );
  }
}
