export default async function globalCategory(language, category, db) {
  const categories = await db.structure.categories_json.read();
  const categoryID = categories[language][category];
  const sharedCategoryID = Object.values(categories["en"]).indexOf(categoryID);
  return Object.keys(categories["en"])[sharedCategoryID];
}
