/* ==========================================================================
   i18n.js — Indonesian (default) / English switching.
   Usage in HTML:  <span data-i18n="hero.lead">…</span>
                   <input data-i18n-attr="placeholder:form.namePh">
   Strings may contain inline <br> and <span> — they are injected as HTML.
   ========================================================================== */
window.WIC = window.WIC || {};

WIC.strings = {
  id: {
    /* --- chrome --- */
    'nav.home': 'Beranda',
    'nav.about': 'Tentang Kami',
    'nav.services': 'Layanan',
    'nav.projects': 'Proyek',
    'nav.gallery': 'Galeri',
    'nav.contact': 'Kontak',
    'nav.skip': 'Lompat ke konten utama',

    'cta.quote': 'Minta Penawaran',
    'cta.quoteShort': 'Penawaran',
    'cta.wa': 'WhatsApp',
    'cta.call': 'Telepon',
    'cta.services': 'Lihat Layanan Kami',
    'cta.about': 'Tentang Kami',
    'cta.allProjects': 'Lihat Semua Proyek',
    'cta.allGallery': 'Lihat Galeri Lengkap',
    'cta.estimate': 'Hitung Estimasi',
    'cta.recalculate': 'Hitung Ulang',
    'cta.sendWa': 'Kirim via WhatsApp',
    'cta.sendEmail': 'Kirim via Email',
    'cta.back': 'Kembali',
    'cta.next': 'Lanjut',
    'cta.learnMore': 'Selengkapnya',

    'topbar.hours': 'Senin – Sabtu, 08.00 – 18.00 WIB',

    /* --- hero --- */
    'hero.eyebrow': 'Solusi Stevedoring Sejak 1999',
    'hero.title': 'Menggerakkan Muatan,<br>Menguatkan Bisnis Anda<span class="dot">.</span>',
    'hero.lead': 'Mitra bongkar muat terpercaya di <strong>Pelabuhan Cigading</strong> untuk muatan curah kering dan break bulk — didukung tenaga kerja bersertifikat dan armada alat berat milik grup sendiri.',
    'hero.chip1': 'Tahun Pengalaman',
    'hero.chip1sub': 'Beroperasi sejak 1999',
    'hero.chip2': 'Aman, Cepat, Terpercaya',
    'hero.chip2sub': 'Komitmen untuk setiap muatan',
    'hero.stat1': 'Sejak',
    'hero.stat1sub': 'Berpengalaman',
    'hero.stat2': 'Jenis Muatan',
    'hero.stat2sub': 'Curah & Break Bulk',
    'hero.stat3': 'Klien & Mitra',
    'hero.stat3sub': 'Dipercaya sejak lama',
    'hero.panelTitle': 'Layanan Inti',
    'hero.scroll': 'Gulir untuk menjelajah',
    'hero.badge': 'Penghargaan Zero Accident 2016 — Krakatau Bandar Samudera',
    'hero.consoleT': 'Layanan Inti',

    /* --- services --- */
    'svc.eyebrow': 'Apa yang Kami Kerjakan',
    'svc.title': 'Tiga layanan inti, satu rantai yang tidak terputus',
    'svc.lead': 'Dari palka kapal sampai ke gudang Anda — kami menangani setiap tahap dengan tim dan peralatan yang sama, sehingga tidak ada muatan yang menunggu di antara penyedia jasa.',
    'svc.1.name': 'Stevedoring',
    'svc.1.short': 'Bongkar muat dari kapal ke dermaga',
    'svc.1.desc': 'Pekerjaan membongkar barang dari kapal ke dermaga, tongkang atau truk — atau memuat sebaliknya sampai tersusun rapi di dalam palka kapal, menggunakan alat mekanis.',
    'svc.2.name': 'Cargodoring',
    'svc.2.short': 'Dermaga menuju gudang penumpukan',
    'svc.2.desc': 'Proses penyerahan muatan kapal yang sudah berada di dermaga (kade) menuju gudang penyimpanan pelabuhan atau lapangan penumpukan, dan sebaliknya untuk muatan keluar.',
    'svc.3.name': 'Receiving / Delivery',
    'svc.3.short': 'Penerimaan dan pengiriman muatan',
    'svc.3.desc': 'Aktivitas penerimaan atau pengiriman barang dari gudang, lapangan penumpukan maupun dermaga dengan menggunakan sarana pengangkut berupa truk dan alat berat.',
    'svc.supportTitle': 'Didukung Peralatan Sendiri',
    'svc.supportLead': 'Alat berat dan armada truk berasal dari grup perusahaan sendiri (sister company) — jadwal tidak bergantung pada pihak ketiga.',
    'svc.sup1': 'Wheel Loader & Grab',
    'svc.sup1d': 'Trimming palka dan penanganan curah',
    'svc.sup2': 'Armada Dump Truck',
    'svc.sup2d': 'Pengiriman langsung ke tujuan',
    'svc.sup3': 'Gudang Penumpukan',
    'svc.sup3d': 'Penyimpanan sementara muatan',

    /* --- process --- */
    'proc.eyebrow': 'Alur Kerja',
    'proc.title': 'Dari kapal sandar sampai muatan tiba',
    'proc.lead': 'Empat tahap yang kami kendalikan sepenuhnya. Gulir untuk mengikuti perjalanan muatan Anda.',
    'proc.1.t': 'Kapal Sandar & Persiapan',
    'proc.1.d': 'Koordinasi dengan agen dan otoritas pelabuhan, draft survey awal, pengecekan kondisi palka, serta penyiapan gang dan peralatan sebelum operasi dimulai.',
    'proc.2.t': 'Stevedoring',
    'proc.2.d': 'Pembongkaran muatan dari palka menggunakan ship crane, shore crane atau CSU, dengan pengawasan keselamatan penuh di setiap shift.',
    'proc.3.t': 'Cargodoring',
    'proc.3.d': 'Muatan yang telah berada di dermaga dipindahkan ke gudang penyimpanan atau lapangan penumpukan, dicatat dan dijaga integritasnya.',
    'proc.4.t': 'Receiving / Delivery',
    'proc.4.d': 'Pengiriman muatan ke gudang atau lokasi tujuan Anda menggunakan armada dump truck grup, tepat waktu dan terdokumentasi.',

    /* --- estimator --- */
    'est.eyebrow': 'Alat Bantu Eksklusif',
    'est.title': 'Hitung estimasi waktu bongkar muatan Anda',
    'est.lead': 'Masukkan komoditas, tonase dan metode bongkar — dapatkan estimasi produktivitas dan lama sandar dalam hitungan detik, lalu kirim langsung sebagai permintaan penawaran.',
    'est.cargo': 'Jenis Muatan',
    'est.tonnage': 'Tonase (MT)',
    'est.tonnagePh': 'contoh: 25000',
    'est.equipment': 'Metode Bongkar',
    'est.resultTitle': 'Estimasi Operasi',
    'est.rate': 'Produktivitas',
    'est.rateUnit': 'MT / hari',
    'est.days': 'Lama Bongkar',
    'est.daysUnit': 'hari kerja efektif',
    'est.method': 'Metode',
    'est.emptyTitle': 'Hasil estimasi tampil di sini',
    'est.emptyText': 'Lengkapi tiga kolom di sebelah kiri, lalu tekan Hitung Estimasi.',
    'est.assumption': 'Asumsi: ± 20 jam kerja efektif per hari, cuaca normal.',
    'est.disclaimer': 'Estimasi indikatif untuk perencanaan awal — bukan penawaran resmi. Waktu sebenarnya bergantung pada kondisi cuaca, ketersediaan dermaga, kondisi palka dan kesiapan consignee. Hubungi kami untuk penawaran mengikat.',
    'est.ctaNote': 'Sudah sesuai perkiraan Anda? Kirim spesifikasi ini ke tim kami.',
    'est.errCargo': 'Pilih jenis muatan terlebih dahulu.',
    'est.errTon': 'Masukkan tonase antara 100 dan 200.000 MT.',
    'est.errEquip': 'Pilih metode bongkar.',

    /* --- cargo finder --- */
    'cargo.eyebrow': 'Kemampuan Penanganan',
    'cargo.title': 'Muatan apa yang Anda kirim?',
    'cargo.lead': 'Lima belas jenis komoditas yang rutin kami tangani di Pelabuhan Cigading. Pilih salah satu untuk melihat metode dan peralatan yang kami gunakan.',
    'cargo.all': 'Semua',
    'cargo.dry': 'Curah Kering',
    'cargo.break': 'Break Bulk',
    'cargo.method': 'Metode Penanganan',
    'cargo.equipment': 'Peralatan',
    'cargo.seeProject': 'Lihat proyek terkait',
    'cargo.notListed': 'Muatan Anda tidak ada dalam daftar?',
    'cargo.notListedSub': 'Kami menangani berbagai komoditas curah dan break bulk lainnya. Kirimkan detailnya dan tim kami akan menilai kesiapan peralatan.',

    /* --- projects --- */
    'proj.eyebrow': 'Rekam Jejak',
    'proj.title': 'Pekerjaan yang sudah kami selesaikan',
    'proj.lead': 'Sebagian proyek bongkar muat yang kami tangani di Pelabuhan Cigading, dengan angka dan kapal yang sebenarnya.',

    /* --- trust / awards / HSE --- */
    'trust.eyebrow': 'Penghargaan',
    'trust.title': 'Diakui oleh operator pelabuhan dan pelanggan',
    'trust.lead': 'Pengakuan pihak ketiga atas keselamatan dan konsistensi layanan kami.',
    'trust.issuedBy': 'Diberikan oleh',

    'hse.eyebrow': 'Keselamatan Kerja',
    'hse.title': 'Zero Accident bukan slogan — kami punya penghargaannya',
    'hse.lead': 'Perusahaan bongkar muat yang selalu mengedepankan keselamatan tinggi dalam setiap kegiatan, baik dari sisi man power maupun cargo yang ditangani.',
    'hse.1': 'Tenaga kerja handal, berkompetensi dan bersertifikat di bidang bongkar muat',
    'hse.2': 'Keselamatan diutamakan pada setiap kegiatan, untuk manusia maupun muatan',
    'hse.3': 'Didukung sarana alat berat dan armada dump truck dari grup sendiri',
    'hse.4': 'Ketepatan dan kecepatan pelayanan, baik data maupun operasional',
    'hse.awardCaption': 'Penghargaan Program Zero Accident 2016, kategori Baik — PT. Krakatau Bandar Samudera',

    'clients.eyebrow': 'Klien & Mitra',
    'clients.title': 'Dipercaya oleh nama besar di industri pangan, energi dan baja',
    'clients.lead': 'Lebih dari tiga puluh perusahaan mempercayakan muatannya kepada kami di Pelabuhan Cigading.',

    'testi.eyebrow': 'Kata Pelanggan',
    'testi.title': 'Yang dikatakan mitra kami',

    /* --- about --- */
    'about.eyebrow': 'Tentang Kami',
    'about.title': 'Dua puluh enam tahun di dermaga yang sama',
    'about.introT': 'Perusahaan bongkar muat yang tumbuh bersama Pelabuhan Cigading',
    'about.p1': 'PT. Wirama Indah Cigading didirikan pada tanggal 10 Desember 1999 dengan nama PT. Werner Indopex Cigading berdasarkan Akta Notaris Nomor 36 Tahun 1999. Kemudian pada tanggal 15 Agustus 2002 berganti nama menjadi PT. Wirama Indah Cigading.',
    'about.p2': 'Kami adalah Perusahaan Jasa Bongkar Muat (PBM) berizin yang khusus menangani pemindahan muatan antara kapal dan dermaga, didukung personel yang berkompeten serta peralatan dan sarana yang memadai.',
    'about.visionT': 'Visi',
    'about.missionT': 'Misi',
    'about.mottoT': 'Motto Perusahaan',
    'about.historyT': 'Perjalanan Kami',
    'about.h1999': 'Didirikan sebagai PT. Werner Indopex Cigading dengan Akta Notaris No. 36 Tahun 1999.',
    'about.h2002': 'Berganti nama menjadi PT. Wirama Indah Cigading pada 15 Agustus 2002.',
    'about.h2016': 'Meraih penghargaan Program Zero Accident dan Supplier of The Year.',
    'about.h2017': 'Dinobatkan sebagai Customer of The Year — Best Shipping Customer.',
    'about.hNow': 'Melayani lebih dari 30 klien dengan 15 jenis komoditas di Pelabuhan Cigading.',
    'about.advT': 'Keunggulan Kami',

    /* --- gallery --- */
    'gal.eyebrow': 'Galeri',
    'gal.title': 'Dokumentasi operasi kami',
    'gal.lead': 'Foto asli dari kegiatan bongkar muat, peralatan dan tim kami di Pelabuhan Cigading.',
    'gal.all': 'Semua',
    'gal.operasi': 'Operasi',
    'gal.alat': 'Peralatan',
    'gal.kapal': 'Kapal',
    'gal.tim': 'Tim',
    'gal.close': 'Tutup',
    'gal.prev': 'Sebelumnya',
    'gal.next': 'Berikutnya',

    /* --- RFQ form --- */
    'rfq.eyebrow': 'Permintaan Penawaran',
    'rfq.title': 'Ceritakan muatan Anda, kami balas hari ini juga',
    'rfq.lead': 'Tiga langkah singkat. Permintaan Anda langsung masuk ke WhatsApp tim operasional kami — tanpa menunggu balasan email.',
    'rfq.step': 'Langkah',
    'rfq.of': 'dari',
    'rfq.s1': 'Muatan',
    'rfq.s2': 'Kapal & Jadwal',
    'rfq.s3': 'Kontak',
    'rfq.cargoType': 'Jenis Muatan',
    'rfq.cargoPh': 'Pilih komoditas',
    'rfq.other': 'Lainnya',
    'rfq.otherCargo': 'Sebutkan Muatan Anda',
    'rfq.otherCargoPh': 'contoh: Bungkil Kopra',
    'rfq.tonnage': 'Perkiraan Tonase (MT)',
    'rfq.service': 'Layanan yang Dibutuhkan',
    'rfq.vessel': 'Nama Kapal (opsional)',
    'rfq.vesselPh': 'contoh: Mv. Windsor Adventure',
    'rfq.eta': 'Perkiraan ETA (opsional)',
    'rfq.port': 'Pelabuhan',
    'rfq.notes': 'Catatan Tambahan (opsional)',
    'rfq.notesPh': 'Kebutuhan khusus, jadwal, atau pertanyaan lain…',
    'rfq.name': 'Nama Anda',
    'rfq.namePh': 'Nama lengkap',
    'rfq.companyL': 'Perusahaan',
    'rfq.companyPh': 'Nama perusahaan',
    'rfq.phone': 'Nomor WhatsApp / Telepon',
    'rfq.phonePh': '08xx xxxx xxxx',
    'rfq.emailL': 'Email (opsional)',
    'rfq.emailPh': 'nama@perusahaan.com',
    'rfq.review': 'Ringkasan permintaan Anda',
    'rfq.privacy': 'Data Anda hanya digunakan untuk menyiapkan penawaran dan tidak dibagikan ke pihak lain.',
    'rfq.required': 'Kolom ini wajib diisi.',
    'rfq.sideT': 'Butuh jawaban cepat?',
    'rfq.sideD': 'Tim operasional kami aktif di WhatsApp pada jam kerja. Untuk kapal yang sudah dekat ETA, hubungi langsung — kami respons lebih cepat.',
    'rfq.sideHours': 'Jam Operasional',

    /* --- contact --- */
    'kontak.eyebrow': 'Hubungi Kami',
    'kontak.title': 'Kami di Cilegon, dekat dermaga',
    'kontak.lead': 'Kantor kami berada di Ciwandan, Cilegon — beberapa menit dari Pelabuhan Cigading, sehingga tim dapat hadir cepat saat kapal sandar.',
    'kontak.addressT': 'Alamat Kantor',
    'kontak.phoneT': 'Telepon',
    'kontak.emailT': 'Email',
    'kontak.hoursT': 'Jam Operasional',
    'kontak.mapT': 'Lokasi Kami',

    /* --- footer / misc --- */
    'foot.about': 'Perusahaan Jasa Bongkar Muat (PBM) di Pelabuhan Cigading, Cilegon. Melayani muatan curah kering dan break bulk sejak 1999.',
    'foot.nav': 'Navigasi',
    'foot.svc': 'Layanan',
    'foot.contact': 'Kontak',
    'foot.rights': 'Seluruh hak cipta dilindungi.',
    'foot.part': 'Bagian dari',
    'foot.built': 'Situs ini dirancang ulang pada 2026.',

    'cta.bannerT': 'Ada kapal yang akan sandar?',
    'cta.bannerD': 'Kirimkan detail muatan dan jadwal Anda. Tim kami menyiapkan penawaran dan gang di hari yang sama.',

    'misc.viewProject': 'Lihat detail',
    'misc.dryBulk': 'Curah Kering',
    'misc.breakBulk': 'Break Bulk',
    'misc.photos': 'foto',
    'misc.langLabel': 'Pilih bahasa'
  },

  en: {
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.services': 'Services',
    'nav.projects': 'Projects',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'nav.skip': 'Skip to main content',

    'cta.quote': 'Request a Quote',
    'cta.quoteShort': 'Quote',
    'cta.wa': 'WhatsApp',
    'cta.call': 'Call',
    'cta.services': 'Explore Our Services',
    'cta.about': 'About Us',
    'cta.allProjects': 'View All Projects',
    'cta.allGallery': 'View Full Gallery',
    'cta.estimate': 'Calculate Estimate',
    'cta.recalculate': 'Recalculate',
    'cta.sendWa': 'Send via WhatsApp',
    'cta.sendEmail': 'Send via Email',
    'cta.back': 'Back',
    'cta.next': 'Continue',
    'cta.learnMore': 'Learn more',

    'topbar.hours': 'Mon – Sat, 08:00 – 18:00 WIB',

    'hero.eyebrow': 'Stevedoring Solutions Since 1999',
    'hero.title': 'Moving Your Cargo,<br>Powering Your Business<span class="dot">.</span>',
    'hero.lead': 'The trusted cargo handling partner at <strong>Cigading Port</strong> for dry bulk and break bulk — backed by certified labour and a heavy equipment fleet owned within our own group.',
    'hero.chip1': 'Years of Experience',
    'hero.chip1sub': 'Operating since 1999',
    'hero.chip2': 'Safe, Fast, Reliable',
    'hero.chip2sub': 'Our commitment to every cargo',
    'hero.stat1': 'Since',
    'hero.stat1sub': 'Established',
    'hero.stat2': 'Cargo Types',
    'hero.stat2sub': 'Bulk & Break Bulk',
    'hero.stat3': 'Clients & Partners',
    'hero.stat3sub': 'Long-standing trust',
    'hero.panelTitle': 'Core Services',
    'hero.scroll': 'Scroll to explore',
    'hero.badge': 'Zero Accident Award 2016 — Krakatau Bandar Samudera',
    'hero.consoleT': 'Core Services',

    'svc.eyebrow': 'What We Do',
    'svc.title': 'Three core services, one unbroken chain',
    'svc.lead': 'From the ship’s hold to your warehouse — every stage handled by the same team and equipment, so your cargo never waits between contractors.',
    'svc.1.name': 'Stevedoring',
    'svc.1.short': 'Ship-to-quay cargo handling',
    'svc.1.desc': 'Discharging cargo from the vessel to the quay, barge or truck — or loading in reverse until it is properly stowed in the ship’s hold, using mechanical equipment.',
    'svc.2.name': 'Cargodoring',
    'svc.2.short': 'Quay to warehouse and stacking yard',
    'svc.2.desc': 'Moving cargo already landed on the quay (kade) to the port warehouse or stacking yard, and the reverse for outbound shipments.',
    'svc.3.name': 'Receiving / Delivery',
    'svc.3.short': 'Inbound and outbound cargo movement',
    'svc.3.desc': 'Receiving or delivering goods from the warehouse, stacking yard or quay using haulage equipment — trucks and heavy machinery.',
    'svc.supportTitle': 'Backed By Our Own Equipment',
    'svc.supportLead': 'Heavy equipment and the truck fleet come from our own sister companies — schedules never depend on a third party.',
    'svc.sup1': 'Wheel Loader & Grab',
    'svc.sup1d': 'Hold trimming and bulk handling',
    'svc.sup2': 'Dump Truck Fleet',
    'svc.sup2d': 'Direct delivery to destination',
    'svc.sup3': 'Warehousing',
    'svc.sup3d': 'Temporary cargo storage',

    'proc.eyebrow': 'How We Work',
    'proc.title': 'From berthing to final delivery',
    'proc.lead': 'Four stages, all under our control. Scroll to follow your cargo’s journey.',
    'proc.1.t': 'Berthing & Preparation',
    'proc.1.d': 'Coordination with agents and port authorities, initial draft survey, hold condition checks, and mobilising gangs and equipment before operations begin.',
    'proc.2.t': 'Stevedoring',
    'proc.2.d': 'Discharging cargo from the holds using ship cranes, shore cranes or a CSU, with full safety supervision on every shift.',
    'proc.3.t': 'Cargodoring',
    'proc.3.d': 'Cargo landed on the quay is moved to the warehouse or stacking yard, recorded and protected against damage or loss.',
    'proc.4.t': 'Receiving / Delivery',
    'proc.4.d': 'Delivery to your warehouse or destination using the group’s dump truck fleet — on time and fully documented.',

    'est.eyebrow': 'Exclusive Tool',
    'est.title': 'Estimate your discharge time instantly',
    'est.lead': 'Enter your commodity, tonnage and discharge method — get an estimated productivity rate and days alongside in seconds, then send it straight through as a quote request.',
    'est.cargo': 'Cargo Type',
    'est.tonnage': 'Tonnage (MT)',
    'est.tonnagePh': 'e.g. 25000',
    'est.equipment': 'Discharge Method',
    'est.resultTitle': 'Operational Estimate',
    'est.rate': 'Productivity',
    'est.rateUnit': 'MT / day',
    'est.days': 'Discharge Time',
    'est.daysUnit': 'effective working days',
    'est.method': 'Method',
    'est.emptyTitle': 'Your estimate appears here',
    'est.emptyText': 'Complete the three fields on the left, then press Calculate Estimate.',
    'est.assumption': 'Assumes ~20 effective working hours per day in normal weather.',
    'est.disclaimer': 'Indicative estimate for early planning — not a formal quotation. Actual time depends on weather, berth availability, hold condition and consignee readiness. Contact us for a binding offer.',
    'est.ctaNote': 'Close to what you expected? Send these details to our team.',
    'est.errCargo': 'Please select a cargo type first.',
    'est.errTon': 'Enter a tonnage between 100 and 200,000 MT.',
    'est.errEquip': 'Please select a discharge method.',

    'cargo.eyebrow': 'Handling Capability',
    'cargo.title': 'What are you shipping?',
    'cargo.lead': 'Fifteen commodity types we handle routinely at Cigading Port. Select one to see the method and equipment we use.',
    'cargo.all': 'All',
    'cargo.dry': 'Dry Bulk',
    'cargo.break': 'Break Bulk',
    'cargo.method': 'Handling Method',
    'cargo.equipment': 'Equipment',
    'cargo.seeProject': 'See related project',
    'cargo.notListed': 'Cargo not on the list?',
    'cargo.notListedSub': 'We handle a wide range of other bulk and break bulk commodities. Send us the details and our team will assess equipment readiness.',

    'proj.eyebrow': 'Track Record',
    'proj.title': 'Work we have already completed',
    'proj.lead': 'A selection of the cargo operations we have handled at Cigading Port — with the real figures and vessels.',

    'trust.eyebrow': 'Recognition',
    'trust.title': 'Recognised by the port operator and our customers',
    'trust.lead': 'Third-party recognition of our safety record and service consistency.',
    'trust.issuedBy': 'Issued by',

    'hse.eyebrow': 'Health & Safety',
    'hse.title': 'Zero Accident is not a slogan — we have the award for it',
    'hse.lead': 'A cargo handling company that puts safety first in every operation, for both our people and the cargo we handle.',
    'hse.1': 'Reliable, competent workforce certified in cargo handling',
    'hse.2': 'Safety prioritised in every activity, for people and for cargo alike',
    'hse.3': 'Supported by heavy equipment and a dump truck fleet from our own group',
    'hse.4': 'Accuracy and speed in service — in documentation as much as operations',
    'hse.awardCaption': 'Zero Accident Programme 2016 award, rated “Baik” — PT. Krakatau Bandar Samudera',

    'clients.eyebrow': 'Clients & Partners',
    'clients.title': 'Trusted by leading names in food, energy and steel',
    'clients.lead': 'More than thirty companies trust us with their cargo at Cigading Port.',

    'testi.eyebrow': 'Client Feedback',
    'testi.title': 'What our partners say',

    'about.eyebrow': 'About Us',
    'about.title': 'Twenty-six years on the same quay',
    'about.introT': 'A cargo handling company that grew alongside Cigading Port',
    'about.p1': 'PT. Wirama Indah Cigading was founded on 10 December 1999 under the name PT. Werner Indopex Cigading, by Notarial Act No. 36 of 1999. On 15 August 2002 the company was renamed PT. Wirama Indah Cigading.',
    'about.p2': 'We are a licensed cargo handling company (PBM) specialising in the transfer of cargo between vessel and quay, supported by competent personnel and adequate equipment and facilities.',
    'about.visionT': 'Vision',
    'about.missionT': 'Mission',
    'about.mottoT': 'Company Motto',
    'about.historyT': 'Our Journey',
    'about.h1999': 'Founded as PT. Werner Indopex Cigading under Notarial Act No. 36 of 1999.',
    'about.h2002': 'Renamed PT. Wirama Indah Cigading on 15 August 2002.',
    'about.h2016': 'Awarded the Zero Accident Programme and Supplier of The Year.',
    'about.h2017': 'Named Customer of The Year — Best Shipping Customer.',
    'about.hNow': 'Serving more than 30 clients across 15 commodity types at Cigading Port.',
    'about.advT': 'Our Advantages',

    'gal.eyebrow': 'Gallery',
    'gal.title': 'Our operations, documented',
    'gal.lead': 'Real photographs of our cargo handling operations, equipment and team at Cigading Port.',
    'gal.all': 'All',
    'gal.operasi': 'Operations',
    'gal.alat': 'Equipment',
    'gal.kapal': 'Vessels',
    'gal.tim': 'Team',
    'gal.close': 'Close',
    'gal.prev': 'Previous',
    'gal.next': 'Next',

    'rfq.eyebrow': 'Request a Quote',
    'rfq.title': 'Tell us about your cargo — we reply the same day',
    'rfq.lead': 'Three quick steps. Your request goes straight to our operations team on WhatsApp, with no waiting on email.',
    'rfq.step': 'Step',
    'rfq.of': 'of',
    'rfq.s1': 'Cargo',
    'rfq.s2': 'Vessel & Schedule',
    'rfq.s3': 'Contact',
    'rfq.cargoType': 'Cargo Type',
    'rfq.cargoPh': 'Select a commodity',
    'rfq.other': 'Other',
    'rfq.otherCargo': 'Specify Your Cargo',
    'rfq.otherCargoPh': 'e.g. Copra Meal',
    'rfq.tonnage': 'Estimated Tonnage (MT)',
    'rfq.service': 'Services Required',
    'rfq.vessel': 'Vessel Name (optional)',
    'rfq.vesselPh': 'e.g. Mv. Windsor Adventure',
    'rfq.eta': 'Estimated ETA (optional)',
    'rfq.port': 'Port',
    'rfq.notes': 'Additional Notes (optional)',
    'rfq.notesPh': 'Special requirements, schedule, or any other questions…',
    'rfq.name': 'Your Name',
    'rfq.namePh': 'Full name',
    'rfq.companyL': 'Company',
    'rfq.companyPh': 'Company name',
    'rfq.phone': 'WhatsApp / Phone Number',
    'rfq.phonePh': '+62 8xx xxxx xxxx',
    'rfq.emailL': 'Email (optional)',
    'rfq.emailPh': 'name@company.com',
    'rfq.review': 'Summary of your request',
    'rfq.privacy': 'Your details are used only to prepare a quotation and are never shared with third parties.',
    'rfq.required': 'This field is required.',
    'rfq.sideT': 'Need an answer fast?',
    'rfq.sideD': 'Our operations team is active on WhatsApp during working hours. For vessels close to ETA, message us directly — we respond faster.',
    'rfq.sideHours': 'Operating Hours',

    'kontak.eyebrow': 'Contact Us',
    'kontak.title': 'We are in Cilegon, close to the quay',
    'kontak.lead': 'Our office is in Ciwandan, Cilegon — minutes from Cigading Port, so our team can be on site quickly when your vessel berths.',
    'kontak.addressT': 'Office Address',
    'kontak.phoneT': 'Telephone',
    'kontak.emailT': 'Email',
    'kontak.hoursT': 'Operating Hours',
    'kontak.mapT': 'Find Us',

    'foot.about': 'A licensed cargo handling company (PBM) at Cigading Port, Cilegon. Handling dry bulk and break bulk cargo since 1999.',
    'foot.nav': 'Navigation',
    'foot.svc': 'Services',
    'foot.contact': 'Contact',
    'foot.rights': 'All rights reserved.',
    'foot.part': 'Part of',
    'foot.built': 'This site was redesigned in 2026.',

    'cta.bannerT': 'Have a vessel due to berth?',
    'cta.bannerD': 'Send us your cargo details and schedule. Our team prepares the quotation and the gang the same day.',

    'misc.viewProject': 'View details',
    'misc.dryBulk': 'Dry Bulk',
    'misc.breakBulk': 'Break Bulk',
    'misc.photos': 'photos',
    'misc.langLabel': 'Choose language'
  }
};

