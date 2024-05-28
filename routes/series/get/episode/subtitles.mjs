import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import globalSerieTitle from "../../../tools/globalTitle.mjs";

export default function getEpisodeSubtitles(router, db) {
  router.get(
    "/:language/:category/:serie/:season/:episode/subtitles",
    check.preconfiguration,
    check.category.bind(this, db),
    check.serie.bind(this, db),
    check.seasons.bind(this, db),
    check.season.bind(this, db),
    check.episodes.bind(this, db),
    check.episode.bind(this, db),
    check.subtitles.bind(this, db),
    async (req, res) => {
      const { language, category, serie, season, episode } = req.params;
      const globCategory = await globalCategory(language, category, db);
      const globSerieTitle = await globalSerieTitle(language, serie, db);
      res.json(
        response.ok({
          path: [
            "series",
            language,
            category,
            serie,
            season,
            episode,
            "subtitles",
          ],
          subtitles: db.structure.shared[globCategory][globSerieTitle].season[
            season
          ].episode[episode].subtitles
            .list()
            .map((subtitle) => subtitle.replace("_srt", "")),
        })
      );
    }
  );
}
