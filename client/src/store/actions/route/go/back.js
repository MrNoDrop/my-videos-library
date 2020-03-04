import { replace } from 'redux-first-routing';

export default pathname => {
  let route = pathname;
  route = pathname.startsWith('/')
    ? pathname.substring(1, pathname.length)
    : pathname;
  route = pathname.endsWith('/')
    ? pathname.substring(0, pathname.length - 1)
    : pathname;
  route = route.split('/');
  route.pop();
  return replace(`${route.join('/')}`);
};
