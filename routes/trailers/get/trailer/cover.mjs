import globalCategory from "../../../tools/globalCategory.mjs";
import globalMovieTitle from "../../../tools/globalTitle.mjs";

export default function getTrailerCover(router, moviesDB, seriesDB) {
  router.get(
    "/trailer/:choosenTrailersDB/:language/:category/:trailer/cover",
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
      try {
        res.sendFile(
          trailerDB.structure.shared[
            await globalCategory(language, category, trailerDB)
          ][
            await globalMovieTitle(language, trailer, trailerDB)
          ].cover.vertical.getRandomPath()
        );
      } catch (err) {
        console.error(err);
      }
    }
  );
}
