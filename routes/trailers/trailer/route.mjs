import response from "../../predefined/responses.mjs";

const SERIES = 0;
const MOVIES = 1;

export default function getTrailerRoute(router, moviesDB, seriesDB) {
  router.get("/trailer/route/:language", (req, res) => {
    const { language } = req.params;
    const { definedRoutes } = req.query;
    const definedTrailerRoutes = JSON.parse(
      JSON.parse(definedRoutes || '"[]"')
    );
    let trailerRoute = null;
    let allTrailers = 0;
    seriesDB.structure[language].list().forEach((category) => {
      const trailers = seriesDB.structure[language][category].list();
      allTrailers += 1 * trailers.length;
    });
    moviesDB.structure[language].list().forEach((category) => {
      const trailers = moviesDB.structure[language][category].list();
      allTrailers += 1 * trailers.length;
    });
    do {
      if (definedTrailerRoutes.length === allTrailers) {
        break;
      }
      let trailersDB = undefined;
      let choosenTrailersDB = undefined;
      switch (Math.floor(Math.random() * 2)) {
        case SERIES:
          choosenTrailersDB = "series";
          trailersDB = seriesDB;
          break;
        case MOVIES:
          choosenTrailersDB = "movies";
          trailersDB = moviesDB;
          break;
        default:
          throw new Error();
      }
      const categories = trailersDB.structure[language].list();
      const category =
        categories[Math.floor(Math.random() * categories.length)];
      const trailers = trailersDB.structure[language][category].list();
      const trailer = trailers[Math.floor(Math.random() * trailers.length)];
      trailerRoute = `/trailer/${choosenTrailersDB}/${language}/${category}/${trailer}`;
    } while (definedTrailerRoutes.includes(trailerRoute));
    res.json(
      response.ok({
        path: ["trailers", "trailer", "route", language],
        trailerRoute,
      })
    );
  });
}
