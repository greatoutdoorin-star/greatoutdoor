import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Processing times, triple-layer packaging, delivery across 18,700+ pin codes, and what to do in the event of transit damage.",
};

export default function ShippingPage() {
  return (
    <PolicyPage title="Shipping Policy">
      <p>
        At Great Outdoor, every piece is handcrafted with great attention to
        detail by our skilled artisans, ensuring you receive a product that&apos;s
        truly special. Our standard processing time for order fulfillment
        typically ranges from 10 to 18 working days following order
        confirmation. This window allows us to maintain the highest standards of
        craftsmanship and quality assurance before dispatching your order.
      </p>

      <p>
        To ensure your furniture arrives in perfect condition, all our products
        are packed using triple-layer packaging, combining durable cardboard and
        protective polywrap. This careful packaging provides an extra layer of
        safety against handling damage during transit, allowing your handcrafted
        pieces to reach you securely and ready to transform your space.
      </p>

      <p>
        Once your furniture is ready, our trusted third-party logistics partners
        take over, ensuring a seamless and reliable delivery experience. You
        will receive timely updates on the shipment status right up until your
        order reaches your doorstep. We are proud to deliver across India,
        covering over 18,700+ pin codes, subject to serviceability checks.
      </p>

      <p>
        We encourage you to record an unwrapping video at the time of delivery.
        In the rare event of transit damage, please contact our support team
        within 48 hours, sharing clear photos and the video. After assessing the
        situation, we will guide you toward the appropriate solution, whether
        that involves a minor DIY fix (assisted by our team) or further steps
        for return or refund, if required.
      </p>

      <p>
        Please note that our furniture is made with thick, durable German cane.
        In case of minor nicks or cuts, our team will assist you with repair
        options such as adhesive touch-ups, layering, or other easy fixes. Given
        the handwoven nature of the product, complete reweaving is often
        impractical, but minor maintenance can restore the beauty and strength
        of your piece with ease.
      </p>

      <p>
        We appreciate your patience and understanding as we work to deliver your
        order with utmost care, craftsmanship, and efficiency. Should there be
        any unforeseen delays or exceptional circumstances, our team will
        promptly keep you informed.
      </p>
    </PolicyPage>
  );
}
