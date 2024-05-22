export default async function globalCategory(language, category, db) {
  language = language === "shared" ? "en" : language;
  const categories = await db.structure.categories.read();
  const categoryID = categories[language][category];
  const sharedCategoryID = Object.values(categories["en"]).indexOf(categoryID);
  return Object.keys(categories["en"])[sharedCategoryID];
}
