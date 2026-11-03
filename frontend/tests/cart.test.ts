import './setup';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { useStore } from '../src/store/useStore';
import { Product } from '../src/types';

const mockProduct: Product = {
  id: 'test-prod-1',
  name: 'Heavy Duty Non-Woven Tote',
  category: 'non-woven',
  categoryLabel: 'Non-Woven Totes',
  subtitle: 'Commercial Carrier Bag',
  pricePerUnit: 0.35,
  moq: 100,
  inStock: true,
  stockQuantity: 5000,
  gsm: 90,
  dimensions: '12"W x 14"H x 4"D',
  material: 'Non-Woven Polypropylene',
  capacity: 'Up to 25 lbs',
  certifications: ['GRS Certified'],
  availableColors: [
    { name: 'Forest Green', hex: '#4E9F76' },
    { name: 'Navy Blue', hex: '#1e3a5f' }
  ],
  description: 'Heavy duty commercial grocery tote bag',
  features: ['Reinforced handles'],
  bestFor: 'Supermarket checkout',
  ecoImpact: 'Replaces 125 single-use plastic bags',
  leadTime: '2-4 Days',
  volumeTiers: [
    { minQty: 500, price: 0.30 },
    { minQty: 2500, price: 0.25 },
    { minQty: 5000, price: 0.20 }
  ]
};

describe('Frontend Cart Operations & Pricing Logic', () => {
  beforeEach(() => {
    useStore.getState().clearCart();
  });

  it('should start with an empty cart after clearCart()', () => {
    const state = useStore.getState();
    assert.equal(state.cart.length, 0);
    assert.equal(state.getCartItemCount(), 0);
    assert.equal(state.getCartSubtotal(), 0);
  });

  it('should add an in-stock wholesale product to cart with volume tier pricing', () => {
    const store = useStore.getState();
    store.addToCart(mockProduct, '#4E9F76', 500, 'wholesale');

    const updated = useStore.getState();
    assert.equal(updated.cart.length, 1);
    assert.equal(updated.cart[0].product.id, 'test-prod-1');
    assert.equal(updated.cart[0].quantity, 500);
    assert.equal(updated.cart[0].selectedColor, '#4E9F76');
    assert.equal(updated.getCartItemCount(), 500);
    // At 500 units, volume tier price is 0.30
    assert.equal(updated.cart[0].unitPrice, 0.30);
    assert.equal(updated.getCartSubtotal(), 500 * 0.30);
  });

  it('should apply higher volume discount when adding 2500 units', () => {
    const store = useStore.getState();
    store.addToCart(mockProduct, '#4E9F76', 2500, 'wholesale');

    const updated = useStore.getState();
    assert.equal(updated.cart[0].unitPrice, 0.25);
    assert.equal(updated.getCartSubtotal(), 2500 * 0.25);
  });

  it('should increment existing item quantity if same product, color, and orderType added', () => {
    const store = useStore.getState();
    store.addToCart(mockProduct, '#4E9F76', 200, 'wholesale');
    store.addToCart(mockProduct, '#4E9F76', 300, 'wholesale');

    const updated = useStore.getState();
    assert.equal(updated.cart.length, 1);
    assert.equal(updated.cart[0].quantity, 500);
    assert.equal(updated.getCartItemCount(), 500);
    // After reaching 500, price tiers should update to 0.30
    assert.equal(updated.cart[0].unitPrice, 0.30);
  });

  it('should create separate cart items for different colors of same product', () => {
    const store = useStore.getState();
    store.addToCart(mockProduct, '#4E9F76', 100, 'wholesale');
    store.addToCart(mockProduct, '#1e3a5f', 100, 'wholesale');

    const updated = useStore.getState();
    assert.equal(updated.cart.length, 2);
    assert.equal(updated.getCartItemCount(), 200);
  });

  it('should enforce retail sample maximum of 5 units and 45% markup', () => {
    const store = useStore.getState();
    // User tries to add 20 units as retail sample, store clamps to max 5
    store.addToCart(mockProduct, '#4E9F76', 20, 'retail');

    const updated = useStore.getState();
    assert.equal(updated.cart.length, 1);
    assert.equal(updated.cart[0].quantity, 5);
    // Retail markup is pricePerUnit * 1.45 = 0.35 * 1.45 = 0.5075
    assert.equal(updated.cart[0].unitPrice, 0.35 * 1.45);
    assert.equal(updated.cart[0].orderType, 'retail');
  });

  it('should update cart item quantity and adjust volume tiers', () => {
    const store = useStore.getState();
    store.addToCart(mockProduct, '#4E9F76', 200, 'wholesale');
    
    const itemId = useStore.getState().cart[0].id;
    // Add 300 more to hit 500 tier
    useStore.getState().updateCartQuantity(itemId, 300);

    const afterIncrement = useStore.getState();
    assert.equal(afterIncrement.cart[0].quantity, 500);
    assert.equal(afterIncrement.cart[0].unitPrice, 0.30);

    // Subtract 100 to drop back to 400
    useStore.getState().updateCartQuantity(itemId, -100);
    const afterDecrement = useStore.getState();
    assert.equal(afterDecrement.cart[0].quantity, 400);
    assert.equal(afterDecrement.cart[0].unitPrice, 0.35);
  });

  it('should remove item when quantity is decremented to zero or below', () => {
    const store = useStore.getState();
    store.addToCart(mockProduct, '#4E9F76', 100, 'wholesale');
    
    const itemId = useStore.getState().cart[0].id;
    useStore.getState().updateCartQuantity(itemId, -100);

    assert.equal(useStore.getState().cart.length, 0);
    assert.equal(useStore.getState().getCartItemCount(), 0);
  });

  it('should explicitly remove item from cart with removeFromCart', () => {
    const store = useStore.getState();
    store.addToCart(mockProduct, '#4E9F76', 100, 'wholesale');
    
    const itemId = useStore.getState().cart[0].id;
    useStore.getState().removeFromCart(itemId);

    assert.equal(useStore.getState().cart.length, 0);
    assert.equal(useStore.getState().getCartItemCount(), 0);
  });
});
