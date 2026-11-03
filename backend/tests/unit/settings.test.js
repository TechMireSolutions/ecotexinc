import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function deepMerge(target, source) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return source;
  }
  const result = { ...(target || {}) };
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = result[key];
    if (
      srcVal &&
      typeof srcVal === 'object' &&
      !Array.isArray(srcVal) &&
      tgtVal &&
      typeof tgtVal === 'object' &&
      !Array.isArray(tgtVal)
    ) {
      result[key] = deepMerge(tgtVal, srcVal);
    } else {
      result[key] = srcVal;
    }
  }
  return result;
}

describe('Backend Settings Engine & Deep Merge Logic', () => {
  it('should deeply merge partial updates without destroying sibling keys', () => {
    const initialSettings = {
      siteName: 'EcoTex Inc.',
      currency: 'USD',
      bankDetails: {
        accountName: 'EcoTex Inc',
        bankName: 'Meezan Bank Ltd',
        iban: 'PK123456789'
      },
      aboutConfig: {
        eyebrow: 'LEADERSHIP & VISION',
        mainHeading: 'Sustainable Packaging'
      }
    };

    const patchPayload = {
      bankDetails: {
        accountNumber: '9988776655' // Add account number without wiping bankName or iban
      }
    };

    const merged = deepMerge(initialSettings, patchPayload);

    assert.equal(merged.siteName, 'EcoTex Inc.');
    assert.equal(merged.bankDetails.bankName, 'Meezan Bank Ltd');
    assert.equal(merged.bankDetails.iban, 'PK123456789');
    assert.equal(merged.bankDetails.accountNumber, '9988776655');
    assert.equal(merged.aboutConfig.mainHeading, 'Sustainable Packaging');
  });

  it('should cleanly replace arrays instead of merging element by element', () => {
    const initialSettings = {
      aboutConfig: {
        teamMembers: [
          { id: 'tm-1', name: 'Rashid Mahmood' },
          { id: 'tm-2', name: 'Farah Al-Sayed' }
        ]
      }
    };

    // User reordered or removed member tm-1 in admin
    const newTeamPayload = {
      aboutConfig: {
        teamMembers: [
          { id: 'tm-2', name: 'Farah Al-Sayed' },
          { id: 'tm-3', name: 'New Executive' }
        ]
      }
    };

    const merged = deepMerge(initialSettings, newTeamPayload);

    assert.equal(merged.aboutConfig.teamMembers.length, 2);
    assert.equal(merged.aboutConfig.teamMembers[0].id, 'tm-2');
    assert.equal(merged.aboutConfig.teamMembers[1].id, 'tm-3');
  });

  it('should safely handle empty or null source payloads without throwing', () => {
    const initialSettings = { siteName: 'EcoTex Inc.' };
    const mergedNull = deepMerge(initialSettings, null);
    assert.equal(mergedNull, null);

    const mergedEmpty = deepMerge(initialSettings, {});
    assert.equal(mergedEmpty.siteName, 'EcoTex Inc.');
  });
});
