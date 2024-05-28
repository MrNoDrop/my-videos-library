import response from "../../predefined/responses.mjs";

const SERIES = 0;
const MOVIES = 1;

export default function getTrailerRoute(router, moviesDB, seriesDB) {
  router.get("/trailer/route/:language", (req, res) => {
    const { language } = req.params;
    const { definedRoutes } = req.query;
    let trailerRoute = -1;
    const definedTrailers = JSON.parse(definedRoutes ? definedRoutes : "[]");
    let trailersDB = undefined;
    switch (Math.floor(Math.random() * 2)) {
      case SERIES:
        trailersDB = seriesDB;
        break;
      case MOVIES:
        trailersDB = moviesDB;
        break;
      default:
        throw new Error();
    }
    const categories = trailersDB.structure[language].list();
    const category =
      categories[Math.floor(Math.random() * (categories.length + 1))];
    const trailers = trailersDB.structure[language][category].list();

    console.log("categories", categories.length, "category", category, "test:");
    if (!definedTrailers.includes(trailer)) {
      trailerRoute = trailer;
    }
    res.json(
      response.ok({
        path: ["trailers", language, "trailer", "route"],
        trailerRoute,
      })
    );
  });
}
