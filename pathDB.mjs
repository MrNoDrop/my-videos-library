import fs from 'fs';

function addPredefinedFunctions() {
  this.skipUpdate = true;
  this.addStructureFunction('list', ({ getObject }) => {
    const copy = { ...getObject() };
    delete copy.extention;
    delete copy.path;
    delete copy.list;
    delete copy.getAbsolutePath;
    return Object.keys(copy);
  });
  this.addStructureFunction('getAbsolutePath', () => this.folderLocation);
  this.addDirFunction(
    'getAbsolutePath',
    ({ path }) => `${this.folderLocation}/${path}`
  );
  this.addDirFunction('isDirectory', () => true);
  this.addDirFunction('isFile', () => false);
  this.addDirFunction('list', object => {
    const copy = { ...this.get(object.path) };
    delete copy.key;
    delete copy.path;
    delete copy.isHidden;
    delete copy.extention;
    for (let func of this.functionNames.dir) {
      delete copy[func];
    }
    return Object.keys(copy);
  });
  this.addDirFunction('write', function({ path }, filename, content) {
    return new Promise((resolve, reject) =>
      fs.writeFile(`${this.folderLocation}/${path}/${filename}`, content, err =>
        err ? reject(err) : resolve(this.update())
      )
    );
  });
  this.addDirFunction('delete', ({ path }) => {
    const deleteFolderRecursive = path => {
      return new Promise(async (resolve, reject) => {
        try {
          if (fs.existsSync(path)) {
            for (let file of fs.readdirSync(path)) {
              const curPath = `${path}/${file}`;
              if (fs.lstatSync(curPath).isDirectory()) {
                // recurse
                await deleteFolderRecursive(curPath);
              } else {
                // delete file
                fs.unlinkSync(curPath);
              }
            }
            fs.rmdirSync(path);
            resolve(this.update());
          }
        } catch (err) {
          reject(err);
        }
      });
    };
    return deleteFolderRecursive(`${this.folderLocation}/${path}`);
  });
  this.addFileFunction(
    'getAbsolutePath',
    ({ path }) => `${this.folderLocation}/${path}`
  );
  this.addFileFunction('isDirectory', () => false);
  this.addFileFunction('isFile', () => true);
  this.addFileFunction('read', function({ path, extention }) {
    return new Promise((resolve, reject) =>
      fs.readFile(`${this.folderLocation}/${path}`, (err, data) =>
        err
          ? reject(err)
          : resolve(
              typeof extention === 'string' &&
                extention.toLowerCase() === 'json'
                ? JSON.parse(data.toString())
                : data
            )
      )
    );
  });
  this.addFileFunction('write', function({ path }, content) {
    return new Promise((resolve, reject) =>
      fs.writeFile(`${this.folderLocation}/${path}`, content, err =>
        err ? reject(err) : resolve(this.update())
      )
    );
  });
  this.addFileFunction('delete', function({ path }) {
    return new Promise((resolve, reject) =>
      fs.unlink(`${this.folderLocation}/${path}`, err =>
        err ? reject(err) : resolve(this.update())
      )
    );
  });
  this.skipUpdate = false;
}

