import { business } from "@/lib/business";

/**
 * Política de privacidad y Términos y condiciones, tal como los entregó el
 * cliente (en inglés: son textos legales y no se traducen sin revisión).
 * Viven en /privacy-policy y /terms, las URLs que se registraron para el
 * programa de mensajes de texto.
 */

export type LegalSection = {
  h2: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Lista numerada (los puntos de los SMS Terms) */
  numbered?: string[];
};

export type LegalDoc = {
  path: "/privacy-policy" | "/terms";
  title: string;
  /** <title> y description */
  metaTitle: string;
  description: string;
  /** Nombre corto para las migas y el footer */
  name: string;
  effectiveDate: string;
  intro: string;
  sections: LegalSection[];
};

const EFFECTIVE_DATE = "October 22, 2026";
const ADDRESS = "2362 Old Middlefield Way, Ste B2, Mountain View, CA 94043";
const PHONE = "(408) 449-1311";
const EMAIL = business.email;

const contact: LegalSection = {
  h2: "Contact us",
  paragraphs: [business.name, ADDRESS, `Phone: ${PHONE}`, `Email: ${EMAIL}`],
};

export const privacyPolicy: LegalDoc = {
  path: "/privacy-policy",
  title: "Privacy Policy",
  metaTitle: "Privacy Policy | Hybrid World Inc",
  description:
    "How Hybrid World Inc collects, uses and protects your information, including text message (SMS) opt-in data, and your California privacy rights.",
  name: "Privacy Policy",
  effectiveDate: EFFECTIVE_DATE,
  intro: `${business.name} ("${business.name}," "we," "us") operates an automotive repair and service shop at ${ADDRESS}. This Privacy Policy explains what information we collect, how we use it, and your choices.`,
  sections: [
    {
      h2: "Information we collect",
      bullets: [
        "Contact information you provide, such as your name, mobile phone number, and email address, when you visit our shop, fill out a form, or sign up for our text messages.",
        "Vehicle and service information related to repairs and maintenance we perform.",
        "Records of your consent to receive text messages, including the date and time you opted in.",
        "Basic website usage data, such as pages visited and browser type, collected through cookies or similar tools.",
      ],
    },
    {
      h2: "How we use your information",
      bullets: [
        "To provide and manage automotive repair and maintenance services.",
        "To contact you about appointments, estimates, and your vehicle.",
        "If you opted in, to send you promotional text messages about special offers and services.",
        "To respond to your questions and improve our services and website.",
        "To comply with legal obligations.",
      ],
    },
    {
      h2: "SMS messaging",
      paragraphs: [
        "If you opt in to our text messages, we use your mobile number only to send you the messages you agreed to receive. Message frequency varies (up to 4 messages per month). Message and data rates may apply. You can opt out at any time by replying STOP, or reply HELP for help.",
        "We do not sell or share your SMS opt-in data or personal information with third parties for marketing purposes.",
        "Text messaging originator opt-in data and consent will not be shared with any third parties, except service providers (such as our messaging platform provider) that help us deliver messages on our behalf.",
      ],
    },
    {
      h2: "How we share information",
      paragraphs: [
        "We do not sell your personal information. We may share information only with service providers that help us operate our business (for example, payment processing, shop management software, and message delivery), or when required by law.",
      ],
    },
    {
      h2: "Data security",
      paragraphs: ["We take reasonable measures to protect your information from unauthorized access, loss, or misuse."],
    },
    {
      h2: "Your California privacy rights",
      paragraphs: [
        "If you are a California resident, you may request to know what personal information we have collected about you, request that we delete it, and opt out of any sale or sharing of personal information. To make a request, contact us using the information below.",
      ],
    },
    {
      h2: "Changes to this policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. The updated version will be posted on this page with a new effective date.",
      ],
    },
    contact,
  ],
};

export const terms: LegalDoc = {
  path: "/terms",
  title: "Terms & Conditions",
  metaTitle: "Terms & Conditions | Hybrid World Inc",
  description:
    "Terms & Conditions for the Hybrid World Inc website, services and Text Deals SMS program: message frequency, opt-out, help and privacy.",
  name: "Terms & Conditions",
  effectiveDate: EFFECTIVE_DATE,
  intro: `These Terms & Conditions apply to the website and services of ${business.name}, an automotive repair and service shop located at ${ADDRESS}. By using our website or services, you agree to these terms.`,
  sections: [
    {
      h2: "Services",
      paragraphs: [
        "Repair estimates are subject to change after vehicle inspection. Additional work will only be performed with your approval. Prices, promotions, and availability may change without notice.",
      ],
    },
    {
      h2: "SMS Terms",
      numbered: [
        `Program description: By opting in to the ${business.name} Text Deals program, you agree to receive recurring automated promotional and marketing text messages from ${business.name}, including special offers, discounts, and announcements about our auto repair and maintenance services.`,
        "Consent is not a condition of any purchase or service.",
        "Message frequency: Message frequency varies, up to 4 messages per month.",
        "Message and data rates may apply. Contact your wireless carrier for details about your plan.",
        "Opt out: You can cancel at any time by replying STOP. You will receive one final message confirming that you have been unsubscribed. After that, you will no longer receive messages from us unless you opt in again.",
        `Help: Reply HELP for help, or contact us at ${PHONE} or ${EMAIL}.`,
        "Carriers are not liable for delayed or undelivered messages.",
        "Supported carriers include major U.S. wireless carriers. Delivery is not guaranteed.",
        "Privacy: Your information is handled as described in our Privacy Policy at hybridworldinc.com/privacy-policy. We do not sell or share your SMS opt-in data or personal information with third parties for marketing purposes.",
      ],
    },
    {
      h2: "Limitation of liability",
      paragraphs: [
        `To the fullest extent permitted by law, ${business.name} is not liable for indirect or incidental damages arising from the use of our website or messaging program.`,
      ],
    },
    {
      h2: "Changes to these terms",
      paragraphs: ["We may update these Terms & Conditions from time to time. Changes will be posted on this page with a new effective date."],
    },
    contact,
  ],
};

export const legalDocs = [privacyPolicy, terms];
