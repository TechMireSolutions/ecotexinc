import './setup';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

interface BagQuoteParams {
  material: 'non-woven' | 'woven-pp' | 'cotton' | 'jute' | 'compostable';
  gsm: number;
  widthInches: number;
  heightInches: number;
  gussetInches: number;
  handleType: 'die-cut' | 'loop' | 'shoulder-strap';
  printColors: number; // 0, 1, 2, 4 (Full CMYK)
  quantity: number;
  isSampleOrder: boolean;
}

/**
 * Enterprise EcoTex Volume & Custom Bag Quote Logic
 */
function calculateBagEstimate(params: BagQuoteParams) {
  // 1. Material base rate per sq inch per 100 GSM
  const materialBaseRates: Record<BagQuoteParams['material'], number> = {
    'non-woven': 0.00028,
    'woven-pp': 0.00035,
    'compostable': 0.00045,
    'cotton': 0.00075,
    'jute': 0.00085,
  };

  const baseRate = materialBaseRates[params.material] || 0.0003;
  // Total fabric area: 2 * (W + G) * (H + G/2)
  const surfaceAreaSqInches = 2 * (params.widthInches + params.gussetInches) * (params.heightInches + params.gussetInches / 2);
  const rawMaterialCost = surfaceAreaSqInches * baseRate * (params.gsm / 80);

  // Handle surcharge
  const handleSurcharges: Record<BagQuoteParams['handleType'], number> = {
    'die-cut': 0.02,
    'loop': 0.05,
    'shoulder-strap': 0.12,
  };
  const handleCost = handleSurcharges[params.handleType] || 0.04;

  // Print plate & ink surcharge per bag
  const printCost = params.printColors === 0 ? 0 : 0.03 + (params.printColors * 0.02);

  // Raw base unit cost
  let unitPrice = rawMaterialCost + handleCost + printCost;

  // Volume scale discounts
  if (params.quantity >= 10000) {
    unitPrice *= 0.70; // 30% volume discount
  } else if (params.quantity >= 5000) {
    unitPrice *= 0.80; // 20% discount
  } else if (params.quantity >= 2500) {
    unitPrice *= 0.88; // 12% discount
  } else if (params.quantity >= 1000) {
    unitPrice *= 0.94; // 6% discount
  }

  // Sample order rules
  if (params.isSampleOrder) {
    // Max sample quantity is 5 units, with a 45% sample handling markup
    const sampleQty = Math.min(5, Math.max(1, params.quantity));
    const sampleUnitPrice = Number((unitPrice * 1.45).toFixed(2));
    return {
      quantity: sampleQty,
      unitPrice: sampleUnitPrice,
      subtotal: Number((sampleUnitPrice * sampleQty).toFixed(2)),
      isSample: true,
      moqMet: true,
    };
  }

  // Commercial orders: minimum MOQ 500 units
  const moqMet = params.quantity >= 500;
  const roundedUnitPrice = Number(unitPrice.toFixed(3));
  const total = Number((roundedUnitPrice * params.quantity).toFixed(2));

  return {
    quantity: params.quantity,
    unitPrice: roundedUnitPrice,
    subtotal: total,
    isSample: false,
    moqMet,
  };
}

describe('Frontend Custom Bag Quote & Pricing Engine Tests', () => {
  it('should calculate valid custom quote for standard non-woven grocery tote', () => {
    const result = calculateBagEstimate({
      material: 'non-woven',
      gsm: 90,
      widthInches: 12,
      heightInches: 14,
      gussetInches: 4,
      handleType: 'loop',
      printColors: 2,
      quantity: 5000,
      isSampleOrder: false,
    });

    assert.ok(result.unitPrice > 0.15 && result.unitPrice < 0.85);
    assert.equal(result.moqMet, true);
    assert.equal(result.isSample, false);
    assert.equal(result.subtotal, Number((result.unitPrice * 5000).toFixed(2)));
  });

  it('should enforce greater volume discounts as order quantity increases', () => {
    const smallOrder = calculateBagEstimate({
      material: 'non-woven',
      gsm: 80,
      widthInches: 10,
      heightInches: 12,
      gussetInches: 3,
      handleType: 'loop',
      printColors: 1,
      quantity: 1000,
      isSampleOrder: false,
    });

    const largeOrder = calculateBagEstimate({
      material: 'non-woven',
      gsm: 80,
      widthInches: 10,
      heightInches: 12,
      gussetInches: 3,
      handleType: 'loop',
      printColors: 1,
      quantity: 10000,
      isSampleOrder: false,
    });

    // Price per unit for 10,000 bags must be significantly lower than 1,000 bags
    assert.ok(largeOrder.unitPrice < smallOrder.unitPrice);
  });

  it('should flag commercial orders below MOQ of 500 units', () => {
    const subMoqOrder = calculateBagEstimate({
      material: 'compostable',
      gsm: 60,
      widthInches: 11,
      heightInches: 15,
      gussetInches: 4,
      handleType: 'die-cut',
      printColors: 0,
      quantity: 250, // Below 500 MOQ
      isSampleOrder: false,
    });

    assert.equal(subMoqOrder.moqMet, false);
  });

  it('should cap sample orders at maximum 5 units and apply 45% sample handling markup', () => {
    const sample = calculateBagEstimate({
      material: 'cotton',
      gsm: 140,
      widthInches: 15,
      heightInches: 16,
      gussetInches: 4,
      handleType: 'shoulder-strap',
      printColors: 4,
      quantity: 20, // Requested 20 samples -> should be capped at 5
      isSampleOrder: true,
    });

    assert.equal(sample.quantity, 5);
    assert.equal(sample.isSample, true);
    assert.equal(sample.moqMet, true);
    assert.ok(sample.unitPrice > 1.0);
  });
});
