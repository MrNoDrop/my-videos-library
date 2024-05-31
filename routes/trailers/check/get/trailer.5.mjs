import response from "../../../predefined/responses.mjs";
import urlToFields from "../../../tools/urlToFields.mjs";

export default async function checkLanguageCategorieTrailer(
  moviesDB,
  seriesDB,
  req,
  res,
  next
) {
  const { choosenTrailersDB, language, category, trailer } = req.parameters;
  let trailersDB = undefined;
  switch (choosenTrailersDB) {
    case "series":
      trailersDB = seriesDB;
      break;
    case "movies":
      trailersDB = moviesDB;
    default:
      throw new Error("Missing check.choosenTrailersDB in path");
  }
  if (trailersDB.structure[language][category]?.includes(trailer)) {
    next();
  } else {
    res.status(400).json(
      response.error.unknownField(
        { index: 5, value: trailer },
        urlToFields(req.originalUrl),
        {
          existing: {
            trailers: trailersDB.structure[language][category]?.list(),
          },
        },
        "Trailer does not exist."
      )
    );
  }
}
