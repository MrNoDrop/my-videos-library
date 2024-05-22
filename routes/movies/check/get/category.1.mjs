import response from "../../../predefined/responses.mjs";

export default async function checkLanguageCategory(db, req, res, next) {
  const { language, category } = req.parameters;
  if (db.structure[language || "shared"].includes(category)) {
    next();
  } else {
    let categoryIndex = undefined;
    const categories = await db.structure.categories.read();
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
    if (db.structure[language || "shared"].includes(req.parameters.category)) {
      next();
    } else {
      res.status(400).json(
        response.error.unknownField(
          { index: 2, value: category },
          [
            "movies",
            ...(language ? [] : ["shared"]),
            ...Object.values(req.parameters),
          ],
          {
            existing: { categories: db.structure[language || "shared"].list() },
          },
          "Category does not exist."
        )
      );
    }
  }
}
