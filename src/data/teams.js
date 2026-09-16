// Mock teams data for the post-login overview. Replace with your API response
// (same shape) — everything on the Teams page is driven by this file.
export const DOMAINS = ['All', 'AI / ML', 'Blockchain', 'Cybersecurity', 'Fintech', 'Core ML'];

export const teams = [
  {
    id: 'subway-surfers', name: 'Subway Surfers', domain: 'AI / ML', progress: 82, status: 'On track',
    ps: 'PS-07 · Real-time crowd flow prediction for metro platforms',
    members: ['Aarav', 'Diya', 'Kabir', 'Meera'], mentor: 'R. Iyer', college: 'IIT Bombay',
    stack: ['Python', 'PyTorch', 'FastAPI', 'React'],
    milestones: [{ label: 'Ideation', done: true }, { label: 'Prototype', done: true }, { label: 'MVP', done: true }, { label: 'Pitch deck', done: false }],
    notes: 'Model reaches 91% accuracy on the validation set; working on the live dashboard.',
  },
  {
    id: 'chainbreakers', name: 'ChainBreakers', domain: 'Blockchain', progress: 64, status: 'On track',
    ps: 'PS-12 · Tamper-proof ticketing on a public ledger',
    members: ['Ishaan', 'Nia', 'Rohan'], mentor: 'S. Menon', college: 'BITS Pilani',
    stack: ['Solidity', 'Hardhat', 'Next.js'],
    milestones: [{ label: 'Ideation', done: true }, { label: 'Prototype', done: true }, { label: 'MVP', done: false }, { label: 'Pitch deck', done: false }],
    notes: 'Smart contracts deployed on testnet; QR validation flow in progress.',
  },
  {
    id: 'nullbyte', name: 'NullByte', domain: 'Cybersecurity', progress: 47, status: 'At risk',
    ps: 'PS-03 · Phishing detection for transit e-mail alerts',
    members: ['Zara', 'Vihaan', 'Arjun', 'Sana', 'Dev'], mentor: 'P. Rao', college: 'NIT Trichy',
    stack: ['Go', 'Rust', 'Grafana'],
    milestones: [{ label: 'Ideation', done: true }, { label: 'Prototype', done: true }, { label: 'MVP', done: false }, { label: 'Pitch deck', done: false }],
    notes: 'Blocked on dataset access; fallback to synthetic corpus being generated.',
  },
  {
    id: 'coinrush', name: 'CoinRush', domain: 'Fintech', progress: 91, status: 'Ahead',
    ps: 'PS-15 · Micro-rewards wallet for daily commuters',
    members: ['Anaya', 'Reyansh'], mentor: 'L. D’Souza', college: 'VIT Vellore',
    stack: ['Kotlin', 'Spring', 'PostgreSQL'],
    milestones: [{ label: 'Ideation', done: true }, { label: 'Prototype', done: true }, { label: 'MVP', done: true }, { label: 'Pitch deck', done: true }],
    notes: 'Demo ready; polishing onboarding animation.',
  },
  {
    id: 'tensor-tribe', name: 'Tensor Tribe', domain: 'Core ML', progress: 38, status: 'Behind',
    ps: 'PS-09 · Edge model for turnstile anomaly detection',
    members: ['Kiara', 'Advik', 'Mira'], mentor: 'R. Iyer', college: 'IIIT Hyderabad',
    stack: ['C++', 'TensorFlow Lite'],
    milestones: [{ label: 'Ideation', done: true }, { label: 'Prototype', done: false }, { label: 'MVP', done: false }, { label: 'Pitch deck', done: false }],
    notes: 'Quantisation regressions; pairing with mentor tomorrow.',
  },
  {
    id: 'graffiti-labs', name: 'Graffiti Labs', domain: 'AI / ML', progress: 73, status: 'On track',
    ps: 'PS-01 · Generative station signage assistant',
    members: ['Ira', 'Shaurya', 'Tara', 'Yash'], mentor: 'S. Menon', college: 'DTU Delhi',
    stack: ['Python', 'Diffusers', 'Vue'],
    milestones: [{ label: 'Ideation', done: true }, { label: 'Prototype', done: true }, { label: 'MVP', done: true }, { label: 'Pitch deck', done: false }],
    notes: 'Style-transfer pipeline stable; writing the pitch.',
  },
];
