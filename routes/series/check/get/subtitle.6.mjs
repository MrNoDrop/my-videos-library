import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import globalSerieTitle from "../../../tools/globalTitle.mjs";

export default async function checkLanguageCategorySerieSeasonEpisodeSubtitlesSubtitle(
  db,
  req,
  res,
  next
) {
  const { language, category, serie, season, episode, subtitle } =
    req.parameters;
  const globCategory = await globalCategory(language, category, db);
  const globSerieTitle = await globalSerieTitle(language, serie, db);

  if (
    db.structure.shared[globCategory][globSerieTitle].season[season].episode[
      episode
    ].subtitles.includes(`${subtitle}_srt`)
  ) {
    next();
  } else {
    res.status(404).json(
      response.error.missing.file(
        { index: 7, value: subtitle },
        [
          "series",
          language,
          category,
          serie,
          season,
          episode,
          "subtitles",
          subtitle,
        ],
        {
          existing: {
            subtitles: db.structure.shared[globCategory][globSerieTitle].season[
              season
            ].episode[episode].subtitles
              .list()
              .map((subtitle) => subtitle.replace("_srt", "")),
          },
        },
        "Missing subtitle file."
      )
    );
  }
}
