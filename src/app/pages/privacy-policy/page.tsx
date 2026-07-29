import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Great Outdoor collects, uses, shares and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage title="Privacy Policy" meta="Effective Date: 30th April 2025">
      <p>
        At Great Outdoor, we are committed to protecting your privacy and
        safeguarding your personal information. This Privacy Policy explains how
        we collect, use, and share information when you interact with our
        website, place an order, or get in touch with us.
      </p>

      <h2 style={{ fontSize: "var(--text-h2)" }}>1. Information We Collect</h2>
      <p>
        We collect personal details such as your name, email address, contact
        number, shipping and billing addresses, and order details when you make
        a purchase or get in touch. We also use cookies and similar
        technologies to collect usage data such as your browsing behaviour and
        device information for better site performance and user experience.
      </p>

      <h2 style={{ fontSize: "var(--text-h2)" }}>2. How We Use Your Data</h2>
      <p>We use your data to:</p>
      <ul>
        <li>Process and deliver your orders</li>
        <li>Send transactional or service-related communication</li>
        <li>Offer customer support and order updates</li>
        <li>Recommend relevant products or offers (you can opt out any time)</li>
        <li>Track website usage to improve design and functionality</li>
      </ul>
      <p>
        We may also use your details for marketing communications via email or
        WhatsApp if you&apos;ve opted in. You can unsubscribe at any time through
        the links provided or by writing to us.
      </p>

      <h2 style={{ fontSize: "var(--text-h2)" }}>3. Data Sharing</h2>
      <p>
        We do not sell your data. However, to complete your order, your data is
        shared with trusted third parties such as payment gateways,
        shipping/logistics providers, and analytics and marketing platforms
        (Google/Facebook). These partners only access your information to
        perform their specific services and are required to handle it
        responsibly.
      </p>

      <h2 style={{ fontSize: "var(--text-h2)" }}>4. GST &amp; Billing Details</h2>
      <p>
        All billing is done through our parent company, Great Indoors, a
        registered proprietorship. Your invoice will reflect the following GST
        details:
      </p>
      <ul>
        <li>Legal Name: Tarun Bhatia</li>
        <li>Trade Name: Great Indoors</li>
        <li>GSTIN: 08ABOPB2472N1ZB</li>
        <li>Address: Shop No. 5, Hotel Ramada, Raja Park, Jaipur – 302004</li>
      </ul>

      <h2 style={{ fontSize: "var(--text-h2)" }}>5. Packaging &amp; Delivery</h2>
      <p>
        Your order is safely packed in triple-layer protective packaging using
        sturdy cardboard and polywrap to minimize the risk of transit damage.
        For any delivery issues, we request you to record an unboxing video and
        contact us within 48 hours for further assistance.
      </p>

      <h2 style={{ fontSize: "var(--text-h2)" }}>6. Your Rights</h2>
      <p>You have full control over your personal data:</p>
      <ul>
        <li>
          You may request to access, update, or delete your personal data at any
          time by emailing us.
        </li>
        <li>
          You can opt out of promotional communications through the unsubscribe
          link or by contacting us directly.
        </li>
      </ul>
      <p>
        Please note: deleting certain information may limit your access to some
        website features.
      </p>

      <h2 style={{ fontSize: "var(--text-h2)" }}>7. Legal Compliance</h2>
      <p>
        We may disclose your information if required by law or to comply with
        legal obligations, protect our rights, or prevent fraud or other
        unlawful activity. This may include sharing information with law
        enforcement or tax authorities, when necessary.
      </p>

      <h2 style={{ fontSize: "var(--text-h2)" }}>8. Data Security</h2>
      <p>
        We use SSL encryption and industry-standard security tools to protect
        your personal data. While no system is 100% secure, we take commercially
        reasonable steps to keep your data safe and only partner with platforms
        that do the same.
      </p>

      <h2 style={{ fontSize: "var(--text-h2)" }}>9. Third-Party Links</h2>
      <p>
        Our website may contain links to external websites. We are not
        responsible for the content or privacy practices of these websites.
        Please review their policies separately.
      </p>

      <h2 style={{ fontSize: "var(--text-h2)" }}>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page with the updated date. Continued use of our services
        after changes implies your consent.
      </p>

      <h2 style={{ fontSize: "var(--text-h2)" }}>11. Contact Us</h2>
      <p>
        For questions, concerns, or data-related requests, please reach out to
        us at{" "}
        <a href="mailto:greatoutdoor.in@gmail.com">greatoutdoor.in@gmail.com</a>
        .
      </p>
    </PolicyPage>
  );
}
