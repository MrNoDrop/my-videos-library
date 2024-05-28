import check from "../../check/get.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import globalSerieTitle from "../../../tools/globalTitle.mjs";

export default function getEpisodeThumbnail(router, db) {
  router.get(
    "/:language/:category/:serie/:season/:episode/thumbnail",
    check.preconfiguration,
    check.category.bind(this, db),
    check.serie.bind(this, db),
    check.seasons.bind(this, db),
    check.season.bind(this, db),
    check.episodes.bind(this, db),
    check.episode.bind(this, db),
    check.thumbnail.bind(this, db),
    async (req, res) => {
      const { language, category, serie, season, episode } = req.params;
      const globCategory = await globalCategory(language, category, db);
      const globSerieTitle = await globalSerieTitle(language, serie, db);
      try {
        res.sendFile(
          await db.structure.shared[globCategory][globSerieTitle].season[
            season
          ].episode[episode].thumbnails.getRandomPath()
        );
      } catch (error) {
        res
          .status(500)
          .json(
            response.error.send.file(
              { index: 6, value: "thumbnail" },
              [
                "series",
                language,
                category,
                serie,
                season,
                episode,
                "thumbnail",
              ],
              null,
              "Could not send thumbnail file."
            )
          );
      }
    }
  );
}
