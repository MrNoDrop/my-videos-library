export function vmin(value) {
  return window.innerHeight <= window.innerWidth
    ? window.innerHeight * (value / 100)
    : window.innerWidth * (value / 100);
}
export function vminPercent(value) {
  const size = vmin(value);
  const res =
    window.innerHeight <= window.innerWidth
      ? window.innerHeight / size / 100
      : window.innerWidth / size / 100;
  console.log('result', res);
  return res;
}
export function toVmin(value) {
  return window.innerHeight <= window.innerWidth
    ? (value * 100) / window.innerHeight
    : (value * 100) / window.innerWidth;
}

export function vmax(value) {
  return window.innerHeight >= window.innerWidth
    ? window.innerHeight * (value / 100)
    : window.innerWidth * (value / 100);
}

export function toVmax(value) {
  return window.innerHeight >= window.innerWidth
    ? (value * 100) / window.innerHeight
    : (value * 100) / window.innerWidth;
}
