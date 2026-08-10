/* ==========================================================================
   content.js — single source of truth for site data.
   Edit THIS file to update cargo, projects, partners, rates or contact info.
   Everything here was taken from wicstevedoring.com — nothing is invented.
   ========================================================================== */
window.WIC = window.WIC || {};

/* --------------------------------------------------------------------------
   COMPANY — change the phone/WhatsApp/email in one place and it updates
   everywhere on the site.
   -------------------------------------------------------------------------- */
WIC.company = {
  legalName: 'PT. Wirama Indah Cigading',
  shortName: 'WIC',
  tagline: { id: 'Perusahaan Bongkar Muat', en: 'Stevedoring Company' },
  founded: 1999,
  foundedFull: '10 Desember 1999',
  formerName: 'PT. Werner Indopex Cigading',
  renamed: '15 Agustus 2002',
  notarialAct: 'Akta Notaris No. 36 Tahun 1999',
  group: 'Melati Group',

  phone: '+62 254 602424',
  phoneAlt: '+62 254 605604',
  phoneHref: '+62254602424',

  // WhatsApp number in international format, no + or spaces
  whatsapp: '6281310121513',

  email: 'operation.wic@melati-group.com',
  emailAlt: 'adi.prastyo@melati-group.com',

  address: 'Jl. Sunan Gunung Jati, Ds. Tegal Ratu No. 01 RT.019 RW.06, Tegal Ratu – Ciwandan, Cilegon, Banten',
  addressShort: 'Ciwandan, Cilegon, Banten',
  port: 'Pelabuhan Cigading',

  hours: { id: 'Senin – Sabtu, 08.00 – 18.00 WIB', en: 'Mon – Sat, 08:00 – 18:00 WIB' },

  instagram: 'https://www.instagram.com/melati.group/',
  linktree: 'https://linktr.ee/melatigroup',

  motto: 'ONE GREAT, ONE TEAM, ONE WINNER',
  vision: {
    id: 'Menjadi Perusahaan Bongkar Muat / Stevedoring yang Handal, Terdepan dan Terpercaya.',
    en: 'To become a reliable, leading and trusted stevedoring company.'
  },
  mission: {
    id: 'Memberikan pelayanan bongkar muat yang profesional dan efisien dengan solusi menyeluruh untuk mencapai kepuasan pelanggan.',
    en: 'To deliver professional, efficient cargo handling with complete solutions that achieve customer satisfaction.'
  }
};

/* --------------------------------------------------------------------------
   ESTIMATOR RATES
   --------------------------------------------------------------------------
   IMPORTANT FOR WIC: these are conservative industry bands (MT per effective
   working day), not WIC's audited productivity figures. Replace the [min, max]
   pairs below with your real gang productivity and the estimator is accurate
   to your operation. Nothing else needs to change.

   Assumption baked into the output: ~20 effective working hours per day,
   excluding weather downtime, berth waiting and vessel-side delays.
   -------------------------------------------------------------------------- */
WIC.equipment = [
  {
    id: 'ship-crane',
    name: { id: 'Ship Crane + Grab', en: 'Ship Crane + Grab' },
    note: { id: 'Menggunakan crane kapal sendiri', en: 'Using the vessel’s own cranes' },
    rate: [4000, 6000]
  },
  {
    id: 'shore-crane',
    name: { id: 'Shore Crane / HMC + Grab', en: 'Shore Crane / HMC + Grab' },
    note: { id: 'Crane darat atau harbour mobile crane', en: 'Shore-based or harbour mobile crane' },
    rate: [6000, 10000]
  },
  {
    id: 'csu',
    name: { id: 'CSU (Continuous Ship Unloader)', en: 'CSU (Continuous Ship Unloader)' },
    note: { id: 'Produktivitas tertinggi untuk curah kering', en: 'Highest productivity for dry bulk' },
    rate: [10000, 15000]
  },
  {
    id: 'bagged',
    name: { id: 'Bagging / Break Bulk (Sling)', en: 'Bagging / Break Bulk (Sling)' },
    note: { id: 'Muatan karung, big bag atau general cargo', en: 'Bagged, big-bag or general cargo' },
    rate: [1500, 2500]
  }
];

/* --------------------------------------------------------------------------
   CARGO — the 15 commodity types WIC handles (from the Services page).
   `factor` adjusts the equipment base rate for flowability / density.
   -------------------------------------------------------------------------- */
