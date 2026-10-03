import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: 'weemekot', // Tvoj uradni Sanity Project ID
  dataset: 'production',  // Privzeti set podatkov
  apiVersion: '2024-01-01', 
  useCdn: true,           // Hitro nalaganje preko Sanity CDN omrežja
});

const builder = imageUrlBuilder(sanityClient);

// Pomožna funkcija, ki bo pretvorila Sanity slike v lepe URL povezave za splet
export function urlFor(source: any) {
  return builder.image(source);
}
