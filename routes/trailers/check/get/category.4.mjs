import response from "../../../predefined/responses.mjs";
import urlToFields from "../../../tools/urlToFields.mjs";

export default async function checkLanguageCategory(
  moviesDB,
  seriesDB,
  req,
  res,
  next
) {
  const { choosenTrailersDB, language, category } = req.parameters;
  let trailersDB = undefined;
  switch (choosenTrailersDB) {
    case "series":
      trailersDB = seriesDB;
      break;
    case "movies":
      trailersDB = moviesDB;
    default:
      throw new Error("Missing check.choosenTrailersDB in path");
  }
  if (trailersDB.structure[language]?.includes(category)) {
    next();
  } else {
    let categoryIndex = undefined;
    const categories = await trailersDB.structure.categories_json.read();
    loop: for (let language in categories) {
      for (let availableCategory in categories[language]) {
        if (availableCategory === category) {
          categoryIndex = categories[language][category];
          break loop;
        }
      }
    }
    if (categoryIndex) {
      for (let key in categories[language]) {
        if (categories[language][key] === categoryIndex) {
          req.parameters.category = key;
          break;
        }
      }
    }
    if (trailersDB.structure[language]?.includes(req.parameters.category)) {
      next();
    } else {
      res.status(400).json(
        response.error.unknownField(
          { index: 4, value: category },
          urlToFields(req.originalUrl),
          {
            existing: { categories: trailersDB.structure[language]?.list() },
          },
          "Category does not exist."
        )
      );
    }
  }
}
