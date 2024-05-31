import express from "express";
import moviesDB from "../db/movies.mjs";
import seriesDB from "../db/series.mjs";
import get from "./trailers/get.mjs";

const router = express.Router();
get.trailerRouteLanguages(router, moviesDB, seriesDB);
get.trailerRoute(router, moviesDB, seriesDB);
get.trailer(router, moviesDB, seriesDB);
// get.trailerAudio(router, moviesDB, seriesDB);
// get.trailerVideo(router, moviesDB, seriesDB);
get.trailerManifest(router, moviesDB, seriesDB);
export default router;
