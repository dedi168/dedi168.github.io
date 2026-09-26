// ==========================================
// 1. MASTER DATA BARANG & JASA
// ==========================================
const masterBarang = [
    { nama: "CCTV INDOOR EZVIZ H6C PRO 2K/3MP", harga: 490000 },
    { nama: "CCTV INDOOR EZVIZ TY1 1080P", harga: 470000 },
    { nama: "CCTV INDOOR EZVIZ C6N 1080P", harga: 470000 },
    { nama: "CCTV OUTDOOR EZVIZ H8C 1080P", harga: 735000 },
    { nama: "CCTV OUTDOOR EZVIZ H8C COLOR", harga: 750000 },
    { nama: "CCTV INDOOR EZVIZ H1C", harga: 835000 },
    { nama: "CCTV INDOOR EZVIZ H6 3K", harga: 835000 },
    { nama: "ACOME APC01 INDOOR 3MP", harga: 405000 },
    { nama: "ACOME APC06 DUAL LENS", harga: 535000 },
    { nama: "ACOME APC62 DUAL LENS PTZ", harga: 514000 },
    { nama: "ACOME APC72 OUTDOOR", harga: 413000 },
    { nama: "ACOME APC9S", harga: 370000 },
    { nama: "ACOME WEBCAM AWC12", harga: 415000 },
    { nama: "INDOOR HILOOK IPC-T221H", harga: 555000 },
    { nama: "HILOOK THC-B120", harga: 339000 },
    { nama: "OUTDOOR HILOOK THC-B127-P", harga: 340000 },
    { nama: "INDOOR HILOOK THC-T127-P", harga: 320000 },
    { nama: "DVR HILOOK DVR-204G-F1(S)", harga: 590000 },
    { nama: "DVR HILOOK DVR-208G-M1/T", harga: 1060000 },
    { nama: "DVR HILOOK DVR-216G-M1/T", harga: 1866000 },
    { nama: "HDD CCTV WD PURPLE 2TB", harga: 3000000 },
    { nama: "RUIJIE RG-EW1200G PRO", harga: 658000 },
    { nama: "RUIJIE RG-EW1200", harga: 450000 },
    { nama: "RUIJIE RG-EW1300G", harga: 585000 },
    { nama: "RUIJIE RG-EW300N", harga: 290000 },
    { nama: "TP-LINK ROUTER TL-WR840N", harga: 240000 },
    { nama: "TENDA F3 4 IN 1 ROUTER", harga: 250000 },
    { nama: "KABEL UTP CAT6 ECERAN METERAN", harga: 8500 },
    { nama: "KABEL FTP SPECTRA OUTDOOR METERAN", harga: 4500 },
    { nama: "JASA INSTALASI CCTV PER TITIK", harga: 150000 },
    { nama: "JASA SETTING NVR DAN REMOTE SMARTPHONE", harga: 300000 },
    { nama: "JASA TARIK KABEL LAN DAN PENATAAN RACK", harga: 120000 },
    { nama: "JASA INSTALASI DAN SETTING ACCESS DOOR", harga: 500000 },
    { nama: "JASA INSTALASI BOX MCB", harga: 150000 },
    { nama: "MICRO SD CARD 32GB CLASS 10", harga: 173000 },
    { nama: "MICRO SD CARD 64GB CLASS 10", harga: 237000 },
    { nama: "KABEL POWER", harga: 7000 },
    { nama: "DURADUS", harga: 15000 },
    { nama: "KLEM 6MM", harga: 6500 },
    { nama: "KLEM 10MM", harga: 12500 },
    { nama: "KABEL TIES 3.6X250", harga: 26000 },
    { nama: "AKSESORIS CCTV(KABEL 5M, DURADUS, KLEM, DLL)", harga: 100000 }
];

// ==========================================
// 2. STATE APLIKASI
// ==========================================
let daftarBarang = [];
let modeAktif = 'pos';
let nomorDokumenOtomatis = '';
const URL_GOOGLE_SHEETS = "https://script.google.com/macros/s/AKfycbzpugAh-yVb75hGLuISIjb_GJa3HPL9ut5yXJy8ZEfAKFIbUAwOaIFfmvqhA-sKg4f_kA/exec";

// ==========================================
// 3. INISIALISASI
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    muatMasterBarang();
    setTanggal();
    generateNoDokumen();
    switchMode('pos');
});

