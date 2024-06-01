import { push } from "redux-first-routing";

export default ({ getState, dispatch }) => {
  const { state, router } = getState();
  const {
    user: { language: storedLanguage },
  } = state;
  const { routes, pathname } = router;
  if (pathname.endsWith("/")) {
    dispatch(push(pathname.substring(0, pathname.length - 1)));
  } else {
    let route = pathname.substring(1, pathname.length);
    route = route.split("/");
    console.log(route[0]);
    const language = routes["supported-languages"].includes(route[0])
      ? route[0]
      : storedLanguage;
    const testingRoute = route[1] ? route[1] : "";
    let validRoute = false;
    for (let key in routes[language]) {
      if (testingRoute === routes[language][key]) {
        validRoute = true;
        break;
      }
    }
    if (!validRoute) {
      const testingRouteSylabs = testingRoute.split("");
      let match = undefined;
      let highestMatchScore = 0;
      for (let key in routes[language]) {
        let matchScore = 0;
        for (let sylab of testingRouteSylabs) {
          if (routes[language][key].includes(sylab)) {
            ++matchScore;
          }
        }
        if (matchScore > 0 && matchScore > highestMatchScore) {
          highestMatchScore = matchScore;
          match = routes[language][key];
        }
      }
      let newRoute = undefined;
      if (!match) {
        newRoute = `/${language}/${routes[language].home}`;
      } else {
        route[1] = match;
        newRoute = `/${route.join("/")}`;
      }
      dispatch(push(newRoute));
    }
  }
};
