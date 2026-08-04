import AnnouncementBar from "./AnnouncementBar";
import EnquiryFab from "./EnquiryFab";
import Footer from "./Footer";
import Sidebar, { type NavCollection } from "./Sidebar";
import ValueProps from "./ValueProps";
import WhatsAppFab from "./WhatsAppFab";

type Props = {
  collections: NavCollection[];
  /** Promo band text; omit or leave blank to hide the bar. */
  announcement?: string;
  children: React.ReactNode;
};

/**
 * Page frame: fixed left sidebar (desktop) / top bar + drawer (mobile),
 * with the content region scrolling independently to its right.
 */
export default function SiteShell({
  collections,
  announcement,
  children,
}: Props) {
  return (
    <div className="min-h-full">
      {announcement && <AnnouncementBar text={announcement} />}
      <Sidebar collections={collections} hasAnnouncement={Boolean(announcement)} />
      {/*
        pt-16 clears the fixed mobile header; .site-main clears the desktop
        rail. The announcement bar is also fixed, so .has-announcement adds its
        height on top — see globals.css.

        pb-16 clears the fixed mobile CTA bar, which would otherwise sit over
        the last rows of the footer. Desktop has no bar, so the padding lifts.
      */}
      <div
        className={`site-main pb-16 pt-16 lg:pb-0 lg:pt-0 ${
          announcement ? "has-announcement" : ""
        }`}
      >
        <main>{children}</main>
        <ValueProps />
        <Footer />
      </div>
      <EnquiryFab />
      <WhatsAppFab />
    </div>
  );
}
