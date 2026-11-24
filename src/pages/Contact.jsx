import { useEffect, useRef, useState } from "react";
import { Lines, useI18n, withEmail } from "../i18n/I18n";

// Formspree form that emails enquiries to eddie@holoptic.org
// (shared with ai.holoptic.org; the subject line tells them apart).
const FORM_ENDPOINT = "https://formspree.io/f/maqdeebp";
const EMAIL = "eddie@holoptic.org";

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
  const { d, en, lang } = useI18n();
  const f = d.contact.form;
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
        <h3>{f.doneTitle}</h3>
        <p>{f.doneText}</p>
        <button
          type="button"
          className="text-button"
          onClick={() => setStatus("idle")}
        >
          {f.again}
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
      <input type="hidden" name="language" value={lang} />
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
            <span>{f.name}</span>
            <input name="name" type="text" autoComplete="name" required />
          </label>
          <label>
            <span>{f.company}</span>
            <input name="company" type="text" autoComplete="organization" />
          </label>
        </div>
        <div className="enquiry-row">
          <label>
            <span>{f.email}</span>
            <input name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            <span>{f.phone}</span>
            <input name="phone" type="tel" autoComplete="tel" />
          </label>
        </div>
        <label>
          <span>{f.topicLabel}</span>
          <select name="topic" defaultValue="">
            <option value="" disabled>
              {f.topicPlaceholder}
            </option>
            {/* Shown in the visitor's language, sent in English. */}
            {f.topics.map((topic, i) => (
              <option
                key={en.contact.form.topics[i]}
                value={en.contact.form.topics[i]}
              >
                {topic}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>{f.message}</span>
          <textarea
            name="message"
            rows={6}
            required
            placeholder={f.messagePlaceholder}
          />
        </label>
      </fieldset>

      {status === "error" && (
        <p className="enquiry-error" role="alert" key={failures}>
          {withEmail(f.error, EMAIL)}
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
              {f.sending}
              <span className="enquiry-dots" aria-hidden="true">
                <i>.</i>
                <i>.</i>
                <i>.</i>
              </span>
            </>
          ) : (
            f.send
          )}
        </button>
        <p>{withEmail(f.orEmail, EMAIL)}</p>
      </div>
      <p className="enquiry-privacy">{withEmail(f.privacy, EMAIL)}</p>
    </form>
  );
}

export default function Contact() {
  const { d } = useI18n();
  const t = d.contact;
  const introRef = useReveal();
  const panelRef = useReveal();
  return (
    <>
      <section className="page-hero contact-hero">
        <div className="container">
          <p className="kicker">{t.kicker}</p>
          <h1>
            <Lines lines={t.title} emLast />
          </h1>
          <p>{t.lead}</p>
        </div>
      </section>
      <section className="section section-light">
        <div className="container contact-grid">
          <div className="reveal" ref={introRef}>
            <p className="kicker">{t.introKicker}</p>
            <h2>{t.introTitle}</h2>
            <p>{t.introText}</p>
            <p className="contact-note">{t.note}</p>
          </div>
          <div className="contact-panel reveal reveal-late" ref={panelRef}>
            <h3>{t.panelTitle}</h3>
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