WIC.cargo = [
  {
    id: 'wheat', cat: 'dry', factor: 1.0, icon: 'wheat',
    name: { id: 'Gandum (Wheat)', en: 'Wheat' },
    method: { id: 'Curah kering free-flowing. Dibongkar dengan grab atau CSU, ditampung ke hopper lalu ke truk atau conveyor menuju silo.', en: 'Free-flowing dry bulk. Discharged by grab or CSU into a hopper, then to trucks or conveyor to silo.' },
    equipment: ['csu', 'ship-crane', 'shore-crane'],
    project: 'wheat-csu'
  },
  {
    id: 'corn', cat: 'dry', factor: 1.0, icon: 'wheat',
    name: { id: 'Jagung (Corn)', en: 'Corn' },
    method: { id: 'Curah kering free-flowing, penanganan setara gandum dengan kontrol kebersihan palka.', en: 'Free-flowing dry bulk, handled like wheat with hold-cleanliness control.' },
    equipment: ['csu', 'ship-crane', 'shore-crane'],
    project: null
  },
  {
    id: 'soyabean', cat: 'dry', factor: 0.95, icon: 'seed',
    name: { id: 'Kedelai (Soyabean)', en: 'Soyabean' },
    method: { id: 'Curah kering. Grab dengan penanganan hati-hati untuk menjaga kualitas biji.', en: 'Dry bulk. Careful grab handling to preserve bean quality.' },
    equipment: ['csu', 'ship-crane', 'shore-crane'],
    project: null
  },
  {
    id: 'sbm', cat: 'dry', factor: 0.9, icon: 'seed',
    name: { id: 'Soyabean Meal (SBM)', en: 'Soyabean Meal (SBM)' },
    method: { id: 'Curah ringan bervolume besar. Butuh grab volume tinggi dan kontrol debu.', en: 'Light, high-volume bulk. Requires high-capacity grabs and dust control.' },
    equipment: ['ship-crane', 'shore-crane', 'csu'],
    project: 'sbm'
  },
  {
    id: 'raw-sugar', cat: 'dry', factor: 0.85, icon: 'sugar',
    name: { id: 'Raw Sugar (Gula Mentah)', en: 'Raw Sugar' },
    method: { id: 'Curah lengket dan higroskopis. Palka harus kering; operasi dihentikan saat hujan.', en: 'Sticky, hygroscopic bulk. Holds must stay dry; operations stop in rain.' },
    equipment: ['ship-crane', 'shore-crane'],
    project: 'raw-sugar'
  },
  {
    id: 'coal', cat: 'dry', factor: 1.1, icon: 'coal',
    name: { id: 'Batubara (Coal)', en: 'Coal' },
    method: { id: 'Curah padat. Grab kapasitas besar didukung wheel loader untuk trimming palka.', en: 'Dense bulk. Large grabs supported by wheel loaders for hold trimming.' },
    equipment: ['ship-crane', 'shore-crane'],
    project: 'coal'
  },
  {
    id: 'clinker', cat: 'dry', factor: 1.05, icon: 'rock',
    name: { id: 'Clinker', en: 'Clinker' },
    method: { id: 'Curah abrasif. Peralatan tahan aus dan pengendalian debu di dermaga.', en: 'Abrasive bulk. Wear-resistant equipment and quayside dust control.' },
    equipment: ['ship-crane', 'shore-crane'],
    project: null
  },
  {
    id: 'salt', cat: 'dry', factor: 0.9, icon: 'sugar',
    name: { id: 'Garam (Salt)', en: 'Salt' },
    method: { id: 'Curah korosif. Peralatan dibilas pasca-operasi, palka dijaga kering.', en: 'Corrosive bulk. Equipment washed down after operations; holds kept dry.' },
    equipment: ['ship-crane', 'shore-crane'],
    project: null
  },
  {
    id: 'fertilizer', cat: 'dry', factor: 0.85, icon: 'seed',
    name: { id: 'Pupuk (Fertilizer)', en: 'Fertilizer' },
    method: { id: 'Curah sensitif kelembapan. Penanganan bersih dan bebas kontaminasi silang.', en: 'Moisture-sensitive bulk. Clean handling, free of cross-contamination.' },
    equipment: ['ship-crane', 'shore-crane', 'bagged'],
    project: null
  },
  {
    id: 'limestone', cat: 'dry', factor: 1.1, icon: 'rock',
    name: { id: 'Batu Kapur (Lime Stone)', en: 'Lime Stone' },
    method: { id: 'Curah mineral padat, ditangani grab dan wheel loader.', en: 'Dense mineral bulk, handled with grabs and wheel loaders.' },
    equipment: ['ship-crane', 'shore-crane'],
    project: null
  },
  {
    id: 'splitstone', cat: 'dry', factor: 1.1, icon: 'rock',
    name: { id: 'Batu Split (Splitstone)', en: 'Splitstone' },
    method: { id: 'Agregat kasar. Grab kapasitas besar, langsung ke dump truck.', en: 'Coarse aggregate. Large grabs discharging direct to dump trucks.' },
    equipment: ['ship-crane', 'shore-crane'],
    project: null
  },
  {
    id: 'sand', cat: 'dry', factor: 1.05, icon: 'rock',
    name: { id: 'Pasir (Sand)', en: 'Sand' },
    method: { id: 'Curah halus, sensitif angin. Grab tertutup dan pengaturan tinggi curah.', en: 'Fine, wind-sensitive bulk. Closed grabs and controlled drop height.' },
    equipment: ['ship-crane', 'shore-crane'],
    project: null
  },
  {
    id: 'steel-materials', cat: 'dry', factor: 0.7, icon: 'steel',
    name: { id: 'Bahan Baja (Steel Materials)', en: 'Steel Materials' },
    method: { id: 'Curah bahan baku baja seperti scrap dan bijih. Grab berat dan magnet.', en: 'Steel raw material bulk such as scrap and ore. Heavy grabs and magnets.' },
    equipment: ['ship-crane', 'shore-crane'],
    project: null
  },
  {
    id: 'steel-products', cat: 'break', factor: 1.0, icon: 'steel',
    name: { id: 'Produk Baja (Steel Products)', en: 'Steel Products' },
    method: { id: 'Break bulk: coil, plate, billet dan section. Sling dan spreader khusus, lashing dikontrol.', en: 'Break bulk: coils, plates, billets and sections. Dedicated slings and spreaders, controlled lashing.' },
    equipment: ['bagged', 'ship-crane', 'shore-crane'],
    project: null
  },
  {
    id: 'bags', cat: 'break', factor: 1.0, icon: 'bag',
    name: { id: 'Muatan Karung (Cargo In Bags)', en: 'Cargo In Bags' },
    method: { id: 'Break bulk karung dan jumbo bag. Sling atau net, dilanjutkan bagging di palka bila diperlukan.', en: 'Bagged and jumbo-bag break bulk. Slings or nets, with in-hold bagging where required.' },
    equipment: ['bagged'],
    project: 'gypsum'
  }
];