// ==========================================
// 4. HELPER & UTILITIES
// ==========================================
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID').format(angka || 0);
}

function handleEnter(event) {
    if (event.key === 'Enter') tambahBarang();
}

function setTanggal() {
    const skrg = new Date();
    const tglLengkap = skrg.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const elDocTgl = document.getElementById('docTanggalSurat');
    if (elDocTgl) elDocTgl.innerText = tglLengkap;

    const tglJam = String(skrg.getDate()).padStart(2, '0') + '.' +
        String(skrg.getMonth() + 1).padStart(2, '0') + '.' +
        String(skrg.getFullYear()).slice(-2) + ' ' +
        String(skrg.getHours()).padStart(2, '0') + ':' +
        String(skrg.getMinutes()).padStart(2, '0');

    const elPosTgl = document.getElementById('posNotaTgl');
    if (elPosTgl) elPosTgl.innerText = tglJam;

    const jatuhTempoDate = new Date();
    jatuhTempoDate.setDate(skrg.getDate() + 7);
    const elJatuhTempo = document.getElementById('tglJatuhTempo');
    if (elJatuhTempo) elJatuhTempo.valueAsDate = jatuhTempoDate;
}

function generateNoDokumen() {
    const skrg = new Date();
    const thn = skrg.getFullYear();
    const bln = String(skrg.getMonth() + 1).padStart(2, '0');
    const tgl = String(skrg.getDate()).padStart(2, '0');

    let prefix = "TRX";
    let keyCounter = "counter_pos";
    if (modeAktif === 'invoice') {
        prefix = "INV";
        keyCounter = "counter_invoice";
    } else if (modeAktif === 'penawaran') {
        prefix = "OFF";
        keyCounter = "counter_penawaran";
    }

    let nomorUrut = parseInt(localStorage.getItem(keyCounter)) || 1;
    const nomorFormatted = String(nomorUrut).padStart(4, '0');

    nomorDokumenOtomatis = `${prefix}-${nomorFormatted}/${tgl}/${bln}/${thn}`;

    const elPosNo = document.getElementById('posNoDokumen');
    const elDocNo = document.getElementById('docNomorSurat');
    if (elPosNo) elPosNo.innerText = nomorDokumenOtomatis;
    if (elDocNo) elDocNo.innerText = nomorDokumenOtomatis;
}

function ambilRiwayatTransaksi() {
    return JSON.parse(localStorage.getItem('riwayat_transaksi')) || [];
}

// ==========================================
// 5. NAVIGASI TAB & SWITCH MODE
// ==========================================
function switchMode(mode) {
    modeAktif = mode;

    const tabs = {
        pos: document.getElementById('tabPos'),
        invoice: document.getElementById('tabInvoice'),
        penawaran: document.getElementById('tabPenawaran')
    };

    Object.keys(tabs).forEach(key => {
        if (tabs[key]) {
            if (key === mode) {
                tabs[key].className = "tab-btn flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all duration-200 bg-indigo-600 text-white shadow-sm";
            } else {
                tabs[key].className = "tab-btn flex-1 py-2.5 px-3 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200";
            }
        }
    });

    const sectionKlien = document.getElementById('sectionKlien');
    const sectionPembayaran = document.getElementById('sectionPembayaran');
    const previewStrukPos = document.getElementById('previewStrukPos');
    const previewSurat = document.getElementById('previewSurat');

    const groupJatuhTempo = document.getElementById('groupJatuhTempo');
    const groupMasaBerlaku = document.getElementById('groupMasaBerlaku');
    const btnCetak = document.getElementById('btnCetak');

    if (mode === 'pos') {
        if (sectionKlien) sectionKlien.classList.add('hidden');
        if (sectionPembayaran) sectionPembayaran.classList.remove('hidden');
        if (previewStrukPos) previewStrukPos.classList.remove('hidden');
        if (previewSurat) previewSurat.classList.add('hidden');
        if (btnCetak) {
            const spanBtn = btnCetak.querySelector('span');
            if (spanBtn) spanBtn.innerText = "Cetak Struk Nota";
        }
    } else {
        if (sectionKlien) sectionKlien.classList.remove('hidden');
        if (sectionPembayaran) sectionPembayaran.classList.add('hidden');
        if (previewStrukPos) previewStrukPos.classList.add('hidden');
        if (previewSurat) previewSurat.classList.remove('hidden');

        const perihalInput = document.getElementById('perihalDokumen');
        if (mode === 'invoice') {
            if (groupJatuhTempo) groupJatuhTempo.classList.remove('hidden');
            if (groupMasaBerlaku) groupMasaBerlaku.classList.add('hidden');
            if (btnCetak) {
                const spanBtn = btnCetak.querySelector('span');
                if (spanBtn) spanBtn.innerText = "Cetak Dokumen Invoice";
            }
            if (perihalInput) perihalInput.value = "Tagihan Pembayaran (Invoice) Pengadaan / Jasa";
        } else {
            if (groupJatuhTempo) groupJatuhTempo.classList.add('hidden');
            if (groupMasaBerlaku) groupMasaBerlaku.classList.remove('hidden');
            if (btnCetak) {
                const spanBtn = btnCetak.querySelector('span');
                if (spanBtn) spanBtn.innerText = "Cetak Dokumen Penawaran";
            }
            if (perihalInput) perihalInput.value = "Penawaran Harga Pengadaan & Jasa";
        }
    }

    generateNoDokumen();
    updateStruk();
}

