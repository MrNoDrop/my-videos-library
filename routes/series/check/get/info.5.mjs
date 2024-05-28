import response from "../../../predefined/responses.mjs";

export default async function checkLanguageCategorySerieSeasonEpisodeInfo(
  db,
  req,
  res,
  next
) {
  const { language, category, serie, season, episode } = req.parameters;

  if (
    db.structure[language][category][serie].season[season].episode[episode].info
  ) {
    next();
  } else {
    res
      .status(404)
      .json(
        response.error.missing.file(
          { index: 6, value: "info" },
          ["series", language, category, serie, season, episode, "info"],
          null,
          "Missing info file."
        )
      );
  }
}
