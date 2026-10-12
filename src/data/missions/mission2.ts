import type { MissionScript } from '@/types/mission';

export const mission2: MissionScript = {
  id: 'm2',
  title: 'Level 2: Poster Pensi',
  description: 'Hadapi tenggat waktu kritis kepanitiaan pentas seni sekolah tanpa melanggar Hak Kekayaan Intelektual (HAKI) dan hak cipta.',
  category: 'HAKI & Plagiarisme',
  difficulty: 'Sedang',
  channelName: 'Panitia Inti Pensi SMA',
  isGroup: true,
  memberCount: 14,
  avatarSeed: 'PensiGroup',
  startNodeId: 'node_intro',
  nodes: {
    node_intro: {
      type: 'message',
      sender: 'npc',
      npcName: 'Rian (Ketua Panitia)',
      avatarSeed: 'Rian',
      text: 'Gawat banget teman-teman! Desainer kita tiba-tiba demam tinggi dan masuk RS. Sementara file poster pensi HARUS dikirim ke percetakan SEKARANG JUGA!',
      delay: 900,
      nextNodeId: 'node_rian_urgent'
    },
    node_rian_urgent: {
      type: 'message',
      sender: 'npc',
      npcName: 'Rian (Ketua Panitia)',
      avatarSeed: 'Rian',
      text: '[SYSTEM_ACTION:suggestApp:browser:Safari:Cari referensi "Maskot Rubah Pensi" di Web/Pinterest] Tolong buka Safari atau Pinterest sekarang, cariin gambar "Maskot Rubah" buat baliho pensi kita! Pilihin satu gambar yang pas terus kirim ke sini secepatnya ya, 10 menit lagi ditunggu vendor cetak!',
      delay: 1400,
      nextNodeId: 'node_choice_1'
    },
    node_choice_1: {
      type: 'choice',
      prompt: 'Bagaimana tindakanmu menghadapi permintaan mendesak Rian?',
      options: [
        {
          text: 'Oke Rian! Aku buka Safari sekarang buat cari bahan gambar maskot.',
          points: 1,
          nextNodeId: 'node_guide_browser'
        },
        {
          text: 'Hati-hati Rian! Jangan asal comot di Pinterest tanpa lisensi. Aku carikan gambar berlisensi legal di Safari.',
          points: 3,
          nextNodeId: 'node_guide_browser'
        },
        {
          text: 'Mending poster kita polos pakai tipografi tegas aja daripada risiko sengketa hak cipta!',
          points: 2,
          nextNodeId: 'node_plain_poster_partial'
        }
      ]
    },
    node_guide_browser: {
      type: 'message',
      sender: 'npc',
      npcName: 'Rian (Ketua Panitia)',
      avatarSeed: 'Rian',
      text: '[SYSTEM_ACTION:suggestApp:browser:Safari:Buka Safari & Pilih Gambar Maskot] Siap, buka aplikasi Safari di ponselmu sekarang ya! Bandingkan lisensi gambar yang kamu temukan, lalu ketuk tombol "Pilih Gambar Ini"!',
      delay: 1200,
      nextNodeId: null
    },

    // Branch 1: Steal from Pinterest (Fatal Bad Ending)
    node_steal_pinterest_fatal: {
      type: 'message',
      sender: 'player',
      text: 'Beres Rian! Aku tempel gambar dari Pinterest tadi. Posternya udah aku kirim ke percetakan dan diposting ke InstaPic sekolah ya!',
      delay: 800,
      nextNodeId: 'node_system_instapic_disaster'
    },
    node_system_instapic_disaster: {
      type: 'message',
      sender: 'system',
      text: '[SYSTEM_ACTION:openApp:instapic] [SYSTEM_ACTION:glitch:1] [SYSTEM_ACTION:shake] [SYSTEM_ACTION:banner:Rian (Panitia):Aduh kolom komentar InstaPic sekolah diserbu netizen!] 🚨 Notifikasi meledak! Postingan InstaPic sekolah diserbu netizen!',
      delay: 1100,
      nextNodeId: 'node_artist_callout'
    },
    node_artist_callout: {
      type: 'message',
      sender: 'npc',
      npcName: 'Bayu (Ilustrator Profesional)',
      avatarSeed: 'BayuArtist',
      text: 'HALO PANITIA SMA! Karya maskot rubah itu adalah aset komersial berhak cipta milik klien saya! Kalian mengambilnya tanpa izin dan memotong watermark saya! Saya akan bawa ini ke ranah hukum!',
      delay: 1400,
      nextNodeId: 'node_rian_panicking'
    },
    node_rian_panicking: {
      type: 'message',
      sender: 'npc',
      npcName: 'Rian (Ketua Panitia)',
      avatarSeed: 'Rian',
      text: 'Aduh gawat parah! Kolom komentar InstaPic sekolah kita dihujat ratusan netizen! Kepala Sekolah baru aja telepon marah besar!',
      delay: 1200,
      nextNodeId: 'node_teacher_debrief_fail'
    },
    node_teacher_debrief_fail: {
      type: 'message',
      sender: 'npc',
      npcName: 'Pak Guru Informatika',
      avatarSeed: 'PakGuru',
      text: 'Bapak sangat kecewa melihat kegaduhan di media sosial sekolah kita. Mengambil karya ciptaan orang lain di internet tanpa lisensi resmi adalah pelanggaran berat Hak Cipta.',
      delay: 1300,
      nextNodeId: 'gameover_copyright'
    },
    gameover_copyright: {
      type: 'gameover',
      reason: 'Sekolah dilaporkan atas pelanggaran Hak Cipta (HAKI) dan dihujat publik di media sosial.',
      debriefCard: {
        status: 'GAGAL',
        stars: 1,
        topicTitle: 'Hak Kekayaan Intelektual (HAKI) & Plagiarisme',
        summary: 'Kamu mengambil karya ilustrasi berhak cipta di internet tanpa lisensi, memicu ancaman hukum dan merusak reputasi nama baik sekolah.',
        keyTerms: [
          { term: 'Hak Cipta (Copyright)', definition: 'Hak eksklusif bagi pencipta untuk mengumumkan atau memperbanyak ciptaannya secara sah.' },
          { term: 'Plagiarisme Visual', definition: 'Penggunaan karya grafis atau ilustrasi orang lain tanpa izin dan tanpa menyertakan atribusi sumber resmi.' },
          { term: 'Commercial License', definition: 'Izin penggunaan karya untuk kepentingan publikasi atau promosi yang mewajibkan pembayaran royalti.' }
        ],
        legalBasis: {
          law: 'UU No. 28 Tahun 2014 tentang Hak Cipta (Pasal 113)',
          description: 'Penggunaan karya ciptaan tanpa hak secara komersial dapat dipidana penjara hingga 4 tahun dan/atau denda maksimal Rp 1 Miliar.'
        },
        moralMessage: 'Karya orang lain di internet bukan barang gratisan. Hargai jerih payah seniman dengan mematuhi lisensi.',
        pedagogicalObjectives: [
          'Memahami konsep dasar Hak Kekayaan Intelektual (HAKI) dan hak cipta karya visual digital.',
          'Mengidentifikasi batasan hukum penggunaan gambar dari mesin pencari atau Pinterest untuk publikasi.',
          'Menyadari dampak hukum dan reputasi institusi akibat pencatutan karya seniman tanpa izin.'
        ],
        whatIfScenarios: [
          {
            choiceTitle: 'Mengunduh Gambar Pinterest & Menghapus Watermark',
            description: 'Kamu memotong watermark dan mempublikasikan gambar seniman untuk poster promosi pensi sekolah.',
            outcomeSummary: 'Seniman asli menuntut ganti rugi, kolom medsos sekolah diserbu hujatan, dan panitia terancam pidana UU Hak Cipta.',
            riskLevel: 'Kritis'
          },
          {
            choiceTitle: 'Menggunakan Poster Tipografi Polos',
            description: 'Kamu menolak plagiarisme namun tidak mencari alternatif aset grafis berlisensi gratis.',
            outcomeSummary: 'Aman dari gugatan hukum, tetapi poster terasa monoton dan minat penonton pensi berkurang.',
            riskLevel: 'Sedang'
          },
          {
            choiceTitle: 'Mencari Aset Berlisensi Creative Commons (CC-BY)',
            description: 'Kamu membuka repositori gambar legal terbuka dan menyertakan atribusi kepada pembuat karya asli.',
            outcomeSummary: 'Poster tampil memukau dan modern, legalitas 100% terjamin, dan panitia dipuji atas integritas digital.',
            riskLevel: 'Aman'
          }
        ]
      }
    },

    // Branch 2: Creative Commons (Perfect Ending)
    node_use_creative_commons: {
      type: 'message',
      sender: 'player',
      text: 'Ini Rian, aku udah nemu ilustrasi rubah gratis berlisensi Creative Commons (CC-BY) dari Unsplash/Freepik yang boleh dipakai gratis. Desainnya keren dan aman secara hukum!',
      delay: 1000,
      nextNodeId: 'node_rian_happy'
    },
    node_rian_happy: {
      type: 'message',
      sender: 'npc',
      npcName: 'Rian (Ketua Panitia)',
      avatarSeed: 'Rian',
      text: 'Mantap banget! Posternya rapi, vendor cetak udah jalan, dan kita posting ke InstaPic sekolah sekarang.',
      delay: 1000,
      nextNodeId: 'node_system_instapic_success'
    },
    node_system_instapic_success: {
      type: 'message',
      sender: 'system',
      text: '[SYSTEM_ACTION:openApp:instapic] [SYSTEM_ACTION:banner:Rian (Panitia):Poster sukses diposting! Komentar netizen pada memuji!] ✨ Postingan poster pensi resmi tayang di InstaPic sekolah dengan respon positif!',
      delay: 1500,
      nextNodeId: 'node_teacher_debrief_success'
    },
    node_teacher_debrief_success: {
      type: 'message',
      sender: 'npc',
      npcName: 'Pak Guru Informatika',
      avatarSeed: 'PakGuru',
      text: 'Bapak mendengar kamu bersikeras menggunakan aset gratis berlisensi Creative Commons di tengah kepanikan panitia. Keputusanmu sangat matang, profesional, dan mencerminkan etika digital yang luhur.',
      delay: 1300,
      nextNodeId: 'success_copyright'
    },
    success_copyright: {
      type: 'success',
      message: 'Poster Pensi legal, aman dari sengketa, dan sukses memukau penonton!',
      debriefCard: {
        status: 'BERHASIL SEMPURNA',
        stars: 3,
        topicTitle: 'HAKI & Lisensi Creative Commons',
        summary: 'Kamu teguh memegang prinsip etika digital dan berhasil memanfaatkan sumber daya terbuka berlisensi Creative Commons secara sah.',
        keyTerms: [
          { term: 'Creative Commons (CC)', definition: 'Sistem lisensi publik standar yang mengizinkan karya dibagikan dan digunakan secara legal sesuai ketentuan pencipta.' },
          { term: 'Atribusi (Attribution)', definition: 'Kewajiban mencantumkan nama pembuat karya asli sebagai bentuk pengakuan hak moral ciptaan.' },
          { term: 'Integritas Akademis', definition: 'Kejujuran dan tanggung jawab moral dalam menghasilkan karya publik tanpa jalan pintas ilegal.' }
        ],
        legalBasis: {
          law: 'UU Hak Cipta & Ketentuan Lisensi Terbuka',
          description: 'Pemanfaatan karya berlisensi Creative Commons mematuhi hukum hak cipta nasional dan internasional.'
        },
        moralMessage: 'Menghormati hak kekayaan intelektual orang lain adalah bukti kedewasaan dan integritas warganet sejati.',
        pedagogicalObjectives: [
          'Menguasai teknik pencarian aset grafis berlisensi terbuka (Creative Commons, CC0, Unsplash, Openverse).',
          'Menerapkan etika atribusi dan penyebutan kredit pencipta pada publikasi publik.',
          'Menjaga reputasi profesional institusi dari tuntutan hukum hak cipta.'
        ],
        whatIfScenarios: [
          {
            choiceTitle: 'Jika Mengambil Gambar Seniman dari Pinterest',
            description: 'Kamu memotong watermark dan mempublikasikan karya ilustrator berhak cipta tanpa izin.',
            outcomeSummary: 'Seniman melayangkan somasi terbuka di media sosial, citra panitia jatuh, dan sanksi pelanggaran UU Hak Cipta.',
            riskLevel: 'Kritis'
          },
          {
            choiceTitle: 'Jika Menggunakan Tipografi Polos Tanpa Ilustrasi',
            description: 'Kamu menolak plagiarisme tetapi tidak mencari aset alternatif terbuka.',
            outcomeSummary: 'Poster aman secara hukum, namun tampilan kurang atraktif dan target penjualan tiket pensi menurun.',
            riskLevel: 'Sedang'
          },
          {
            choiceTitle: 'Pilihanmu: Riset & Unduh Aset Creative Commons',
            description: 'Kamu membuka repositori gambar legal, memeriksa lisensi CC-BY, dan memberikan atribusi pantas.',
            outcomeSummary: 'Poster pensi sukses besar, legalitas terjamin 100%, dan kamu dipuji atas integritas berkarya.',
            riskLevel: 'Aman'
          }
        ]
      }
    },

    // Branch 3: Plain Poster (Partial Ending)
    node_plain_poster_partial: {
      type: 'message',
      sender: 'player',
      text: 'Aku gak mau ambil risiko hukum, Rian. Daripada comot karya orang, mending kita pakai desain tipografi warna solid yang tegas.',
      delay: 900,
      nextNodeId: 'node_rian_grumpy'
    },
    node_rian_grumpy: {
      type: 'message',
      sender: 'npc',
      npcName: 'Rian (Ketua Panitia)',
      avatarSeed: 'Rian',
      text: 'Yaah agak monoton sih posternya tanpa maskot rubah... tapi yaudahlah, yang penting aman dan masuk cetak tepat waktu.',
      delay: 1100,
      nextNodeId: 'node_teacher_debrief_partial'
    },
    node_teacher_debrief_partial: {
      type: 'message',
      sender: 'npc',
      npcName: 'Pak Guru Informatika',
      avatarSeed: 'PakGuru',
      text: 'Sikapmu menolak plagiarisme sudah benar. Namun di masa depan, kamu bisa mencari alternatif aset berlisensi Creative Commons agar desain tetap memikat tanpa melanggar hukum.',
      delay: 1300,
      nextNodeId: 'partial_copyright'
    },
    partial_copyright: {
      type: 'partial',
      message: 'Poster aman dari pelanggaran hukum, meski estetika kurang maksimal.',
      debriefCard: {
        status: 'BERHASIL PARSIAL',
        stars: 2,
        topicTitle: 'Penolakan Plagiarisme',
        summary: 'Kamu berhasil mencegah pelanggaran hak cipta di sekolah, namun belum memanfaatkan potensi aset legal bebas royalti.',
        keyTerms: [
          { term: 'Plagiarisme', definition: 'Mengambil karya orang lain tanpa izin.' },
          { term: 'Creative Commons', definition: 'Pilihan bijak untuk mendapatkan aset gratis berkualitas tanpa risiko hukum.' }
        ],
        legalBasis: {
          law: 'UU Hak Cipta No. 28 Tahun 2014',
          description: 'Mencegah penggunaan karya tanpa hak menyelamatkan sekolah dari sanksi hukum perdata/pidana.'
        },
        moralMessage: 'Katakan tidak pada pembajakan, dan pelajari cara menemukan aset legal di internet.',
        pedagogicalObjectives: [
          'Memahami risiko sengketa hukum pada pelanggaran hak cipta.',
          'Mengenal keberadaan lisensi Creative Commons untuk kebutuhan kreatif santri.'
        ],
        whatIfScenarios: [
          {
            choiceTitle: 'Mengambil Gambar Seniman Tanpa Izin',
            description: 'Mengabaikan hak cipta demi kepraktisan semata.',
            outcomeSummary: 'Ancaman pidana dan ganti rugi perdata pelanggaran hak cipta.',
            riskLevel: 'Kritis'
          },
          {
            choiceTitle: 'Pilihanmu: Memilih Tipografi Polos Tanpa Maskot',
            description: 'Memilih jalan aman tanpa pelanggaran hukum.',
            outcomeSummary: 'Bebas sengketa hukum, namun daya pikat promosi berkurang.',
            riskLevel: 'Sedang'
          },
          {
            choiceTitle: 'Mencari Aset Terbuka Berlisensi Creative Commons',
            description: 'Mencari gambar legal gratis dengan atribusi pantas.',
            outcomeSummary: 'Desain menarik sekaligus kepatuhan hukum sempurna.',
            riskLevel: 'Aman'
          }
        ]
      }
    }
  }
};