/* --------------------------------------------------------------------------
   Engine
   -------------------------------------------------------------------------- */
(function () {
  'use strict';

  var KEY = 'wic-lang';
  var current = 'id';

  try {
    var saved = localStorage.getItem(KEY);
    if (saved === 'id' || saved === 'en') current = saved;
  } catch (e) { /* private mode — fall back to default */ }

  /** Resolve a {id, en} object (or plain value) to the active language. */
  function t(value) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value[current] !== undefined ? value[current] : (value.id || '');
    }
    return value;
  }

  /** Look up a dictionary key. */
  function s(key) {
    var dict = WIC.strings[current] || WIC.strings.id;
    return dict[key] !== undefined ? dict[key] : (WIC.strings.id[key] !== undefined ? WIC.strings.id[key] : key);
  }

  function apply() {
    document.documentElement.lang = current;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.innerHTML = s(el.getAttribute('data-i18n'));
    });

    // data-i18n-attr="placeholder:est.tonnagePh,aria-label:gal.next"
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length === 2) el.setAttribute(parts[0].trim(), s(parts[1].trim()));
      });
    });

    document.querySelectorAll('.lang__btn').forEach(function (btn) {
      var on = btn.getAttribute('data-lang') === current;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    document.dispatchEvent(new CustomEvent('wic:langchange', { detail: { lang: current } }));
  }

  function set(lang) {
    if (lang !== 'id' && lang !== 'en') return;
    if (lang === current) return;
    current = lang;
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    apply();
  }

  function init() {
    document.querySelectorAll('.lang__btn').forEach(function (btn) {
      btn.addEventListener('click', function () { set(btn.getAttribute('data-lang')); });
    });
    apply();
  }

  WIC.t = t;
  WIC.s = s;
  WIC.lang = function () { return current; };
  WIC.setLang = set;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
