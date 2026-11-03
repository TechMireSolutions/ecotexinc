import './setup';
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { useStore } from '../src/store/useStore';
import { TeamMemberConfig, SiteSettings } from '../src/types';

describe('Frontend CMS, About Section & Site Settings Unit Tests', () => {
  beforeEach(() => {
    // Reset site settings to default test fixture
    const defaultSettings: Partial<SiteSettings> = {
      siteName: 'EcoTex Inc.',
      tagline: 'Sustainable Packaging Solutions',
      contactEmail: 'contact@ecotexinc.com',
      contactPhone: '+1 (951) 450-9773',
      aboutConfig: {
        heroTitle: 'Pioneering Circular Industrial Packaging',
        heroSubtitle: 'Sustainable Manufacturing',
        missionQuote: 'To eliminate single-use plastics from commercial supply chains.',
        storyParagraph1: 'EcoTex Inc. leads the transition toward circular economy manufacturing.',
        storyParagraph2: 'A zero-waste global packaging ecosystem.',
        whyChooseUsTitle: 'Why Partner With EcoTex',
        whyChooseUsSubtitle: 'Pioneering sustainable commercial packaging',
        whyChooseUsFeatures: [
          { title: 'Zero Waste', description: 'Complete circularity in production.' },
          { title: 'Traceability', description: 'Full supply chain accountability.' }
        ],
        teamSectionTitle: 'MEET OUR TEAM',
        teamSectionSubtitle: '| LEADERSHIP & VISION |',
        teamMembers: [
          {
            id: 'tm-1',
            name: 'Rashid Mahmood',
            role: 'Managing Director & Founder',
            bio: '25+ years in industrial textile engineering.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=85',
            email: 'rashid@ecotexinc.com',
            linkedin: 'https://linkedin.com/in/rashid'
          },
          {
            id: 'tm-2',
            name: 'Farah Al-Sayed',
            role: 'Head of Quality & Materials Engineering',
            bio: 'Polymer sustainability specialist.',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85',
            email: 'farah@ecotexinc.com',
            linkedin: 'https://linkedin.com/in/farah'
          }
        ]
      }
    };

    useStore.getState().updateSiteSettings(defaultSettings as SiteSettings);
  });

  it('should initialize and read aboutConfig and team members correctly', () => {
    const settings = useStore.getState().siteSettings;
    assert.ok(settings);
    assert.equal(settings.aboutConfig?.teamSectionTitle, 'MEET OUR TEAM');
    assert.equal(settings.aboutConfig?.teamMembers.length, 2);
    assert.equal(settings.aboutConfig?.teamMembers[0].name, 'Rashid Mahmood');
    assert.equal(settings.aboutConfig?.teamMembers[1].name, 'Farah Al-Sayed');
  });

  it('should add a new team member to aboutConfig', () => {
    const settings = useStore.getState().siteSettings;
    const currentMembers = settings.aboutConfig?.teamMembers || [];

    const newMember: TeamMemberConfig = {
      id: 'tm-3',
      name: 'Marcus Vance',
      role: 'Chief Sustainability Officer',
      bio: 'Leading carbon footprint reduction and LCA audits.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85',
      email: 'marcus@ecotexinc.com',
      linkedin: 'https://linkedin.com/in/marcus'
    };

    const updatedAbout = {
      ...settings.aboutConfig!,
      teamMembers: [...currentMembers, newMember]
    };

    useStore.getState().updateSiteSettings({
      ...settings,
      aboutConfig: updatedAbout
    });

    const updated = useStore.getState().siteSettings;
    assert.equal(updated.aboutConfig?.teamMembers.length, 3);
    assert.equal(updated.aboutConfig?.teamMembers[2].id, 'tm-3');
    assert.equal(updated.aboutConfig?.teamMembers[2].name, 'Marcus Vance');
    assert.equal(updated.aboutConfig?.teamMembers[2].email, 'marcus@ecotexinc.com');
  });

  it('should update an existing team member details in aboutConfig', () => {
    const settings = useStore.getState().siteSettings;
    const currentMembers = [...(settings.aboutConfig?.teamMembers || [])];

    // Update Farah's role and email
    currentMembers[1] = {
      ...currentMembers[1],
      role: 'VP of Sustainable Materials',
      email: 'vp.materials@ecotexinc.com'
    };

    useStore.getState().updateSiteSettings({
      ...settings,
      aboutConfig: {
        ...settings.aboutConfig!,
        teamMembers: currentMembers
      }
    });

    const updated = useStore.getState().siteSettings;
    assert.equal(updated.aboutConfig?.teamMembers[1].role, 'VP of Sustainable Materials');
    assert.equal(updated.aboutConfig?.teamMembers[1].email, 'vp.materials@ecotexinc.com');
  });

  it('should delete a team member from aboutConfig', () => {
    const settings = useStore.getState().siteSettings;
    const filteredMembers = (settings.aboutConfig?.teamMembers || []).filter((m) => m.id !== 'tm-1');

    useStore.getState().updateSiteSettings({
      ...settings,
      aboutConfig: {
        ...settings.aboutConfig!,
        teamMembers: filteredMembers
      }
    });

    const updated = useStore.getState().siteSettings;
    assert.equal(updated.aboutConfig?.teamMembers.length, 1);
    assert.equal(updated.aboutConfig?.teamMembers[0].name, 'Farah Al-Sayed');
  });

  it('should reorder team members (move up / move down)', () => {
    const settings = useStore.getState().siteSettings;
    const members = [...(settings.aboutConfig?.teamMembers || [])];
    
    // Swap index 0 and 1
    const temp = members[0];
    members[0] = members[1];
    members[1] = temp;

    useStore.getState().updateSiteSettings({
      ...settings,
      aboutConfig: {
        ...settings.aboutConfig!,
        teamMembers: members
      }
    });

    const updated = useStore.getState().siteSettings;
    assert.equal(updated.aboutConfig?.teamMembers[0].name, 'Farah Al-Sayed');
    assert.equal(updated.aboutConfig?.teamMembers[1].name, 'Rashid Mahmood');
  });

  it('should safely preserve bank transfer details and WhatsApp notifications config', () => {
    const settings = useStore.getState().siteSettings;
    
    useStore.getState().updateSiteSettings({
      ...settings,
      bankDetails: {
        accountName: 'EcoTex Inc Industrial',
        accountNumber: 'PK99MEZN000123456789',
        bankName: 'Meezan Bank Ltd',
        iban: 'PK99MEZN000123456789',
        branchCode: '0101',
        instructions: 'Please email wire confirmation to billing@ecotexinc.com'
      },
      orderNotifications: {
        emailEnabled: true,
        notificationEmail: 'orders@ecotexinc.com',
        whatsappEnabled: true,
        whatsappNumber: '+923328784015'
      }
    });

    const updated = useStore.getState().siteSettings;
    assert.equal(updated.bankDetails?.bankName, 'Meezan Bank Ltd');
    assert.equal(updated.bankDetails?.iban, 'PK99MEZN000123456789');
    assert.equal(updated.orderNotifications?.whatsappNumber, '+923328784015');
    assert.equal(updated.orderNotifications?.whatsappEnabled, true);
  });
});
