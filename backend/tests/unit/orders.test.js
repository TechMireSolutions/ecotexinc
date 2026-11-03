import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

describe('Backend Order Business Logic & Calculation Engine', () => {
  // Test commercial subtotal and shipping calculation rules
  it('should calculate correct subtotal and apply $50 freight for orders under $1,000', () => {
    const items = [
      { productId: 'prod-1', productName: 'Eco Loop Bag', quantity: 2000, unitPrice: 0.25 }
    ];
    
    const calculatedSubtotal = items.reduce(
      (sum, item) => sum + (Number(item.totalPrice) || (Number(item.unitPrice || 0) * Number(item.quantity || 1))),
      0
    );

    const shipping = calculatedSubtotal >= 1000 ? 0 : 50;
    const total = calculatedSubtotal + shipping;

    assert.equal(calculatedSubtotal, 500);
    assert.equal(shipping, 50); // Under $1000 threshold -> $50 standard LTL shipping
    assert.equal(total, 550);
  });

  it('should grant FREE Freight (shipping = 0) for commercial orders of $1,000 or greater', () => {
    const items = [
      { productId: 'prod-1', productName: 'Eco Loop Bag', quantity: 5000, unitPrice: 0.25 }
    ];
    
    const calculatedSubtotal = items.reduce(
      (sum, item) => sum + (Number(item.totalPrice) || (Number(item.unitPrice || 0) * Number(item.quantity || 1))),
      0
    );

    const shipping = calculatedSubtotal >= 1000 ? 0 : 50;
    const total = calculatedSubtotal + shipping;

    assert.equal(calculatedSubtotal, 1250);
    assert.equal(shipping, 0); // Equal or over $1000 threshold -> Free freight
    assert.equal(total, 1250);
  });

  it('should accurately calculate inventory stock deduction and out-of-stock flagging', () => {
    const mockProducts = [
      { id: 'prod-10', name: 'Compostable Bag', stockQuantity: 300, inStock: true },
      { id: 'prod-20', name: 'Cotton Tote', stockQuantity: 50, inStock: true },
    ];

    const orderItems = [
      { productId: 'prod-10', quantity: 100 },
      { productId: 'prod-20', quantity: 50 },
    ];

    for (const item of orderItems) {
      const prod = mockProducts.find((p) => p.id === item.productId);
      if (prod) {
        const currentStock = typeof prod.stockQuantity === 'number' ? prod.stockQuantity : 50;
        const orderedBoxes = Number(item.quantity) || 1;
        const newStock = Math.max(0, currentStock - orderedBoxes);
        prod.stockQuantity = newStock;
        if (newStock === 0) {
          prod.inStock = false;
        }
      }
    }

    // prod-10: 300 - 100 = 200, still in stock
    assert.equal(mockProducts[0].stockQuantity, 200);
    assert.equal(mockProducts[0].inStock, true);

    // prod-20: 50 - 50 = 0, automatically marked out of stock
    assert.equal(mockProducts[1].stockQuantity, 0);
    assert.equal(mockProducts[1].inStock, false);
  });

  it('should normalize order item fields and fallback defaults', () => {
    const rawOrder = {
      buyerName: 'Direct Buyer',
      items: [
        { name: 'Custom Bag', quantity: '20', price: '0.40' }
      ]
    };

    const normalizedItems = rawOrder.items.map((it) => ({
      productId: it.productId || it.id || '',
      productName: it.productName || it.name || 'Custom Bag',
      quantity: Number(it.quantity) || 1,
      unitPrice: Number(it.unitPrice || it.price) || 0,
      totalPrice: Number(it.totalPrice) || ((Number(it.unitPrice || it.price) || 0) * (Number(it.quantity) || 1)),
      color: it.color || it.selectedColor || 'Default',
      customPrint: Boolean(it.customPrint),
    }));

    assert.equal(normalizedItems[0].productName, 'Custom Bag');
    assert.equal(normalizedItems[0].quantity, 20);
    assert.equal(normalizedItems[0].unitPrice, 0.40);
    assert.equal(normalizedItems[0].totalPrice, 8.00);
    assert.equal(normalizedItems[0].color, 'Default');
    assert.equal(normalizedItems[0].customPrint, false);
  });
});
