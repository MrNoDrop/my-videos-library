import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";
import parseSrt from "../../../../modules/parseSrt.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import globalSerieTitle from "../../../tools/globalTitle.mjs";

export default async function getEpisodeSubtitle(router, db) {
  router.get(
    "/:language/:category/:serie/:season/:episode/subtitles/:subtitle",
    check.preconfiguration,
    check.category.bind(this, db),
    check.serie.bind(this, db),
    check.seasons.bind(this, db),
    check.season.bind(this, db),
    check.episodes.bind(this, db),
    check.episode.bind(this, db),
    check.subtitles.bind(this, db),
    check.subtitle.bind(this, db),
    async (req, res) => {
      const { language, category, serie, season, episode, subtitle } =
        req.params;
      const { parsed } = req.query;
      const globCategory = await globalCategory(language, category, db);
      const globSerieTitle = await globalSerieTitle(language, serie, db);

      try {
        if (parsed) {
          res.json(
            response.ok(
              parseSrt(
                await db.structure.shared[globCategory][globSerieTitle].season[
                  season
                ].episode[episode].subtitles[`${subtitle}_srt`].read()
              )
            )
          );
        } else {
          res.sendFile(
            db.structure.shared[globCategory][globSerieTitle].season[
              season
            ].episode[episode].subtitles[`${subtitle}_srt`].getAbsolutePath()
          );
        }
      } catch (error) {
        res
          .status(500)
          .json(
            response.error.send.file(
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
              null,
              "Could not send subtitle file.",
              error
            )
          );
      }
    }
  );
}