/* --------------------------------------------------------------------------
   PROJECTS — real jobs published on the current site.
   -------------------------------------------------------------------------- */
WIC.projects = [
  {
    id: 'gypsum',
    img: 'assets/img/projects/gypsum-aplus.png',
    client: 'PT. APLUS PACIFIC',
    figure: '55.254', unit: 'MT',
    title: { id: 'Pembongkaran Gypsum', en: 'Gypsum Discharge' },
    desc: {
      id: 'Pembongkaran cargo gypsum milik PT. APLUS PACIFIC dengan kuantitas 55.254 MT. Port loading Oman, ex Mv. Windsor Adventure, dibongkar menggunakan ship crane.',
      en: 'Gypsum discharge for PT. APLUS PACIFIC totalling 55,254 MT. Load port Oman, ex Mv. Windsor Adventure, discharged using ship cranes.'
    },
    meta: [
      { k: { id: 'Kapal', en: 'Vessel' }, v: 'Mv. Windsor Adventure' },
      { k: { id: 'Pelabuhan Muat', en: 'Load Port' }, v: 'Oman' },
      { k: { id: 'Peralatan', en: 'Equipment' }, v: 'Ship Crane' }
    ]
  },
  {
    id: 'sbm',
    img: 'assets/img/projects/soyabean-meal.png',
    client: { id: 'Beberapa Consignee', en: 'Multiple Consignees' },
    figure: 'SBM', unit: '',
    title: { id: 'Pembongkaran Soyabean Meal', en: 'Soyabean Meal Discharge' },
    desc: {
      id: 'Pembongkaran Soyabean Meal untuk beberapa consignee di Pelabuhan Cigading, ditangani dengan grab berkapasitas besar dan pengendalian debu.',
      en: 'Soyabean Meal discharge for multiple consignees at Cigading Port, handled with high-capacity grabs and dust control.'
    },
    meta: [
      { k: { id: 'Komoditas', en: 'Commodity' }, v: 'Soyabean Meal' },
      { k: { id: 'Pelabuhan', en: 'Port' }, v: 'Cigading' },
      { k: { id: 'Peralatan', en: 'Equipment' }, v: 'Grab' }
    ]
  },
  {
    id: 'wheat',
    img: 'assets/img/projects/wheat-gandum.png',
    client: { id: 'Beberapa Consignee', en: 'Multiple Consignees' },
    figure: 'Wheat', unit: '',
    title: { id: 'Pembongkaran Gandum', en: 'Wheat Discharge' },
    desc: {
      id: 'Kami telah banyak bekerja sama dengan beberapa consignee untuk melaksanakan pembongkaran kapal dengan muatan cargo gandum.',
      en: 'We have worked with numerous consignees discharging vessels carrying wheat cargo.'
    },
    meta: [
      { k: { id: 'Komoditas', en: 'Commodity' }, v: 'Wheat / Gandum' },
      { k: { id: 'Pelabuhan', en: 'Port' }, v: 'Cigading' },
      { k: { id: 'Peralatan', en: 'Equipment' }, v: 'Grab / Ship Crane' }
    ]
  },
  {
    id: 'wheat-csu',
    img: 'assets/img/projects/wheat-csu.png',
    client: { id: 'Pelabuhan Cigading', en: 'Cigading Port' },
    figure: 'CSU', unit: '',
    title: { id: 'Pembongkaran Gandum dengan CSU', en: 'Wheat Discharge via CSU' },
    desc: {
      id: 'Pembongkaran cargo wheat (gandum) menggunakan CSU (Continuous Ship Unloader) di Pelabuhan Cigading — metode dengan produktivitas tertinggi untuk curah kering.',
      en: 'Wheat cargo discharge using a CSU (Continuous Ship Unloader) at Cigading Port — the highest-productivity method for dry bulk.'
    },
    meta: [
      { k: { id: 'Komoditas', en: 'Commodity' }, v: 'Wheat / Gandum' },
      { k: { id: 'Peralatan', en: 'Equipment' }, v: 'Continuous Ship Unloader' },
      { k: { id: 'Pelabuhan', en: 'Port' }, v: 'Cigading' }
    ]
  },
  {
    id: 'raw-sugar',
    img: 'assets/img/projects/raw-sugar.png',
    client: { id: 'Pelabuhan Cigading', en: 'Cigading Port' },
    figure: 'Raw Sugar', unit: '',
    title: { id: 'Pembongkaran Raw Sugar', en: 'Raw Sugar Discharge' },
    desc: {
      id: 'Pembongkaran Raw Sugar di Pelabuhan Cigading dengan penanganan khusus untuk muatan higroskopis dan protokol berhenti saat hujan.',
      en: 'Raw sugar discharge at Cigading Port with dedicated handling for hygroscopic cargo and rain-stop protocols.'
    },
    meta: [
      { k: { id: 'Komoditas', en: 'Commodity' }, v: 'Raw Sugar' },
      { k: { id: 'Pelabuhan', en: 'Port' }, v: 'Cigading' },
      { k: { id: 'Penanganan', en: 'Handling' }, v: 'Rain-stop protocol' }
    ]
  },
  {
    id: 'coal',
    img: 'assets/img/projects/coal.png',
    client: { id: 'Beberapa Consignee', en: 'Multiple Consignees' },
    figure: 'Coal', unit: '',
    title: { id: 'Pembongkaran Batubara', en: 'Coal Discharge' },
    desc: {
      id: 'Proses pembongkaran cargo batubara (coal) dengan dukungan wheel loader untuk trimming palka dan armada dump truck dari sister company.',
      en: 'Coal cargo discharge supported by wheel loaders for hold trimming and a dump truck fleet from our sister company.'
    },
    meta: [
      { k: { id: 'Komoditas', en: 'Commodity' }, v: 'Coal / Batubara' },
      { k: { id: 'Pendukung', en: 'Support' }, v: 'Wheel Loader + Dump Truck' },
      { k: { id: 'Pelabuhan', en: 'Port' }, v: 'Cigading' }
    ]
  }
];

