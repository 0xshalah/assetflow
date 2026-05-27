import type { InfobarContent } from '@/components/ui/infobar';

export const inventoryInfoContent: InfobarContent = {
  title: 'Inventory Management',
  sections: [
    {
      title: 'Overview',
      description:
        'Kelola daftar barang dan aset perusahaan. Tambah, edit, atau hapus item dari inventaris.',
      links: []
    }
  ]
};

export const loansInfoContent: InfobarContent = {
  title: 'Loan Tracking',
  sections: [
    {
      title: 'Overview',
      description:
        'Pantau peminjaman dan pengembalian barang. Catat peminjaman baru dan tandai barang yang sudah dikembalikan.',
      links: []
    }
  ]
};
