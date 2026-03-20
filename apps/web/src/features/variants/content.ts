import type { VariantContent } from "@/features/variants/types";

export const variantContent: Record<string, VariantContent> = {
  "cold-mist": {
    nav: { home: "Home", gallery: "Gallery", about: "About", contacts: "Contact" },
    home: {
      eyebrow: "Dark atmosphere / cold mist",
      title: "Форма. Цвет. Пустота.",
      description:
        "Exploring the boundaries of ethereal perception through generative abstraction.",
      primaryCta: "View Collection",
      secondaryCta: "Read the Artist Notes",
    },
    gallery: {
      eyebrow: "Exhibition archive",
      title: "ARCHIVE.",
      description: "A curated collection of ethereal voids and architectural silence. Exploring the intersection of cold slate and misty morning light.",
    },
    about: {
      eyebrow: "Artist / Editorial",
      title: "Biography arranged like a cold gallery essay, not a lifestyle profile.",
      paragraphs: [
        "The tone here is restrained and architectural. Text should feel carved into the atmosphere rather than laid onto a generic card.",
        "Exhibition history, practice notes, and artistic philosophy should sit in a calm editorial cadence with generous negative space.",
      ],
    },
    contacts: {
      eyebrow: "Inquiry",
      title: "A narrow, high-tension contact surface for serious buyers and curators.",
      description: "The form must feel focused and minimal, with structure emerging through tonal contrast rather than decorative framing.",
      channels: ["Email: studio@example.com", "Representation: by appointment", "Collector requests: available upon inquiry"],
      inquiryLabel: "Request Price",
    },
    detail: {
      inquiryLabel: "Request Price",
      note: "Detail view should preserve distance, silence, and tonal restraint.",
    },
  },
  "copper-glow": {
    nav: { home: "Home", gallery: "Gallery", about: "Artist", contacts: "Inquire" },
    home: {
      eyebrow: "Dark atmosphere / copper glow",
      title: "Form. Color. Void.",
      description:
        "Cinematic darkness, oxidized copper light, and architectural tension tuned into a collector-facing editorial gallery.",
      primaryCta: "Explore Archive",
      secondaryCta: "The Manifesto",
    },
    gallery: {
      eyebrow: "Collection",
      title: "Curated Visions",
      description: "Explore the intersection of structural rigidity and atmospheric warmth. A collection curated for the Cinematic Alchemist.",
    },
    about: {
      eyebrow: "Artist / Persona",
      title: "An intense, high-end editorial portrait of the artist and practice.",
      paragraphs: [
        "This variant leans into cinematic luxury and should maintain its warm, copper-lit atmosphere across every section.",
        "Biography blocks, metadata, and inquiry surfaces must keep the same sharp geometry and abyssal depth as the gallery itself.",
      ],
    },
    contacts: {
      eyebrow: "Inquiry",
      title: "A warm spotlight for commissions, acquisitions, and curatorial contact.",
      description: "The contact experience should feel premium and deliberate, not friendly by default.",
      channels: ["Acquisitions: studio@example.com", "Curatorial inquiries: curators@example.com", "Commissions: upon review"],
      inquiryLabel: "Inquire",
    },
    detail: {
      inquiryLabel: "Inquire",
      note: "The artwork detail must preserve cinematic scale and copper lighting tension.",
    },
  },
  "etheric-pulse": {
    nav: { home: "Portal", gallery: "Works", about: "Practice", contacts: "Contact" },
    home: {
      eyebrow: "Dark atmosphere / etheric pulse",
      title: "A breathing digital gallery where light and interface dissolve into energy.",
      description:
        "This variant is mystical and fluid. Glass, glow, and soft pulses are structural here, not decorative flourishes to trim away.",
      primaryCta: "Follow the Energy",
      secondaryCta: "Read the Practice",
    },
    gallery: {
      eyebrow: "Energy field",
      title: "A fluid dark exhibition with glow-led navigation and softer geometry.",
      description: "The UI should recede and pulse, allowing the artwork to feel like the main light source.",
    },
    about: {
      eyebrow: "Practice",
      title: "An atmospheric explanation of process, intuition, and emotional rhythm.",
      paragraphs: [
        "This is the least rigid dark variant and must preserve its sense of movement, soft glow, and breathing space.",
        "Avoid turning the page into a severe editorial sheet; it should still feel mystical and immersive.",
      ],
    },
    contacts: {
      eyebrow: "Contact",
      title: "A soft-glass contact surface that feels integrated into the same energy field.",
      description: "Inputs, chips, and buttons should preserve roundness and low-gravity glow behavior.",
      channels: ["Studio: studio@example.com", "Collectors: collector@example.com", "Instagram: @etheric.pulse.artist"],
      inquiryLabel: "Open Inquiry",
    },
    detail: {
      inquiryLabel: "Open Inquiry",
      note: "Detail view should keep pulses, rounded edges, and glow-led hierarchy.",
    },
  },
  "mint-rose": {
    nav: { home: "Home", gallery: "Gallery", about: "Story", contacts: "Inquire" },
    home: {
      eyebrow: "Organic flow / mint rose",
      title: "A tender, liquid gallery where art feels suspended inside warm watercolor air.",
      description:
        "This variant depends on soft asymmetry, mint highlights, glass surfaces, and emotionally gentle copy. It should never feel harsh or architectural.",
      primaryCta: "View Collection",
      secondaryCta: "Make an Inquiry",
    },
    gallery: {
      eyebrow: "Collection",
      title: "Fluid masks, floating cards, and a collector journey softened by glass and blur.",
      description: "The gallery should feel unstructured and soothing rather than precise or institutional.",
    },
    about: {
      eyebrow: "Story",
      title: "A brief soft-focus narrative placeholder for the mint-and-rose direction.",
      paragraphs: [
        "This variant currently has no dedicated about source screen, so any future About page must stay inside the same tender and liquid design language.",
        "Do not import denser olive or dark editorial behavior into this route.",
      ],
    },
    contacts: {
      eyebrow: "Inquiry",
      title: "An inviting glass card for commissions and purchase requests.",
      description: "The form should feel like a cozy continuation of the gallery, not a transactional utility page.",
      channels: ["Studio: studio@example.com", "Commissions: open", "Collectors: by private response"],
      inquiryLabel: "Send Message",
    },
    detail: {
      inquiryLabel: "Inquire about this piece",
      note: "Use fluid masking and soft-focus framing for detail surfaces.",
    },
  },
  "olive-cream": {
    nav: { home: "Home", gallery: "Gallery", about: "Journal", contacts: "Inquire" },
    home: {
      eyebrow: "Organic flow / olive cream",
      title: "A breathing catalog of abstract work shaped by earth, paper, and tactility.",
      description:
        "This variant has more weight than Mint Rose: literary serif rhythm, olive depth, and tactile cream surfaces should lead every page.",
      primaryCta: "Enter Collection",
      secondaryCta: "View Detail Story",
    },
    gallery: {
      eyebrow: "Collection",
      title: "A soft but grounded masonry wall with tactile olive shadows.",
      description: "Preserve the feeling of a physical catalog page rather than a pastel lifestyle portfolio.",
    },
    about: {
      eyebrow: "Journal",
      title: "A placeholder narrative for the olive editorial family.",
      paragraphs: [
        "This family currently lacks a dedicated About source file in the references, so any About page must be extrapolated from its own literary and tactile rules.",
        "Do not borrow Mint Rose softness or Cold Mist severity to fill the gap.",
      ],
    },
    contacts: {
      eyebrow: "Inquiry",
      title: "An earthy, grounded collector contact surface.",
      description: "Inquiry UI should feel premium, quiet, and literary rather than airy or mystical.",
      channels: ["Acquisitions: studio@example.com", "Collector requests: by appointment", "Commissions: limited availability"],
      inquiryLabel: "Inquire",
    },
    detail: {
      inquiryLabel: "Inquire",
      note: "Detail pages must emphasize scale, material, and literary storytelling.",
    },
  },
  "sage-sand": {
    nav: { home: "Home", gallery: "Gallery", about: "About", contacts: "Contact" },
    home: {
      eyebrow: "Organic flow / sage sand",
      title: "A calm, intimate portfolio built on sand warmth and sage rhythm.",
      description:
        "This version is quieter and more personal than the other organic variants. It should preserve narrative softness, asymmetry, and warm clay accents.",
      primaryCta: "Explore Collection",
      secondaryCta: "Read About",
    },
    gallery: {
      eyebrow: "Gallery Index",
      title: "Soft asymmetrical discovery with personal, non-corporate pacing.",
      description: "The page should feel intimate and inviting, not like a universal art marketplace.",
    },
    about: {
      eyebrow: "About",
      title: "A personal narrative page where biography and exhibition history stay soft and human.",
      paragraphs: [
        "This variant explicitly includes an About page and should preserve its narrative intimacy and warm reading rhythm.",
        "The biography tone should remain personal and reflective rather than brand-heavy or cinematic.",
      ],
    },
    contacts: {
      eyebrow: "Contact",
      title: "A warm, direct invitation to continue the conversation.",
      description: "Keep the contact surface calm and approachable, with clay-accented interactions instead of hard contrast.",
      channels: ["Email: studio@example.com", "Instagram: @sage.sand.artist", "Availability: selected commissions"],
      inquiryLabel: "Contact the Artist",
    },
    detail: {
      inquiryLabel: "Inquire",
      note: "Detail views should remain intimate and distraction-light.",
    },
  },
};
