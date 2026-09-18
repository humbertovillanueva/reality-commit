export const onboardingSteps = ['Welcome', 'Capture', 'Compare', 'Remember', 'Get started'] as const;
export function stepFromHash(hash: string): number {
  const match = /^#intro\/([1-5])$/.exec(hash);
  return match ? Number(match[1]) - 1 : 0;
}
