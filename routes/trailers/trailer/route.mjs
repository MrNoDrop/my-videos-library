import response from "../../predefined/responses.mjs";

const SERIES = 0;
const MOVIES = 1;

export default function getTrailerRoute(router, moviesDB, seriesDB) {
  router.get("/trailer/route/:language", (req, res) => {
    const { language } = req.params;
    const { definedRoutes } = req.query;
    const definedTrailerRoutes = JSON.parse(
      definedRoutes ? definedRoutes : "[]"
    );
    let trailerRoute = null;
    do {
      let trailersDB = undefined;
      let trailerRoutePrefix = undefined;
      switch (Math.floor(Math.random() * 2)) {
        case SERIES:
          trailerRoutePrefix = "/series";
          trailersDB = seriesDB;
          break;
        case MOVIES:
          trailerRoutePrefix = "/movies";
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
      trailerRoute = `${trailerRoutePrefix}/${language}/${category}/${trailer}/trailer`;
      if (!definedTrailerRoutes.icludes(trailerRoute)) {
        definedTrailerRoutes.push(trailerRoute);
      }
    } while (!definedTrailerRoutes.includes(trailerRoute));
    res.json(
      response.ok({
        path: ["trailers", "trailer", "route", language],
        trailerRoute,
      })
    );
  });
}