/* --------------------------------------------------------------------------
   AWARDS — all three verified from the award photographs on the live site.
   The Zero Accident award was issued by PT. Krakatau Bandar Samudera,
   the operator of Cigading Port.
   -------------------------------------------------------------------------- */
WIC.awards = [
  {
    year: '2016',
    img: 'assets/img/awards/zero-accident.png',
    title: { id: 'Program Zero Accident', en: 'Zero Accident Programme' },
    issuer: 'PT. Krakatau Bandar Samudera — Port & Services',
    desc: {
      id: 'Penghargaan atas prestasi menyelesaikan Program Zero Accident tahun 2016, kategori Baik.',
      en: 'Awarded for completing the 2016 Zero Accident Programme, rated "Baik" (Good).'
    }
  },
  {
    year: '2017',
    img: 'assets/img/awards/customer-of-the-year.png',
    title: { id: 'Customer of The Year', en: 'Customer of The Year' },
    issuer: 'Best Shipping Customer',
    desc: {
      id: 'Diakui sebagai Best Shipping Customer atas konsistensi volume dan kualitas kerja sama.',
      en: 'Recognised as Best Shipping Customer for consistent volume and quality of partnership.'
    }
  },
  {
    year: '2016',
    img: 'assets/img/awards/supplier-of-the-year.png',
    title: { id: 'Supplier of The Year', en: 'Supplier of The Year' },
    issuer: 'Logistics Service Provider',
    desc: {
      id: 'Penghargaan kategori Logistics Service Provider atas kinerja layanan sepanjang tahun.',
      en: 'Awarded in the Logistics Service Provider category for year-round service performance.'
    }
  }
];

