export const HP_USER = {
  name: 'Sari Wijaya',
  role: 'Product Designer',
  team: 'Digital Experience',
  streak: 12,
  points: 1340,
  wellbeing: 78,
  avatar: '#4A7C59',
};

export const HP_MOODS = [
  { key: 'joy', label: 'Bahagia', emoji: '😊', tone: 'yellow', value: 5 },
  { key: 'calm', label: 'Tenang', emoji: '🙂', tone: 'sage', value: 4 },
  { key: 'neutral', label: 'Biasa', emoji: '😐', tone: 'neutral', value: 3 },
  { key: 'tired', label: 'Lelah', emoji: '😔', tone: 'blue', value: 2 },
  { key: 'stress', label: 'Stress', emoji: '😣', tone: 'coral', value: 1 },
];

export const HP_ENERGY = [
  { key: 'low', label: 'Rendah', hint: 'Cocok untuk admin, review, tugas ringan' },
  { key: 'mid', label: 'Sedang', hint: 'Kolaborasi, meeting, eksekusi rutin' },
  { key: 'high', label: 'Tinggi', hint: 'Deep work, keputusan penting, kreativitas' },
];

export const HP_QUICK_TAGS = ['Semangat', 'Fokus', 'Lelah', 'Cemas', 'Bersyukur', 'Overwhelmed'];

export const HP_PRIORITIES = [
  { id: 1, title: 'Review wireframe onboarding v3', goal: 'Launch Apps Redesign', energy: 'high', est: '45m', done: false, tone: 'sage' },
  { id: 2, title: 'Kirim handoff ke tim engineering', goal: 'Launch Apps Redesign', energy: 'mid', est: '20m', done: false, tone: 'sage' },
  { id: 3, title: 'Sinkronisasi ikon design system', goal: 'DS Migration Q2', energy: 'low', est: '30m', done: true, tone: 'blue' },
];

export const HP_GOALS = [
  { id: 1, title: 'Launch Apps Redesign', progress: 68, alignment: 92, owner: 'Sari', due: '30 Apr', tone: 'sage', metric: '8 / 12 milestones' },
  { id: 2, title: 'DS Migration Q2', progress: 42, alignment: 85, owner: 'Team', due: '15 Jun', tone: 'blue', metric: '210 / 500 components' },
  { id: 3, title: 'Mentoring 2 junior designer', progress: 55, alignment: 78, owner: 'Sari', due: 'Ongoing', tone: 'lavender', metric: '11 / 20 sessions' },
];

export const HP_FEED = [
  { id: 1, from: 'Budi Santoso', to: 'Sari Wijaya', value: 'Collaboration', msg: 'Makasih banyak Sari — handoff kemarin super jelas, tim eng langsung bisa jalan tanpa blocker. 🌱', likes: 12, time: '2 jam lalu' },
  { id: 2, from: 'Anya Putri', to: 'Rizky Hidayat', value: 'Innovation', msg: 'Ide prototype Rizky buat checkout flow bener-bener ngubah persepsi user. Kreatif banget!', likes: 8, time: '5 jam lalu' },
  { id: 3, from: 'Dian Kusuma', to: 'Tim Research', value: 'Respect', msg: 'Makasih tim research udah dengerin concern designer sebelum finalize insight report.', likes: 21, time: 'Kemarin' },
];

export const HP_VALUES = ['Collaboration', 'Innovation', 'Respect', 'Ownership', 'Growth'];

export const HP_PEOPLE = [
  { name: 'Budi Santoso', role: 'Product Manager' },
  { name: 'Anya Putri', role: 'Engineering Lead' },
  { name: 'Rizky Hidayat', role: 'Designer' },
  { name: 'Dian Kusuma', role: 'Researcher' },
  { name: 'Maya Sari', role: 'Marketing' },
];

export const HP_SKILLS = [
  { name: 'User Research', current: 70, target: 85 },
  { name: 'Interaction Design', current: 82, target: 90 },
  { name: 'Design Systems', current: 65, target: 80 },
  { name: 'Leadership', current: 45, target: 70 },
  { name: 'Storytelling', current: 55, target: 75 },
];

export const HP_WELLBEING_DIMS = [
  { key: 'mental', label: 'Mental', score: 76, tone: 'sage', trend: '+4' },
  { key: 'physical', label: 'Fisik', score: 64, tone: 'blue', trend: '+1' },
  { key: 'financial', label: 'Finansial', score: 82, tone: 'yellow', trend: '+0' },
  { key: 'social', label: 'Sosial', score: 88, tone: 'lavender', trend: '+6' },
];

export const HP_HABITS = [
  { name: 'Tidur 7+ jam', streak: 8, target: 7, done: true, emoji: '🌙' },
  { name: 'Jalan kaki 15 menit', streak: 3, target: 7, done: false, emoji: '🚶' },
  { name: 'Meditasi pagi', streak: 12, target: 7, done: true, emoji: '🧘' },
  { name: 'Jurnal syukur', streak: 5, target: 7, done: false, emoji: '📓' },
];

export const HP_AI_INSIGHTS = [
  { tone: 'sage', title: 'Kamu paling produktif Selasa pagi', body: 'Berdasarkan 4 minggu terakhir, deep work di Selasa 09:00–11:00 punya completion rate 40% lebih tinggi.' },
  { tone: 'blue', title: 'Energi sedikit drop 2 hari ini', body: 'Mau coba 5-menit reset atau jalan sebentar? Tidak wajib, hanya kalau butuh.' },
  { tone: 'yellow', title: 'Streak check-in 12 hari 🎉', body: 'Kamu rutin menyapa diri sendiri — ini kebiasaan kecil yang dampaknya besar.' },
];

export const HP_COACH_MESSAGES = [
  { from: 'ai', text: 'Hai Sari 🌱 — selamat pagi. Aku lihat kamu udah check-in, moodnya "Tenang", energi sedang. Mau aku bantu susun prioritas hari ini?' },
];

export const HP_COACH_SUGGESTIONS = [
  'Bantu susun prioritas',
  'Aku lagi overwhelmed',
  'Kasih ide untuk 1-on-1 besok',
  'Refleksikan minggu ini',
];