export default class PathDB {
  database = { paths: [], structure: {} };
  functions = {
    dir: [],
    file: [],
    structure: []
  };
  functionNames = { dir: [], file: [], structure: [] };
  constructor(folderLocation) {
    this.folderLocation = folderLocation.replace('\\', '/');
    if (this.folderLocation.endsWith('/')) {
      this.folderLocation = this.folderLocation.substring(
        0,
        folderLocation.length - 1
      );
    }
    addPredefinedFunctions.bind(this)();
    this.initialRun = true;
    this.update();
    this.initialRun = false;
  }
  update() {
    if (!this.skipUpdate) {
      this.database.paths = map(this.folderLocation);
      this.database.structure = obj.bind(this)(
        this.database.paths,
        this.functions,
        this.folderLocation
      );
    }
  }
  monitor(interval = 100) {
    if (!this.isMonitoring) {
      this.isMonitoring = true;
      this.interval = setInterval(() => {
        this.update();
      }, interval);
    }
  }
  stop() {
    this.isMonitoring = true;
    clearInterval(this.interval);
  }
  get paths() {
    return this.database.paths;
  }
  get structure() {
    for (let { funcName, func } of this.functions.structure) {
      this.database.structure[funcName] = func.bind(this, {
        getObject: () => this.database.structure,
        path: '',
        extention: null
      });
    }
    return this.database.structure;
  }
  get(path) {
    return getStructureObject(this.structure, path);
  }
  create(
    path,
    filename = null,
    filecontent = null,
    options = { force: false }
  ) {
    const { force } = arguments[arguments.length - 1];
    path = checkPath(path);
    const pathEntrys = path.split('/');
    let potentialPath = `${this.folderLocation}`;
    for (let i = 0; i < pathEntrys.length; i++) {
      potentialPath = `${potentialPath}/${pathEntrys[i]}`;
      if (fs.existsSync(potentialPath)) {
        if (fs.lstatSync(potentialPath).isFile()) {
          try {
            if (!force) {
              throw new Error(
                `Creating path: '${path}' has not succeeded, path: '${potentialPath.replace(
                  this.folderLocation,
                  ''
                )}' is a file.\nSet attribute force to true to override blocking chains.`
              );
            } else {
              fs.unlinkSync(potentialPath, err => {
                if (err) throw new Error(err);
              });
              fs.mkdirSync(potentialPath);
            }
          } catch (err) {
            console.error(err);
            return false;
          }
        }
        continue;
      } else {
        fs.mkdirSync(potentialPath);
      }
    }
    if (typeof filename === 'string') {
      fs.writeFileSync(
        `${this.folderLocation}/${path}/${filename}`,
        typeof filecontent === 'object' &&
          filecontent.constructor.name === 'Object'
          ? ''
          : filecontent
      );
    }
    return true;
  }
  delete(path) {
    path = checkPath(path);
    const deleteFolderRecursive = path => {
      try {
        if (fs.existsSync(path)) {
          for (let file of fs.readdirSync(path)) {
            const curPath = `${path}/${file}`;
            if (fs.lstatSync(curPath).isDirectory()) {
              // recurse
              deleteFolderRecursive(curPath);
            } else {
              // delete file
              fs.unlinkSync(curPath);
            }
          }
          fs.rmdirSync(path);
        }
        return true;
      } catch (err) {
        console.error(err);
        return false;
      }
    };
    let isRegisteredPath = false;
    for (let registeredPath of this.paths) {
      if (registeredPath.startsWith(path)) {
        isRegisteredPath = true;
        break;
      }
    }
    if (isRegisteredPath) {
      if (!fs.existsSync(`${this.folderLocation}/${path}`)) {
        this.database.paths = this.paths.filter(
          registeredPath => registeredPath !== path
        );
        return true;
      }
      if (fs.lstatSync(`${this.folderLocation}/${path}`).isDirectory()) {
        return deleteFolderRecursive(`${this.folderLocation}/${path}`);
      }
    }
    if (fs.lstatSync(`${this.folderLocation}/${path}`).isFile()) {
      fs.unlinkSync(`${this.folderLocation}/${path}`);
      return true;
    }
    return false;
  }
  addStructureFunction(funcName, func) {
    if (this.functionNames.structure.includes(funcName)) {
      const functionIndex = this.functionNames.indexOf(funcName);
      if (functionIndex >= 0) {
        this.functionNames.structure.splice(functionIndex, 1);
        this.functions.structure.splice(functionIndex, 1);
      }
    }
    this.functionNames.structure.push(funcName);
    this.functions.structure.push({ funcName, func });
    this.update();
  }
  addDirFunction(funcName, func, target = '*') {
    if (!this.functionNames.dir.includes(funcName)) {
      this.functionNames.dir.push(funcName);
    }
    this.functions.dir.push({ target, funcName, func });
    this.update();
  }
  addFileFunction(funcName, func, target = '*.*') {
    if (!this.functionNames.file.includes(funcName)) {
      this.functionNames.file.push(funcName);
    }
    this.functions.file.push({ target, funcName, func });
    this.update();
  }
}
function map(source, initialSource = null) {
  if (initialSource === null) {
    initialSource = source;
  }
  let mapped = [];
  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    if (files.length === 0) {
      mapped = [...mapped, `${source.replace(initialSource, '')}`];
    } else {
      files.forEach(function(file) {
        try {
          if (fs.lstatSync(`${source}/${file}`).isDirectory()) {
            mapped = [...mapped, ...map(`${source}/${file}`, initialSource)];
          } else {
            mapped = [
              ...mapped,
              `${source.replace(initialSource, '')}/${file}`
            ];
          }
        } catch (err) {
          console.error(err);
        }
      });
    }
  } else if (fs.lstatSync(source).isFile()) {
    mapped.push(
      source.startsWith(initialSource + '/')
        ? source.replace(initialSource + '/', '')
        : source.replace(initialSource, '')
    );
  }
  return mapped;
}

