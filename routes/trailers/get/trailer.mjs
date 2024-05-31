import response from "../../predefined/responses.mjs";
import check from "../check/get.mjs";

export default function getTrailer(router, moviesDB, seriesDB) {
  router.get(
    `/trailer/:choosenTrailersDB/:language/:category/:trailer`,
    check.preconfiguration,
    check.choosenTrailersDB.bind(this, moviesDB, seriesDB),
    check.language.bind(this, moviesDB, seriesDB),
    check.category.bind(this, moviesDB, seriesDB),
    check.trailer.bind(this, moviesDB, seriesDB),
    async (req, res) => {
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
      res.json(
        response.ok({
          path: [
            "trailers",
            "trailer",
            choosenTrailersDB,
            language,
            category,
            trailer,
          ],
          manifest: `/trailers/trailer/${trailerDB.structure[language][
            category
          ][trailer].toUrl()}/manifest`.replaceAll("//", "/"),
          thumbnail: null,
        })
      );
    }
  );
}
