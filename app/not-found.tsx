import Link from 'next/link';
export default function NotFound() {
  return (
    <main id="main" className="container-xl py-5">
      <div className="empty-state">
        <span className="eyebrow">404 · A LITTLE OFF THE MAP</span>
        <h1 className="my-4">Let’s find your next step.</h1>
        <p>We couldn’t find that page. Your next good idea is still welcome here.</p>
        <Link href="/" className="btn btn-primary">
          Back to Veehoster <i className="bi bi-arrow-right" aria-hidden="true" />
        </Link>
      </div>
    </main>
  );
}
