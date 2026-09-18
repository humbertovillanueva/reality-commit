import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import SamplePicker from './SamplePicker';
import DemoContext, { PhotoCredits } from './DemoContext';
import CaptureImage from './CaptureImage';
import { demoWorkspace } from './demo';

describe('Sample selection and evidence rendering', () => {
  it('offers both examples and a way back to personal work', () => {
    const html=renderToStaticMarkup(<SamplePicker workspace={demoWorkspace('bridge')} busy={false} savedKeys={['personal']} onChoose={()=>{}} />);
    expect(html).toContain('Pump cleaning'); expect(html).toContain('Bridge rehabilitation');
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(html).toContain('Return to my photos &amp; reviews');
  });
  it('shows each source panel with an accessible description', () => {
    const c=demoWorkspace('bridge').captures[1];
    const html=renderToStaticMarkup(<CaptureImage {...c} alt="Bridge after rehabilitation" />);
    expect(html).toContain('viewBox="1000 0 1000 666"');
    expect(html).toContain('aria-label="Bridge after rehabilitation"');
    expect(html).toContain('./bridge-rehabilitation.jpg');
  });
  it('provides the right credits and limitations for each sample', () => {
    const html=renderToStaticMarkup(<DemoContext sample="bridge" />);
    expect(html).toContain('Date not supplied'); expect(html).toContain('load capacity');
    expect(html).toContain('FHWA inspection guidance');
    expect(renderToStaticMarkup(<PhotoCredits sample="bridge" />)).toContain('National Park Service');
    expect(renderToStaticMarkup(<PhotoCredits />)).toContain('Oldforgefarm');
  });
});
