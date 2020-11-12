export default function parseSrt(buffer) {
  let srt = new TextDecoder('utf-8').decode(buffer);
  const toReplace = { '\r': '', ' -> ': ' --> ' };
  for (let [key, value] of Object.entries(toReplace)) {
    while (srt.includes(key)) {
      srt = srt.replace(key, value);
    }
  }
  srt = srt.split('\n\n');
  return srt.map(entry => {
    const entry_ = entry.substring(entry.indexOf('\n') + 1, entry.length);
    const [time, subtitle] = [
      entry_.substring(0, entry_.indexOf('\n')),
      entry_.substring(entry_.indexOf('\n') + 1, entry_.length)
    ];
    const [start, end] = time.split(' --> ');
    return [toNumber(start), toNumber(end), subtitle];
  });
}

function toNumber(formattedTime) {
  let time = `${formattedTime}`;
  const toReplace = { '.': ':', ',': ':', '.': ':', ' ': '' };
  for (let [key, value] of Object.entries(toReplace)) {
    while (time.includes(key)) {
      time = time.replace(key, value);
    }
  }
  let [hours, minutes, seconds, millis] = time.split(':');

  return parseFloat(
    `${parseInt(hours) * 120 +
      parseInt(minutes) * 60 +
      parseInt(seconds)}.${millis}`
  );
}
