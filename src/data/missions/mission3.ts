import type { MissionScript } from '@/types/mission';

export const mission3: MissionScript = {
  id: 'm3',
  title: 'Level 3: Bercanda atau Menyakiti?',
  description: 'Hadapi situasi perundungan siber (cyberbullying) dan body shaming di media sosial dengan empati dan tindakan nyata.',
  category: 'Cyberbullying & Empati Digital',
  difficulty: 'Sedang',
  channelName: 'Dinda (Teman Sebangku Siska)',
  isGroup: false,
  avatarSeed: 'Dinda',
  startNodeId: 'node_intro',
  nodes: {
    node_intro: {
      type: 'message',
      sender: 'npc',
      npcName: 'Dinda (Teman Sebangku Siska)',
      avatarSeed: 'Dinda',
      text: 'P, kamu udah buka InstaPic barusan belum? 😭',
      delay: 900,
      nextNodeId: 'node_explain_instapic'
    },
    node_explain_instapic: {
      type: 'message',
      sender: 'npc',
      npcName: 'Dinda (Teman Sebangku Siska)',
      avatarSeed: 'Dinda',
      text: '[SYSTEM_ACTION:suggestApp:instapic:InstaPic:@siska_aurora membagikan postingan baru • Maya dan 17 lainnya berkomentar] Siska baru upload foto belajar di perpus, terus Maya sama gengnya langsung nge-body shaming parah di kolom komentar! Bilang Siska dekil dan bikin ilfeel...',
      delay: 1500,
      nextNodeId: 'node_dinda_worried'
    },
    node_dinda_worried: {
      type: 'message',
      sender: 'npc',
      npcName: 'Dinda (Teman Sebangku Siska)',
      avatarSeed: 'Dinda',
      text: 'Siska pasti down banget liatnya, dia anaknya pendiam dan gampang kepikiran. Coba kamu cek postingan Siska di InstaPic deh!',
      delay: 1200,
      nextNodeId: 'node_wait_choice'
    },
    node_wait_choice: {
      type: 'choice',
      prompt: 'Bagaimana kamu merespons perundungan terhadap Siska?',
      options: [
        {
          text: 'Aku buka InstaPic sekarang buat laporkan komentar jahat Maya dan semangati Siska.',
          points: 3,
          nextNodeId: 'node_report_and_dm'
        },
        {
          text: 'Ah biarin aja Din, itu urusan mereka. Mending kita pura-pura gak lihat (Bystander).',
          points: 0,
          nextNodeId: 'node_bystander_fatal'
        },
        {
          text: 'Kurang ajar si Maya! Aku mau serang balik dan maki penampilannya di kolom komentar!',
          points: 2,
          nextNodeId: 'node_attack_back_partial'
        }
      ]
    },

    // Branch 1: Bystander / Mengabaikan (Bad Ending)
    node_bystander_fatal: {
      type: 'message',
      sender: 'system',
      text: 'Keesokan paginya di sekolah... Muncul notifikasi pesan dari teman sebangku Siska.',
      delay: 1000,
      nextNodeId: 'node_friend_dm_sad'
    },
    node_friend_dm_sad: {
      type: 'message',
      sender: 'npc',
      npcName: 'Dinda (Teman Sebangku Siska)',
      avatarSeed: 'Dinda',
      text: 'Kamu udah dengar kabar belum? Hari ini Siska gak masuk sekolah. Dia nangis terus dari semalam, trauma berat dan minta pindah sekolah karena komen jahat Maya kemarin. Gak ada satupun yang belain dia di kelas 😭',
      delay: 1400,
      nextNodeId: 'node_teacher_debrief_fail'
    },
    node_teacher_debrief_fail: {
      type: 'message',
      sender: 'npc',
      npcName: 'Pak Guru Informatika',
      avatarSeed: 'PakGuru',
      text: 'Bapak sangat sedih mendengar kondisi Siska. Menjadi penonton yang diam (Bystander Effect) saat temanmu dirundung di media sosial sama buruknya dengan ikut membully. Sikap apatis memperluas luka korban.',
      delay: 1400,
      nextNodeId: 'gameover_bully'
    },
    gameover_bully: {
      type: 'gameover',
      reason: 'Korban mengalami trauma psikologis akibat pembiaran perundungan siber (Bystander Effect).',
      debriefCard: {
        status: 'GAGAL',
        stars: 1,
        topicTitle: 'Cyberbullying & Bystander Effect',
        summary: 'Kamu memilih diam dan membiarkan perundungan terjadi di depan matamu. Sikap apatis memperparah trauma psikologis korban.',
        keyTerms: [
          { term: 'Cyberbullying', definition: 'Tindakan intimidasi, pelecehan, atau penghinaan yang dilakukan berulang melalui media digital.' },
          { term: 'Bystander Effect', definition: 'Fenomena psikologis di mana saksi mata memilih diam dan tidak menolong korban karena merasa itu bukan urusannya.' },
          { term: 'Dampak Psikologis', definition: 'Korban cyberbullying dapat mengalami depresi, kecemasan sosial, hingga trauma berkepanjangan.' }
        ],
        legalBasis: {
          law: 'UU ITE Pasal 27 Ayat (3) & Permendikbudristek No. 46/2023',
          description: 'Pencegahan dan Penanganan Kekerasan di Lingkungan Satuan Pendidikan mewajibkan seluruh warga sekolah aktif mencegah perundungan.'
        },
        moralMessage: 'Ketika ketidakadilan terjadi di hadapanmu, diam bukanlah netral, melainkan berpihak pada penindas.',
        pedagogicalObjectives: [
          'Mengenali bentuk-bentuk perundungan siber (Cyberbullying) dan dampaknya terhadap kesehatan mental remaja.',
          'Memahami bahaya fenomena Bystander Effect (sikap apatis saat menyaksikan pelecehan).',
          'Menumbuhkan kesadaran kolektif untuk menciptakan iklim digital yang aman, empatik, dan suportif.'
        ],
        whatIfScenarios: [
          {
            choiceTitle: 'Diam Saja dan Mengabaikan Komentar Jahat',
            description: 'Kamu memilih tidak peduli karena merasa bukan urusanmu, membiarkan Siska dihujat sendirian.',
            outcomeSummary: 'Siska mengalami trauma psikologis mendalam, mogok sekolah, dan merasa terasing tanpa pembelaan.',
            riskLevel: 'Kritis'
          },
          {
            choiceTitle: 'Menyerang Balik Maya dengan Hinaan Fisik',
            description: 'Kamu membela Siska secara impulsif dengan menghina balik bentuk wajah Maya di linimasa publik.',
            outcomeSummary: 'Memicu perang komentar (Flame War) massal dan meninggalkan jejak digital toksik permanen.',
            riskLevel: 'Sedang'
          },
          {
            choiceTitle: 'Melaporkan Komentar ke Sistem & Menyemangati Siska',
            description: 'Kamu menggunakan fitur Report resmi Instagram dan mengirim pesan privat yang hangat.',
            outcomeSummary: 'Komentar toksik dihapus sistem, mental korban terlindungi, dan kamu menjadi pelindung siber sejati.',
            riskLevel: 'Aman'
          }
        ]
      }
    },

    // Branch 2: Public Attack / Flame War (Partial Ending)
    node_attack_back_partial: {
      type: 'message',
      sender: 'player',
      text: 'Woy Maya lo jahat banget! Lo sendiri ngaca dong muka lo kayak gimana sok-sokan ngatain Siska!',
      delay: 900,
      nextNodeId: 'node_system_flame_war'
    },
    node_system_flame_war: {
      type: 'message',
      sender: 'system',
      text: '[SYSTEM_ACTION:glitch:1] [SYSTEM_ACTION:shake] 🔥 Terjadi perang komentar sengit antara kubumu dan kelompok Maya di linimasa publik! Notifikasi InstaPic jebol!',
      delay: 1200,
      nextNodeId: 'node_teacher_debrief_partial'
    },
    node_teacher_debrief_partial: {
      type: 'message',
      sender: 'npc',
      npcName: 'Pak Guru Informatika',
      avatarSeed: 'PakGuru',
      text: 'Niatmu membela Siska patut diapresiasi, namun menyerang balik dengan kata-kata kasar di ruang publik justru menciptakan jejak digital toksik dan memicu perkelahian massal di media sosial.',
      delay: 1300,
      nextNodeId: 'partial_bully'
    },
    partial_bully: {
      type: 'partial',
      message: 'Siska terselamatkan dari bully, namun menciptakan jejak digital kotor akibat adu mulut publik.',
      debriefCard: {
        status: 'BERHASIL PARSIAL',
        stars: 2,
        topicTitle: 'Eskalasi Konflik Digital (Flame War)',
        summary: 'Kamu berniat baik membela teman, namun cara membalas dengan ujaran kebencian di kolom komentar publik memperkeruh suasana.',
        keyTerms: [
          { term: 'Flame War', definition: 'Perdebatan sengit dan saling menghina antar pengguna internet di ruang publik digital.' },
          { term: 'Jejak Digital Toksik', definition: 'Komentar kasar yang kamu tinggalkan di internet tersimpan permanen dan dapat merugikan reputasimu.' }
        ],
        legalBasis: {
          law: 'UU ITE Pasal 27 Ayat (3) tentang Ujaran Kebencian & Penghinaan',
          description: 'Saling menghina di media sosial berisiko menyeret kedua belah pihak ke sanksi hukum pencemaran nama baik.'
        },
        moralMessage: 'Jangan memadamkan api dengan minyak tanah. Lawan kejahatan dengan ketenangan dan etika.',
        pedagogicalObjectives: [
          'Membedakan antara pembelaan korban yang solutif dengan agresi digital (Flame War).',
          'Menyadari bahwa saling menghina di ruang publik tetap melanggar UU ITE dan mencoreng jejak digital.'
        ],
        whatIfScenarios: [
          {
            choiceTitle: 'Pilihanmu: Membalas Hinaan Maya dengan Hinaan Fisik',
            description: 'Kamu melabrak Maya di depan publik kolom komentar.',
            outcomeSummary: 'Memicu perang komentar publik, mempermalukan nama sekolah, dan jejak digital negatif.',
            riskLevel: 'Sedang'
          },
          {
            choiceTitle: 'Membiarkan Begitu Saja Tanpa Membela',
            description: 'Memilih pura-pura tidak melihat perundungan.',
            outcomeSummary: 'Korban mengalami depresi dan merasa tidak punya teman yang peduli.',
            riskLevel: 'Kritis'
          },
          {
            choiceTitle: 'Laporkan Komentar & Kirim DM Empati',
            description: 'Melaporkan ke sistem moderasi dan menguatkan hati Siska via obrolan privat.',
            outcomeSummary: 'Masalah tuntas elegan tanpa kebisingan publik.',
            riskLevel: 'Aman'
          }
        ]
      }
    },

    // Branch 3: Report & Empathetic Private DM (Perfect Ending)
    node_report_and_dm: {
      type: 'message',
      sender: 'npc',
      npcName: 'Dinda (Teman Sebangku Siska)',
      avatarSeed: 'Dinda',
      text: '[SYSTEM_ACTION:suggestApp:instapic:InstaPic:Buka postingan Siska & Laporkan Komentar Maya] Betul banget! Buka aplikasi InstaPic sekarang, ketuk ikon titik tiga pada komentar jahat Maya dan pilih "Laporkan Komentar". Nanti kita semangati Siska secara pribadi ya!',
      delay: 1300,
      nextNodeId: null
    },
    node_dm_siska_start: {
      type: 'message',
      sender: 'player',
      text: 'Hai Siska, kamu gak usah dengerin omongan Maya ya. Kamu cantik apa adanya, dan postingan belajarmu menginspirasi banyak orang. Komentar Maya udah aku laporkan ke sistem kok. Tetap semangat ya!',
      delay: 1000,
      nextNodeId: 'node_siska_touching_reply'
    },
    node_siska_touching_reply: {
      type: 'message',
      sender: 'npc',
      npcName: 'Siska Aurora',
      avatarSeed: 'Siska',
      text: 'Ya ampun... Makasih banyak yaa 🥺❤️ Tadinya aku drop banget, nangis di kamar dan hampir mau hapus akun medsosku. Pesanmu bikin aku tenang dan ngerasa gak sendirian. Makasih udah jadi teman yang baik!',
      delay: 1300,
      nextNodeId: 'node_teacher_debrief_perfect'
    },
    node_teacher_debrief_perfect: {
      type: 'message',
      sender: 'npc',
      npcName: 'Pak Guru Informatika',
      avatarSeed: 'PakGuru',
      text: 'Bapak sangat bangga padamu! Menggunakan fitur pelaporan resmi dan memberikan dukungan moral secara privat adalah kombinasi tindakan paling cerdas dan berempati tinggi. Kamu adalah pelindung siber sejati.',
      delay: 1400,
      nextNodeId: 'success_bully'
    },
    success_bully: {
      type: 'success',
      message: 'Kamu berhasil menyelamatkan mental Siska tanpa memicu drama publik!',
      debriefCard: {
        status: 'BERHASIL SEMPURNA',
        stars: 3,
        topicTitle: 'Empati Digital & Pelaporan Bijak',
        summary: 'Kamu memanfaatkan fitur moderasi Report secara tepat dan memberikan perlindungan emosional langsung ke korban melalui komunikasi privat.',
        keyTerms: [
          { term: 'Empati Digital', definition: 'Kemampuan memahami dan merasakan perasaan orang lain di ruang virtual serta bertindak untuk membantu.' },
          { term: 'Fitur Report (Pelaporan)', definition: 'Mekanisme resmi platform untuk membersihkan konten pelecehan secara efektif tanpa memicu kegaduhan.' },
          { term: 'Dukungan Moral Privat', definition: 'Menghubungi korban secara empatik untuk memulihkan kepercayaan dirinya dan mencegah isolasi sosial.' }
        ],
        legalBasis: {
          law: 'Permendikbudristek No. 46 Tahun 2023 & UU ITE',
          description: 'Langkah aktif melindungi rekan dari kekerasan psikologis di dunia maya merupakan perwujudan Pelajar Pancasila yang berintegritas.'
        },
        moralMessage: 'Ketikamu bisa menjadi pisau atau perisai bagi mental orang lain. Terima kasih telah memilih menjadi perisai pelindung.',
        pedagogicalObjectives: [
          'Menguasai keterampilan Upstander (intervensi positif) saat melihat perundungan digital.',
          'Menggunakan mekanisme Report platform sebagai solusi moderasi yang efektif dan bersih.',
          'Mempraktikkan empati santri melalui pendampingan emosional di kanal privat.'
        ],
        whatIfScenarios: [
          {
            choiceTitle: 'Jika Ikut Menertawakan Komentar Maya',
            description: 'Kamu ikut menambahkan komentar ejekan bersama kelompok perundung.',
            outcomeSummary: 'Menjadi pelaku sekunder cyberbullying yang dapat dikenakan sanksi tata tertib sekolah dan hukum pidana.',
            riskLevel: 'Kritis'
          },
          {
            choiceTitle: 'Jika Melabrak Maya di Kolom Komentar',
            description: 'Menyerang balik secara emosional di ruang publik media sosial.',
            outcomeSummary: 'Memicu perdebatan panas (Flame War) yang mengotori jejak digitalmu sendiri.',
            riskLevel: 'Sedang'
          },
          {
            choiceTitle: 'Pilihanmu: Melaporkan Komentar & DM Hangat ke Siska',
            description: 'Menghapus racun digital melalui laporan resmi dan menguatkan mental sahabat.',
            outcomeSummary: 'Komentar terhapus, mental korban terlindungi, dan terhindar dari segala drama siber.',
            riskLevel: 'Aman'
          }
        ]
      }
    }
  }
};
