import check from "../../check/get.mjs";
import response from "../../../predefined/responses.mjs";

export default function getMovieAudio(router, db) {
  router.get(
    "/:language/:category/:movie/audio/:quality",
    check.preconfiguration,
    check.language.bind(this, db),
    check.category.bind(this, db),
    check.movie.bind(this, db),
    check.audios.bind(this, db),
    check.audio.bind(this, db),
    (req, res) => {
      const { language, category, movie, quality } = req.params;
      try {
        res.sendFile(
          db.structure[language][category][movie].audio[
            quality
          ].getAbsolutePath()
        );
      } catch (error) {
        res
          .status(500)
          .json(
            response.error.send.file(
              { index: 7, value: quality },
              ["movies", language, category, movie, "audio", quality],
              null,
              "Could not send audio file.",
              error
            )
          );
      }
    }
  );
}
