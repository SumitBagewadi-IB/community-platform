import Image from "next/image";

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
            <a href="#">Community Guidelines</a>
          </nav>
        </div>
      </div>
      <p className="site-footer__disclaimer">
        Investments in securities market are subject to market risks. Read all the related documents
        carefully before investing. [PLACEHOLDER — replace with the current SEBI/compliance-approved
        disclaimer and registration numbers before this goes live.]
      </p>
    </footer>
  );
}
