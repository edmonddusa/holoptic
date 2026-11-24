import { useEffect, useRef, useState } from "react";

// Formspree form that emails enquiries to eddie@holoptic.org
// (shared with ai.holoptic.org; the subject line tells them apart).
const FORM_ENDPOINT = "https://formspree.io/f/maqdeebp";
const EMAIL = "eddie@holoptic.org";

const topics = [
  "Cloud & Infrastructure",
  "Database Engineering",
  "Software Engineering",
  "Private AI",
  "Something else",
];

// Sending lasts at least this long, so the animation never just flickers.
const MIN_SENDING_MS = 1100;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Adds "is-visible" once the element scrolls into view (for fade-up reveals).
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function EnquiryForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [failures, setFailures] = useState(0); // replays the error shake

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const [response] = await Promise.all([
        fetch(FORM_ENDPOINT, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        }),
        wait(MIN_SENDING_MS),
      ]);
      if (!response.ok)
        throw new Error(`Formspree returned ${response.status}`);
      form.reset();
      setStatus("sent");
    } catch {
      setFailures((n) => n + 1);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="enquiry-done" role="status">
        <svg className="enquiry-check" viewBox="0 0 52 52" aria-hidden="true">
          <circle cx="26" cy="26" r="24" />
          <path d="M15 27 l7.5 7.5 L37 19" />
        </svg>
        <h3>Thank you.</h3>
        <p>
          Your message is on its way. We read every enquiry personally and will
          get back to you by email.
        </p>
        <button
          type="button"
          className="text-button"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      className={`enquiry-form${status === "sending" ? " is-sending" : ""}`}
      onSubmit={handleSubmit}
      aria-busy={status === "sending"}
    >
      <input
        type="hidden"
        name="_subject"
        value="New enquiry from holoptic.org"
      />
      <input type="hidden" name="source" value="holoptic.org" />
      {/* Spam trap: hidden from people, filled in by bots. */}
      <input
        type="text"
        name="_gotcha"
        className="enquiry-trap"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <fieldset className="enquiry-fields" disabled={status === "sending"}>
        <div className="enquiry-row">
          <label>
            <span>Name *</span>
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            <span>Company</span>
            <input name="company" type="text" autoComplete="organization" />
          </label>
        </div>
        <div className="enquiry-row">
          <label>
            <span>Email *</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            <span>Phone (optional)</span>
            <input name="phone" type="tel" autoComplete="tel" />
          </label>
        </div>
        <label>
          <span>What can we help with?</span>
          <select name="topic" defaultValue="">
            <option value="" disabled>
              Choose an area
            </option>
            {topics.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Message *</span>
          <textarea
            name="message"
            rows={6}
            required
            placeholder="The system, the problem, and any constraints or timeline."
          />
        </label>
      </fieldset>

      {status === "error" && (
        <p className="enquiry-error" role="alert" key={failures}>
          Sorry, the message couldn't be sent. Please try again, or email{" "}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a> directly.
        </p>
      )}

      <div className="enquiry-actions">
        <button
          className="button button-dark enquiry-submit"
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? (
            <>
              Sending
              <span className="enquiry-dots" aria-hidden="true">
                <i>.</i>
                <i>.</i>
                <i>.</i>
              </span>
            </>
          ) : (
            "Send enquiry →"
          )}
        </button>
        <p>
          Or email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </div>
    </form>
  );
}

export default function Contact() {
  const introRef = useReveal();
  const panelRef = useReveal();
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
          <div className="reveal" ref={introRef}>
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
          <div className="contact-panel reveal reveal-late" ref={panelRef}>
            <h3>Project enquiry</h3>
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
