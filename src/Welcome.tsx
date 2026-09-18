import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, Check, GitCommitHorizontal, ShieldCheck } from 'lucide-react';
import { onboardingSteps, stepFromHash } from './onboarding';
import './welcome.css';

type WelcomeProps = { hasSavedWorkspace: boolean; onExplore: () => void; onCapture: () => void };

export function WelcomeScreen({ step, hasSavedWorkspace, onExplore, onCapture }: WelcomeProps & { step: number }) {
  if (step === 0) return <div className="intro-opening">
    <div className="intro-logo-stage" aria-hidden="true"><div className="intro-orbit intro-orbit-one" /><div className="intro-orbit intro-orbit-two" /><svg className="intro-logo" viewBox="0 0 64 64" width="128" height="128"><rect x="1" y="1" width="62" height="62" rx="16" /><path pathLength="1" d="M18 18h19a10 10 0 0 1 0 20H18zm0 0v31m17-11 12 11" /><circle cx="48" cy="16" r="5" /></svg></div>
    <span className="intro-kicker">A MEMORY FOR PHYSICAL SPACES</span><h1 id="intro-title">Welcome to<br /><em>Reality Commit.</em></h1><p className="intro-lead">A photo diary for buildings and equipment.<br /> See what changed. Keep the story.</p><p className="intro-muted">Let’s take a quick look around. No account needed.</p>
  </div>;
  if (step === 1) return <div className="intro-split">
    <div className="intro-copy"><span className="intro-kicker">01 / CAPTURE</span><h1 id="intro-title">Start with<br /><em>what you see.</em></h1><p className="intro-lead">Take a photo during a visit. Name the equipment, give it an ID, and describe its visible condition.</p><p className="intro-support">Use the same ID on your next visit. That’s how the app connects the equipment’s story over time.</p></div>
    <div className="intro-evidence-card"><div className="intro-card-top"><Camera size={18} /><span>YOUR FIRST VISIT</span><span className="intro-label">SAMPLE</span></div><img className="intro-photo" src="./demo-before.svg" alt="Illustrated mechanical room with a circulation pump" width="1000" height="650" /><div className="intro-observation"><span className="intro-kicker">AN OBSERVATION YOU ENTER</span><dl><dt>Asset ID</dt><dd>P-001</dd><dt>Equipment</dt><dd>Circulation pump</dd><dt>Condition</dt><dd>No visible surface staining</dd></dl></div><p className="intro-card-caption">Synthetic illustration · not an AI detection</p></div>
  </div>;
  if (step === 2) return <div className="intro-split">
    <div className="intro-copy"><span className="intro-kicker">02 / COMPARE</span><h1 id="intro-title">Another visit.<br /><em>A new chapter.</em></h1><p className="intro-lead">Add a later photo and updated notes. The app compares your recorded observations and proposes changes to review.</p><p className="intro-support">You check the photos and decide what the evidence supports. Something missing from a photo isn’t necessarily gone.</p></div>
    <div className="intro-evidence-card"><div className="intro-card-top"><span>TWO VISITS / SAME ASSET</span><span className="intro-label">P-001</span></div><div className="intro-photo-pair"><figure><img src="./demo-before.svg" alt="Synthetic first visit: no recorded pump surface staining" width="1000" height="650" /><figcaption>Before</figcaption></figure><figure><img src="./demo-after.svg" alt="Synthetic later visit: brown surface staining visible on the pump" width="1000" height="650" /><figcaption>After</figcaption></figure></div><div className="intro-observation"><span className="intro-change-tag">CONDITION NOTE CHANGED</span><h2>“Brown staining visible<br />on the casing.”</h2><p>A proposed observation—not a diagnosis.</p><div className="intro-review-note"><Check size={17} /> A person reviews before saving.</div></div><p className="intro-card-caption">Illustrated example · observations entered by hand</p></div>
  </div>;
  if (step === 3) return <div className="intro-split">
    <div className="intro-copy"><span className="intro-kicker">03 / REMEMBER</span><h1 id="intro-title">Save the change.<br /><em>Not just the photo.</em></h1><p className="intro-lead">Accept or reject each proposal and add your review notes. Save the review as a <strong>commit</strong>—a record you can come back to.</p><p className="intro-support">Each equipment ID connects its observations and reviewed changes in one history.</p></div>
    <div className="intro-history-card"><div className="intro-card-top"><GitCommitHorizontal size={21} /><span>WHAT A SAVED REVIEW LOOKS LIKE</span></div><div className="intro-timeline"><div><span className="intro-timeline-dot" /><small>VISIT 01 · OBSERVATION</small><h2>Baseline recorded</h2><p>P-001 · No visible surface staining.</p></div><div><span className="intro-timeline-dot" /><small>VISIT 02 · OBSERVATION</small><h2>Condition note changed</h2><p>P-001 · Brown staining visible.</p></div><div className="intro-timeline-saved"><span className="intro-timeline-dot" /><small>REVIEW SAVED · COMMIT</small><h2>Evidence checked</h2><p>“Surface staining is visible in the later photo. The cause is not established.”</p><span className="intro-review-note"><Check size={16} /> Review note + photo references</span></div></div><p className="intro-card-caption">Example history · not a certified inspection record</p></div>
  </div>;
  return <div className="intro-finish"><span className="intro-kicker">YOU’RE READY</span><h1 id="intro-title">Give your space<br /><em>a memory.</em></h1><p className="intro-lead">{hasSavedWorkspace ? 'Pick up where you left off, or add a photo from your next visit.' : 'Try the sample first, or start a record with your own photos.'}</p><div className="intro-choices"><button className="intro-choice" onClick={onExplore}><span className="intro-choice-icon"><GitCommitHorizontal size={24} /></span><span><b>{hasSavedWorkspace ? 'Continue my workspace' : 'Explore the sample'}</b><small>{hasSavedWorkspace ? 'Your existing photos and reviews are preserved.' : 'A ready-made example. No uploads needed.'}</small></span><ArrowRight size={21} /></button><button className="intro-choice" onClick={onCapture}><span className="intro-choice-icon"><Camera size={24} /></span><span><b>{hasSavedWorkspace ? 'Add a new capture' : 'Start with my photos'}</b><small>{hasSavedWorkspace ? 'Record another visit in your current workspace.' : 'Add a photo and record what you can see.'}</small></span><ArrowRight size={21} /></button></div><div className="intro-expectations"><ShieldCheck size={22} /><div><b>A few things to know before you start</b><p>Observations are manual—this version does not automatically detect damage. Photos and reviews stay in this browser; nothing syncs to other devices or people. Export important work before clearing browser data.</p></div></div></div>;
}

