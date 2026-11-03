import './setup';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { useStore } from '../src/store/useStore';
import { Product } from '../src/types';

describe('Frontend Catalog & Category CRUD State Logic', () => {
  it('should add a new product to store and generate an id', () => {
    const initialCount = useStore.getState().products.length;
    const testProdData: Omit<Product, 'id'> = {
      name: 'Organic Jute Shopping Sack',
      category: 'jute',
      categoryLabel: 'Jute Bags',
      subtitle: 'Natural Fiber Carrier Bag',
      pricePerUnit: 0.65,
      moq: 500,
      inStock: true,
      stockQuantity: 1200,
      gsm: 180,
      dimensions: '14"W x 16"H x 5"D',
      material: '100% Biodegradable Jute Fiber',
      capacity: 'Up to 30 lbs',
      certifications: ['OEKO-TEX Certified'],
      availableColors: [{ name: 'Natural Tan', hex: '#D2B48C' }],
      description: 'Handwoven natural organic jute shopping sack',
      features: ['Durable weave', 'Biodegradable'],
      bestFor: 'Eco grocery shopping',
      ecoImpact: 'Completely compostable in 90 days',
      leadTime: '5-7 Days',
      volumeTiers: [{ minQty: 500, price: 0.65 }]
    };

    useStore.getState().addProduct(testProdData);
    const updated = useStore.getState().products;
    assert.equal(updated.length, initialCount + 1);

    const added = updated.find(p => p.name === 'Organic Jute Shopping Sack');
    assert.ok(added);
    assert.ok(added.id.startsWith('prod-'));
    assert.equal(added.pricePerUnit, 0.65);
    assert.equal(added.stockQuantity, 1200);
  });

  it('should update product details and automatically set inStock=false when stockQuantity=0', () => {
    const products = useStore.getState().products;
    const target = products.find(p => p.name === 'Organic Jute Shopping Sack');
    assert.ok(target, 'Target product must exist');

    useStore.getState().updateProduct(target.id, {
      pricePerUnit: 0.70,
      stockQuantity: 0
    });

    const updated = useStore.getState().products.find(p => p.id === target.id);
    assert.ok(updated);
    assert.equal(updated.pricePerUnit, 0.70);
    assert.equal(updated.stockQuantity, 0);
    // Verified: store automatically marks inStock = false when stockQuantity <= 0
    assert.equal(updated.inStock, false);
  });

  it('should toggle product stock availability and restore default stock when toggled on', () => {
    const products = useStore.getState().products;
    const target = products.find(p => p.name === 'Organic Jute Shopping Sack');
    assert.ok(target);
    assert.equal(target.inStock, false);

    // Toggle on
    useStore.getState().toggleProductStock(target.id);
    let updated = useStore.getState().products.find(p => p.id === target.id);
    assert.ok(updated);
    assert.equal(updated.inStock, true);
    assert.ok((updated.stockQuantity ?? 0) > 0);

    // Toggle off
    useStore.getState().toggleProductStock(target.id);
    updated = useStore.getState().products.find(p => p.id === target.id);
    assert.ok(updated);
    assert.equal(updated.inStock, false);
    assert.equal(updated.stockQuantity, 0);
  });

  it('should delete product from catalog', () => {
    const products = useStore.getState().products;
    const target = products.find(p => p.name === 'Organic Jute Shopping Sack');
    assert.ok(target);

    const countBefore = products.length;
    useStore.getState().deleteProduct(target.id);

    const countAfter = useStore.getState().products.length;
    assert.equal(countAfter, countBefore - 1);
    assert.equal(useStore.getState().products.some(p => p.id === target.id), false);
  });

  it('should add, update and delete packaging categories', () => {
    const initialCategoriesCount = useStore.getState().categories.length;

    // Add category
    useStore.getState().addCategory({
      label: 'Compostable Garment Covers',
      description: 'Bio-film garment packaging for fashion retail'
    });

    const categoriesAfterAdd = useStore.getState().categories;
    assert.equal(categoriesAfterAdd.length, initialCategoriesCount + 1);

    const addedCat = categoriesAfterAdd.find(c => c.label === 'Compostable Garment Covers');
    assert.ok(addedCat);
    assert.equal(addedCat.id, 'compostable-garment-covers');

    // Update category
    useStore.getState().updateCategory(addedCat.id, {
      description: 'Updated premium apparel protective covers'
    });

    const categoriesAfterUpdate = useStore.getState().categories;
    const updatedCat = categoriesAfterUpdate.find(c => c.id === addedCat.id);
    assert.equal(updatedCat?.description, 'Updated premium apparel protective covers');

    // Delete category
    useStore.getState().deleteCategory(addedCat.id);
    const categoriesAfterDelete = useStore.getState().categories;
    assert.equal(categoriesAfterDelete.length, initialCategoriesCount);
    assert.equal(categoriesAfterDelete.some(c => c.id === addedCat.id), false);
  });

  it('should update site settings and maintain immutable defaults', () => {
    const initialSettings = useStore.getState().siteSettings;
    assert.ok(initialSettings.companyName);

    useStore.getState().updateSiteSettings({
      companyName: 'EcoTex Global Manufacturing',
      announcement: '🌱 100% Circular Bio-Polymer Extrusion Facility'
    });

    const updatedSettings = useStore.getState().siteSettings;
    assert.equal(updatedSettings.companyName, 'EcoTex Global Manufacturing');
    assert.equal(updatedSettings.announcement, '🌱 100% Circular Bio-Polymer Extrusion Facility');
    // Ensure nested fields are preserved
    assert.ok(updatedSettings.logoConfig);
  });
});
