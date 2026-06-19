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
    { href: "#courses", key: "navCourses" },
    { href: "#teachers", key: "navTeachers" },
    { href: "#results", key: "navResults" },
    { href: "#planner", key: "navPlanner" },
  ];

  return (
    <footer id="contact" className="border-t border-white/10 bg-black/40">
      <div className="mx-auto w-[92%] max-w-7xl py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-neon-cyan to-neon-violet text-[#050510]">
                <GraduationCap size={20} strokeWidth={2.5} />
              </span>
              <span className="text-lg font-black text-white">{settings.logoText || settings.name}</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">{settings.aboutText}</p>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-3">
                {socials.map(({ href, icon: Icon }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full glass text-slate-300 transition hover:text-neon-cyan hover:shadow-[0_0_16px_rgba(34,211,238,0.5)]"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">{t("footerLinks")}</h4>
            <ul className="mt-4 space-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-slate-400 transition hover:text-neon-cyan">
                    {t(link.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">{t("footerContact")}</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              {settings.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone size={15} className="text-neon-cyan" />
                  <a href={`tel:${settings.phone}`} className="transition hover:text-white">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-2.5">
                  <Mail size={15} className="text-neon-cyan" />
                  <a href={`mailto:${settings.email}`} className="transition hover:text-white">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-neon-cyan" />
                  <a href={settings.mapsUrl || "#"} target="_blank" rel="noreferrer" className="transition hover:text-white">
                    {settings.address}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {settings.name}. {t("footerRights")}
        </div>
      </div>
    </footer>
  );
}
