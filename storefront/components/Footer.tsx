import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3">
        <div className="space-y-3">
          <p className="font-heading text-2xl font-bold uppercase tracking-tighter text-white">Minorda</p>
          <p className="font-heading text-lg font-bold uppercase text-volt">Progress isn&apos;t linear.</p>
          <p className="max-w-sm text-sm text-slate-400">
            Performance apparel for athletes who train hard and keep coming back.
          </p>
        </div>
        <nav aria-label="Footer" className="space-y-3">
          <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-white">Shop</h2>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-white" href="/collections">Shop all</Link></li>
            <li><Link className="hover:text-white" href="/search">Search</Link></li>
            <li><Link className="hover:text-white" href="/cart">Cart</Link></li>
          </ul>
        </nav>
        <div className="space-y-3">
          <h2 className="font-heading text-sm font-bold uppercase tracking-[0.12em] text-white">Contact</h2>
          <p className="text-sm">
            <a className="hover:text-white" href="mailto:ops@minorda.com">ops@minorda.com</a>
          </p>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <p className="mx-auto max-w-7xl px-5 py-5 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500">
          © {new Date().getFullYear()} Minorda
        </p>
      </div>
    </footer>
  );
}
