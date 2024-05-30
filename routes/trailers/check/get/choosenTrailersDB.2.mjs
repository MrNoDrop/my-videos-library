import response from "../../../predefined/responses.mjs";

export default function checkLanguage(moviesDB, seriesDB, req, res, next) {
  const { choosenTrailersDB } = req.parameters;
  let url = undefined;
  if (req.originalUrl.indexOf("?") !== -1) {
    url = req.originalUrl.substring(1, req.originalUrl.indexOf("?")).split("/");
  } else {
    url = req.originalUrl.substring(1, req.originalUrl.length).split("/");
  }
  if (["movies", "series"].includes(choosenTrailersDB)) {
    next();
  } else {
    res.status(400).json(
      response.error.unknownField(
        { index: 2, value: choosenTrailersDB },
        [...url],
        {
          existing: ["series", "movies"],
        },
        "Database does not exist."
      )
    );
  }
}
