export default function urlToFields(url) {
  if (url.indexOf("?") !== -1) {
    return url.substring(1, url.indexOf("?")).split("/");
  } else {
    return url.substring(1, url.length).split("/");
  }
}
