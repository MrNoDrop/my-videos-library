import { useEffect, useState } from 'react';

export default function useImageLoader(
  image,
  images,
  addImage,
  allowedToFetch
) {
  const [imageBlob, setImageBlob] = useState(undefined);
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (!fetching && !images[image] && allowedToFetch && !imageBlob) {
      setFetching(true);
      (async () => {
        const fetchedImageBlob = await (await fetch(image)).blob();
        setImageBlob(fetchedImageBlob);
        setFetching(false);
      })();
    } else if (!fetching && !images[image] && imageBlob) {
      addImage(images, image, URL.createObjectURL(imageBlob));
      setImageBlob(undefined);
    }
  }, [
    image,
    images,
    addImage,
    allowedToFetch,
    fetching,
    setFetching,
    imageBlob,
    setImageBlob
  ]);
  return images[image];
}
