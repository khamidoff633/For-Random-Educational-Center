import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Send,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import type { SchoolSettings } from "../../types";
import type { UIKey } from "../../i18n";

export default function Footer({
  settings,
  t,
}: {
  settings: SchoolSettings;
  t: (key: UIKey) => string;
}) {
  const socials = [
    { href: settings.telegram, icon: Send },
    { href: settings.instagram, icon: Instagram },
    { href: settings.facebook, icon: Facebook },
    { href: settings.youtube, icon: Youtube },
  ].filter((s) => s.href);

  const links: { href: string; key: UIKey }[] = [
    { href: "#about", key: "navAbout" },
    { href: "#courses", key: "navCourses" },
    { href: "#teachers", key: "navTeachers" },
    { href: "#results", key: "navResults" },
    { href: "#faq", key: "navFaq" },
  ];

  return (
    <footer className="bg-wine text-cream/80">
      <div className="mx-auto w-[92%] max-w-7xl py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-caramel to-caramel-deep text-white">
                <GraduationCap size={20} strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-extrabold text-cream">
                {settings.logoText || settings.name}
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">{settings.aboutText}</p>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-3">
                {socials.map(({ href, icon: Icon }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-cream/80 transition hover:bg-caramel hover:text-white"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-cream">
              {t("footerLinks")}
            </h4>
            <ul className="mt-4 space-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-cream/60 transition hover:text-caramel">
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-cream">
              {t("footerContact")}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-cream/60">
              {settings.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone size={15} className="text-caramel" />
                  <a href={`tel:${settings.phone}`} className="transition hover:text-cream">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-2.5">
                  <Mail size={15} className="text-caramel" />
                  <a href={`mailto:${settings.email}`} className="transition hover:text-cream">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-caramel" />
                  <a href={settings.mapsUrl || "#"} target="_blank" rel="noreferrer" className="transition hover:text-cream">
                    {settings.address}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-cream/50">
          © {new Date().getFullYear()} {settings.name}. {t("footerRights")}
        </div>
      </div>
    </footer>
  );
}
