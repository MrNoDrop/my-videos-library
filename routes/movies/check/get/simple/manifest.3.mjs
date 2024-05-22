import response from "../../../../predefined/responses.mjs";

export default async function checkLanguageCategoryMovieManifest(
  db,
  req,
  res,
  next
) {
  const { language, category, movie } = req.params;
  if (db.structure[language][category][movie].manifest) {
    next();
  } else {
    res
      .status(404)
      .json(
        response.error.missing.file(
          { index: 4, value: "manifest" },
          ["movies", ...Object.values(req.params), "manifest"],
          null,
          "Missing manifest file."
        )
      );
  }
}
