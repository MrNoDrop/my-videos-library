import fs from 'fs';

function srtToVtt(input, output) {
  if (!fs.existsSync(input) || !fs.lstatSync(input).isFile()) {
    return false;
  }
  fs.writeFileSync(
    output,
    `WEBVTT - https://subtitletools.com\n\n${new TextDecoder('utf-8')
      .decode(fs.readFileSync(input).buffer)
      .split('\n\n')
      .map(entry => {
        const entry_ = entry.substring(entry.indexOf('\n') + 1, entry.length);
        let [time, subtitle] = [
          entry_.substring(0, entry_.indexOf('\n')),
          entry_.substring(entry_.indexOf('\n') + 1, entry_.length)
        ];
        do {
          time = time.replace(' ', '');
        } while (time.includes(' '));
        do {
          time = time.replace(',', '.');
        } while (time.includes(','));
        let [start, end] = time.includes('-->')
          ? time.split('-->')
          : time.split('->');
        time = [start, end].join(' --> ');
        return [time, subtitle].join('\n');
      })
      .filter(entry => entry !== null)
      .join('\n\n')}`
  );
}
srtToVtt(
  'C:/Users/Patryk Sitko/Desktop/my-videos-app/media/series/shared/anime/naruto/season/1/episode/1/subtitles/fr.srt',
  'C:/Users/Patryk Sitko/Desktop/my-videos-app/media/series/shared/anime/naruto/season/1/episode/1/subtitles/fr.vtt'
);
