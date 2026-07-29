/**
 * FAQ content, grouped by category exactly as on the reference page.
 * Moves to the database once the admin panel lands so these are editable.
 */

export type Faq = { q: string; a: string };
export type FaqGroup = { category: string; items: Faq[] };

export const FAQ_GROUPS: FaqGroup[] = [
  {
    category: "About Us",
    items: [
      {
        q: "Where are Great Outdoor pieces manufactured?",
        a: "All our handwoven pieces are designed and produced in the business hub of Delhi NCR and supplied worldwide.",
      },
      {
        q: "Do you have a store where we can see a physical sample?",
        a: 'Yes, you can visit our showroom in Raja Park, Jaipur, by the name of our parent company "Great Indoors", where you\'ll find samples of all our materials along with displays of some furniture pieces and other wide range of products.',
      },
      {
        q: "What materials are your products made from?",
        a: "Our furniture is hand knitted with premium German cane and rope, offering both strength and visual appeal. The aluminium frame not only makes our products lightweight but ensures it stays rust free for years. We use wooden finishes on our frames and not actual wood, ensuring longevity without the risk of rust.",
      },
      {
        q: "Do you work with hotels or restaurants and provide B2B collaboration?",
        a: "We are one of the largest suppliers of outdoor furniture for the hospitality sector and would love to collaborate with you. Please email us at hello@greatoutdoor.in, and our team will get in touch or visit our Bulk Order page for more information.",
      },
    ],
  },
  {
    category: "Designs & Customization",
    items: [
      {
        q: "Do you offer customization?",
        a: "Yes, for retail orders, you can select from a variety of cane or rope colors along with weather-proof upholstery options. For bulk orders, we offer extensive customization including design, dimensions, materials, weave styles, prints and more.",
      },
      {
        q: "Can I change the weave or knit style of the rope or cane?",
        a: "Yes, our collection offers a variety of weave and knit patterns. Customization options like altering the weave, knit, cushion colors, and prints are available. You can still email us at hello@greatoutdoor.in or WhatsApp to see if knit change is feasible for the specific design you picked from our website.",
      },
      {
        q: "Do you offer any design assistance?",
        a: "Our landscape stylist will call you within 48 hours of placing your order to guide you through your final preferences and help you select the ideal cane/rope shades and upholstery options depending on your outdoor space. Since all our designs are handmade & made-to-order, they cannot be returned, canceled, or exchanged. This call ensures we confirm your choices before processing the order.",
      },
      {
        q: "Can I purchase a complete set?",
        a: 'Absolutely! If you like a specific chair, you can easily select the matching table from the "You may also like" section to create a cohesive set. If you\'re looking for a custom sofa set, email us your requirements, and our team will reach out to assist you.',
      },
    ],
  },
  {
    category: "Payments & Refunds",
    items: [
      {
        q: "What is your policy on refunds and exchanges?",
        a: "Due to the handcrafted nature of our products, we maintain a no-return and no-refund policy. Each item is meticulously crafted by a team of 70+ skilled artisans from Delhi NCR, which makes returns impractical. Our commitment to quality and craftsmanship ensures that every piece is tailored to meet your needs. We encourage you to review your selections carefully before placing an order. For any other help, please reach out to our support team or discuss with our landscape stylist over WhatsApp for more.",
      },
      {
        q: "Can payments be made in monthly installments?",
        a: "Yes, we offer the option to make payments in monthly installments. During the checkout process, you can select an installment plan that suits your budget. This makes it easier for you to enjoy our handcrafted outdoor furniture while spreading the cost over several months.",
      },
      {
        q: "Can I cancel or modify my order after placing it?",
        a: "Once your order is processed, cancellations or modifications cannot be made due to the handcrafted nature of our products. Each item is meticulously hand-woven by our skilled artisans, making alterations challenging. However, you will receive design assistance within 48 hours of placing your order, ensuring your selection is perfectly suited for your outdoor setting by our landscape stylist.",
      },
    ],
  },
  {
    category: "Delivery, Logistics & Damages",
    items: [
      {
        q: "What is the delivery time?",
        a: "Once payment is authorized and the receipt is generated, the manufacturing time is 2 to 3 weeks. After your order is processed and ready for shipment, our third-party logistics provider will notify you about the delivery status until it arrives at your doorstep.",
      },
      {
        q: "Do you deliver across India?",
        a: "Yes, we deliver to all the locations covered by our third-party logistics platform, as acclaimed they deliver to 18,700+ pin codes across India. At the end of the ordering process, you can check the availability by entering your pin code.",
      },
      {
        q: "What happens if my furniture is damaged in transit?",
        a: "(ENSURE THAT YOU RECORD A VIDEO OF UNPACKING THE FURNITURE) If your furniture is damaged during transit, please contact our support team with photos & videos of the damage within 48 hours of delivery. We will assess the damage and, if irreparable, arrange for a return or refund after inspection. Minor issues can be resolved with a little DIY touchup for which our team will assist you!",
      },
      {
        q: "Will the furniture be replaced in case of a cut in the cane?",
        a: "Our thick and durable German cane is designed to prevent unraveling, even if cut from one end. In such cases, our options as manufacturers are limited to: using a strong adhesive, stapling the cane, layering with an extra piece of cane, or, as a last resort, reweaving the entire chair, which is impractical and unsustainable. To assist you in these situations, we provide necessary instructions for easy fixture and maintenance of your furniture at home.",
      },
    ],
  },
  {
    category: "Installation & Handling",
    items: [
      {
        q: "How is my furniture packaged for delivery?",
        a: "To ensure your furniture arrives in perfect condition, all our products are packed using triple-layer packaging, combining durable cardboard and protective polywrap. This careful packaging provides an extra layer of safety against handling damage during transit, allowing your handcrafted pieces to reach you securely and ready to transform your space.",
      },
      {
        q: "Is installation provided with my purchase?",
        a: "No installation is required. Our furniture is delivered in sealed packaging with triple-layer plastic and cardboard protection, ensuring it arrives safely. Just unpack and set up—no additional steps needed!",
      },
      {
        q: "Can I move the furniture around easily?",
        a: "Yes, our outdoor furniture is lightweight yet sturdy, thanks to its durable aluminum frame, making it easy to rearrange or relocate as needed.",
      },
    ],
  },
  {
    category: "Cleaning & Care Tips",
    items: [
      {
        q: "How do I clean my cushions?",
        a: "Cushions can be machine-washed or cleaned by hand with mild soap and water. Avoid harsh cleaning methods to maintain their quality.",
      },
      {
        q: "Can furniture be left outside all year round?",
        a: "While our products are made of durable materials like German cane, rope, and aluminum, which are ideal for outdoor settings, along with our weatherproof cushion covers, we recommend keeping your furniture in the shade for its longevity. Harsh sunlight can harm the appearance over years of exposure.",
      },
    ],
  },
  {
    category: "Warranty & Memberships",
    items: [
      {
        q: "Do you offer any membership or loyalty programs?",
        a: "Yes, we offer a membership program through our email subscription. By subscribing, you'll receive exclusive notifications about new product drops before they are available on our website. This way, you can enjoy early access, ensuring you never miss out on our newest arrivals.",
      },
      {
        q: "Do your products come with a warranty?",
        a: "Yes, we stand by the quality of our products with a comprehensive warranty. Our cushions come with a 2-year warranty on the color of the covers, ensuring they maintain their vibrant appearance over time, and a 5-year warranty on the color of the materials used in our furniture. Furthermore, there is a 10-year warranty against any breakage, reflecting our commitment to durability and craftsmanship.",
      },
    ],
  },
  {
    category: "Bulk & Business Orders",
    items: [
      {
        q: "Do you provide customized solutions for bulk orders?",
        a: "Yes, we offer customized solutions for bulk orders specifically tailored to hotels, cafes, and other businesses. The minimum order quantity for bulk is ₹50,000. We understand that each establishment has unique needs, so we can adjust products to match your specifications, including design, color, and materials. Please reach out to us to discuss your customization options for bulk orders and receive the best quote for your needs.",
      },
      {
        q: "How to place bulk orders?",
        a: "To place a bulk order, start by browsing our collection and finalizing your desired product. Our Ecommerce Range is limited but we can send an extensive deck of our products over WhatsApp. With a huge range of knits and weaves, along with a variety of cushion colors, prints, and choices of cane or rope colors. Additionally, bulk orders can be customized with specific dimensions and designs. If you have a unique design outside of our provided range, we can bring that to life as well to perfectly meet your requirements.",
      },
    ],
  },
  {
    category: "New Drops & Sales",
    items: [
      {
        q: "How often do you release new collections?",
        a: "We release new collections every 6 months, where we strive to experiment with designs and bring out the best in craftsmanship. Each collection showcases innovative styles reflecting the latest trends and timeless outdoor furniture aesthetics. Keep an eye out for our updates and subscribe to our membership through email.",
      },
    ],
  },
];
