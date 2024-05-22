import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";

export default function getMovieAudios(router, db) {
  router.get(
    "/:language/:category/:movie/audio",
    check.preconfiguration,
    check.language.bind(this, db),
    check.category.bind(this, db),
    check.movie.bind(this, db),
    check.audios.bind(this, db),
    (req, res) => {
      const { language, category, movie } = req.params;
      res.json(
        response.ok({
          path: ["movies", ...Object.values(req.params), "audio"],
          qualities: db.structure[language][category][movie].audio.list(),
        })
      );
    }
  );
}
