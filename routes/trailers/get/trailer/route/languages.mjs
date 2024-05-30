import response from "../../../../predefined/responses.mjs";
export default function getTrailerRouteLanguages(router, moviesDB, seriesDB) {
  router.get("/trailer/route", (req, res) => {
    res.json(
      response.ok({
        path: ["trailers", "trailer", "route"],
        languages: [
          ...moviesDB.structure.languages(),
          ...seriesDB.structure.languages(),
        ].filter(onlyUnique),
      })
    );
  });
}

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}
