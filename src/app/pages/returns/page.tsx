import type { Metadata } from "next";
import PolicyPage from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Returns & Refund",
  description:
    "Our no-return, no-refund policy for made-to-order handcrafted furniture, and how we handle logistics or manufacturing defects.",
};

export default function ReturnsPage() {
  return (
    <PolicyPage title="Returns & Refund">
      <p>
        At Great Outdoor, each piece of outdoor furniture is handcrafted with
        immense care by over 70 skilled artisans based in the Delhi NCR region.
        Because of the bespoke nature of our process, we follow a strict
        no-return and no-refund policy. Every product is made to order, tailored
        to meet your aesthetic and spatial needs, making reversals impractical
        both logistically and ethically. We strongly encourage our customers to
        make informed selections before placing an order.
      </p>

      <p>
        To support this, our in-house landscape stylist is available via
        WhatsApp for any assistance or guidance you may need in choosing the
        perfect fit for your outdoor space. Once an order has been processed, we
        are unable to accommodate cancellations or modifications.
      </p>

      <p>
        However, within 24 hours of purchase, you will receive dedicated design
        support from our team to ensure your selections align with your vision.
        Our commitment to craftsmanship and thoughtful design means each product
        is as intentional as the spaces it lives in.
      </p>

      <p>
        For any logistics-related or manufacturing defects, we request you to
        record an unwrapping video at the time of delivery. In such rare
        instances, our team will assess the situation and take an appropriate
        call. Our commitment to quality and craftsmanship ensures that every
        piece we deliver is worthy of the spaces you create.
      </p>
    </PolicyPage>
  );
}
