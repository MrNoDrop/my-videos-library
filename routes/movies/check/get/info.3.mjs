import response from "../../../predefined/responses.mjs";

export default async function checkLanguageCategoryMovieInfo(
  db,
  req,
  res,
  next
) {
  const { language, category, movie } = req.parameters;

  if (db.structure[language][category][movie].info) {
    next();
  } else {
    res
      .status(404)
      .json(
        response.error.missing.file(
          { index: 4, value: "info" },
          ["movies", ...Object.values(req.parameters)],
          null,
          "Missing info file."
        )
      );
  }
}
