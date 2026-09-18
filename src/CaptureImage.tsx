import type { Capture } from './domain';

// Display the two panels of the NPS composite without changing its original bytes.
// Marker coordinates refer to the displayed panel, never the entire composite.
export default function CaptureImage({ image, imageView, alt }: Pick<Capture, 'image' | 'imageView'> & { alt: string }) {
  if (imageView) return <svg className="capture-panel" viewBox={`${imageView === 'left-half' ? 0 : 1000} 0 1000 666`} role="img" aria-label={alt}>
    <title>{alt}</title><image href={image} width="2000" height="666" />
  </svg>;
  return <img src={image} alt={alt} />;
}
