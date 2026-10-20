export interface MetamorphVersionOption {
  id: string;
  label: string;
  isCurrent?: boolean;
}

export const KNOWN_VERSIONS: MetamorphVersionOption[] = [
  { id: 'develop', label: 'Local (develop)', isCurrent: true },
  { id: 'v2.3.1', label: 'Release v2.3.1 (Latest)' },
  { id: 'v2.3.0', label: 'Release v2.3.0' },
  { id: 'v2.2.0', label: 'Release v2.2.0' },
];
