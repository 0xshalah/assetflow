import { itemCategoryValues } from '@/db/schema/items';

describe('items schema constants', () => {
  it('has exactly 3 category values', () => {
    expect(itemCategoryValues).toHaveLength(3);
  });

  it('contains lemari-c01', () => {
    expect(itemCategoryValues).toContain('lemari-c01');
  });

  it('contains lemari-c02', () => {
    expect(itemCategoryValues).toContain('lemari-c02');
  });

  it('contains lemari-c03', () => {
    expect(itemCategoryValues).toContain('lemari-c03');
  });

  it('is a readonly tuple', () => {
    // Verify it cannot contain unexpected values
    const asArray = [...itemCategoryValues];
    expect(asArray.every((v) => v.startsWith('lemari-c'))).toBe(true);
  });
});
