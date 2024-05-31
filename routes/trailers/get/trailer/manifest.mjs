import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";

export default function getEpisodeSubtitle(router, moviesDB, seriesDB) {
  router.get(
    "/trailer/:choosenTrailersDB/:language/:category/:trailer/manifest",
    check.preconfiguration,
    check.choosenTrailersDB.bind(this, moviesDB, seriesDB),
    check.language.bind(this, moviesDB, seriesDB),
    check.category.bind(this, moviesDB, seriesDB),
    check.trailer.bind(this, moviesDB, seriesDB),
    check.simple.manifest.bind(this, moviesDB, seriesDB),
    (req, res) => {
      const { choosenTrailersDB, language, category, trailer } = req.params;
      let trailerDB;
      switch (choosenTrailersDB) {
        case "series":
          trailerDB = seriesDB;
          break;
        case "movies":
          trailerDB = moviesDB;
          break;
        default:
          throw new Error("check.choosenTrailersDB failed");
      }
      try {
        res.sendFile(
          trailerDB.structure[language][category][
            trailer
          ].trailer.manifest_mpd.getAbsolutePath()
        );
      } catch (error) {
        res
          .status(500)
          .json(
            response.error.send.file(
              { index: 6, value: "manifest" },
              [
                "trailers",
                "trailer",
                choosenTrailersDB,
                language,
                category,
                trailer,
                "manifest",
              ],
              null,
              "Could not send manifest file.",
              error
            )
          );
      }
    }
  );
}
