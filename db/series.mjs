import fs from "../modules/customFS.mjs";
import PathDB from "node-system-path-db-es6";
const supportedLanguages = JSON.parse(
  fs.readFileSync(`${fs.__projectPath}/supported-languages.json`).toString()
);
const seriesDB = (() => new PathDB(`${fs.__projectPath}/media/series`))();
seriesDB.monitor();
seriesDB.isSupportedLanguage = (language) => {
  return supportedLanguages.includes(language);
};
seriesDB.structure.list = () => {
  const nonLanguages = (language) => !["shared"].includes(language);
  const languages = seriesDB.structure.list().filter(nonLanguages);
  return languages;
};
seriesDB.addStructureFunction("languages", ({ getDatabaseStructure }) => {
  return getDatabaseStructure()
    .list()
    .filter(
      (entry) =>
        !["shared", "languages", "categories", "titles"].includes(entry)
    );
});
const toUrl = ({ path, extention }) => {
  let copy = `${path}`;
  if (path.includes("/season/")) {
    copy = copy.replace("/season/", "/");
  }
  if (path.includes("/episode/")) {
    copy = copy.replace("/episode/", "/");
  }
  if (extention && path.endsWith(`.${extention}`)) {
    copy = copy.substring(0, copy.lastIndexOf(`.${extention}`));
  }
  return `/series/${copy}`;
};
seriesDB.addFileFunction("toUrl", toUrl);
seriesDB.addDirFunction("toUrl", toUrl);
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
  return `${seriesDB.folderLocation}/${getDatabaseStructure()[choosen].path}`;
};
seriesDB.addDirFunction("getRandomPath", getRandomPath, (path) =>
  path.endsWith("thumbnails")
);
seriesDB.addDirFunction("getRandomPath", getRandomPath, (path) =>
  path.endsWith("horizontal")
);
seriesDB.addDirFunction("getRandomPath", getRandomPath, (path) =>
  path.endsWith("vertical")
);

export default seriesDB;
