
import { FAQItem, TimelineEvent } from '../types';
import { ClipboardList, Flag, Play, Award, Music, Gift, Mic } from './icons';

export const faqData: { en: FAQItem[], id: FAQItem[] } = {
  en: [
    {
      question: 'Where is the Race Village located?',
      answer: 'The event is hosted at Taman Wisata Bougenville, Mount Puntang, Bandung. We recommend arriving a day early to acclimatize (1,300m ASL) and enjoy our luxury villa accommodation.',
    },
    {
      question: 'What are the mandatory gear requirements?',
      answer: 'For 21K, mandatory gear includes: 1.5L Water, Whistle, Basic First Aid, Mobile Phone, and Windbreaker/Rain Jacket. Gear checks will be conducted before start.',
    },
    {
      question: 'Is the 21K route beginner friendly?',
      answer: 'No. The 21K route is categorized as "Hard" with steep technical climbs (Puncak Mega) and slippery descents. Previous trail experience is highly recommended.',
    },
    {
      question: 'Is there a baggage deposit?',
      answer: 'Yes, a secure baggage drop service is available at the Race Village for all runners starting from 04:00.',
    },
    {
      question: 'Can I upgrade/downgrade my category?',
      answer: 'Category changes are allowed up to 30 days before the race, subject to slot availability and an administration fee.',
    },
    {
      question: 'Is there parking available at the venue?',
      answer: 'Yes, limited parking is available within Taman Wisata Bougenville. We strongly encourage carpooling to reduce congestion. Priority parking is given to runners arriving before 04:30.',
    },
    {
      question: 'What should I do if I get lost?',
      answer: 'Stay calm and stop moving immediately to conserve energy. Blow your mandatory whistle (3 short blasts) to alert nearby runners or marshals. Use your phone to send your GPS location to the emergency number printed on your BIB.',
    },
    {
      question: 'Are there medical services on the course?',
      answer: 'Your safety is our priority. Static medical posts are located at every Water Station (WS) and the Race Village. Additionally, mobile medic teams on trail bikes patrol the technical sections of the route.',
    }
  ],
  id: [
    {
      question: 'Dimana lokasi Race Village?',
      answer: 'Acara diadakan di Taman Wisata Bougenville, Gunung Puntang, Bandung. Kami menyarankan datang sehari sebelumnya untuk aklimatisasi (1.300 mdpl) dan menikmati akomodasi villa mewah kami.',
    },
    {
      question: 'Apa saja perlengkapan wajib (Mandatory Gear)?',
      answer: 'Untuk 21K wajib membawa: Air min. 1.5L, Peluit, P3K Dasar, HP, dan Jaket Windbreaker/Hujan. Pengecekan gear (Gear Check) dilakukan sebelum start.',
    },
    {
      question: 'Apakah rute 21K ramah pemula?',
      answer: 'Tidak. Rute 21K dikategorikan "Keras" (Hard) dengan tanjakan teknis curam (Puncak Mega) dan turunan licin. Pengalaman trail sebelumnya sangat disarankan.',
    },
    {
      question: 'Apakah ada penitipan tas (Drop Bag)?',
      answer: 'Ya, layanan penitipan tas tersedia aman di Race Village untuk semua pelari mulai pukul 04:00.',
    },
    {
      question: 'Bisakah saya ganti kategori?',
      answer: 'Perubahan kategori diperbolehkan hingga 30 hari sebelum lomba, tergantung ketersediaan slot dan biaya administrasi.',
    },
    {
      question: 'Apakah tersedia area parkir?',
      answer: 'Ya, parkir tersedia terbatas di dalam Taman Wisata Bougenville. Kami sangat menyarankan berbagi kendaraan (carpooling) untuk mengurangi kemacetan. Parkir prioritas diberikan kepada pelari yang tiba sebelum pukul 04:30.',
    },
    {
      question: 'Apa yang harus dilakukan jika tersesat?',
      answer: 'Tetap tenang dan berhenti bergerak segera untuk menghemat energi. Tiup peluit wajib Anda (3 tiupan pendek) untuk menarik perhatian pelari lain atau marshal. Gunakan ponsel Anda untuk mengirim lokasi GPS ke nomor darurat yang tertera di BIB.',
    },
    {
      question: 'Apakah ada layanan medis di rute?',
      answer: 'Keselamatan Anda adalah prioritas kami. Pos medis statis tersedia di setiap Water Station (WS) dan Race Village. Selain itu, tim medis mobile dengan motor trail berpatroli di bagian rute yang teknis.',
    }
  ]
};

export const timelineEventsData: { en: TimelineEvent[], id: TimelineEvent[] } = {
  en: [
    {
      time: '04:00',
      title: 'Race Pack Collection',
      description: 'Last minute collection opens for all categories at Race Village.',
      icon: ClipboardList,
    },
    {
      time: '05:00',
      title: 'Safety Briefing & Gear Check',
      description: 'Mandatory briefing for 21K runners. Final gear inspection.',
      icon: Mic,
    },
    {
      time: '05:30',
      title: 'Start - 21K Half Marathon',
      description: 'Flag off for the main event. Good luck!',
      icon: Flag,
    },
    {
      time: '06:00',
      title: 'Start - 10K Challenger',
      description: '10K runners begin their adventure.',
      icon: Play,
    },
    {
      time: '06:30',
      title: 'Start - 5K Fun Trail',
      description: 'The Historical Loop runners set off.',
      icon: Play,
    },
    {
      time: '09:00',
      title: 'Podium Ceremony (5K & 10K)',
      description: 'Awards for top finishers in short distances.',
      icon: Award,
    },
    {
      time: '12:00',
      title: 'Podium Ceremony (21K)',
      description: 'Crowning the King & Queen of Puntang.',
      icon: Award,
    },
    {
      time: '16:00',
      title: 'Event Concludes (COT)',
      description: 'Cut Off Time for 21K (10 Hours). Race village closes.',
      icon: Flag,
    },
  ],
  id: [
    {
      time: '04:00',
      title: 'Pengambilan Race Pack',
      description: 'Pengambilan menit terakhir dibuka untuk semua kategori di Race Village.',
      icon: ClipboardList,
    },
    {
      time: '05:00',
      title: 'Safety Briefing & Cek Gear',
      description: 'Briefing wajib untuk pelari 21K. Pemeriksaan gear terakhir.',
      icon: Mic,
    },
    {
      time: '05:30',
      title: 'Start - 21K Half Marathon',
      description: 'Pelepasan untuk acara utama. Semoga berhasil!',
      icon: Flag,
    },
    {
      time: '06:00',
      title: 'Start - 10K Challenger',
      description: 'Pelari 10K memulai petualangan mereka.',
      icon: Play,
    },
    {
      time: '06:30',
      title: 'Start - 5K Fun Trail',
      description: 'Pelari Historical Loop diberangkatkan.',
      icon: Play,
    },
    {
      time: '09:00',
      title: 'Upacara Podium (5K & 10K)',
      description: 'Penghargaan untuk finisher teratas jarak pendek.',
      icon: Award,
    },
    {
      time: '12:00',
      title: 'Upacara Podium (21K)',
      description: 'Penobatan Raja & Ratu Puntang.',
      icon: Award,
    },
    {
      time: '16:00',
      title: 'Acara Selesai (COT)',
      description: 'Batas Waktu untuk 21K (10 Jam). Race village tutup.',
      icon: Flag,
    },
  ]
};
