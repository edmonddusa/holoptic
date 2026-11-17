export default function Contact() {
  return (
    <>
      <section className="page-hero contact-hero">
        <div className="container">
          <p className="kicker">CONTACT</p>
          <h1>
            Let's talk about
            <br />
            <em>your next challenge.</em>
          </h1>
          <p>
            Architecture, modernization, performance, or delivery — tell us what
            you're working on.
          </p>
        </div>
      </section>
      <section className="section section-light">
        <div className="container contact-grid">
          <div>
            <p className="kicker">START A CONVERSATION</p>
            <h2>Good engineering starts with a clear discussion.</h2>
            <p>
              We work with teams looking for experienced technical guidance and
              hands-on delivery. Share your objectives, constraints, and
              timeline.
            </p>
            <p className="contact-note">
              Budapest, Hungary · International and remote engagements
            </p>
          </div>
          <div className="contact-panel">
            <h3>Project enquiry</h3>
            <p>
              Use the button below to open your email application. Your message
              is sent only when you choose to send it.
            </p>
            <a
              className="button button-dark"
              href="mailto:eddie@holoptic.org?subject=Holoptic%20project%20enquiry"
            >
              Email Holoptic →
            </a>
            <p className="contact-small">
              <strong>
                <a href="mailto:eddie@holoptic.org">eddie@holoptic.org</a>
              </strong>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
