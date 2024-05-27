import response from "../../../predefined/responses.mjs";

export default function checkLanguage(db, req, res, next) {
  const { language } = req.parameters;
  if (db.isSupportedLanguage(language)) {
    next();
  } else {
    res
      .status(400)
      .json(
        response.error.unknownField(
          { index: 1, value: language },
          ["movies", language],
          { existing: { languages: db.structure.languages() } },
          "Language does not exist."
        )
      );
  }
}