export default function Welcome(props: WelcomeProps) {
  const [step, setStep] = useState(() => stepFromHash(window.location.hash));
  const panel = useRef<HTMLElement>(null);
  const userNavigated = useRef(false);
  useEffect(() => {
    const sync = () => { userNavigated.current = true; setStep(stepFromHash(window.location.hash)); };
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  useEffect(() => {
    if (!userNavigated.current) return;
    const heading = panel.current?.querySelector<HTMLElement>('h1');
    heading?.setAttribute('tabindex', '-1'); heading?.focus({ preventScroll: true });
    window.scrollTo(0, 0); userNavigated.current = false;
  }, [step]);
  function goTo(next: number) { userNavigated.current = true; window.location.hash = `intro/${Math.max(0, Math.min(onboardingSteps.length - 1, next)) + 1}`; }
  return <div className="welcome intro-shell">
    <header className="intro-nav"><a href="#intro/1" className="intro-wordmark" aria-label="Reality Commit introduction"><img src="./mark.svg" alt="" width="32" height="32" /><span>reality<span>commit</span></span></a><button className="intro-skip" onClick={props.onExplore}>{props.hasSavedWorkspace ? 'Back to workspace' : 'Skip intro'}<ArrowRight size={16} /></button></header>
    <main className="intro-main" ref={panel}><section className="intro-screen" key={step} aria-labelledby="intro-title"><WelcomeScreen step={step} {...props} /></section></main>
    <footer className="intro-controls"><button className="intro-back" disabled={step === 0} onClick={() => goTo(step - 1)}><ArrowLeft size={17} />Back</button><div className="intro-progress"><span aria-live="polite" aria-atomic="true">{String(step + 1).padStart(2, '0')} / 05 <span className="intro-current-label">— {onboardingSteps[step]}</span></span><ol aria-label="Introduction progress">{onboardingSteps.map((label, index) => <li key={label}><button onClick={() => goTo(index)} aria-label={`Step ${index + 1}: ${label}`} aria-current={index === step ? 'step' : undefined} className={index < step ? 'complete' : ''}><span /></button></li>)}</ol></div>{step < onboardingSteps.length - 1 ? <button className="intro-next" onClick={() => goTo(step + 1)}>Next<ArrowRight size={18} /></button> : <span className="intro-end-label">Choose above <Check size={16} /></span>}</footer>
  </div>;
}
