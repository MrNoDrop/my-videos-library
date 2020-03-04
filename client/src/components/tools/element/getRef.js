const PROPS = 0;

export function getElementRef(documentElement) {
  if (!documentElement) {
    return;
  }
  const elementValues = Object.values(documentElement);
  if (!typeof elementValues === "object") {
    return;
  }
  return elementValues[PROPS] ? elementValues[PROPS].ref : undefined;
}

export default getElementRef;
