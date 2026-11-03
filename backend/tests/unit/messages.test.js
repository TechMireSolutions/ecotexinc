import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function normalizePhoneNumber(rawPhone) {
  if (!rawPhone) return '';
  let cleanPhone = String(rawPhone).replace(/[^0-9]/g, '');
  if (cleanPhone.startsWith('03') && cleanPhone.length === 11) {
    cleanPhone = '92' + cleanPhone.slice(1);
  } else if (cleanPhone.startsWith('00')) {
    cleanPhone = cleanPhone.slice(2);
  }
  return cleanPhone;
}

function processIncomingMessage(thread) {
  const customerName = (thread.customerName || thread.name || 'Anonymous Inquiry').trim();
  const email = (thread.customerEmail || thread.email || '').trim().toLowerCase();
  const rawPhone = thread.phone || thread.whatsapp || '';
  const cleanPhone = normalizePhoneNumber(rawPhone);
  const status = thread.status || 'unread';

  const messages = Array.isArray(thread.messages) ? thread.messages : [];
  if (messages.length === 0 && thread.initialMessage) {
    messages.push({
      id: `msg-${Date.now()}`,
      sender: 'customer',
      senderName: customerName,
      text: thread.initialMessage.trim(),
      timestamp: new Date().toISOString()
    });
  }

  return {
    id: thread.id || `msg-${Date.now()}`,
    customerName,
    email,
    phone: cleanPhone,
    status,
    messages,
    createdAt: thread.createdAt || new Date().toISOString()
  };
}

describe('Backend Customer Messages & Communication Logic Tests', () => {
  it('should normalize Pakistani local phone numbers (03xx) to international E.164 (923xx)', () => {
    assert.equal(normalizePhoneNumber('03328784015'), '923328784015');
    assert.equal(normalizePhoneNumber('+92 332 8784015'), '923328784015');
    assert.equal(normalizePhoneNumber('00923328784015'), '923328784015');
    assert.equal(normalizePhoneNumber('+1 (951) 450-9773'), '19514509773');
  });

  it('should process new customer inquiry thread with default status unread', () => {
    const thread = processIncomingMessage({
      name: 'Ahmed Khan',
      email: 'AHMED@COMPANY.COM',
      phone: '03001234567',
      initialMessage: 'Need quote for 25,000 laminated woven bags'
    });

    assert.equal(thread.customerName, 'Ahmed Khan');
    assert.equal(thread.email, 'ahmed@company.com');
    assert.equal(thread.phone, '923001234567');
    assert.equal(thread.status, 'unread');
    assert.equal(thread.messages.length, 1);
    assert.equal(thread.messages[0].sender, 'customer');
    assert.equal(thread.messages[0].text, 'Need quote for 25,000 laminated woven bags');
  });

  it('should support adding admin replies and updating thread status', () => {
    const thread = processIncomingMessage({
      name: 'Sara Ali',
      email: 'sara@retail.com',
      initialMessage: 'Do you offer custom foil stamping?'
    });

    // Admin replies
    const adminReply = {
      id: `admin-${Date.now()}`,
      sender: 'admin',
      senderName: 'EcoTex Senior Representative',
      text: 'Yes! We offer hot foil stamping in Gold, Silver, and Matte Black.',
      timestamp: new Date().toISOString()
    };

    thread.messages.push(adminReply);
    thread.status = 'replied';

    assert.equal(thread.messages.length, 2);
    assert.equal(thread.messages[1].sender, 'admin');
    assert.equal(thread.status, 'replied');
  });
});
