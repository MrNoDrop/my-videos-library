export default function generateKeyFromComponent(entry) {
  const component = Object.values(entry)[0];
  return Object.keys(component)
    .join("")
    .concat(Object.values(component).join(""));
}
