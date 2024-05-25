import fs from "../modules/customFS.mjs";
import PathDB from "../pathDB.mjs";
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
moviesDB.addStructureFunction("languages", ({ getObject }) => {
  return getObject()
    .list()
    .filter(
      (entry) =>
        !["shared", "languages", "categories", "titles"].includes(entry)
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
const getRandomPath = ({ getObject }) => {
  const files = getObject().list();
  let choosen = files[0];
  if (files.length > 1) {
    let index = Math.floor(Math.random() * files.length - 1);
    index = index < 0 ? 0 : index;
    choosen = files[index];
  } else if (files.length < 1) {
    return null;
  }
  return `${moviesDB.folderLocation}/${getObject()[choosen].path}`;
};
moviesDB.addDirFunction("getRandomPath", getRandomPath, "thumbnails");
moviesDB.addDirFunction("getRandomPath", getRandomPath, "horizontal");
moviesDB.addDirFunction("getRandomPath", getRandomPath, "vertical");

export default moviesDB;
