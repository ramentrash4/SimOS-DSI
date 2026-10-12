import type { MissionScript } from '@/types/mission';

export const mission4: MissionScript = {
  id: 'm4',
  title: 'Level 4: Kurir Misterius',
  description: 'Waspadai modus penipuan berkedok pengiriman paket kurir yang menyebarkan malware penyadap data perbankan.',
  category: 'Keamanan Data & Malware Phishing',
  difficulty: 'Tantangan',
  channelName: '+62 821-9944-1209 (Kurir Paket)',
  isGroup: false,
  avatarSeed: 'UnknownCourier',
  startNodeId: 'node_intro',
  nodes: {
    node_intro: {
      type: 'message',
      sender: 'npc',
      npcName: 'Nomor Tidak Dikenal',
      avatarSeed: 'UnknownCourier',
      text: 'Halo kak, ini kurir ekspedisi. Ada paket COD atas nama Anda tapi nomor rumah dan alamatnya kepotong tinta printer.\n\nTolong cek foto resinya di bawah ini benar alamat kakak atau bukan ya.',
      delay: 1000,
      nextNodeId: 'node_courier_apk'
    },
    node_courier_apk: {
      type: 'message',
      sender: 'npc',
      npcName: 'Nomor Tidak Dikenal',
      avatarSeed: 'UnknownCourier',
      text: 'Silakan diunduh foto resi paketnya:',
      attachment: {
        type: 'apk',
        fileName: 'Foto_Resi_Paket.APK',
        fileSize: '4.8 MB'
      },
      delay: 1200,
      nextNodeId: 'node_choice_1'
    },
    node_choice_1: {
      type: 'choice',
      prompt: 'Ada file lampiran .APK mencurigakan. Apa tindakanmu?',
      options: [
        {
          text: 'Langsung klik unduh dan pasang filenya karena penasaran paket apa yang datang.',
          points: 0,
          nextNodeId: 'download_apk_fatal'
        },
        {
          text: 'Tanya balik: "Paket apa ya pak? Saya tidak merasa pesan barang COD."',
          points: 1,
          nextNodeId: 'node_courier_threat'
        },
        {
          text: 'Jeda Kritis: Sadar ekstensi .APK adalah aplikasi berbahaya (bukan .JPG). Langsung tolak dan blokir nomor!',
          points: 3,
          nextNodeId: 'node_block_courier_safe'
        }
      ]
    },

    // Branch 1: Fatal Download APK
    download_apk_fatal: {
      type: 'message',
      sender: 'system',
      text: '[SYSTEM_ACTION:glitch:2] [SYSTEM_ACTION:shake] ⚠️ SISTEM: File Foto_Resi_Paket.APK terpasang! Izin pembacaan SMS dan kontak disadap secara otomatis!',
      delay: 1200,
      nextNodeId: 'node_sms_otp_stolen'
    },
    node_sms_otp_stolen: {
      type: 'message',
      sender: 'system',
      text: '[SYSTEM_ACTION:sms:BANK_ALERT:Kode OTP e-Wallet Anda adalah 4812. JANGAN BERIKAN KE SIAPAPUN!] [SYSTEM_ACTION:shake] 📩 Notifikasi SMS Masuk: Kode OTP Rekening Anda disadap!',
      delay: 3000,
      nextNodeId: 'node_sms_drain_money'
    },
    node_sms_drain_money: {
      type: 'message',
      sender: 'system',
      text: '[SYSTEM_ACTION:sms:BANK_ALERT:Transfer BERHASIL. Saldo Rp 500.000 telah dikirim ke Rekening Penampung!] 💸 PERINGATAN: Saldo tabungan Anda telah terkuras habis oleh malware!',
      delay: 3500,
      nextNodeId: 'node_teacher_debrief_fail'
    },
    node_teacher_debrief_fail: {
      type: 'message',
      sender: 'npc',
      npcName: 'Pak Guru Informatika',
      avatarSeed: 'PakGuru',
      text: 'Bapak baru saja menerima laporan bahwa saldomu terkuras akibat malware. File berekstensi .APK adalah sebuah aplikasi yang dapat mengeksekusi skrip pencuri SMS dan OTP, bukan dokumen foto (.JPG). Penipu memanfaatkan rasa penasaranmu.',
      delay: 1400,
      nextNodeId: 'gameover_malware'
    },
    gameover_malware: {
      type: 'gameover',
      reason: 'Perangkat terinfeksi malware Trojan penyadap SMS, saldo tabungan terkuras Rp 500.000.',
      debriefCard: {
        status: 'GAGAL',
        stars: 1,
        topicTitle: 'Malware Trojan & Pencurian Data (Sniffer APK)',
        summary: 'Kamu mengunduh dan memasang aplikasi (.APK) dari nomor asing. Malware tersebut menyadap kode OTP perbankan dan menguras tabunganmu.',
        keyTerms: [
          { term: 'Trojan APK Sniffer', definition: 'Aplikasi jahat yang menyamar sebagai file dokumen/foto resi untuk mencuri izin SMS dan menyadap OTP.' },
          { term: 'Ekstensi File (.APK vs .JPG)', definition: 'File foto asli berakhiran .jpg / .png, sedangkan .apk adalah paket aplikasi Android yang dapat mengeksekusi kode perusak.' },
          { term: 'One-Time Password (OTP)', definition: 'Kode sandi sekali pakai untuk autentikasi transaksi yang wajib dirahasiakan dan tidak boleh disadap.' }
        ],
        legalBasis: {
          law: 'UU ITE Pasal 30 & Pasal 32 (Akses Ilegal)',
          description: 'Mengakses dan menyadap sistem komputer orang lain tanpa hak merupakan tindak pidana siber dengan ancaman penjara hingga 8 tahun.'
        },
        moralMessage: 'Jangan sembarang instal aplikasi dari luar toko resmi. Kejelian melihat ekstensi file adalah pelindung utama rekeningmu.',
        pedagogicalObjectives: [
          'Memahami cara kerja malware Trojan Android berkedok resi paket kurir (.APK).',
          'Mengenal mekanisme penyadapan izin SMS (RECEIVE_SMS) untuk mencuri kode One-Time Password (OTP).',
          'Melatih ketenangan dalam menghadapi manipulasi psikologis rasa panik (Social Engineering intimidasi denda).'
        ],
        whatIfScenarios: [
          {
            choiceTitle: 'Mengunduh dan Memasang File .APK Resi',
            description: 'Kamu penasaran dengan isi paket dan mengklik instalasi aplikasi dari WhatsApp.',
            outcomeSummary: 'Malware mengambil alih izin SMS, OTP m-Banking disadap penyerang, dan saldo Rp 500.000 terkuras ludes.',
            riskLevel: 'Kritis'
          },
          {
            choiceTitle: 'Panik Saat Diancam Denda Retur Rp 200.000',
            description: 'Penipu menggertak dengan denda pembatalan dan kamu tergesa-gesa menurutinya.',
            outcomeSummary: 'Jatuh ke dalam jebakan manipulasi psikologis dan mengorbankan keamanan perangkat.',
            riskLevel: 'Kritis'
          },
          {
            choiceTitle: 'Menganalisis Ekstensi File & Memblokir Nomor',
            description: 'Kamu menyadari file foto tidak pernah berakhiran .APK dan langsung memblokir nomor penipu.',
            outcomeSummary: 'Perangkat dan saldo perbankan 100% aman, skema penipuan siber berhasil digagalkan total.',
            riskLevel: 'Aman'
          }
        ]
      }
    },

    // Branch 2: Asking the courier
    node_courier_threat: {
      type: 'message',
      sender: 'npc',
      npcName: 'Nomor Tidak Dikenal',
      avatarSeed: 'UnknownCourier',
      text: 'Ini pesanan barang elektronik kak! Kalau kakak tidak mau unduh resinya dan verifikasi alamat sekarang, paket akan kami retur dan kakak kena DENDA PEMBATALAN Rp 200.000!',
      delay: 1200,
      nextNodeId: 'node_choice_threat'
    },
    node_choice_threat: {
      type: 'choice',
      prompt: 'Penipu mulai mengancam denda retur. Apa responmu?',
      options: [
        {
          text: 'Takut kena denda... Akhirnya menekan dan mengunduh file APK tersebut.',
          points: 0,
          nextNodeId: 'download_apk_fatal'
        },
        {
          text: 'Sadar ini manipulasi Social Engineering! Gertakan denda adalah trik penipu. Blokir nomornya sekarang juga!',
          points: 3,
          nextNodeId: 'node_block_courier_safe'
        }
      ]
    },

    // Branch 3: Safe Block & Jeda Kritis (Perfect Ending)
    node_block_courier_safe: {
      type: 'message',
      sender: 'player',
      text: 'Jangan coba-coba menipu ya! File resi foto itu ekstensi .JPG, bukan aplikasi .APK! Nomor Anda saya laporkan dan blokir sekarang juga.',
      delay: 800,
      nextNodeId: 'node_system_blocked'
    },
    node_system_blocked: {
      type: 'message',
      sender: 'system',
      text: '🛡️ Nomor +62 821-9944-1209 berhasil DIBLOKIR. File berbahaya tidak terpasang. Seluruh data pribadi dan saldo perbankan Anda 100% aman!',
      delay: 1100,
      nextNodeId: 'node_teacher_debrief_safe'
    },
    node_teacher_debrief_safe: {
      type: 'message',
      sender: 'npc',
      npcName: 'Pak Guru Informatika',
      avatarSeed: 'PakGuru',
      text: 'Kerja luar biasa! Kejelianmu mengenali jenis ekstensi file dan ketenanganmu menghadapi gertakan Social Engineering adalah tameng siber yang sangat tangguh. Kamu telah melindungi dirimu dari kejahatan finansial siber.',
      delay: 1300,
      nextNodeId: 'success_malware'
    },
    success_malware: {
      type: 'success',
      message: 'Kamu berhasil menggagalkan jebakan malware dan mengamankan data pribadimu!',
      debriefCard: {
        status: 'BERHASIL SEMPURNA',
        stars: 3,
        topicTitle: 'Keamanan Data Pribadi & Pertahanan Malware',
        summary: 'Kamu cermat mengidentifikasi ekstensi file palsu dan tidak terpancing oleh manipulasi psikologis penipu.',
        keyTerms: [
          { term: 'Jeda Kritis Siber', definition: 'Tidak panik saat digertak denda dan menganalisis secara logis format file yang dikirimkan.' },
          { term: 'Rekayasa Sosial (Social Engineering)', definition: 'Taktik penipu menciptakan rasa panik atau takut agar korban bertindak ceroboh tanpa berpikir.' },
          { term: 'Hygiene Perangkat Digital', definition: 'Kebiasaan hanya menginstal aplikasi resmi dari Google Play / App Store dan memblokir nomor mencurigakan.' }
        ],
        legalBasis: {
          law: 'UU Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022)',
          description: 'Menjaga keamanan data kredensial pribadi dan perangkat dari akses ilegal pihak luar adalah hak dan kewajiban setiap warga digital.'
        },
        moralMessage: 'Kecermatan adalah antivirus terbaik. Kenali ekstensi file sebelum mengklik tautan apapun.',
        pedagogicalObjectives: [
          'Mampu membedakan ekstensi file media (.jpg/.png) dengan file instalasi eksekutabel (.apk).',
          'Menguasai tindakan mitigasi primer: menolak instalasi sideloading dari luar toko aplikasi resmi.',
          'Menerapkan pertahanan diri menghadapi manipulasi urgensi dan intimidasi penipu.'
        ],
        whatIfScenarios: [
          {
            choiceTitle: 'Jika Mengklik File APK Karena Penasaran',
            description: 'Kamu penasaran siapa pengirim paket lalu memasang aplikasinya.',
            outcomeSummary: 'Trojan menyadap SMS secara diam-diam, mengambil OTP m-banking, dan menguras saldo rekening.',
            riskLevel: 'Kritis'
          },
          {
            choiceTitle: 'Jika Membayar Denda Retur Rp 200.000',
            description: 'Kamu panik saat diancam denda pembatalan dan memilih mentransfer uang.',
            outcomeSummary: 'Kehilangan uang tunai akibat manipulasi psikologis penipuan kurir fiktif.',
            riskLevel: 'Kritis'
          },
          {
            choiceTitle: 'Pilihanmu: Membongkar Modus & Blokir Nomor',
            description: 'Kamu teliti melihat nama file berakhiran .APK, menegur penipu, dan memutus kontak.',
            outcomeSummary: 'Data pribadi dan rekening terlindungi 100%, kamu menjadi teladan literasi keamanan siber.',
            riskLevel: 'Aman'
          }
        ]
      }
    }
  }
};
