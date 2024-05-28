export default async function golbalMovieTitle(language, title, db) {
  const titles = await db.structure.titles_json.read();
  const titleID = titles[language][title];
  const sharedTitleID = Object.values(titles["en"]).indexOf(titleID);
  return Object.keys(titles["en"])[sharedTitleID];
}
