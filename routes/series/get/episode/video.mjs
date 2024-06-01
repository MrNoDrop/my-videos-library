import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";
import globalCategory from "../../../tools/globalCategory.mjs";
import globalSerieTitle from "../../../tools/globalTitle.mjs";

export default function getEpisodeVideo(router, db) {
  router.get(
    "/:language/:category/:serie/:season/:episode/video/:quality",
    check.preconfiguration,
    check.language.bind(this, db),
    check.category.bind(this, db),
    check.serie.bind(this, db),
    check.seasons.bind(this, db),
    check.season.bind(this, db),
    check.episodes.bind(this, db),
    check.episode.bind(this, db),
    check.videos.bind(this, db),
    check.video.bind(this, db),
    async (req, res) => {
      const { language, category, serie, season, episode, quality } =
        req.params;
      const globCategory = await globalCategory(language, category, db);
      const globSerieTitle = await globalSerieTitle(language, serie, db);

      try {
        res.sendFile(
          db.structure.shared[globCategory][globSerieTitle].season[
            season
          ].episode[episode].video[`${quality}_mp4`].getAbsolutePath()
        );
      } catch (error) {
        res
          .status(500)
          .json(
            response.error.send.file(
              { index: 7, value: quality },
              [
                "series",
                language,
                category,
                serie,
                season,
                episode,
                "video",
                quality,
              ],
              null,
              "Could not send video file.",
              error
            )
          );
      }
    }
  );
}
