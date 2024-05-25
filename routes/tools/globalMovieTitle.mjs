export default async function golbalMovieTitle(language, title, db) {
  language = language === "shared" ? "en" : language;
  const titles = await db.structure.titles.read();
  const titleID = titles[language][title];
  const sharedTitleID = Object.values(titles["en"]).indexOf(titleID);
  return Object.keys(titles["en"])[sharedTitleID];
}
