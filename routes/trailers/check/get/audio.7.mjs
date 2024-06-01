import response from "../../../predefined/responses.mjs";

export default async function checkLanguageCategoryTrailerAudioQuality(
  moviesDB,
  seriesDB,
  req,
  res,
  next
) {
  const { choosenTrailersDB, language, category, trailer, quality } =
    req.parameters;
  let trailerDB;
  switch (choosenTrailersDB) {
    case "series":
      trailerDB = seriesDB;
      break;
    case "movies":
      trailerDB = moviesDB;
      break;
    default:
      throw new Error("Missing check.choosenTrailersDB in path");
  }
  if (
    trailerDB.structure[language][category][trailer].trailer.audio.includes(
      `${quality}_mp4`
    )
  ) {
    next();
  } else {
    res.status(404).json(
      response.error.missing.file(
        { index: 7, value: quality },
        [
          "trailers",
          "trailer",
          choosenTrailersDB,
          language,
          category,
          trailer,
          "audio",
          quality,
        ],
        {
          existing: {
            qualities: trailerDB.structure[language][category][
              trailer
            ].trailer.audio
              .list()
              .map((quality) => quality.replace("_mp4", "")),
          },
        },
        "Missing audio file."
      )
    );
  }
}
