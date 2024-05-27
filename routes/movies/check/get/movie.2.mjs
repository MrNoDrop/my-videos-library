import response from "../../../predefined/responses.mjs";

export default async function checkLanguageCategorieMovie(db, req, res, next) {
  let { language, category, movie } = req.parameters;
  if (db.structure[language][category]?.includes(movie)) {
    next();
  } else {
    res.status(400).json(
      response.error.unknownField(
        { index: 3, value: movie },
        ["movies", language, category, movie],
        {
          existing: {
            movies: db.structure[language][category]?.list(),
          },
        },
        "Movie does not exist."
      )
    );
  }
}
