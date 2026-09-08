/**
 * Centralized SEO Configuration and Schema Definitions for LOGIN 2026
 * Platform: National Technical Symposium organized by Computer Applications Association (CAA),
 * Department of Computer Applications, PSG College of Technology, Coimbatore, Tamil Nadu.
 */

export const SITE_CONFIG = {
  name: 'LOGIN 2026 | National Level Technical Symposium',
  shortName: 'LOGIN 2026',
  tagline: 'The Last Human — 35th Edition National Technical Symposium',
  baseUrl: 'https://login.psgtech.ac.in',
  edition: '35th Edition',
  dates: 'September 18 & 19, 2026',
  startDate: '2026-09-18T09:00:00+05:30',
  endDate: '2026-09-19T18:00:00+05:30',
  defaultOgImage: '/assets/login.webp',
  defaultHeroImage: '/hero_image_about.webp',
  groupPicImage: '/Group_pic.webp',
  organizer: {
    name: 'Computer Applications Association (CAA)',
    department: 'Department of Computer Applications (MCA)',
    institution: 'PSG College of Technology',
    parentOrganization: 'PSG & Sons and Charities',
    address: {
      streetAddress: 'Avinashi Road, Peelamedu',
      addressLocality: 'Coimbatore',
      addressRegion: 'Tamil Nadu',
      postalCode: '641004',
      addressCountry: 'IN',
    },
    geo: {
      latitude: '11.0239',
      longitude: '77.0026',
    },
    email: 'login@psgtech.ac.in',
    website: 'https://login.psgtech.ac.in',
    institutionWebsite: 'https://www.psgtech.edu',
    phones: {
      secretary: '+91 81482 51567',
      treasurer: '+91 99528 73426',
      executiveCoordinator: '+91 83005 26351',
    },
  },
  socialLinks: {
    instagram: 'https://instagram.com/login_psgtech',
    linkedin: 'https://www.linkedin.com/school/psg-college-of-technology/',
  },
};

/**
 * Common JSON-LD Structured Data Schema Generators
 */

export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  '@id': `${SITE_CONFIG.baseUrl}/#organization`,
  name: SITE_CONFIG.organizer.institution,
  alternateName: ['PSG Tech', 'PSG Tech Coimbatore', 'PSG College of Technology MCA'],
  url: SITE_CONFIG.organizer.institutionWebsite,
  logo: `${SITE_CONFIG.baseUrl}/assets/logos/psg-main.webp`,
  image: `${SITE_CONFIG.baseUrl}${SITE_CONFIG.groupPicImage}`,
  description:
    'PSG College of Technology is an autonomous, government-aided premier engineering institution located in Peelamedu, Coimbatore, Tamil Nadu, affiliated with Anna University.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE_CONFIG.organizer.address.streetAddress,
    addressLocality: SITE_CONFIG.organizer.address.addressLocality,
    addressRegion: SITE_CONFIG.organizer.address.addressRegion,
    postalCode: SITE_CONFIG.organizer.address.postalCode,
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: SITE_CONFIG.organizer.geo.latitude,
    longitude: SITE_CONFIG.organizer.geo.longitude,
  },
  department: {
    '@type': 'Organization',
    name: 'Department of Computer Applications',
    alternateName: ['PSG Tech MCA', 'MCA Department PSG Tech', 'Computer Applications Association (CAA)'],
    description:
      'The Department of Computer Applications at PSG College of Technology fosters top-tier software engineering, AI, and cybersecurity talent through academic excellence and the annual national technical symposium LOGIN.',
    parentOrganization: {
      '@type': 'CollegeOrUniversity',
      name: 'PSG College of Technology',
    },
  },
});

export const getWebSiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_CONFIG.baseUrl}/#website`,
  url: SITE_CONFIG.baseUrl,
  name: 'LOGIN 2026 | PSG Tech MCA National Technical Symposium',
  alternateName: 'LOGIN 2026',
  description:
    'Official portal for LOGIN 2026 — the 35th Edition National Level Technical Symposium and intercollegiate coding, hackathon, and CTF competitions organized by the Department of Computer Applications, PSG College of Technology, Coimbatore, Tamil Nadu.',
  publisher: {
    '@id': `${SITE_CONFIG.baseUrl}/#organization`,
  },
  inLanguage: 'en-US',
});

export const getSymposiumEventSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  '@id': `${SITE_CONFIG.baseUrl}/#login2026-symposium`,
  name: 'LOGIN 2026: The Last Human — National Technical Symposium',
  alternateName: [
    'LOGIN 2026',
    'LOGIN 2026 PSG Tech',
    'LOGIN 2026 Coimbatore',
    'PSG Tech MCA National Symposium',
    'LOGIN 2026 Intercollegiate Technical Events',
  ],
  description:
    'LOGIN 2026 is the 35th Edition National Level Technical Symposium hosted by the Computer Applications Association (CAA), Department of Computer Applications, PSG College of Technology, Coimbatore. Featuring 11 technical, non-technical, and flagship arenas including Code Relay, The Extraction CTF, Debug Arena, CodeXcape, and Star of LOGIN.',
  startDate: SITE_CONFIG.startDate,
  endDate: SITE_CONFIG.endDate,
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'PSG College of Technology',
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.organizer.address.streetAddress,
      addressLocality: SITE_CONFIG.organizer.address.addressLocality,
      addressRegion: SITE_CONFIG.organizer.address.addressRegion,
      postalCode: SITE_CONFIG.organizer.address.postalCode,
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_CONFIG.organizer.geo.latitude,
      longitude: SITE_CONFIG.organizer.geo.longitude,
    },
  },
  image: [
    `${SITE_CONFIG.baseUrl}${SITE_CONFIG.defaultHeroImage}`,
    `${SITE_CONFIG.baseUrl}${SITE_CONFIG.defaultOgImage}`,
    `${SITE_CONFIG.baseUrl}${SITE_CONFIG.groupPicImage}`,
  ],
  organizer: {
    '@id': `${SITE_CONFIG.baseUrl}/#organization`,
  },
  offers: {
    '@type': 'Offer',
    url: `${SITE_CONFIG.baseUrl}/register`,
    price: '0.00',
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    validFrom: '2026-08-01T00:00:00+05:30',
  },
});

