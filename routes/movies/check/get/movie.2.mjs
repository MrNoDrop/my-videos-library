import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";

export default async function checkLanguageCategorieMovie(db, req, res, next) {
  let { language, category, movie } = req.parameters;
  if (db.structure[language || "shared"][category].includes(movie)) {
    next();
  } else {
    res.status(400).json(
      response.error.unknownField(
        { index: 3, value: movie },
        [
          "movies",
          ...(language ? [] : ["shared"]),
          ...Object.values(req.parameters),
        ],
        {
          existing: {
            movies:
              db.structure[language || "shared"][
                language
                  ? category
                  : await globalCategory(language, category, db)
              ].list(),
          },
        },
        "Movie does not exist."
      )
    );
  }
}
