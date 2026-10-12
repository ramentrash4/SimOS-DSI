import type { MissionScript } from '@/types/mission';

export const mission5: MissionScript = {
  id: 'm5',
  title: 'Level 5: Jejak yang Tertinggal',
  description: 'Hadapi krisis jejak digital masa lalu menjelang pemilihan Ketua OSIS dengan integritas, tanggung jawab, dan kedewasaan.',
  category: 'Digital Footprint & Akuntabilitas',
  difficulty: 'Tantangan',
  channelName: 'Budi Santoso (Calon OSIS)',
  isGroup: false,
  avatarSeed: 'Budi',
  startNodeId: 'node_intro',
  nodes: {
    node_intro: {
      type: 'message',
      sender: 'npc',
      npcName: 'Budi Santoso',
      avatarSeed: 'Budi',
      text: 'Gawat darurat bro! Tangan gue gemeteran... Kubu lawan baru aja nge-post screenshot status akun InstaPic lama gue waktu 3 tahun lalu pas kelas 7 SMP! 😭',
      delay: 900,
      nextNodeId: 'node_budi_panic'
    },
    node_budi_panic: {
      type: 'message',
      sender: 'npc',
      npcName: 'Budi Santoso',
      avatarSeed: 'Budi',
      text: 'Waktu itu gue masih bocah labil dan pernah nulis status ngehina guru MTK pakai kata-kata kasar. Sekarang akun gosip sekolah @lambe_sman1 udah nge-viralin itu. Pemilihan OSIS tinggal besok pagi! Gue harus gimana?!',
      delay: 1300,
      nextNodeId: 'node_choice_1'
    },
    node_choice_1: {
      type: 'choice',
      prompt: 'Saran strategi apa yang akan kamu berikan kepada Budi?',
      options: [
        {
          text: 'Udah ngeles aja Bud! Bikin klarifikasi bohong kalau akun lo waktu itu di-hack orang lain.',
          points: 0,
          nextNodeId: 'node_lie_hack_fatal'
        },
        {
          text: 'Jangan mau kalah! Kita cari juga aib masa lalu kubu lawan, terus kita viralin balik biar seri!',
          points: 0,
          nextNodeId: 'node_revenge_toxic_fatal'
        },
        {
          text: 'Jangan bohong Bud. Hadapi secara ksatria: bikin video permintaan maaf tulus, akui kesalahan masa lalu, dan buktikan lo sudah dewasa.',
          points: 3,
          nextNodeId: 'node_apology_mature_success'
        }
      ]
    },

    // Branch 1: Lie about hacking (Bad Ending 1)
    node_lie_hack_fatal: {
      type: 'message',
      sender: 'player',
      text: 'Tenang Bud, ngeles aja! Bikin pernyataan resmi kalau postingan itu bukan lo yang nulis, tapi akun lo dibajak/dihack orang waktu SMP.',
      delay: 800,
      nextNodeId: 'node_system_budi_lie'
    },
    node_system_budi_lie: {
      type: 'message',
      sender: 'system',
      text: 'Budi merilis klarifikasi bohong. Namun 1 jam kemudian, kubu lawan membongkar log aktivitas dan bukti bahwa tidak ada riwayat hack sama sekali!',
      delay: 1200,
      nextNodeId: 'node_budi_disqualified'
    },
    node_budi_disqualified: {
      type: 'message',
      sender: 'npc',
      npcName: 'Budi Santoso',
      avatarSeed: 'Budi',
      text: 'Kebohongan gue terbongkar bro... Kepala Sekolah panggil gue ke ruang BK. Gue resmi DIDISKUALIFIKASI secara tidak hormat dan dicap pembohong oleh seluruh siswa sekolah...',
      delay: 1400,
      nextNodeId: 'node_teacher_debrief_fail_lie'
    },
    node_teacher_debrief_fail_lie: {
      type: 'message',
      sender: 'npc',
      npcName: 'Pak Guru Informatika',
      avatarSeed: 'PakGuru',
      text: 'Bapak sangat kecewa. Jejak digital buruk di masa lalu tidak akan pernah selesai jika ditutupi dengan kebohongan baru. Di era digital, manipulasi data sangat mudah dibuktikan dan hanya akan menghancurkan reputasimu selamanya.',
      delay: 1300,
      nextNodeId: 'gameover_footprint_lie'
    },
    gameover_footprint_lie: {
      type: 'gameover',
      reason: 'Kebohongan terbongkar oleh jejak digital lanjutan, Budi didiskualifikasi secara tidak hormat.',
      debriefCard: {
        status: 'GAGAL',
        stars: 1,
        topicTitle: 'Jejak Digital & Bahaya Kebohongan Publik',
        summary: 'Kamu menyarankan menutup kesalahan masa lalu dengan alibi palsu ("akun di-hack"), yang berujung pada kehancuran integritas total.',
        keyTerms: [
          { term: 'Jejak Digital Permanen', definition: 'Seluruh aktivitas dan rekam jejak digital tidak pernah benar-benar hilang dari internet.' },
          { term: 'Integritas Kepemimpinan', definition: 'Kejujuran mutlak yang menjadi syarat utama seorang pemimpin organisasi di dunia nyata maupun maya.' },
          { term: 'Audit Forensik Digital', definition: 'Kemudahan memverifikasi kebenaran alibi di internet melalui rekam jejak log dan arsip data.' }
        ],
        legalBasis: {
          law: 'UU ITE Rekam Jejak Elektronik & Kode Etik Siswa',
          description: 'Penyampaian informasi palsu untuk mengelabui publik mencoreng integritas akademik dan melanggar etika kewargaan digital.'
        },
        moralMessage: 'Internet tidak pernah lupa. Menutup kesalahan dengan kebohongan hanya memperdalam jurang kehancuran.',
        pedagogicalObjectives: [
          'Memahami sifat permanen jejak digital (Digital Footprint) di era arsip mesin pencari.',
          'Menyadari bahaya audit forensik digital saat menutup kesalahan dengan alibi palsu ("akun di-hack").',
          'Mengutamakan nilai kejujuran dan integritas di ruang publik digital.'
        ],
        whatIfScenarios: [
          {
            choiceTitle: 'Bohong Mengaku Akun Dibajak (Hacked)',
            description: 'Kamu menyarankan Budi membuat alibi palsu bahwa postingan masa lalunya dibuat oleh peretas.',
            outcomeSummary: 'Audit jejak log membuktikan IP login berasal dari perangkat sendiri, Budi didiskualifikasi secara memalukan.',
            riskLevel: 'Kritis'
          },
          {
            choiceTitle: 'Menyerang Balik Lawan dengan Membocorkan Aib (Doxxing)',
            description: 'Kamu membalas dendam dengan mengunggah rahasia pribadi kubu lawan ke media sosial.',
            outcomeSummary: 'Linimasa sekolah ricuh, perpecahan horizontal terjadi, dan seluruh proses pemilihan OSIS dibatalkan.',
            riskLevel: 'Kritis'
          },
          {
            choiceTitle: 'Membuat Video Klarifikasi & Permohonan Maaf Tulus',
            description: 'Kamu membimbing Budi mengakui kekhilafan masa lalu dan membuktikan kedewasaan dirinya.',
            outcomeSummary: 'Guru dan teman sekolah memaafkan, integritas Budi diakui, dan ia diizinkan terus maju sebagai kandidat.',
            riskLevel: 'Aman'
          }
        ]
      }
    },

    // Branch 2: Revenge / Doxxing (Bad Ending 2)
    node_revenge_toxic_fatal: {
      type: 'message',
      sender: 'player',
      text: 'Gak usah takut Bud! Kita bongkar juga aib lawan pemilihan OSIS, pasti mereka punya aib masa lalu! Kita viralin balik sekarang!',
      delay: 800,
      nextNodeId: 'node_system_toxic_war'
    },
    node_revenge_toxic_fatal_sys: {
      type: 'message',
      sender: 'system',
      text: '[SYSTEM_ACTION:glitch:2] [SYSTEM_ACTION:shake] 💥 Linimasa sekolah berubah menjadi medan saling serang aib dan ujaran kebencian! Suasana sekolah menjadi kacau dan ricuh!',
      delay: 1200,
      nextNodeId: 'node_principal_angry'
    },
    node_revenge_toxic_fatal_sys2: {
      type: 'message',
      sender: 'npc',
      npcName: 'Budi Santoso',
      avatarSeed: 'Budi',
      text: 'Kacau parah bro... Kepala Sekolah marah besar karena reputasi sekolah hancur di media sosial. Seluruh proses pemilihan OSIS DIBATALKAN dan kepengurusan dibekukan!',
      delay: 1300,
      nextNodeId: 'node_teacher_debrief_fail_war'
    },
    node_teacher_debrief_fail_war: {
      type: 'message',
      sender: 'npc',
      npcName: 'Pak Guru Informatika',
      avatarSeed: 'PakGuru',
      text: 'Balas dendam dengan membuka aib lawan (Doxxing) adalah tindakan tercela yang merusak iklim demokrasi sekolah. Membalas lumpur dengan lumpur hanya membuat semua orang kotor.',
      delay: 1300,
      nextNodeId: 'gameover_footprint_war'
    },
    gameover_footprint_war: {
      type: 'gameover',
      reason: 'Saling bongkar aib (doxxing) memicu kegaduhan massal, pemilihan OSIS dibekukan Kepala Sekolah.',
      debriefCard: {
        status: 'GAGAL',
        stars: 1,
        topicTitle: 'Doxxing & Eskalasi Toksik di Media Sosial',
        summary: 'Kamu memilih jalur balas dendam dengan menyebarkan aib lawan, memicu perpecahan dan merusak nama baik institusi pendidikan.',
        keyTerms: [
          { term: 'Doxxing', definition: 'Menyebarkan informasi atau aib pribadi seseorang ke publik untuk memicu perundungan dan penghakiman massa.' },
          { term: 'Cancel Culture Toksik', definition: 'Aksi saling menjatuhkan reputasi seseorang secara agresif tanpa ruang perbaikan.' }
        ],
        legalBasis: {
          law: 'UU ITE Pasal 27 Ayat (3) & Pasal 32 (Penyebaran Data Pribadi)',
          description: 'Membongkar dan menyebarkan data pribadi orang lain secara ilegal dapat dijerat sanksi pidana.'
        },
        moralMessage: 'Dua kesalahan tidak akan pernah menghasilkan satu kebenaran. Jangan balas kejahatan dengan kehancuran bersama.',
        pedagogicalObjectives: [
          'Memahami bahaya fenomena Doxxing dan penyebaran informasi privat secara sepihak.',
          'Menyadari sanksi hukum UU Perlindungan Data Pribadi (UU PDP) dan UU ITE atas aksi doxxing.'
        ],
        whatIfScenarios: [
          {
            choiceTitle: 'Membongkar Aib Lawan di Linimasa Publik',
            description: 'Membalas dendam dengan membuka rahasia masa lalu kompetitor pemilihan.',
            outcomeSummary: 'Keributan massal di media sosial dan pembekuan seluruh kegiatan kesiswaan.',
            riskLevel: 'Kritis'
          },
          {
            choiceTitle: 'Membuat Pengakuan Tulus & Bertanggung Jawab',
            description: 'Menghadapi kritik dengan jiwa kesatria seorang calon pemimpin.',
            outcomeSummary: 'Mendapat respek dari warga sekolah dan menyelesaikan perselisihan secara elegan.',
            riskLevel: 'Aman'
          }
        ]
      }
    },

    // Branch 3: Mature Apology & Accountability (Perfect Ending)
    node_apology_mature_success: {
      type: 'message',
      sender: 'player',
      text: 'Jangan bohong dan jangan balas dendam Bud. Lo calon pemimpin. Bikin video klarifikasi di InstaPic sekarang: akui kesalahan itu dengan tulus, minta maaf kepada guru yang bersangkutan dan warga sekolah, serta buktikan lo yang sekarang sudah jauh lebih dewasa.',
      delay: 1000,
      nextNodeId: 'node_budi_makes_video'
    },
    node_budi_makes_video: {
      type: 'message',
      sender: 'npc',
      npcName: 'Budi Santoso',
      avatarSeed: 'Budi',
      text: 'Lo bener bro... Gue gak boleh lari dari masa lalu gue. Gue udah unggah video klarifikasi dan permohonan maaf terbuka di InstaPic. Gue siap terima apapun konsekuensinya.',
      delay: 1300,
      nextNodeId: 'node_system_instapic_respect'
    },
    node_system_instapic_respect: {
      type: 'message',
      sender: 'system',
      text: '[SYSTEM_ACTION:openApp:instapic] ✨ Video klarifikasi Budi viral! Guru dan siswa mengapresiasi keberanian, kejujuran, dan kedewasaan Budi!',
      delay: 1200,
      nextNodeId: 'node_budi_relieved'
    },
    node_budi_relieved: {
      type: 'message',
      sender: 'npc',
      npcName: 'Budi Santoso',
      avatarSeed: 'Budi',
      text: 'Bro, Guru MTK barusan temui gue di sekolah dan memaafkan gue secara terbuka! Kepala Sekolah tetap mengizinkan gue ikut pemilihan besok karena menghargai integritas dan keberanian gue mengakui kesalahan. Makasih banyak atas nasihat hebat lo!',
      delay: 1400,
      nextNodeId: 'node_teacher_debrief_success'
    },
    node_teacher_debrief_success: {
      type: 'message',
      sender: 'npc',
      npcName: 'Pak Guru Informatika',
      avatarSeed: 'PakGuru',
      text: 'Bapak sangat kagum pada bimbinganmu ke Budi. Menghadapi jejak digital masa lalu dengan keberanian mengakui kesalahan dan bertanggung jawab adalah karakter pemimpin sejati. Internet mungkin tidak pernah lupa, namun manusia selalu bisa bertumbuh menjadi lebih mulia.',
      delay: 1400,
      nextNodeId: 'success_footprint'
    },
    success_footprint: {
      type: 'success',
      message: 'Kamu berhasil menyelamatkan masa depan Budi dengan teladan integritas dan akuntabilitas digital!',
      debriefCard: {
        status: 'BERHASIL SEMPURNA',
        stars: 3,
        topicTitle: 'Jejak Digital & Akuntabilitas Pemimpin',
        summary: 'Kamu membimbing rekanmu menghadapi konsekuensi rekam jejak digital secara bertanggung jawab, memulihkan reputasi melalui kejujuran.',
        keyTerms: [
          { term: 'Jejak Digital (Digital Footprint)', definition: 'Rekam jejak seluruh perkataan, unggahan, dan tindakan di internet yang menjadi bagian dari reputasi seumur hidup.' },
          { term: 'Akuntabilitas Digital', definition: 'Sikap berani mempertanggungjawabkan perbuatan di ruang maya dan berkomitmen menjadi pribadi yang lebih baik.' },
          { term: 'Kedewasaan Bermedia Sosial', definition: 'Kemampuan menyikapi kritik dan kesalahan masa lalu tanpa reaktif, melainkan dengan kerendahan hati dan perbaikan nyata.' }
        ],
        legalBasis: {
          law: 'UU ITE & Prinsip Etika Digital Nasional',
          description: 'Keberanian mengakui kekhilafan dan memulihkan nama baik melalui mekanisme damai mencerminkan kedewasaan berdemokrasi.'
        },
        moralMessage: 'Internet mencatat masa lalumu, namun integritas dan tanggung jawabmu hari ini yang menentukan masa depanmu.',
        pedagogicalObjectives: [
          'Menginternalisasi akuntabilitas digital: berani bertanggung jawab atas jejak perkataan di masa lalu.',
          'Memahami strategi pemulihan reputasi digital (reputation repair) secara etis, transparan, dan tulus.',
          'Menumbuhkan kepemimpinan digital santri yang menjunjung tinggi integritas moral.'
        ],
        whatIfScenarios: [
          {
            choiceTitle: 'Jika Berbohong Mengaku Akun Diretas',
            description: 'Mencoba lepas tangan dari kesalahan lama dengan menyalahkan pihak lain.',
            outcomeSummary: 'Audit forensik membongkar alibi palsu, diskualifikasi tidak hormat, reputasi runtuh.',
            riskLevel: 'Kritis'
          },
          {
            choiceTitle: 'Jika Membalas Menyerang & Membuka Aib Lawan',
            description: 'Memperkeruh keadaan dengan saling menjatuhkan di ranah publik.',
            outcomeSummary: 'Konflik horizontal yang merusak nama baik sekolah dan merugikan kedua belah pihak.',
            riskLevel: 'Kritis'
          },
          {
            choiceTitle: 'Pilihanmu: Video Klarifikasi Tulus & Tanggung Jawab',
            description: 'Mengakui kesalahan masa lalu, meminta maaf terbuka, dan membuktikan perubahan positif.',
            outcomeSummary: 'Dimaafkan oleh pihak sekolah, mendapat simpati luas, dan terpilih dengan penuh integritas.',
            riskLevel: 'Aman'
          }
        ]
      }
    }
  }
};