export const getBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `${SITE_CONFIG.baseUrl}${item.url}`,
  })),
});

export const getFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const getEventDetailSchema = (event: {
  id: number | string;
  name: string;
  description: string;
  slug?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  venue?: string;
  is_online?: boolean;
  is_flagship?: boolean;
  category?: string;
  entry_fee?: string | number;
  guardian_asset?: string;
}) => {
  const eventDate = event.date || '2026-09-18';
  const startTime = event.start_time || '09:30:00';
  const endTime = event.end_time || '16:30:00';
  const startIso = `${eventDate}T${startTime}+05:30`;
  const endIso = `${eventDate}T${endTime}+05:30`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${event.name} — LOGIN 2026 | PSG Tech Coimbatore`,
    description: event.description,
    url: `${SITE_CONFIG.baseUrl}/events/${event.slug || event.id}`,
    startDate: startIso,
    endDate: endIso,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.is_online
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: event.is_online
      ? {
          '@type': 'VirtualLocation',
          url: `${SITE_CONFIG.baseUrl}/events/${event.slug || event.id}`,
        }
      : {
          '@type': 'Place',
          name: `${event.venue || 'Campus Labs'}, PSG College of Technology`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: SITE_CONFIG.organizer.address.streetAddress,
            addressLocality: SITE_CONFIG.organizer.address.addressLocality,
            addressRegion: SITE_CONFIG.organizer.address.addressRegion,
            postalCode: SITE_CONFIG.organizer.address.postalCode,
            addressCountry: 'IN',
          },
        },
    image: event.guardian_asset
      ? `${SITE_CONFIG.baseUrl}${event.guardian_asset}`
      : `${SITE_CONFIG.baseUrl}${SITE_CONFIG.defaultHeroImage}`,
    organizer: {
      '@type': 'EducationalOrganization',
      name: 'Computer Applications Association (CAA), PSG College of Technology',
      url: SITE_CONFIG.baseUrl,
    },
    superEvent: {
      '@type': 'Event',
      name: 'LOGIN 2026: The Last Human',
      url: SITE_CONFIG.baseUrl,
      startDate: SITE_CONFIG.startDate,
      endDate: SITE_CONFIG.endDate,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_CONFIG.baseUrl}/register`,
      price: event.entry_fee ? String(event.entry_fee) : '0.00',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };
};

/**
 * Standard Verified FAQs for Rich Results & Voice Search
 */
export const HOMEPAGE_FAQS = [
  {
    question: 'What is LOGIN 2026 at PSG College of Technology?',
    answer:
      'LOGIN 2026 is the 35th Edition National Level Technical Symposium organized by the Computer Applications Association (CAA), Department of Computer Applications, PSG College of Technology, Coimbatore. The symposium hosts 11 technical, non-technical, and flagship coding and cybersecurity arenas under the theme "THE LAST HUMAN".',
  },
  {
    question: 'When and where is LOGIN 2026 being conducted?',
    answer:
      'LOGIN 2026 will take place on September 18 and 19, 2026, at the PSG College of Technology campus located on Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004.',
  },
  {
    question: 'Who is eligible to participate in LOGIN 2026 intercollegiate events?',
    answer:
      'Undergraduate and postgraduate students pursuing MCA, B.Sc Computer Science/IT, BCA, B.E., B.Tech, M.Sc, and related technical disciplines from recognized universities and colleges across Tamil Nadu and all of India are eligible to participate.',
  },
  {
    question: 'Is there a Hackathon or Coding competition at LOGIN 2026 in Coimbatore?',
    answer:
      'Yes, LOGIN 2026 features premier coding and algorithmic competitions including Code Relay (collaborative speed coding), CodeXcape (technical escape room), Blind Coding, Debug Arena (system recovery and bug elimination), and the headline flagship arena "Star of LOGIN".',
  },
  {
    question: 'Is there a Capture The Flag (CTF) Cybersecurity competition at LOGIN 2026?',
    answer:
      'Yes! "The Extraction" is LOGIN 2026’s story-driven cybersecurity CTF competition. Teams solve real-world cryptographic puzzles, network forensics, binary exploitation, and authentication bypass challenges under the Operation BLACKOUT mission scenario.',
  },
  {
    question: 'How do students register for LOGIN 2026 events?',
    answer:
      'Students can register directly through the official LOGIN 2026 portal at https://login.psgtech.ac.in/register by selecting their college, creating their participant credentials, and selecting their desired technical and non-technical event tracks.',
  },
  {
    question: 'Is the registration fee charged for each event?',
    answer:
      'No. The registration fee is ₹100 only once per participant. After paying ₹100, a participant can register for multiple LOGIN 2026 events without paying ₹100 again for every event. Official participation and merit e-certificates are also provided as applicable.',
  },
  {
    question: 'Are lunch and snacks provided for registered participants?',
    answer:
      'Yes. Registered participants receive free lunch and snacks during the LOGIN 2026 event days, according to the official event schedule.',
  },
];
