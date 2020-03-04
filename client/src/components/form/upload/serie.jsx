// import React, { useState } from 'react';
// function SerieUploadForm() {
//   const [video, setVideo] = useState(undefined);
//   const [missingVideo, setMissingVideo] = useState(false);
//   const [serieTitle, setSerieTitle] = useState(undefined);
//   const [episode, setEpisode] = useState(undefined);
//   const [episodeTitle, setEpisodeTitle] = useState(undefined);
//   const [releaseDate, setReleaseDate] = useState(undefined);
//   const [description, setDescription] = useState(undefined);
//   const [submitted, setSubmitted] = useState(false);
//   const resetForm = () => {
//     setVideo(undefined);
//     // setVideoPassedValidation(undefined);
//     setSerieTitle(undefined);
//   };
//   return (
//     <form
//       onSubmit={e => {
//         e.preventDefault();
//         const formData = new FormData();
//         if (typeof video !== 'object' || video.constructor.name !== 'File') {
//           setMissingVideo(true);
//         }
//         formData.append('video', video);
//         formData.append('serieTitle', serieTitle);
//         formData.append('episode', episode);
//         formData.append('episodeTitle', episodeTitle);
//         formData.append('releaseDate', releaseDate);
//         formData.append('description', description);
//         fetch('/series/upload', {
//           method: 'POST',
//           body: formData
//         })
//           .then(res => res.json())
//           .then(res => {
//             if (res.error) {
//               switch (res.error) {
//                 case 'Missing Video File':
//                   setMissingVideo(true);
//                   break;
//               }
//             }
//           });
//       }}
//     >
//       <label for="serie-title">Serie Title:</label>
//       <input
//         type="text"
//         name="serie-title"
//         onChange={e => setSerieTitle(e.target.value)}
//       />
//       <label for="serie-episode">Serie Episode:</label>
//       <input
//         type="number"
//         name="serie-episode"
//         onChange={e => setEpisode(e.target.value)}
//       />
//       <label for="episode-title">Episode Title:</label>
//       <input
//         type="text"
//         name="episode-title"
//         onChange={e => setEpisodeTitle(e.target.value)}
//       />
//       <label for="episode-release-date">Episode Release Date:</label>
//       <input
//         type="date"
//         name="episode-release-date"
//         onChange={e => setReleaseDate(e.target.value)}
//       />
//       <label for="episode-description">Episode Description:</label>
//       <input
//         type="text"
//         name="episode-description"
//         onChange={e => setDescription(e.target.value)}
//       />
//       <input
//         type="file"
//         onChange={e => setVideo(e.target.files[0])}
//         accept="video/mp4"
//         s
//       />
//       <button type="submit" />
//     </form>
//   );
// }

// export default SerieUploadForm;
