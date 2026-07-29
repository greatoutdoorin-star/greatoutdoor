import Footer from "./Footer";
import Sidebar, { type NavCollection } from "./Sidebar";
import ValueProps from "./ValueProps";
import WhatsAppFab from "./WhatsAppFab";

type Props = {
  collections: NavCollection[];
  children: React.ReactNode;
};

/**
 * Page frame: fixed left sidebar (desktop) / top bar + drawer (mobile),
 * with the content region scrolling independently to its right.
 */
export default function SiteShell({ collections, children }: Props) {
  return (
    <div className="min-h-full">
      <Sidebar collections={collections} />
      {/* pt-16 clears the mobile top bar; .site-main clears the desktop rail */}
      <div className="site-main pt-16 lg:pt-0">
        <main>{children}</main>
        <ValueProps />
        <Footer />
      </div>
      <WhatsAppFab />
    </div>
  );
}
