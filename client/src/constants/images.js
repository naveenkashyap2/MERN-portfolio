import heroTravel from '../assets/images/hero-travel.jpg';
import agraTaj from '../assets/images/agra-taj.jpg';
import agraFort from '../assets/images/agra-fort.jpg';
import jaipur from '../assets/images/jaipur.jpg';
import delhi from '../assets/images/delhi.jpg';
import varanasi from '../assets/images/varanasi.jpg';
import amritsar from '../assets/images/amritsar.jpg';
import hotel from '../assets/images/hotel.jpg';

export const IMAGES = {
  hero: heroTravel,
  'agra-taj': agraTaj,
  'agra-fort': agraFort,
  jaipur,
  delhi,
  varanasi,
  amritsar,
  hotel,
};

/** Resolve an image slug from the backend to a local asset, with fallback. */
export function imageFor(slug, fallback = 'hero') {
  return IMAGES[slug] || IMAGES[fallback] || IMAGES.hero;
}
