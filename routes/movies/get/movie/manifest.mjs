import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";

export default function getMovieManifest(router, db) {
  router.get(
    "/:language/:category/:movie/manifest",
    check.preconfiguration,
    check.language.bind(this, db),
    check.category.bind(this, db),
    check.movie.bind(this, db),
    check.simple.manifest.bind(this, db),
    (req, res) => {
      const { language, category, movie } = req.params;
      try {
        res.sendFile(
          db.structure[language][category][movie].manifest_mpd.getAbsolutePath()
        );
      } catch (error) {
        res
          .status(500)
          .json(
            response.error.send.file(
              { index: 4, value: "manifest" },
              ["movies", language, category, movie, "manifest"],
              null,
              "Could not send manifest file.",
              error
            )
          );
      }
    }
  );
}
