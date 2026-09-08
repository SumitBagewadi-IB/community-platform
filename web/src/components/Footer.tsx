import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <Image
              src="/images/ib_logo_darkbg.svg"
              alt="Indiabulls Securities"
              width={110}
              height={26}
              style={{ height: 26, width: "auto" }}
            />
            <span>Indiabulls Securities Community</span>
          </div>
          <nav className="site-footer__links">
            <a href="https://www.indiabullssecurities.com" target="_blank" rel="noopener noreferrer">
              Main Website
            </a>
            <a
              href="https://www.indiabullssecurities.com/stocks-equity"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stocks &amp; Equity
            </a>
            <a href="https://www.indiabullssecurities.com/mutual-funds" target="_blank" rel="noopener noreferrer">
              Mutual Funds
            </a>
            <a href="https://www.indiabullssecurities.com/ipo" target="_blank" rel="noopener noreferrer">
              IPO
            </a>
            <Link href="/guidelines">Community Guidelines</Link>
            <a
              href="https://storage.googleapis.com/indiabullssecurities/uploads/quicklinks/pdf/Investor_Grievance_Redressal_Mechanism.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Investor Grievance Redressal
            </a>
            <a
              href="https://www.indiabullssecurities.com/grievance-redressal/feedback-and-suggestions"
              target="_blank"
              rel="noopener noreferrer"
            >
              Feedback &amp; Suggestions
            </a>
          </nav>
        </div>
      </div>

      {/* Source: live registration/regulatory block from the footer of
          indiabullssecurities.com, copied verbatim (fetched 2026-09-11) —
          this replaces the earlier placeholder disclaimer. Re-verify
          against the live site before relying on this if it's been a
          while, since registration details can change. */}
      <div className="site-footer__disclaimer">
        <p>
          Investments in securities market are subject to market risks. Read all the related documents
          carefully before investing.
        </p>
        <p>
          Indiabulls Securities Limited (Formerly known as Dhani Stocks Limited) [Corporate Identification
          Number for ISL: U74999DL2003PLC122874]
        </p>
        <p>
          SEBI Registration Number (Stock Broker): INZ000036136; NSE Membership Number 08756 (Capital
          Market, Futures &amp; Options and Currency Derivatives Segment)
        </p>
        <p>
          BSE Membership Number: 907 (Capital Market, Futures &amp; Options); MCX Membership Number: 12835
        </p>
        <p>
          SEBI Registration Number (Depository Participant): IN-DP-423-2019; NSDL DP ID: IN302236; CDSL DP
          ID: 12029900
        </p>
        <p>
          SEBI Registration Number (Research Analyst): INH000022358; BSE Enlistment Number: 6629
        </p>
        <p>AMFI registration Number ARN-160411 for Mutual Fund Distribution</p>
        <p>APMI registration Number APRN06094 for PMS Distribution</p>
        <p>
          Registered office address: A-2, First Floor, Kirti Nagar, New Delhi - 110015. Tel.: 011-41052775,
          Fax: 011-42137986.
        </p>
        <p>
          Correspondence office address: Plot no. 108, 5th Floor, IT Park, Udyog Vihar, Phase - I, Gurugram
          - 122016, Haryana.
        </p>
        <p>
          Email: <a href="mailto:helpdesk@indiabulls.com">helpdesk@indiabulls.com</a>; Tel: 022-61446300
        </p>
        <p>*Applicable in all segments of NSE (CM, FO, CD), BSE (CM, FO) &amp; MCX</p>
        <p>© All rights reserved {new Date().getFullYear()} Indiabulls Securities.</p>
      </div>
    </footer>
  );
}