// ==========================================
// 6. KELOLA BARANG (DATALIST & INPUT)
// ==========================================
function muatMasterBarang() {
    const datalist = document.getElementById('listBarang');
    if (!datalist) return;
    datalist.innerHTML = '';
    masterBarang.forEach(item => {
        const option = document.createElement('option');
        option.value = item.nama;
        option.label = `Rp ${formatRupiah(item.harga)}`;
        datalist.appendChild(option);
    });
}

function autoIsiHarga() {
    const elNama = document.getElementById('namaBarang');
    if (!elNama) return;
    const inputNama = elNama.value.trim().toUpperCase();
    const inputHarga = document.getElementById('hargaBarang');
    const barangDitemukan = masterBarang.find(item => item.nama === inputNama);
    if (inputHarga) {
        inputHarga.value = barangDitemukan ? barangDitemukan.harga : '';
    }
}

function tambahBarang() {
    const namaInput = document.getElementById('namaBarang');
    const qtyInput = document.getElementById('qtyBarang');
    const diskonInput = document.getElementById('diskonItem');

    if (!namaInput || !qtyInput || !diskonInput) return;

    const nama = namaInput.value.trim().toUpperCase();
    const qty = parseInt(qtyInput.value) || 0;
    const diskon = parseInt(diskonInput.value) || 0;

    const barangMaster = masterBarang.find(item => item.nama === nama);

    if (!barangMaster) {
        alert('Barang/Jasa tidak ditemukan di Master Data!');
        return;
    }

    if (qty <= 0) {
        alert('Jumlah Qty minimal 1');
        return;
    }

    const harga = barangMaster.harga;

    if (diskon >= harga) {
        alert('Diskon tidak boleh melebihi atau sama dengan harga barang!');
        return;
    }

    const indexEksis = daftarBarang.findIndex(item => item.nama === nama && item.diskon === diskon);

    if (indexEksis !== -1) {
        daftarBarang[indexEksis].qty += qty;
        daftarBarang[indexEksis].subtotal = (harga - diskon) * daftarBarang[indexEksis].qty;
        daftarBarang[indexEksis].totalDiskonItem = diskon * daftarBarang[indexEksis].qty;
    } else {
        const subtotal = (harga - diskon) * qty;
        const totalDiskonItem = diskon * qty;
        daftarBarang.push({ nama, harga, qty, diskon, subtotal, totalDiskonItem });
    }

    namaInput.value = '';
    const elHargaBarang = document.getElementById('hargaBarang');
    if (elHargaBarang) elHargaBarang.value = '';
    qtyInput.value = '1';
    diskonInput.value = '0';
    namaInput.focus();

    renderTabel();
    updateStruk();
}

function hapusBarang(index) {
    daftarBarang.splice(index, 1);
    renderTabel();
    updateStruk();
}