/* --------------------------------------------------------------------------
   TESTIMONIALS — verbatim from the live site.
   Rendered as typographic cards; the old site's stock headshots were not
   photographs of these people and have deliberately not been reused.
   -------------------------------------------------------------------------- */
WIC.testimonials = [
  {
    name: 'Didi Setiadi',
    company: 'PT Golden Grand Mills',
    logo: 'assets/img/partners/golden-grand-mills.png',
    quote: {
      id: 'PT WIC adalah salah satu perusahaan stevedoring yang sangat profesional, komitmen dalam bekerja, dan di-support dengan team yang sudah tersertifikasi di bidangnya.',
      en: 'PT WIC is a highly professional stevedoring company, committed in its work and supported by a team certified in its field.'
    }
  },
  {
    name: 'Agustino (Nino)',
    company: 'PT. Grainland',
    logo: 'assets/img/partners/grainland.png',
    quote: {
      id: 'Selama kami bekerja sama dengan PT. Wirama Indah Cigading (WIC) dalam proses pembongkaran kapal kami selama ini berjalan dengan lancar dan memuaskan.',
      en: 'Throughout our cooperation with PT. Wirama Indah Cigading (WIC), our vessel discharge operations have run smoothly and satisfactorily.'
    }
  },
  {
    name: 'Diki Taufan',
    company: 'PT. Mayora Indah Tbk',
    logo: 'assets/img/partners/mayora.png',
    quote: {
      id: 'PT. Wirama Indah Cigading (WIC) bekerja konsisten terhadap target yang kita minta dan komunikasi sangat baik.',
      en: 'PT. Wirama Indah Cigading (WIC) works consistently against the targets we set, and communication is excellent.'
    }
  }
];

/* --------------------------------------------------------------------------
   PARTNERS & CUSTOMERS — all 31 logos published on the live site.
   -------------------------------------------------------------------------- */
