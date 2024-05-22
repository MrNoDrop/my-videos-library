import response from "../../predefined/responses.mjs";
export default function getLanguages(router, db) {
  router.get("/", (req, res) => {
    res.json(
      response.ok({ path: ["movies"], languages: db.structure.languages() })
    );
  });
}
