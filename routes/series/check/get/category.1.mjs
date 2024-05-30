import response from "../../../predefined/responses.mjs";

export default async function checkLanguageCategory(db, req, res, next) {
  const { language, category } = req.parameters;
  if (db.structure[language]?.includes(category)) {
    next();
  } else {
    let categoryIndex = undefined;
    const categories = await db.structure.categories_json.read();
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
    if (db.structure[language]?.includes(req.parameters.category)) {
      next();
    } else {
      res.status(400).json(
        response.error.unknownField(
          { index: 2, value: category },
          ["series", language, category],
          {
            existing: { categories: db.structure[language]?.list() },
          },
          "Category does not exist."
        )
      );
    }
  }
}