function join(obj1, obj2) {
  let finalObject = { ...obj1 };
  for (let key in obj2) {
    if (typeof finalObject[key] !== 'object') {
      finalObject[key] = {};
    }
    if (typeof obj2[key] === 'object') {
      finalObject[key] = join(finalObject[key], obj2[key]);
    } else {
      finalObject[key] = obj2[key];
    }
  }
  return finalObject;
}

function obj(mapped, functions, folderLocation) {
  let objectified = [];
  let obj = {};
  for (let path of mapped) {
    objectified.push(objectify.bind(this)(path, functions, folderLocation));
  }
  for (let object of objectified) {
    obj = join(obj, object);
  }
  return obj;
}

function objectify(
  path,
  functions,
  folderLocation = undefined,
  currentPath = ''
) {
  path = checkPath(path);
  currentPath = checkPath(currentPath);
  let key = undefined;
  if (path.includes('/')) {
    key = path.substring(0, path.indexOf('/') + 1).replace('/', '');
  } else {
    key = path;
  }
  let objectKey = `${key}`;
  let isHidden = false;
  let extention = undefined;
  if (objectKey.startsWith('.')) {
    isHidden = true;
    objectKey = objectKey.substring(1, objectKey.length);
  }
  if (
    objectKey.includes('.') &&
    fs.lstatSync(`${folderLocation}/${currentPath}/${key}`).isFile()
  ) {
    extention = objectKey.substring(
      objectKey.lastIndexOf('.') + 1,
      objectKey.length
    );
    objectKey = objectKey.substring(0, objectKey.lastIndexOf('.'));
  }
  const requestedFunctions = {};
  const objectifiedPath = {
    [objectKey]: {
      key: objectKey,
      path: `${currentPath}/${key}`,
      isHidden,
      extention,
      ...(key === path
        ? {}
        : objectify.bind(this)(
            path.substring(path.indexOf('/') + 1, path.length),
            functions,
            folderLocation,
            `${currentPath}/${key}`
          ))
    }
  };
  if (typeof functions === 'object' && typeof folderLocation === 'string') {
    if (fs.lstatSync(`${folderLocation}/${currentPath}/${key}`).isDirectory()) {
      for (let i = 0; i < functions.dir.length; i++) {
        let { target, funcName, func } = functions.dir[i];
        if (target === '*' || target === objectKey || target === key) {
          requestedFunctions[funcName] = func.bind(this, {
            ...objectifiedPath[objectKey],
            getObject: () => this.get(`${currentPath}/${key}`)
          });
        }
      }
    } else if (
      fs.lstatSync(`${folderLocation}/${currentPath}/${key}`).isFile()
    ) {
      for (let i = 0; i < functions.file.length; i++) {
        let { target, funcName, func } = functions.file[i];
        if (target === '*.*' || target === objectKey || target === key) {
          requestedFunctions[funcName] = func.bind(this, {
            ...objectifiedPath[objectKey],
            getObject: () => this.get(`${currentPath}/${key}`)
          });
        }
      }
    }
  }
  objectifiedPath[objectKey] = {
    ...objectifiedPath[objectKey],
    ...requestedFunctions
  };
  return objectifiedPath;
}

function checkPath(path) {
  path = path.replace('\\', '/');
  if (path.startsWith('/')) {
    path = path.substring(1, path.length);
  }
  if (path.endsWith('/')) {
    path = path.substring(0, path.length - 1);
  }
  return path;
}
function getStructureObject(structure, path) {
  path = checkPath(path);
  const [key, ...otherKeys] = path.split('/');
  if (structure[key] === undefined) {
    return undefined;
  } else if (otherKeys.length >= 1) {
    return getStructureObject(structure[key], otherKeys.join('/'));
  } else {
    return structure[key];
  }
}
// function list /*directory*/() {}
// function read /*file*/() {}
// function del /*file or directory*/() {}
// function toPath() {}
// const pathdb = new PathDB('C:/Users/Patryk Sitko/Desktop/my-videos-app/media');
// pathdb.monitor();
// console.log(pathdb.get('/series/naruto copy/season/1/episode/2'));
// setTimeout(
//   async () =>
//     console.log(await pathdb.structure.series.naruto['image.png'].read()),
//   1000
// );
// setInterval(
//   () =>
//     console.log(pathdb.structure.series.anime.naruto.season['1'].episode[1]),
//   10
// );
// pathdb.stop();
// console.log(
//   fs
//     .lstatSync('C:/Users/Patryk Sitko/Desktop/my-videos-app/.dockerignore')
//     .isFile()
// );
