import fs from '../modules/customFS.mjs';
import PathDB from '../pathDB.mjs';
const seriesDB = (() => new PathDB(`${fs.__projectPath}/media/series`))();
seriesDB.monitor();
seriesDB.addDirFunction(
  'getRandomPath',
  ({ getObject }) => {
    const files = getObject().list();
    let choosen = files[0];
    if (files.length > 1) {
      let index = Math.floor(Math.random() * files.length - 1);
      index = index < 0 ? 0 : index;
      choosen = files[index];
    } else if (files.length < 1) {
      return undefined;
    }
    return `${seriesDB.folderLocation}/${getObject()[choosen].path}`;
  },
  'thumbnails'
);
console.log(seriesDB.structure.list());
export default seriesDB;
