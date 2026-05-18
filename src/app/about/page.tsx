import Link from "next/link";
import { NavbarShell } from "@/components/shared/navbar-shell";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE_CONFIG } from "@/lib/site-config";
import { Globe, FileText, Award, Target } from "lucide-react";

const highlights = [
  { label: "Press Releases Distributed", value: "50k+" },
  { label: "Media Partners", value: "2,500+" },
  { label: "Companies Served", value: "12k+" },
];

const values = [
  { title: "Professional Distribution", description: "We connect your press releases with thousands of journalists and media outlets worldwide.", icon: Globe },
  { title: "Media Expertise", description: "Our team understands the media landscape and helps craft compelling press releases that get noticed.", icon: FileText },
  { title: "Global Reach", description: "From local news to international media, we ensure your story reaches the right audience.", icon: Target },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <NavbarShell />
      
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 backdrop-blur px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-600 mb-6">
            <Award className="h-3.5 w-3.5" />
            About Mediavoxer
          </div>
          <h1 className="text-4xl font-bold tracking-[-0.04em] text-slate-900 sm:text-5xl lg:text-6xl mb-6">
            Trusted press release publishing and distribution
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-8">
            {SITE_CONFIG.name} helps brands, agencies, and organizations publish official updates with
            clean presentation, category-based discovery, and broad media visibility.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid gap-6 sm:grid-cols-3 mb-16">
          {highlights.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{item.value}</div>
              <div className="text-sm text-slate-600">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] mb-16">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-600 border-blue-200">Our Story</Badge>
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">
              Built for clear announcements and credible visibility
            </h2>
            <p className="text-slate-600 leading-7 mb-4">
              We created this platform for organizations that need a reliable way to publish
              announcements, launch updates, and official statements without friction.
            </p>
            <p className="text-slate-600 leading-7">
              From local campaigns to global launches, every release is structured for readability,
              search discoverability, and distribution across trusted media surfaces.
            </p>
          </div>
          
          <div className="space-y-4">
            {values.map((value) => (
              <div key={value.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <value.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{value.title}</h3>
                    <p className="text-sm text-slate-600 leading-6">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-2xl p-12 border border-blue-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Ready to amplify your message?
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations that trust Mediavoxer for their press release distribution needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Button variant="outline" asChild className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-full">
              <Link href="/contact">
                Contact Our Team
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
