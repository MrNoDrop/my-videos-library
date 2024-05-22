import response from "../../../predefined/responses.mjs";

export default async function checkLanguageCategoryMovieAudioQuality(
  db,
  req,
  res,
  next
) {
  const { language, category, movie, quality } = req.parameters;
  if (db.structure[language][category][movie].audio.includes(quality)) {
    next();
  } else {
    res.status(404).json(
      response.error.missing.file(
        { index: 5, value: quality },
        ["movies", language, category, movie, "audio", quality],
        {
          existing: {
            qualities: db.structure[language][category][movie].audio.list(),
          },
        },
        "Missing audio file."
      )
    );
  }
}
