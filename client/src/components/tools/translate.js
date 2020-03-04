export async function translate(sourceLang, targetLang, sentence) {
  const checkedSentence = (() => {
    let sentenceToCheck = sentence;
    do {
      sentenceToCheck = sentenceToCheck.replace(" ", "%20");
    } while (sentenceToCheck.includes(" "));
    return sentenceToCheck;
  })();
  return await fetch(
    `https://translated-mymemory---translation-memory.p.rapidapi.com/api/get?q=${checkedSentence}&langpair=${sourceLang}|${targetLang}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host":
          "translated-mymemory---translation-memory.p.rapidapi.com",
        "x-rapidapi-key": "eb933f782dmsh284070e30b3e02bp1a83c4jsnafd84ac40e6e"
      }
    }
  )
    .then(res => res.json())
    .then(json => ({
      language: targetLang,
      translation: json.responseData.translatedText
    }));
}
