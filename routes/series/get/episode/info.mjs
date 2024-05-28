import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";

export default function getEpisodeInfo(router, db) {
  router.get(
    "/:language/:category/:serie/:season/:episode/info",
    check.preconfiguration,
    check.language.bind(this, db),
    check.category.bind(this, db),
    check.serie.bind(this, db),
    check.seasons.bind(this, db),
    check.season.bind(this, db),
    check.episodes.bind(this, db),
    check.episode.bind(this, db),
    check.info.bind(this, db),
    async (req, res) => {
      const { language, category, serie, season, episode } = req.params;
      res.json(
        response.ok({
          path: ["series", language, category, serie, season, episode, "info"],
          info: await db.structure[language][category][serie].season[
            season
          ].episode[episode].info.read(),
        })
      );
    }
  );
}
