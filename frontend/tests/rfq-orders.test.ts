import './setup';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { useStore } from '../src/store/useStore';
import { Product } from '../src/types';

describe('Frontend Orders & RFQ Quote Management Logic', () => {
  it('should create an order, update revenue analytics, and deduct product stock', async () => {
    // 1. Add a sample product to store with known stock
    const testProduct: Omit<Product, 'id'> = {
      name: 'Inventory Test Bag',
      category: 'non-woven',
      categoryLabel: 'Non-Woven Bags',
      subtitle: 'Inventory Management Carrier Bag',
      pricePerUnit: 0.50,
      moq: 100,
      inStock: true,
      stockQuantity: 200,
      gsm: 80,
      dimensions: '12"W x 14"H x 4"D',
      material: 'Virgin Non-Woven PP',
      capacity: 'Up to 20 lbs',
      certifications: ['GRS Certified'],
      availableColors: [{ name: 'Eco Green', hex: '#4E9F76' }],
      description: 'Test inventory non-woven carrier bag',
      features: ['Durable'],
      bestFor: 'Testing inventory deduction',
      ecoImpact: 'Reusable packaging',
      leadTime: '2-4 Days',
      volumeTiers: [{ minQty: 100, price: 0.50 }]
    };

    useStore.getState().addProduct(testProduct);
    const product = useStore.getState().products.find(p => p.name === 'Inventory Test Bag');
    assert.ok(product);
    assert.equal(product.stockQuantity, 200);

    const initialOrdersCount = useStore.getState().orders.length;
    const initialGrossRevenue = useStore.getState().analytics.grossRevenue;

    // 2. Create order buying 50 units
    const orderData = {
      buyerName: 'Global Markets Group',
      companyName: 'Global Markets LLC',
      email: 'procurement@globalmarkets.com',
      subtotal: 25.00,
      shipping: 10.00,
      total: 35.00,
      items: [
        {
          productId: product.id,
          productName: product.name,
          quantity: 50,
          unitPrice: 0.50,
          totalPrice: 25.00,
          color: '#4E9F76'
        }
      ]
    };

    const created = await useStore.getState().createOrder(orderData);
    assert.ok(created.id);
    assert.equal(created.buyerName, 'Global Markets Group');
    assert.equal(created.total, 35.00);

    // 3. Verify order is in store
    const storeOrders = useStore.getState().orders;
    assert.equal(storeOrders.length, initialOrdersCount + 1);
    assert.ok(storeOrders.some(o => o.id === created.id));

    // 4. Verify stock was automatically deducted from 200 down to 150
    const updatedProduct = useStore.getState().products.find(p => p.id === product.id);
    assert.ok(updatedProduct);
    assert.equal(updatedProduct.stockQuantity, 150);
    assert.equal(updatedProduct.inStock, true);

    // 5. Verify analytics were updated
    const analytics = useStore.getState().analytics;
    assert.equal(analytics.totalOrdersCount, initialOrdersCount + 1);
    assert.equal(analytics.grossRevenue, initialGrossRevenue + 35.00);
  });

  it('should update order status', () => {
    const orders = useStore.getState().orders;
    const targetOrder = orders[0];
    assert.ok(targetOrder);

    useStore.getState().updateOrderStatus(targetOrder.id, 'Dispatched Freight');
    const updated = useStore.getState().orders.find(o => o.id === targetOrder.id);
    assert.ok(updated);
    assert.equal(updated.status, 'Dispatched Freight');
  });

  it('should delete an order and decrement order count', () => {
    const orders = useStore.getState().orders;
    const targetOrder = orders[0];
    assert.ok(targetOrder);
    const countBefore = orders.length;

    useStore.getState().deleteOrder(targetOrder.id);
    const ordersAfter = useStore.getState().orders;
    assert.equal(ordersAfter.length, countBefore - 1);
    assert.equal(ordersAfter.some(o => o.id === targetOrder.id), false);
  });

  it('should create custom RFQ quote and manage its lifecycle', async () => {
    const initialQuotesCount = useStore.getState().quotes.length;

    const newQuote = await useStore.getState().createQuote({
      name: 'Elena Rostova',
      company: 'Nordic Clean Retail',
      email: 'elena@nordicclean.se',
      volume: '50,000 units',
      printing: '4-Color Continuous Flexo',
      category: 'compostable'
    });

    assert.ok(newQuote.id.startsWith('RFQ-'));
    assert.equal(newQuote.status, 'New');

    const quotes = useStore.getState().quotes;
    assert.equal(quotes.length, initialQuotesCount + 1);

    // Update status
    useStore.getState().updateQuoteStatus(newQuote.id, 'Quotation Sent');
    const updatedQuote = useStore.getState().quotes.find(q => q.id === newQuote.id);
    assert.ok(updatedQuote);
    assert.equal(updatedQuote.status, 'Quotation Sent');

    // Delete quote
    useStore.getState().deleteQuote(newQuote.id);
    const quotesAfterDelete = useStore.getState().quotes;
    assert.equal(quotesAfterDelete.length, initialQuotesCount);
    assert.equal(quotesAfterDelete.some(q => q.id === newQuote.id), false);
  });
});
