export default function ObjectIncludesObject(objectToTest, testedObject) {
  for (let key of Object.keys(testedObject)) {
    if (testedObject[key] !== objectToTest[key]) {
      return false;
    }
  }
  return true;
}
