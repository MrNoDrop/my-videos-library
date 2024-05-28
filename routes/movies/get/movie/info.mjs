import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";

export default function getMovieInfo(router, db) {
  router.get(
    "/:language/:category/:movie/info",
    check.preconfiguration,
    check.language.bind(this, db),
    check.category.bind(this, db),
    check.movie.bind(this, db),
    check.info.bind(this, db),
    async (req, res) => {
      const { language, category, movie } = req.params;
      res.json(
        response.ok({
          path: ["movies", ...Object.values(req.params), "info"],
          info: await db.structure[language][category][movie].info_json.read(),
        })
      );
    }
  );
}
