import type { MissionScript } from '@/types/mission';

export const mission1: MissionScript = {
  id: 'm1',
  title: 'Level 1: Pesan Berantai',
  description: 'Uji kemampuan jeda kritis dan cek fakta terhadap berita libur mendadak yang disebarkan di grup kelas.',
  category: 'Literasi Hoax & Cek Fakta',
  difficulty: 'Mudah',
  channelName: 'Grup Kelas X-MIPA 1',
  isGroup: true,
  memberCount: 36,
  avatarSeed: 'ClassGroup1',
  startNodeId: 'node_intro',
  nodes: {
    node_intro: {
      type: 'message',
      sender: 'npc',
      npcName: 'Dina (Ketua Kelas)',
      avatarSeed: 'Dina',
      text: 'PENGUMUMAN PENTING! 🚨 Teman-teman, besok kita LIBUR TOTAL karena tiba-tiba ada sidak kebersihan dan penyemprotan massal dari Dinas.\n\nTolong bantu sebar ke grup ekskul dan teman lain ya!\nhttp://info-diknas-sekolah.blogspot.xyz/libur-mendadak',
      delay: 1000,
      nextNodeId: 'node_dina_ask'
    },
    node_dina_ask: {
      type: 'message',
      sender: 'npc',
      npcName: 'Dina (Ketua Kelas)',
      avatarSeed: 'Dina',
      text: 'Jangan sampai ada yang masuk sekolah sia-sia besok ya! Ayo forward sekarang juga.',
      delay: 1200,
      nextNodeId: 'node_choice_1'
    },
    node_choice_1: {
      type: 'choice',
      prompt: 'Bagaimana reaksimu terhadap pesan Dina?',
      options: [
        {
          text: 'Wah asik libur! Langsung forward pesan Dina ke semua grup ekskul.',
          points: 0,
          nextNodeId: 'node_forward_fatal',
          isForwardAction: true
        },
        {
          text: 'Din, serius ini? Dapat info dari mana? Tautannya kok blogspot aneh ya?',
          points: 1,
          nextNodeId: 'node_dina_reply_clarify'
        },
        {
          text: 'Tunggu Din, jangan disebar dulu! Aku mau buka Browser cek website resmi sekolah dulu.',
          points: 2,
          nextNodeId: 'node_open_browser_flow'
        }
      ]
    },

    // Branch 1: Fatal Forward
    node_forward_fatal: {
      type: 'message',
      sender: 'player',
      text: 'Wah mantap libur! Aku izin bantu teruskan info ini ke grup ekskul dan teman lain ya!',
      delay: 600,
      nextNodeId: 'node_dina_ack_forward'
    },
    node_dina_ack_forward: {
      type: 'message',
      sender: 'npc',
      npcName: 'Dina (Ketua Kelas)',
      avatarSeed: 'Dina',
      text: '[SYSTEM_ACTION:suggestApp:chat:Chatter:Pesan baru dari Grup Futsal] Boleh, tolong teruskan ke grup futsal dan teman-teman ekskul ya!',
      delay: 800,
      nextNodeId: null
    },
    node_forwarded_to_clubs: {
      type: 'message',
      sender: 'player',
      text: 'Guys, besok sekolah libur total kata Dina! Ini info dari dinas: http://info-diknas-sekolah.blogspot.xyz/libur-mendadak (Diteruskan ke grup ekskul)',
      delay: 600,
      nextNodeId: null
    },
    node_edo_doubt: {
      type: 'message',
      sender: 'npc',
      npcName: 'Edo (Kapten Futsal)',
      avatarSeed: 'Edo',
      text: 'Bro seriusan besok libur? Coba lo klik dulu linknya, beneran dari dinas gak tuh? Kok domain blogspot aneh gitu?',
      delay: 1100,
      nextNodeId: null
    },
    node_hacked_glitch: {
      type: 'message',
      sender: 'system',
      text: '[SYSTEM_ACTION:glitch:2] ⚠️ PERINGATAN SISTEM: Akun Anda sedang melakukan pengiriman spam massal ke seluruh kontak!',
      delay: 1200,
      nextNodeId: 'node_friend_angry_1'
    },
    node_friend_angry_1: {
      type: 'message',
      sender: 'npc',
      npcName: 'Edo',
      avatarSeed: 'Edo',
      text: 'Woy akun lo kenapa nge-spam link aneh ke semua grup OSIS dan ekskul?!',
      delay: 1000,
      nextNodeId: 'node_friend_angry_2'
    },
    node_friend_angry_2: {
      type: 'message',
      sender: 'npc',
      npcName: 'Sarah',
      avatarSeed: 'Sarah',
      text: 'Parah banget akun lo kena bajak malware! Link yang lo sebar itu phishing pencuri akun Google!',
      delay: 1000,
      nextNodeId: 'node_teacher_debrief_fail'
    },
    node_teacher_debrief_fail: {
      type: 'message',
      sender: 'npc',
      npcName: 'Pak Guru Informatika',
      avatarSeed: 'PakGuru',
      text: 'Bapak melihat akunmu baru saja menyebarkan tautan malware berbahaya ke seluruh grup sekolah. Ini adalah akibat langsung menyebarkan informasi tanpa jeda kritis dan cek fakta.',
      delay: 1400,
      nextNodeId: 'gameover_hoax'
    },
    gameover_hoax: {
      type: 'gameover',
      reason: 'Akunmu terinfeksi malware dan menyebarkan hoax ke seluruh sekolah.',
      debriefCard: {
        status: 'GAGAL',
        stars: 1,
        topicTitle: 'Literasi Hoax & Social Engineering',
        summary: 'Kamu langsung mempercayai dan menyebarkan berita tanpa melakukan verifikasi sumber. Tautan blogspot palsu tersebut adalah malware phishing.',
        keyTerms: [
          { term: 'Hoax (Berita Bohong)', definition: 'Informasi yang direkayasa untuk menipu dan memanipulasi pembaca agar panik atau percaya hal yang tidak benar.' },
          { term: 'Phishing & Malware', definition: 'Tautan jebakan yang dirancang mencuri kredensial akun dan menyusupkan skrip jahat ke perangkat korban.' },
          { term: 'Social Engineering', definition: 'Manipulasi psikologis yang memanfaatkan rasa gembira ("libur mendadak") agar korban lengah.' }
        ],
        legalBasis: {
          law: 'UU ITE Pasal 28 Ayat (1)',
          description: 'Setiap orang yang dengan sengaja menyebarkan berita bohong dan menyesatkan diancam pidana penjara paling lama 6 tahun dan/atau denda Rp 1 Miliar.'
        },
        moralMessage: 'Saring sebelum sharing! Kecepatan menyebarkan pesan tidak ada artinya jika yang kamu sebarkan adalah racun digital.',
        pedagogicalObjectives: [
          'Mengasah kebiasaan Jeda Kritis (Critical Thinking Pause) sebelum merespons atau membagikan pesan.',
          'Mampu membedakan domain institusi resmi (.sch.id) dari domain penipuan gratisan (.blogspot, .xyz).',
          'Memahami risiko phishing dan pencurian kredensial akun media sosial akibat tautan mencurigakan.'
        ],
        whatIfScenarios: [
          {
            choiceTitle: 'Langsung Mem-forward Pesan ke Grup Kelas',
            description: 'Kamu mempercayai pesan tanpa mengecek domain blogspot palsu dan menyebarkannya dengan cepat.',
            outcomeSummary: 'Akunmu terinfeksi malware, menyebarkan spam otomatis ke seluruh kontak sekolah, dan melanggar UU ITE.',
            riskLevel: 'Kritis'
          },
          {
            choiceTitle: 'Mendiamkan Saja Tanpa Memberitahu Dina',
            description: 'Kamu ragu terhadap link tersebut tetapi memilih diam tanpa melakukan konfirmasi atau pengecekan.',
            outcomeSummary: 'Kamu terhindar dari peretasan akun, namun puluhan teman sekelasmu tetap menjadi korban disinformasi.',
            riskLevel: 'Sedang'
          },
          {
            choiceTitle: 'Mengecek Web Resmi Sekolah & Membuka Safari',
            description: 'Kamu menyadari domain blogspot tidak resmi, membuka browser, dan memastikan pengumuman di portal sekolah.',
            outcomeSummary: 'Hoax terverifikasi palsu, pesan berhasil ditarik sebelum menyebar luas, dan seluruh kelas terselamatkan.',
            riskLevel: 'Aman'
          }
        ]
      }
    },

    // Branch 2: Clarification with Dina
    node_dina_reply_clarify: {
      type: 'message',
      sender: 'npc',
      npcName: 'Dina (Ketua Kelas)',
      avatarSeed: 'Dina',
      text: 'Aduh, aku cuma di-forward dari kakak kelas alumni sih. Harusnya bener kan? Masa kakak kelas bohong?',
      delay: 1200,
      nextNodeId: 'node_choice_2'
    },
    node_choice_2: {
      type: 'choice',
      prompt: 'Dina masih ragu, apa yang akan kamu lakukan?',
      options: [
        {
          text: 'Yaudah deh kalau dari kakak kelas pasti valid, aku bantu forward ya.',
          points: 0,
          nextNodeId: 'node_forward_fatal',
          isForwardAction: true
        },
        {
          text: 'Jangan mudah percaya Din! Ayo kita cek ke website resmi SMAN 1 sekarang juga lewat Browser.',
          points: 2,
          nextNodeId: 'node_open_browser_flow'
        }
      ]
    },

    // Branch 3: Fact Checking in Browser
    node_open_browser_flow: {
      type: 'message',
      sender: 'npc',
      npcName: 'Dina (Ketua Kelas)',
      avatarSeed: 'Dina',
      text: '[SYSTEM_ACTION:suggestApp:browser:Safari:Cek keabsahan berita di portal sekolah] Bener juga kata kamu! Coba buka Safari sekarang terus cek pengumuman di portal resmi sman1-official.sch.id ya. Nanti kabarin aku di grup ini!',
      delay: 1300,
      nextNodeId: null
    },
    node_browser_wait_fact: {
      type: 'message',
      sender: 'npc',
      npcName: 'Dina (Ketua Kelas)',
      avatarSeed: 'Dina',
      text: 'Gimana hasilnya? Kamu nemu pengumuman resmi di web sekolah nggak?',
      delay: 1000,
      nextNodeId: 'node_choice_browser_result'
    },
    node_choice_browser_result: {
      type: 'choice',
      prompt: 'Laporkan temuan cek faktamu kepada Dina:',
      options: [
        {
          text: 'Din, aku cek web resmi SMAN 1! Ada spanduk merah tegas: Berita Libur Besok HOAX! Tarik pesanmu sekarang!',
          points: 3,
          nextNodeId: 'node_send_proof_screenshot'
        }
      ]
    },
    node_send_proof_screenshot: {
      type: 'message',
      sender: 'player',
      text: 'Ini bukti tangkapan layar dari portal resmi sman1-official.sch.id! Pihak sekolah sudah membantah keras berita libur tersebut.',
      attachment: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=600',
        caption: '📸 Bukti Resmi Portal Sekolah: Klarifikasi Hoax Libur Mendadak'
      },
      delay: 700,
      nextNodeId: 'node_success_dina_apologize'
    },
    node_success_dina_apologize: {
      type: 'message',
      sender: 'npc',
      npcName: 'Dina (Ketua Kelas)',
      avatarSeed: 'Dina',
      text: 'Ya ampun! Untung kamu ingatkan dan cek ke web resmi sekolah! Aku langsung hapus pesannya sekarang dan umumkan kalau itu hoax. Makasih banyak ya!',
      delay: 1300,
      nextNodeId: 'node_teacher_debrief_success'
    },
    node_teacher_debrief_success: {
      type: 'message',
      sender: 'npc',
      npcName: 'Pak Guru Informatika',
      avatarSeed: 'PakGuru',
      text: 'Luar biasa! Bapak sangat bangga. Kebiasaan melakukan "Jeda Kritis" dan memeriksa sumber primer ke website resmi sekolah telah menyelamatkan seluruh kelas dari penyebaran hoax dan bahaya pencurian data.',
      delay: 1400,
      nextNodeId: 'success_hoax'
    },
    success_hoax: {
      type: 'success',
      message: 'Kamu berhasil menjadi Pahlawan Cek Fakta di kelas!',
      debriefCard: {
        status: 'BERHASIL SEMPURNA',
        stars: 3,
        topicTitle: 'Literasi Hoax & Jeda Kritis',
        summary: 'Kamu tidak terburu-buru menyebarkan berita, melainkan menggunakan akal sehat untuk memverifikasi keabsahan fakta ke website resmi sekolah.',
        keyTerms: [
          { term: 'Jeda Kritis (Critical Pause)', definition: 'Kebiasaan menahan diri sejenak untuk memikirkan kebenaran, dampak, dan sumber suatu pesan sebelum membagikannya.' },
          { term: 'Cek Fakta (Fact-Checking)', definition: 'Metode penelusuran fakta dengan membandingkan informasi viral terhadap kanal publikasi resmi institusi terverifikasi.' },
          { term: 'Domain & URL Spoofing', definition: 'Trik penipu menggunakan domain gratisan (.blogspot, .xyz) menyerupai nama instansi pemerintah.' }
        ],
        legalBasis: {
          law: 'UU ITE Pasal 28 & Etika Komunikasi Digital',
          description: 'Siswa yang aktif mencegah penyebaran berita bohong telah berpartisipasi menjaga ruang siber yang aman dan mematuhi etika warga digital yang bertanggung jawab.'
        },
        moralMessage: 'Internet membutuhkan pemikir, bukan sekadar penekan tombol forward. Jadilah benteng pertahanan informasi bagi lingkunganmu.',
        pedagogicalObjectives: [
          'Mengembangkan kemampuan berpikir kritis (Critical Thinking Pause) sebelum merespons rangsangan digital.',
          'Mampu membedakan domain institusi resmi (.sch.id) dengan domain manipulatif (.blogspot, .xyz).',
          'Menguasai metode verifikasi lateral dengan memeriksa sumber primer di portal resmi sekolah.'
        ],
        whatIfScenarios: [
          {
            choiceTitle: 'Jika Kamu Langsung Mem-forward Pesan',
            description: 'Kamu membagikan tautan blogspot ke grup kelas tanpa meneliti terlebih dahulu.',
            outcomeSummary: 'Akun terinfeksi phishing otomatis, menyebarkan spam ke seluruh kontak, dan melanggar etika serta UU ITE.',
            riskLevel: 'Kritis'
          },
          {
            choiceTitle: 'Jika Kamu Hanya Diam Tanpa Bertindak',
            description: 'Kamu tidak menyebarkan link, namun juga tidak melakukan verifikasi dan membiarkan teman lain tertipu.',
            outcomeSummary: 'Diri sendiri selamat, namun puluhan siswa lain menjadi korban phishing dan kepanikan kelas berlanjut.',
            riskLevel: 'Sedang'
          },
          {
            choiceTitle: 'Pilihanmu: Cek Fakta di Web Resmi Sekolah',
            description: 'Kamu menahan diri, membuka Safari, dan mengecek spanduk pengumuman di portal resmi sman1-official.sch.id.',
            outcomeSummary: 'Hoax terbukti palsu, pesan berhasil ditarik oleh Dina, dan kelas terselamatkan dari kebocoran akun.',
            riskLevel: 'Aman'
          }
        ]
      }
    }
  }
};
