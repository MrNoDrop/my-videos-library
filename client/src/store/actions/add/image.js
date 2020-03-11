import { ADD_IMAGE } from '../types';

export default (images, image, imageUrl) => ({
  type: ADD_IMAGE,
  payload: { images: { ...images, [image]: imageUrl } }
});