WIC.partners = [
  { n: 'Cargill', f: 'cargill.png' },
  { n: 'Wilmar', f: 'wilmar.png' },
  { n: 'Mayora Indah', f: 'mayora.png' },
  { n: 'Japfa', f: 'japfa.png' },
  { n: 'Petrokimia Gresik', f: 'petrokimia-gresik.png' },
  { n: 'Krakatau Bandar Samudera', f: 'krakatau-port.png' },
  { n: 'Golden Grand Mills', f: 'golden-grand-mills.png' },
  { n: 'Grainland', f: 'grainland.png' },
  { n: 'APLUS Pacific', f: 'aplus.png' },
  { n: 'Berkah Manis Makmur', f: 'berkah-manis-makmur.png' },
  { n: 'Horizon Investments', f: 'horizon.png' },
  { n: 'Cerestar', f: 'cerestar.png' },
  { n: 'Charoen Pokphand Indonesia', f: 'cpi.png' },
  { n: 'Malindo Feedmill', f: 'malindo.png' },
  { n: 'Sreeya Sewu', f: 'sreeya.png' },
  { n: 'Suri Tani Pemuka', f: 'suri-tani.png' },
  { n: 'Farmsco', f: 'farmsco.png' },
  { n: 'Sinta Prima Feedmill', f: 'sinta-prima.png' },
  { n: 'Seger Agro', f: 'seger-agro.png' },
  { n: 'Pundi Kencana', f: 'pundi.png' },
  { n: 'IPC', f: 'ipc.png' },
  { n: 'IKPP Merak', f: 'ikpp-merak.png' },
  { n: 'Cabot', f: 'cabot.png' },
  { n: 'CISF', f: 'cisf.jpg' },
  { n: 'DSI', f: 'dsi.png' },
  { n: 'KJL', f: 'kjl.png' },
  { n: 'KPE', f: 'kpe.png' },
  { n: 'AJU', f: 'aju.png' },
  { n: 'GCU', f: 'gcu.png' },
  { n: 'GAMA', f: 'gama.png' },
  { n: 'CMMI', f: 'cmmi.png' }
];

/* --------------------------------------------------------------------------
   GALLERY — 15 operational photographs.
   cat: operasi | alat | kapal | tim
   -------------------------------------------------------------------------- */
WIC.gallery = [
  { f: 'g01.jpg', cat: 'kapal',  cap: { id: 'Kapal sandar di dermaga Cigading', en: 'Vessel alongside at Cigading' } },
  { f: 'g02.jpg', cat: 'kapal',  cap: { id: 'Bulk carrier menunggu giliran bongkar', en: 'Bulk carrier awaiting discharge' } },
  { f: 'g03.jpg', cat: 'alat',   cap: { id: 'Crane dermaga siap operasi', en: 'Quayside crane ready for operations' } },
  { f: 'g04.jpg', cat: 'operasi',cap: { id: 'Aktivitas bongkar muat di dermaga', en: 'Cargo handling on the quay' } },
  { f: 'g05.jpg', cat: 'operasi',cap: { id: 'Operasi malam hari, Mv. W-Smash', en: 'Night operations, Mv. W-Smash' } },
  { f: 'g06.jpg', cat: 'operasi',cap: { id: 'Wheel loader trimming palka', en: 'Wheel loader trimming the hold' } },
  { f: 'g07.jpg', cat: 'alat',   cap: { id: 'Continuous Ship Unloader di atas geladak', en: 'Continuous Ship Unloader on deck' } },
  { f: 'g08.jpg', cat: 'kapal',  cap: { id: 'Mv. HSL Athens sandar di Cigading', en: 'Mv. HSL Athens berthed at Cigading' } },
  { f: 'g09.jpg', cat: 'alat',   cap: { id: 'Gantry crane saat blue hour', en: 'Gantry crane at blue hour' } },
  { f: 'g10.jpg', cat: 'tim',    cap: { id: 'Tim operasional di area dermaga', en: 'Operations team on the quay' } },
  { f: 'g11.jpg', cat: 'tim',    cap: { id: 'Tim bersama consignee di sisi kapal', en: 'Team with consignee at the vessel' } },
  { f: 'g12.jpg', cat: 'kapal',  cap: { id: 'Kapal dibantu tug boat menuju dermaga', en: 'Vessel assisted by tug to berth' } },
  { f: 'g13.jpg', cat: 'alat',   cap: { id: 'Crane beroperasi pada malam hari', en: 'Crane operating after dark' } },
  { f: 'g14.jpg', cat: 'operasi',cap: { id: 'Grab memuat ke hopper dan truk', en: 'Grab feeding hopper and trucks' } },
  { f: 'g15.jpg', cat: 'operasi',cap: { id: 'Excavator menangani muatan curah', en: 'Excavator handling bulk cargo' } }
];
