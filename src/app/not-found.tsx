import Link from "next/link";
import { content } from "@/lib/content";

export default function NotFound() {
  return (
    <div className="wrap section">
      <p className="meta">Viga 404</p>
      <h1 className="mt-3">Seda lehte ei leitud.</h1>
      <p className="lead mt-5 max-w-prose">
        Aadress võib olla vigane või leht on teisaldatud. Alusta avalehelt või vaata ruume.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary">
          {content.navigation[0].label}
        </Link>
        <Link href="/#ruumid" className="btn btn-secondary">
          {content.hero.primaryCta}
        </Link>
      </div>
    </div>
  );
}
