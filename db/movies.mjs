import fs from "../modules/customFS.mjs";
import PathDB from "node-system-path-db-es6";
const supportedLanguages = JSON.parse(
  fs.readFileSync(`${fs.__projectPath}/supported-languages.json`).toString()
);
const moviesDB = (() => new PathDB(`${fs.__projectPath}/media/movies`))();
moviesDB.monitor();
moviesDB.isSupportedLanguage = (language) => {
  return supportedLanguages.includes(language);
};
moviesDB.structure.list = () => {
  const nonLanguages = (language) => !["shared"].includes(language);
  const languages = moviesDB.structure.list().filter(nonLanguages);
  return languages;
};
moviesDB.addStructureFunction("languages", ({ getDatabaseStructure }) => {
  return getDatabaseStructure()
    .list()
    .filter(
      (entry) =>
        !["shared", "languages", "categories_json", "titles_json"].includes(
          entry
        )
    );
});
const toUrl = ({ path, extention }) => {
  let copy = `${path}`;
  if (extention && path.endsWith(`.${extention}`)) {
    copy = copy.substring(0, copy.lastIndexOf(`.${extention}`));
  }
  return `/movies/${copy}`;
};
moviesDB.addFileFunction("toUrl", toUrl);
moviesDB.addDirFunction("toUrl", toUrl);
const getRandomPath = ({ getDatabaseStructure }) => {
  const files = getDatabaseStructure().list();
  let choosen = files[0];
  if (files.length > 1) {
    let index = Math.floor(Math.random() * files.length - 1);
    index = index < 0 ? 0 : index;
    choosen = files[index];
  } else if (files.length < 1) {
    return null;
  }
  return `${moviesDB.folderLocation}/${getDatabaseStructure()[choosen].path}`;
};
moviesDB.addDirFunction("getRandomPath", getRandomPath, (path) =>
  path.endsWith("thumbnails")
);
moviesDB.addDirFunction("getRandomPath", getRandomPath, (path) =>
  path.endsWith("horizontal")
);
moviesDB.addDirFunction("getRandomPath", getRandomPath, (path) =>
  path.endsWith("vertical")
);

export default moviesDB;
