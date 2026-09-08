import Sidebar from "@/components/Sidebar";

export const metadata = { title: "Community Guidelines" };

export default function GuidelinesPage() {
  return (
    <div className="container">
      <div className="layout">
        <Sidebar />
        <main>
          <div className="content-card">
            <div className="content-card__header">
              <h1>Community Guidelines</h1>
            </div>
            <div style={{ padding: "1.25rem", lineHeight: 1.7 }}>
              <h3 style={{ marginTop: 0 }}>Be respectful</h3>
              <p>
                Disagree with an idea, not the person. No harassment, personal attacks, or
                discriminatory language.
              </p>

              <h3>This is not investment advice</h3>
              <p>
                Nothing posted here — by other members or Indiabulls Securities staff — is a
                personalised investment recommendation. Do your own research and consult a
                qualified advisor before making investment decisions.
              </p>

              <h3>No spam or promotion</h3>
              <p>
                Don&apos;t use the community to advertise unrelated products, services, or
                external trading groups.
              </p>

              <h3>Protect your account and privacy</h3>
              <p>
                Never share your client ID, password, OTP, or other account credentials here —
                Indiabulls Securities staff will never ask for these in the community.
              </p>

              <h3>Report an issue</h3>
              <p>
                Flag anything that violates these guidelines using a post&apos;s options menu, or
                reach out to support through the main website.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
