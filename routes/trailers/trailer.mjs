import response from "../../predefined/responses.mjs";

export default function getTrailer(router, moviesDB, seriesDB) {
  router.get(
    `/:trailerRoutePrefix/:language/:category/:trailer`,
    async (req, res) => {
      const { trailerRoutePrefix, language, category, trailer } = req.params;
      let trailerDB = undefined;
      switch (trailerRoutePrefix) {
        case "series":
          trailerDB = seriesDB;
          break;
        case "movies":
          trailerDB = moviesDB;
          break;
        default:
          trailerDB = undefined;
          break;
      }
      if (trailerDB) {
        res.json(
          response.ok({
            path: [trailerRoutePrefix, language, category, trailer],
            manifest: null,
            thumbnail: null,
          })
        );
      } else {
        res.status(400).json(
          response.error.unknownField(
            { index: 0, value: trailerRoutePrefix },
            [trailerRoutePrefix, language, category, trailer],
            {
              existing: ["series", "movies"],
            },
            "Trailer does not exist."
          )
        );
      }
    }
  );
}
