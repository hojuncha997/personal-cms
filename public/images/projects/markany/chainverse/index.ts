// export { default as img1 } from './img1.png'
// export { default as img2 } from './img2.png'
// export { default as img3 } from './img3.png'

import img1 from './img1.png';
import img2 from './img2.png';
import img3 from './img3.png';

export const images = {
  img1,
  img2,
  img3
} as const;