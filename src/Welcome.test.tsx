import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { WelcomeScreen } from './Welcome';
import { stepFromHash, onboardingSteps } from './onboarding';

const render = (step = 0, saved = false) => renderToStaticMarkup(
  <WelcomeScreen step={step} hasSavedWorkspace={saved} onExplore={() => {}} onCapture={() => {}} />,
);

describe('Welcome experience', () => {
  it('places Next and Skip together below the opening invitation', () => {
    const html = render();
    expect(html).toContain('intro-opening-actions');
    expect(html.indexOf('intro-opening-actions')).toBeGreaterThan(html.indexOf('Let’s take a quick look around.'));
    expect(html).toContain('Next');
    expect(html).toContain('Skip intro');
  });
  it('explains the product before asking a new visitor to enter', () => {
    const html = render();
    expect(html).toContain('A photo diary for buildings and equipment.');
    expect(html).toContain('intro-logo');
    expect(html).not.toContain('Explore the sample');
    expect(html).not.toContain('Start with my photos');
    expect(html).not.toContain('Continue my workspace');
  });

  it('offers returning visitors their existing workspace instead of a reset', () => {
    const html = render(4, true);
    expect(html).toContain('Continue my workspace');
    expect(html).toContain('Add a new capture');
    expect(html).toContain('Your existing photos and reviews are preserved.');
    expect(html).not.toContain('Start with my photos');
  });

  it('sets honest expectations about automation and browser-only storage', () => {
    const html = render(4);
    expect(html).toContain('does not automatically detect damage');
    expect(html).toContain('nothing syncs to other devices or people.');
    expect(render(2)).toContain('observations entered by hand');
  });

  it('uses accessible example images on the comparison screen', () => {
    const html = render(2);
    expect(html).toContain('alt="Real pump before cleaning:');
    expect(html).toContain('alt="Real pump after cleaning:');
  });
  it('puts sample and upload entry points only on the last screen', () => {
    expect(render(4)).toContain('Explore the sample');
    expect(render(4)).toContain('Start with my photos');
    for (let step = 0; step < 4; step++) expect(render(step)).not.toContain('Start with my photos');
  });
  it('renders one titled screen at a time', () => {
    onboardingSteps.forEach((_, step) => expect(render(step).match(/<h1 /g)).toHaveLength(1));
  });
  it('restores valid step URLs and handles invalid URLs safely', () => {
    onboardingSteps.forEach((_, step) => expect(stepFromHash(`#intro/${step + 1}`)).toBe(step));
    for (const hash of ['', '#', '#intro/0', '#intro/6', '#intro/nope', '#workspace']) expect(stepFromHash(hash)).toBe(0);
  });
});
