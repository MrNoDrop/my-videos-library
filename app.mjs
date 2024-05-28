import express from "express";
import fileUpload from "express-fileupload";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { dirname } from "path";
import { fileURLToPath } from "url";

import indexRouter from "./routes/index.mjs";
import seriesRouter from "./routes/series.mjs";
import moviesRouter from "./routes/movies.mjs";
import trailersRouter from "./routes/trailers.mjs";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client/build")));

app.use("/", indexRouter);
app.use("/series", seriesRouter);
app.use("/movies", moviesRouter);
app.use("/trailers", trailersRouter);

export default app;
