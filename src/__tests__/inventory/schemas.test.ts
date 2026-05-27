import { createItemSchema, updateItemSchema } from '@/features/inventory/schemas';

// ─── createItemSchema ────────────────────────────────────────────────────────

describe('createItemSchema', () => {
  const validData = {
    name: 'Pulpen Hitam',
    specification: 'Tinta gel, warna hitam',
    category: 'lemari-c01' as const,
    quantity: 10,
    unit: 'pcs',
    supplier: 'Toko ATK Maju',
    receivedAt: '2024-01-15T08:00:00.000Z'
  };

  it('accepts valid data', () => {
    const result = createItemSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('accepts all valid category values', () => {
    const categories = ['lemari-c01', 'lemari-c02', 'lemari-c03'] as const;
    for (const category of categories) {
      const result = createItemSchema.safeParse({ ...validData, category });
      expect(result.success).toBe(true);
    }
  });

  it('rejects missing name', () => {
    const result = createItemSchema.safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects name longer than 200 chars', () => {
    const result = createItemSchema.safeParse({ ...validData, name: 'a'.repeat(201) });
    expect(result.success).toBe(false);
  });

  it('rejects invalid category', () => {
    const result = createItemSchema.safeParse({ ...validData, category: 'lemari-c99' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toMatch(/Lemari C-01|Kategori/i);
    }
  });

  it('rejects quantity = 0', () => {
    const result = createItemSchema.safeParse({ ...validData, quantity: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects quantity = -1', () => {
    const result = createItemSchema.safeParse({ ...validData, quantity: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects quantity > 99999', () => {
    const result = createItemSchema.safeParse({ ...validData, quantity: 100000 });
    expect(result.success).toBe(false);
  });

  it('rejects non-integer quantity', () => {
    const result = createItemSchema.safeParse({ ...validData, quantity: 1.5 });
    expect(result.success).toBe(false);
  });

  it('rejects empty unit', () => {
    const result = createItemSchema.safeParse({ ...validData, unit: '' });
    expect(result.success).toBe(false);
  });

  it('rejects unit longer than 50 chars', () => {
    const result = createItemSchema.safeParse({ ...validData, unit: 'x'.repeat(51) });
    expect(result.success).toBe(false);
  });

  it('rejects empty supplier', () => {
    const result = createItemSchema.safeParse({ ...validData, supplier: '' });
    expect(result.success).toBe(false);
  });

  it('rejects supplier longer than 200 chars', () => {
    const result = createItemSchema.safeParse({ ...validData, supplier: 'a'.repeat(201) });
    expect(result.success).toBe(false);
  });

  it('rejects empty receivedAt', () => {
    const result = createItemSchema.safeParse({ ...validData, receivedAt: '' });
    expect(result.success).toBe(false);
  });

  it('rejects extra (unknown) keys due to strict()', () => {
    const result = createItemSchema.safeParse({ ...validData, extraField: 'hack' });
    expect(result.success).toBe(false);
  });

  it('trims whitespace from name', () => {
    const result = createItemSchema.safeParse({ ...validData, name: '  Pulpen  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Pulpen');
    }
  });

  it('defaults specification to empty string if not provided', () => {
    const { specification: _spec, ...rest } = validData;
    const result = createItemSchema.safeParse(rest);
    // Should succeed because specification has a default
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.specification).toBe('');
    }
  });

  it('rejects specification longer than 500 chars', () => {
    const result = createItemSchema.safeParse({ ...validData, specification: 'x'.repeat(501) });
    expect(result.success).toBe(false);
  });
});

// ─── updateItemSchema ────────────────────────────────────────────────────────

describe('updateItemSchema', () => {
  it('accepts empty object (all fields optional)', () => {
    const result = updateItemSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('accepts partial update with only name', () => {
    const result = updateItemSchema.safeParse({ name: 'Spidol Merah' });
    expect(result.success).toBe(true);
  });

  it('accepts partial update with only quantity', () => {
    const result = updateItemSchema.safeParse({ quantity: 50 });
    expect(result.success).toBe(true);
  });

  it('accepts quantity = 0 (depletion)', () => {
    const result = updateItemSchema.safeParse({ quantity: 0 });
    expect(result.success).toBe(true);
  });

  it('rejects invalid category on update', () => {
    const result = updateItemSchema.safeParse({ category: 'invalid-cat' });
    expect(result.success).toBe(false);
  });

  it('accepts valid category on update', () => {
    const result = updateItemSchema.safeParse({ category: 'lemari-c02' });
    expect(result.success).toBe(true);
  });

  it('rejects extra keys due to strict()', () => {
    const result = updateItemSchema.safeParse({ unknownKey: 'bad' });
    expect(result.success).toBe(false);
  });

  it('rejects name longer than 200 chars on update', () => {
    const result = updateItemSchema.safeParse({ name: 'z'.repeat(201) });
    expect(result.success).toBe(false);
  });

  it('rejects negative quantity on update', () => {
    const result = updateItemSchema.safeParse({ quantity: -5 });
    expect(result.success).toBe(false);
  });
});
