'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container-xl py-5">
      <div className="empty-state">
        <h1>A small interruption.</h1>
        <p>Something didn’t load as expected. Please try again.</p>
        <button className="btn btn-primary" onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
