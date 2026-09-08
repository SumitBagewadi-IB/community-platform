import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container">
      <div style={{ padding: "4rem 0", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem" }}>Page not found</h1>
        <p style={{ color: "var(--ib-gray-500)", marginBottom: "1.5rem" }}>
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to Latest Topics
        </Link>
      </div>
    </div>
  );
}
