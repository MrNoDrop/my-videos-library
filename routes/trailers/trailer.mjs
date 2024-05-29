import response from "../predefined/responses.mjs";

export default function getTrailer(router, moviesDB, seriesDB) {
  router.get(
    `/trailer/:choosenTrailersDB/:language/:category/:trailer`,
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
          trailerDB = undefined;
          break;
      }
      if (trailerDB) {
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
            ][trailer]
              .toUrl()
              .replace("//", "/")}/manifest`.replace("//", "/"),
            thumbnail: null,
          })
        );
      } else {
        res.status(400).json(
          response.error.unknownField(
            { index: 2, value: choosenTrailersDB },
            [
              "trailers",
              "trailer",
              choosenTrailersDB,
              language,
              category,
              trailer,
            ],
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