function renderTabel() {
    const tbody = document.getElementById('tabelBarang');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (daftarBarang.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="p-3 text-center text-slate-400 italic">Belum ada item ditambahkan</td></tr>`;
        return;
    }

    daftarBarang.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="p-2.5 font-medium text-slate-800">${item.nama}</td>
            <td class="p-2.5 text-center">${item.qty}</td>
            <td class="p-2.5 text-right">Rp ${formatRupiah(item.harga)}</td>
            <td class="p-2.5 text-right text-rose-500">Rp ${formatRupiah(item.diskon)}</td>
            <td class="p-2.5 text-right font-semibold text-slate-800">Rp ${formatRupiah(item.subtotal)}</td>
            <td class="p-2.5 text-center">
                <button onclick="hapusBarang(${index})" class="p-1 text-rose-600 hover:bg-rose-50 rounded transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================
// 7. REALTIME PREVIEW UPDATE
// ==========================================
function updateStruk() {
    const posDaftarBarang = document.getElementById('posDaftarBarang');
    const docTabelItems = document.getElementById('docTabelItems');

    if (posDaftarBarang) posDaftarBarang.innerHTML = '';
    if (docTabelItems) docTabelItems.innerHTML = '';

    let totalBelanja = 0;
    let totalItem = 0;
    let akumulasiDiskon = 0;

    if (daftarBarang.length === 0) {
        if (posDaftarBarang) posDaftarBarang.innerHTML = `<div class="text-center text-slate-400 italic py-2">Belum ada item ditambahkan</div>`;
        if (docTabelItems) docTabelItems.innerHTML = `<tr><td colspan="4" class="border border-slate-300 p-4 text-center text-slate-400 italic">Belum ada item ditambahkan</td></tr>`;
    } else {
        daftarBarang.forEach((item, index) => {
            totalBelanja += item.subtotal;
            totalItem += item.qty;
            akumulasiDiskon += item.totalDiskonItem;

            if (posDaftarBarang) {
                const divPos = document.createElement('div');
                divPos.className = "flex justify-between items-start text-xs text-slate-700";
                let infoDiskonText = item.diskon > 0 ? `<span class="text-[10px] text-rose-500 block">(Disc: -Rp ${formatRupiah(item.diskon)})</span>` : '';
                divPos.innerHTML = `
                    <div class="space-y-0.5">
                        <div class="font-medium text-slate-800">${item.nama}</div>
                        <div class="text-slate-500 text-[11px]">${item.qty} x Rp ${formatRupiah(item.harga - item.diskon)} ${infoDiskonText}</div>
                    </div>
                    <div class="font-semibold text-slate-800">Rp ${formatRupiah(item.subtotal)}</div>
                `;
                posDaftarBarang.appendChild(divPos);
            }

            if (docTabelItems) {
                const trDoc = document.createElement('tr');
                trDoc.innerHTML = `
                    <td class="border border-slate-300 p-2.5 text-center">${index + 1}</td>
                    <td class="border border-slate-300 p-2.5 font-medium">${item.nama}</td>
                    <td class="border border-slate-300 p-2.5 text-right font-semibold">Rp ${formatRupiah(item.subtotal)}</td>
                    <td class="border border-slate-300 p-2.5 text-center">${item.qty} Unit</td>
                `;
                docTabelItems.appendChild(trDoc);
            }
        });
    }

    const namaKlienVal = document.getElementById('namaKlien')?.value.trim() || 'Utan Boutique Hotel';
    const jabatanKlienVal = document.getElementById('jabatanKlien')?.value.trim() || 'Yth. Kepala Divisi IT';
    const alamatKlienVal = document.getElementById('alamatKlien')?.value.trim() || 'Jl. Guru Gatot 45, Bondowoso, Jawa Timur 69393';
    const perihalVal = document.getElementById('perihalDokumen')?.value.trim() || (modeAktif === 'invoice' ? 'Tagihan Pembayaran (Invoice)' : 'Penawaran Harga Pengadaan');

    const elDocJabatan = document.getElementById('docYthJabatan');
    const elDocNama = document.getElementById('docYthNama');
    const elDocAlamat = document.getElementById('docYthAlamat');
    const elDocPerihal = document.getElementById('docPerihalSurat');
    const elDocKlienBody = document.getElementById('docNamaKlienBody');
    const elDocKataKunci = document.getElementById('docKataKunci');

    if (elDocJabatan) elDocJabatan.innerText = jabatanKlienVal;
    if (elDocNama) elDocNama.innerText = namaKlienVal;
    if (elDocAlamat) elDocAlamat.innerText = alamatKlienVal;
    if (elDocPerihal) elDocPerihal.innerText = perihalVal;
    if (elDocKlienBody) elDocKlienBody.innerText = namaKlienVal;
    if (elDocKataKunci) elDocKataKunci.innerText = modeAktif === 'invoice' ? 'tagihan' : 'penawaran';

    const uangBayarInput = document.getElementById('uangBayar');
    const uangBayar = parseInt(uangBayarInput ? uangBayarInput.value : 0) || 0;
    const kembalian = uangBayar - totalBelanja;
    const statusKembalian = document.getElementById('statusKembalian');

    if (statusKembalian) {
        if (uangBayar === 0) {
            statusKembalian.innerText = "Rp 0";
            statusKembalian.className = "text-xs font-bold px-2.5 py-1 rounded-full bg-slate-200 text-slate-700";
        } else if (kembalian < 0) {
            statusKembalian.innerText = `Kurang Rp ${formatRupiah(Math.abs(kembalian))}`;
            statusKembalian.className = "text-xs font-bold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700";
        } else {
            statusKembalian.innerText = `Kembali Rp ${formatRupiah(kembalian)}`;
            statusKembalian.className = "text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700";
        }
    }

    const elItem = document.getElementById('posTotalItem');
    const elBelanja = document.getElementById('posTotalBelanja');
    const elTunai = document.getElementById('posTunai');
    const elKembali = document.getElementById('posKembali');

    if (elItem) elItem.innerText = totalItem;
    if (elBelanja) elBelanja.innerText = formatRupiah(totalBelanja);
    if (elTunai) elTunai.innerText = formatRupiah(uangBayar);
    if (elKembali) elKembali.innerText = formatRupiah(kembalian > 0 ? kembalian : 0);

    const namaPelangganInput = document.getElementById('namaPelangganPos')?.value.trim();
    const elPosPelanggan = document.getElementById('posNamaPelanggan');

    if (elPosPelanggan) {
        elPosPelanggan.innerText = namaPelangganInput || 'Umum';
    }
}

// ==========================================
// 8. FUNGSI TRANSAKSI, CETAK & RESET
// ==========================================
function cetakNota() {
    if (daftarBarang.length === 0) {
        alert('Daftar barang/jasa masih kosong!');
        return;
    }

    const totalBelanja = daftarBarang.reduce((sum, item) => sum + item.subtotal, 0);
    const statusBayarVal = document.getElementById('statusPembayaran')?.value || 'Lunas';
    const namaPelangganPos = document.getElementById('namaPelangganPos')?.value.trim() || 'Umum';

    const uangBayarInput = parseInt(document.getElementById('uangBayar')?.value) || 0;
    const hitungKembalian = uangBayarInput > 0 ? (uangBayarInput - totalBelanja) : 0;

    const dataTransaksi = {
        noDokumen: nomorDokumenOtomatis,
        mode: modeAktif,
        tanggal: new Date().toISOString(),
        items: [...daftarBarang],
        totalBelanja: totalBelanja,
        statusPembayaran: statusBayarVal,
        uangBayar: modeAktif === 'pos' ? uangBayarInput : totalBelanja,
        kembalian: modeAktif === 'pos' ? (hitungKembalian > 0 ? hitungKembalian : 0) : 0,
        pelanggan: modeAktif === 'pos' ? namaPelangganPos : '',
        klien: modeAktif !== 'pos' ? {
            nama: document.getElementById('namaKlien')?.value || '',
            jabatan: document.getElementById('jabatanKlien')?.value || '',
            alamat: document.getElementById('alamatKlien')?.value || ''
        } : null
    };

    simpanTransaksiKeStorage(dataTransaksi);
    window.print();
    resetFormSetelan();
}

function resetFormSetelan() {
    daftarBarang = [];
    const idsToReset = ['uangBayar', 'namaKlien', 'jabatanKlien', 'telpKlien', 'alamatKlien', 'namaPelangganPos'];
    idsToReset.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });

    generateNoDokumen();
    setTanggal();
    renderTabel();
    updateStruk();
}

function resetTransaksi() {
    if (!confirm("Apakah Anda yakin ingin mereset transaksi ini?")) return;
    resetFormSetelan();
}

// ==========================================
// 9. RIWAYAT TRANSAKSI & MODAL
// ==========================================
function bukaModalRiwayat() {
    const modal = document.getElementById('modalRiwayat');
    if (modal) {
        modal.classList.remove('hidden');
        renderRiwayat();
    }
}

function tutupModalRiwayat() {
    const modal = document.getElementById('modalRiwayat');
    if (modal) modal.classList.add('hidden');
}

function renderRiwayat() {
    const tbody = document.getElementById('tabelRiwayatBody');
    if (!tbody) return;

    const kataKunci = (document.getElementById('cariRiwayat')?.value || '').toLowerCase().trim();
    const filterMode = document.getElementById('filterMode')?.value || 'semua';
    const riwayat = JSON.parse(localStorage.getItem('riwayat_transaksi')) || [];

    tbody.innerHTML = '';

    const dataTersaring = riwayat.filter(item => {
        const noDok = String(item.noDokumen || '').toLowerCase();
        const namaPelangganKlien = item.mode === 'pos'
            ? String(item.pelanggan || 'Umum')
            : String(item.klien?.nama || '');

        const cocokKata = noDok.includes(kataKunci) || namaPelangganKlien.toLowerCase().includes(kataKunci);
        const cocokMode = filterMode === 'semua' || item.mode === filterMode;
        return cocokKata && cocokMode;
    });

    if (dataTersaring.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-slate-400 italic">Tidak ada data riwayat transaksi ditemukan.</td></tr>`;
        return;
    }

    dataTersaring.reverse().forEach((item, index) => {
        const indexAsli = riwayat.length - 1 - index;

        let tgl = '-';
        if (item.tanggal) {
            const d = new Date(item.tanggal);
            if (!isNaN(d.getTime())) {
                tgl = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
            }
        }

        let badgeClass = "bg-slate-100 text-slate-700";
        if (item.mode === 'invoice') badgeClass = "bg-amber-100 text-amber-700";
        if (item.mode === 'penawaran') badgeClass = "bg-indigo-100 text-indigo-700";

        const statusBayar = String(item.statusPembayaran || 'Lunas');
        let badgeStatus = "bg-emerald-100 text-emerald-800";
        if (statusBayar === 'Belum Lunas') {
            badgeStatus = "bg-rose-100 text-rose-800";
        } else if (statusBayar.includes('DP')) {
            badgeStatus = "bg-amber-100 text-amber-800";
        }

        const namaTampil = item.mode === 'pos'
            ? (item.pelanggan || 'Umum')
            : (item.klien?.nama || 'Umum');

        let totalAngka = Number(item.totalBelanja) || 0;
        if (totalAngka === 0 && Array.isArray(item.items)) {
            totalAngka = item.items.reduce((sum, i) => {
                const sub = Number(i.subtotal) || ((Number(i.harga || 0) - Number(i.diskon || 0)) * Number(i.qty || 1));
                return sum + sub;
            }, 0);
        }

        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50 transition border-b border-slate-100";
        tr.innerHTML = `
            <td class="p-3 font-semibold text-slate-800">${item.noDokumen || '-'}</td>
            <td class="p-3 text-slate-500">${tgl}</td>
            <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${badgeClass}">${item.mode || 'POS'}</span></td>
            <td class="p-3 text-slate-600">${namaTampil}</td>
            <td class="p-3 text-center">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${badgeStatus}">
                    ${statusBayar}
                </span>
            </td>
            <td class="p-3 text-right font-bold text-slate-800">Rp ${formatRupiah(totalAngka)}</td>
            <td class="p-3 text-center">
                <div class="flex items-center justify-center gap-1">
                    <button onclick="muatUlangTransaksi(${indexAsli})" title="Muat & Cetak Ulang" class="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>
                    <button onclick="hapusRiwayatItem(${indexAsli})" title="Hapus" class="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function muatUlangTransaksi(index) {
    const riwayat = JSON.parse(localStorage.getItem('riwayat_transaksi')) || [];
    const item = riwayat[index];
    if (!item) return;

    daftarBarang = [...(item.items || [])];
    switchMode(item.mode);

    nomorDokumenOtomatis = item.noDokumen;
    const elPosNo = document.getElementById('posNoDokumen');
    const elDocNo = document.getElementById('docNomorSurat');
    if (elPosNo) elPosNo.innerText = nomorDokumenOtomatis;
    if (elDocNo) elDocNo.innerText = nomorDokumenOtomatis;

    if (item.klien) {
        const elNama = document.getElementById('namaKlien');
        const elJabatan = document.getElementById('jabatanKlien');
        const elAlamat = document.getElementById('alamatKlien');
        if (elNama) elNama.value = item.klien.nama || '';
        if (elJabatan) elJabatan.value = item.klien.jabatan || '';
        if (elAlamat) elAlamat.value = item.klien.alamat || '';
    }

    if (item.pelanggan) {
        const elPelanggan = document.getElementById('namaPelangganPos');
        if (elPelanggan) elPelanggan.value = item.pelanggan;
    }

    if (item.uangBayar) {
        const elUangBayar = document.getElementById('uangBayar');
        if (elUangBayar) elUangBayar.value = item.uangBayar;
    }

    renderTabel();
    updateStruk();
    tutupModalRiwayat();

    setTimeout(() => {
        window.print();
    }, 300);
}

function hapusRiwayatItem(index) {
    if (!confirm("Hapus transaksi ini dari riwayat?")) return;
    let riwayat = JSON.parse(localStorage.getItem('riwayat_transaksi')) || [];
    riwayat.splice(index, 1);
    localStorage.setItem('riwayat_transaksi', JSON.stringify(riwayat));
    renderRiwayat();
}

function hapusSemuaRiwayat() {
    if (!confirm("Apakah Anda yakin ingin menghapus SEMUA riwayat transaksi? Data tidak bisa dikembalikan.")) return;
    localStorage.removeItem('riwayat_transaksi');
    renderRiwayat();
}

// ==========================================
// 10. PENYIMPANAN LOCAL & GOOGLE SHEETS
// ==========================================
function simpanTransaksiKeStorage(dataTransaksi) {
    const elStatus = document.getElementById('statusProses');
    const btnCetak = document.getElementById('btnCetak');

    if (elStatus) {
        elStatus.style.display = 'inline';
        elStatus.innerText = 'Menyimpan...';
    }
    if (btnCetak) btnCetak.disabled = true;

    let riwayat = JSON.parse(localStorage.getItem('riwayat_transaksi')) || [];
    riwayat.push(dataTransaksi);
    localStorage.setItem('riwayat_transaksi', JSON.stringify(riwayat));

    let keyCounter = "counter_pos";
    if (modeAktif === 'invoice') keyCounter = "counter_invoice";
    if (modeAktif === 'penawaran') keyCounter = "counter_penawaran";

    let nomorUrut = parseInt(localStorage.getItem(keyCounter)) || 1;
    localStorage.setItem(keyCounter, nomorUrut + 1);

    const isValidUrl = URL_GOOGLE_SHEETS && URL_GOOGLE_SHEETS.startsWith("https://script.google.com");

    if (isValidUrl) {
        fetch(URL_GOOGLE_SHEETS, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataTransaksi)
        })
            .then(() => {
                console.log('Data transaksi berhasil dikirim ke Google Sheets');
                selesaiProsesUI('Berhasil disimpan!');
            })
            .catch(err => {
                console.error('Gagal mengirim ke Google Sheets:', err);
                selesaiProsesUI('Tersimpan secara lokal (Offline)');
            });
    } else {
        selesaiProsesUI('Tersimpan lokal (URL Sheet belum diisi)');
    }
}

function selesaiProsesUI(pesan) {
    const elStatus = document.getElementById('statusProses');
    const btnCetak = document.getElementById('btnCetak');

    if (elStatus) {
        elStatus.innerText = pesan;
        setTimeout(() => { elStatus.style.display = 'none'; }, 3000);
    }
    if (btnCetak) btnCetak.disabled = false;
}

// ==========================================
// 11. EKSPOR DATA KE EXCEL (CSV/XLS)
// ==========================================
function eksporRiwayatKeCSV() {
    const riwayat = JSON.parse(localStorage.getItem('riwayat_transaksi')) || [];

    if (riwayat.length === 0) {
        alert('Tidak ada data riwayat transaksi untuk diekspor!');
        return;
    }

    let excelContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
        <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        <!--[if gte mso 9]>
        <xml>
            <x:ExcelWorkbook>
                <x:ExcelWorksheets>
                    <x:ExcelWorksheet>
                        <x:Name>Riwayat Transaksi</x:Name>
                        <x:WorksheetOptions>
                            <x:DisplayGridlines/>
                        </x:WorksheetOptions>
                    </x:ExcelWorksheet>
                </x:ExcelWorksheets>
            </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
            th { background-color: #1e293b; color: #ffffff; font-weight: bold; text-align: center; height: 35px; }
            td { vertical-align: middle; }
            .str { mso-number-format:'\\@'; }
            .num { mso-number-format:'\\#,##0'; }
        </style>
    </head>
    <body>
        <table border="1" style="border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11pt;">
            <thead>
                <tr>
                    <th style="width: 220px;">No Dokumen</th>
                    <th style="width: 110px;">Tanggal</th>
                    <th style="width: 80px;">Jam</th>
                    <th style="width: 110px;">Jenis Dokumen</th>
                    <th style="width: 180px;">Nama Klien / Pelanggan</th>
                    <th style="width: 120px;">Status Bayar</th>
                    <th style="width: 350px;">Rincian Barang (Item x Qty @ Harga)</th>
                    <th style="width: 140px;">Total Belanja (Rp)</th>
                </tr>
            </thead>
            <tbody>
    `;

    riwayat.forEach(transaksi => {
        let tgl = '-';
        let jam = '-';
        if (transaksi.tanggal) {
            const objTgl = new Date(transaksi.tanggal);
            if (!isNaN(objTgl.getTime())) {
                tgl = `${String(objTgl.getDate()).padStart(2, '0')}/${String(objTgl.getMonth() + 1).padStart(2, '0')}/${objTgl.getFullYear()}`;
                jam = `${String(objTgl.getHours()).padStart(2, '0')}:${String(objTgl.getMinutes()).padStart(2, '0')}`;
            }
        }

        const mode = transaksi.mode ? transaksi.mode.toUpperCase() : 'POS';
        const namaKlien = transaksi.mode === 'pos'
            ? (transaksi.pelanggan || 'Umum')
            : (transaksi.klien?.nama || 'Umum');

        const statusBayar = transaksi.statusPembayaran || 'Lunas';

        const detailBarang = (transaksi.items || []).map(item => {
            const hargaBersih = (item.harga || 0) - (item.diskon || 0);
            return `${item.nama} (${item.qty}x @ Rp ${formatRupiah(hargaBersih)})`;
        }).join(" | ");

        let totalReal = Number(transaksi.totalBelanja) || 0;
        if (totalReal === 0 && Array.isArray(transaksi.items)) {
            totalReal = transaksi.items.reduce((sum, i) => {
                const sub = Number(i.subtotal) || ((Number(i.harga) - Number(i.diskon || 0)) * Number(i.qty));
                return sum + sub;
            }, 0);
        }

        excelContent += `
            <tr>
                <td class="str" align="left">${transaksi.noDokumen || '-'}</td>
                <td class="str" align="center">${tgl}</td>
                <td class="str" align="center">${jam}</td>
                <td align="center"><strong>${mode}</strong></td>
                <td>${namaKlien}</td>
                <td align="center">${statusBayar}</td>
                <td>${detailBarang || '-'}</td>
                <td class="num" align="right">${totalReal}</td>
            </tr>
        `;
    });

    excelContent += `
            </tbody>
        </table>
    </body>
    </html>
    `;

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const linkA = document.createElement("a");

    const skrg = new Date();
    const tglFile = `${skrg.getFullYear()}${String(skrg.getMonth() + 1).padStart(2, '0')}${String(skrg.getDate()).padStart(2, '0')}_${String(skrg.getHours()).padStart(2, '0')}${String(skrg.getMinutes()).padStart(2, '0')}`;

    linkA.setAttribute("href", url);
    linkA.setAttribute("download", `Riwayat_Transaksi_${tglFile}.xls`);
    document.body.appendChild(linkA);

    linkA.click();
    document.body.removeChild(linkA);
    URL.revokeObjectURL(url);
}

// ==========================================
// 12. SINKRONISASI APPS SCRIPT
// ==========================================
function muatDataDariAppsScript() {
    const elStatus = document.getElementById('statusProses');
    if (elStatus) {
        elStatus.style.display = 'inline';
        elStatus.innerText = 'Mengambil data dari Apps Script...';
    }

    fetch(URL_GOOGLE_SHEETS)
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data)) {
                localStorage.setItem('riwayat_transaksi', JSON.stringify(data));
                renderRiwayat();
                bukaModalRiwayat();
                selesaiProsesUI('Data berhasil diperbarui!');
            } else {
                selesaiProsesUI('Format data tidak sesuai.');
            }
        })
        .catch(err => {
            console.error('Gagal mengambil data dari Apps Script:', err);
            selesaiProsesUI('Gagal terhubung ke Apps Script');
        });
}
