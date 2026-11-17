"use client";

import { useState } from "react";
import { Icon, ClosetScene } from "@/app/components/landing/illustrations";
import { Faq, LandingFooter, LandingNav, SectionHead, Steps, StickyCta, SuitesSection, scrollToForm, sendInquiry, type SubmitState } from "@/app/components/landing/Landing";
import { SUITES } from "@/app/components/landing/suites";

/* Avatar: the independent business traveller in Toronto Mon–Thu, plus the companies who book for them.
   Copy is built from the Nov 2026 Reddit deep dive (Marketing/Avatar Research — Reddit Deep Dive). */

const PAINS = [
  { icon: "cutlery", title: "Dinner with a plastic fork", body: "No fridge, no plate, no knife. The per diem goes to takeout and you eat it sitting on the bed." },
  { icon: "mask", title: "Blinking lights at 2 a.m.", body: "Gappy curtains, a glowing smoke detector, an AC that clicks off at 3. You've started packing tape for the LEDs." },
  { icon: "bag", title: "The same bag, every Sunday", body: "Shirts, chargers, gym shoes, the monitor you can't bring. Pack it, haul it, unpack it. Every single week." },
  { icon: "key", title: "A stranger every Monday", body: "New room, new rules, new Wi-Fi password, and a front desk that's never heard of you." },
];

const HOME_BASE = [
  { icon: "bin", title: "A leave-it-here bin", body: "Shirts, shoes, chargers, your monitor. We store it between stays and set it back out before you land." },
  { icon: "calendar", title: "The same suite, every time", body: "Same bed, same desk, same shower. No learning a new room at 10 p.m. on a Monday." },
  { icon: "thermo", title: "Your preferences on file", body: "Pillow, thermostat, coffee order. Set before you walk in, every week, without asking twice." },
  { icon: "receipt", title: "A standing-week rate", body: "Book the season, not the night. Weekly and standing-week rates, quoted up front." },
];

const WEEK = [
  { d: "Mon", s: "Walk in. It's set up.", in: true },
  { d: "Tue", s: "Cook. Sleep.", in: true },
  { d: "Wed", s: "Work. Laundry.", in: true },
  { d: "Thu", s: "Leave your bin.", in: true },
  { d: "Fri", s: "We store it.", in: false },
  { d: "Sat", s: "You're home.", in: false },
  { d: "Sun", s: "Pack light.", in: false },
];

const AMENITIES = [
  { icon: "sleep", title: "Sleep", items: ["A real bedroom with a door", "Extra pillows + blankets", "Air conditioning + heat you control", "Fresh linens + towels"] },
  { icon: "desk", title: "Work", items: ["A proper desk, not a vanity", "Fast Wi-Fi", "A dining table for spreading out", "Smart TV with Netflix for after"] },
  { icon: "cutlery", title: "Eat", items: ["Full kitchen: stove, oven, fridge, freezer", "Real cutlery, sharp knives, pots + pans", "Coffee maker with coffee stocked", "Microwave + wine glasses"] },
  { icon: "washer", title: "Live", items: ["Washer + dryer in the suite", "Shampoo, conditioner, body wash", "Closet space + hangers", "Cleaning supplies, so it stays yours"] },
];

const EXTRAS = [
  { icon: "mask", title: "Blackout, no blinking lights", body: "Curtains that close all the way. Every LED covered." },
  { icon: "plug", title: "Power on both sides of the bed", body: "Plus USB-C at the desk and a spare strip." },
  { icon: "desk", title: "A monitor on the desk", body: "Plug in your laptop and get a second screen." },
  { icon: "board", title: "First-night fridge", body: "Send a grocery list. It's stocked when you arrive." },
  { icon: "tray", title: "Grab-and-go breakfast", body: "Packed and waiting for the 6 a.m. flight home." },
  { icon: "iron", title: "Steamer, set up", body: "Shirts out of the bin and straight onto your back." },
];

const TEAMS = [
  { icon: "home", title: "Relocations", body: "A furnished base while a new hire finds a place." },
  { icon: "team", title: "Project teams", body: "Rotating staff, one suite, one invoice." },
  { icon: "briefcase", title: "Consultants + executives", body: "Recurring weeks for people who'd rather not live in a lobby." },
  { icon: "shield", title: "Insurance placements", body: "A comfortable, private home while theirs is repaired." },
];

const STEPS = [
  { icon: "calendar", title: "Tell us your weeks", body: "Your first night, which nights, and how often. It takes about thirty seconds." },
  { icon: "receipt", title: "Get your rate", body: "We reply with open dates and your weekly or standing-week rate. No surprises at checkout." },
  { icon: "key", title: "Walk in Monday", body: "Self check-in. Your bin is unpacked, your coffee's stocked, the Wi-Fi password is on the desk." },
];

const FAQ = [
  { q: "Can I expense it?", a: "Yes. Every stay gets an itemized invoice with your company name, dates, nightly rate and tax lines shown separately, emailed when you check out. Companies can also be billed directly." },
  { q: "How does leaving my things actually work?", a: "On a standing schedule you get a labelled bin. Leave it in the suite when you check out. We store it and set everything back out before your next arrival: shirts on hangers, shoes by the door, monitor on the desk." },
  { q: "Do I have to commit to every week?", a: "No. Book one week to try it. If it works, lock in a schedule: every week, every other week, or around your project." },
  { q: "How does check-in work?", a: "Self check-in. Arrival instructions come before your first night, so there's no key handoff and no waiting around. If anything's off, a real person answers by text." },
  { q: "Is there parking?", a: "Parking is included at The Earl. Ask us about options near the Bathurst suites." },
  { q: "What if my trip changes?", a: "Tell us as early as you can. Change and cancellation terms are spelled out on your quote before you book anything." },
  { q: "Where are the suites?", a: "Downtown near Wellesley & Sherbourne, and in the Annex on Bathurst near Bloor. Both are a walk from the subway. More Toronto suites are on the way." },
];

const FREQUENCY = ["One week to try it", "Every week", "Every other week", "A few times a month", "One longer stay (project or relocation)"];
const NIGHTS = ["1–2 nights", "3 nights (Mon–Thu)", "4 nights", "5+ nights", "A month or longer"];

function InquiryForm({ suite, setSuite }: { suite: string; setSuite: (s: string) => void }) {
  const [who, setWho] = useState<"me" | "company">("me");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const [f, setF] = useState({ name: "", email: "", phone: "", company: "", firstNight: "", frequency: FREQUENCY[1], nights: NIGHTS[1], people: "1", notes: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.email) { setError("Add your email so we can send your rate."); return; }
    setState("sending"); setError("");
    const recurring = f.frequency !== FREQUENCY[0] && f.frequency !== FREQUENCY[4];
    const message = [
      `Booking for: ${who === "me" ? "myself" : "my company / team"}`,
      `How often: ${f.frequency}`,
      `Nights per stay: ${f.nights}`,
      who === "company" ? `People / suites needed: ${f.people}` : "",
      `Suite: ${suite || "No preference"}`,
      f.notes ? `Notes: ${f.notes}` : "",
    ].filter(Boolean).join("\n");
    const ok = await sendInquiry({
      name: f.name, email: f.email, phone: f.phone, company: f.company, moveIn: f.firstNight, message, listing: suite,
      source: "corporate", tags: ["business-travel", ...(recurring ? ["home-base"] : [])],
    });
    setState(ok ? "done" : "error");
    if (!ok) setError("That didn't send. Try again, or email info@carestaysuites.com.");
  };

  if (state === "done") {
    return (
      <div className="lp-form lp-done">
        <Icon name="check" size={64} />
        <h3>Got it.</h3>
        <p>We&apos;ll reply by email with open dates and your rate. Keep an eye on your inbox (and spam, just in case).</p>
        <a href="#suites" className="lp-btn lp-btn--ghost">Look at the suites again</a>
      </div>
    );
  }

  return (
    <form className="lp-form" onSubmit={submit} noValidate>
      <div className="lp-seg" role="tablist" aria-label="Who is this for">
        <button type="button" className={who === "me" ? "is-on" : ""} onClick={() => setWho("me")}>Just me</button>
        <button type="button" className={who === "company" ? "is-on" : ""} onClick={() => setWho("company")}>My company or team</button>
      </div>
      <div className="lp-form-row">
        <div className="lp-field"><label htmlFor="b-name">Name</label><input id="b-name" autoComplete="name" value={f.name} onChange={set("name")} placeholder="Sam Patel" /></div>
        <div className="lp-field"><label htmlFor="b-email">Email</label><input id="b-email" type="email" autoComplete="email" required value={f.email} onChange={set("email")} placeholder="sam@company.com" /></div>
      </div>
      <div className="lp-form-row">
        <div className="lp-field"><label htmlFor="b-phone">Phone</label><input id="b-phone" type="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} placeholder="(647) 000-0000" /></div>
        <div className="lp-field"><label htmlFor="b-company">Company{who === "me" ? " (for the invoice)" : ""}</label><input id="b-company" autoComplete="organization" value={f.company} onChange={set("company")} placeholder="Company name" /></div>
      </div>
      <div className="lp-form-row">
        <div className="lp-field"><label htmlFor="b-first">First night</label><input id="b-first" type="date" value={f.firstNight} onChange={set("firstNight")} /></div>
        <div className="lp-field"><label htmlFor="b-freq">How often</label><select id="b-freq" value={f.frequency} onChange={set("frequency")}>{FREQUENCY.map((o) => <option key={o}>{o}</option>)}</select></div>
      </div>
      <div className="lp-form-row">
        <div className="lp-field"><label htmlFor="b-nights">Nights per stay</label><select id="b-nights" value={f.nights} onChange={set("nights")}>{NIGHTS.map((o) => <option key={o}>{o}</option>)}</select></div>
        {who === "company" ? (
          <div className="lp-field"><label htmlFor="b-people">People</label><input id="b-people" inputMode="numeric" value={f.people} onChange={set("people")} placeholder="How many people?" /></div>
        ) : (
          <div className="lp-field"><label htmlFor="b-suite">Suite</label><select id="b-suite" value={suite} onChange={(e) => setSuite(e.target.value)}><option value="">No preference</option>{SUITES.map((s) => <option key={s.id}>{s.name}</option>)}<option>Waitlist: new Toronto suites</option></select></div>
        )}
      </div>
      <div className="lp-field"><label htmlFor="b-notes">Anything we should know?</label><textarea id="b-notes" value={f.notes} onChange={set("notes")} placeholder="Early arrival, parking, a monitor, a grocery list for the first night…" /></div>
      {error && <p className="lp-form-error" role="alert">{error}</p>}
      <button className="lp-btn" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : who === "me" ? "Get my weekly rate" : "Request a company proposal"}</button>
      <p className="lp-form-note">We reply by email. No spam, no sharing your details.</p>
    </form>
  );
}

export default function CorporatePage() {
  const [suite, setSuite] = useState("");
  const ask = (name: string) => { setSuite(name); scrollToForm(); };

  return (
    <div className="lp lp--biz">
      <LandingNav cta="Get my weekly rate" />

      {/* 1. Hero: call out the avatar */}
      <header className="lp-hero">
        <div className="lp-wrap lp-hero-grid">
          <div>
            <div className="lp-kicker">For people who work in Toronto but don&apos;t live here</div>
            <h1 className="lp-h1">Same suite. Every week. <em>Your stuff already here.</em></h1>
            <p className="lp-hero-sub">Private one-bedroom suites for consultants, project leads and anyone in Toronto Monday to Thursday. A real kitchen, a real desk, a dark, quiet bedroom, and a closet that keeps your things between trips.</p>
            <div className="lp-hero-ctas">
              <a href="#inquiry" className="lp-btn">Get my weekly rate</a>
              <a href="#suites" className="lp-btn lp-btn--light">See the 3 suites</a>
            </div>
            <ul className="lp-proof">
              <li><Icon name="receipt" size={26} />Itemized invoices</li>
              <li><Icon name="washer" size={26} />Washer + dryer in every suite</li>
              <li><Icon name="key" size={26} />Self check-in</li>
            </ul>
          </div>
          <div className="lp-mosaic-wrap" style={{ position: "relative" }}>
            <div className="lp-mosaic">
              <figure><img src="/suites/bathurst3-living.webp" alt="Bathurst Suite 3 living room with a work desk" /><figcaption>Bathurst Suite 3</figcaption></figure>
              <figure><img src="/suites/earl-kitchen.webp" alt="The Earl kitchen with gas range" /><figcaption>A real kitchen</figcaption></figure>
              <figure><img src="/suites/bathurst2-bedroom-desk.webp" alt="Bedroom with a desk" /><figcaption>A real desk</figcaption></figure>
            </div>
            <div className="lp-float">
              <h4>Expense-ready, every stay</h4>
              <small>Emailed the day you check out</small>
              <ul>
                <li><Icon name="check" size={20} />Your company name on it</li>
                <li><Icon name="check" size={20} />Dates + nightly rate</li>
                <li><Icon name="check" size={20} />Tax lines shown separately</li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* 2. Agitate: the hotel week */}
        <section className="lp-section">
          <div className="lp-wrap">
            <SectionHead eyebrow="The hotel week" title={<>You know exactly <em>how it goes.</em></>} />
            <div className="lp-pains">
              {PAINS.map((p) => (
                <div className="lp-pain" key={p.title}>
                  <Icon name={p.icon} size={52} />
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
            <p className="lp-pain-turn">A hotel is built for one night. You&apos;re here every week. You need a home base.</p>
          </div>
        </section>

        {/* 3. The mechanism: Home Base */}
        <section className="lp-section lp-section--alt">
          <div className="lp-wrap lp-split">
            <div className="lp-art"><ClosetScene /></div>
            <div>
              <SectionHead eyebrow="Home Base" title={<>Toronto, <em>without the suitcase.</em></>} sub="Book the same suite on a standing schedule: every week, every other week, whatever your project runs. Between trips, your things stay with us. Before you land, they're back in the suite." />
              <div className="lp-week" aria-label="A Home Base week">
                {WEEK.map((w) => <div key={w.d} className={`lp-day${w.in ? " is-in" : ""}`}>{w.d}<span>{w.s}</span></div>)}
              </div>
              <div className="lp-week-key"><span><i style={{ background: "var(--lp-accent)" }} />You&apos;re in the suite</span><span><i style={{ background: "var(--lp-paper)", border: "1px solid var(--lp-line)" }} />Your bin is stored</span></div>
              <ul className="lp-perks">
                {HOME_BASE.map((p) => (
                  <li key={p.title}><Icon name={p.icon} size={52} /><div><h3>{p.title}</h3><p>{p.body}</p></div></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Amenities we already have + the Home Base extras */}
        <section className="lp-section">
          <div className="lp-wrap">
            <SectionHead eyebrow="In every suite" title={<>Everything a hotel room <em>is missing.</em></>} sub="Every CareStay suite is a full one-bedroom apartment, not a room. This is what's already there when you walk in." />
            <div className="lp-amen">
              {AMENITIES.map((a) => (
                <div className="lp-amen-card" key={a.title}>
                  <header><Icon name={a.icon} size={44} /><h3>{a.title}</h3></header>
                  <ul>{a.items.map((i) => <li key={i}>{i}</li>)}</ul>
                </div>
              ))}
            </div>
            <div className="lp-extras">
              <div className="lp-extras-head">
                <div><span className="lp-pill" style={{ background: "rgba(255,255,255,.12)", color: "#fff" }}>Home Base guests</span><h3 style={{ marginTop: 10 }}>The little things you&apos;d otherwise pack.</h3></div>
                <p>Frequent travellers pack these because hotels don&apos;t have them. We put them in the suite instead.</p>
              </div>
              <div className="lp-extras-grid">
                {EXTRAS.map((x) => (
                  <div className="lp-extra" key={x.title}><Icon name={x.icon} size={44} /><div><h4>{x.title}</h4><p>{x.body}</p></div></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Remove the expense objection */}
        <section className="lp-section lp-section--alt">
          <div className="lp-wrap lp-split lp-split--flip">
            <div className="lp-invoice" aria-label="Example of a CareStay invoice">
              <div className="lp-invoice-top"><strong>CareStay Suites</strong><span>Invoice</span></div>
              <div className="lp-invoice-row"><b>Billed to</b><span>Your company name</span></div>
              <div className="lp-invoice-row"><b>Guest</b><span>You</span></div>
              <div className="lp-invoice-row"><b>Stay</b><span>Mon → Thu · 3 nights</span></div>
              <div className="lp-invoice-row"><b>Nightly rate × 3</b><span className="lp-bar" style={{ width: 70 }} /></div>
              <div className="lp-invoice-row"><b>Taxes, line by line</b><span className="lp-bar" style={{ width: 46 }} /></div>
              <div className="lp-invoice-total"><span>Total</span><span className="lp-bar" style={{ width: 84, background: "var(--lp-ink)", opacity: .2 }} /></div>
              <div className="lp-invoice-stamp"><Icon name="check" size={20} />Emailed at checkout</div>
            </div>
            <div>
              <SectionHead eyebrow="Expenses" title={<>The receipt your <em>finance team</em> wants.</>} sub="Expense rules are a big reason frequent travellers stay stuck in hotels. So our paperwork looks like a hotel's." />
              <ul className="lp-ticks">
                <li><Icon name="check" size={24} />Company name and billing address on every invoice</li>
                <li><Icon name="check" size={24} />Dates, nightly rate and each tax on its own line</li>
                <li><Icon name="check" size={24} />Emailed the day you check out. No chasing.</li>
                <li><Icon name="check" size={24} />Direct billing for companies booking their people</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 6. Honest comparison */}
        <section className="lp-section">
          <div className="lp-wrap" style={{ maxWidth: 900 }}>
            <SectionHead center eyebrow="Hotel vs. Home Base" title={<>A hotel still wins on points. <em>We win after 6 p.m.</em></>} />
            <table className="lp-compare">
              <thead><tr><th scope="col">&nbsp;</th><th scope="col">Hotel room</th><th scope="col">CareStay Home Base</th></tr></thead>
              <tbody>
                <tr><td>A bedroom with a door</td><td>Rarely</td><td className="lp-yes">Always</td></tr>
                <tr><td>A full kitchen</td><td>Mini-fridge, if lucky</td><td className="lp-yes">Stove, oven, real knives</td></tr>
                <tr><td>Laundry</td><td>Per item, by tomorrow</td><td className="lp-yes">Washer + dryer in the suite</td></tr>
                <tr><td>Leave your things</td><td>Bag hold, maybe</td><td className="lp-yes">Stored + set back out</td></tr>
                <tr><td>Same room every week</td><td>Luck of the draw</td><td className="lp-yes">Same suite</td></tr>
                <tr><td>Itemized invoice</td><td>Yes</td><td className="lp-yes">Yes</td></tr>
                <tr><td>Points + a lobby</td><td>Yes</td><td>No. That&apos;s the trade.</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 7. Proof: the actual suites */}
        <SuitesSection mode="business" eyebrow="The suites" title={<>Three suites. <em>Real photos.</em></>} sub="No stock images, no 'similar unit.' This is exactly where you'd stay." onAsk={ask} />

        {/* 8. Companies: the original corporate audience */}
        <section className="lp-section lp-section--dark">
          <div className="lp-wrap">
            <SectionHead eyebrow="For companies" title={<>Booking for <em>someone else?</em></>} sub="Relocations, project rotations and placements. One contact, direct billing, a proposal built around your dates and headcount." />
            <div className="lp-teams">
              {TEAMS.map((t) => <div className="lp-team" key={t.title}><Icon name={t.icon} size={46} /><h3>{t.title}</h3><p>{t.body}</p></div>)}
            </div>
            <div className="lp-teams-cta">
              <a href="#inquiry" className="lp-btn">Request a company proposal</a>
              <p>Tell us headcount and dates. We&apos;ll come back with options.</p>
            </div>
          </div>
        </section>

        {/* 9. How it works */}
        <section className="lp-section">
          <div className="lp-wrap">
            <SectionHead center eyebrow="How it works" title={<>Three steps. <em>Then Monday&apos;s easy.</em></>} />
            <Steps steps={STEPS} />
          </div>
        </section>

        {/* 10. Objections */}
        <section className="lp-section lp-section--alt">
          <div className="lp-wrap">
            <SectionHead center eyebrow="Questions" title={<>Before you <em>ask.</em></>} />
            <Faq items={FAQ} />
          </div>
        </section>

        {/* 11. Convert */}
        <section className="lp-form-section" id="inquiry">
          <div className="lp-wrap lp-form-grid">
            <div className="lp-form-aside">
              <div className="lp-eyebrow" style={{ color: "#c9cdff" }}>Get your rate</div>
              <h2 className="lp-h2">Tell us your weeks. <em style={{ color: "#c9cdff" }}>We&apos;ll do the rest.</em></h2>
              <p className="lp-sub">We reply with open dates and your weekly or standing-week rate. Try one week before you commit to anything.</p>
              <ul>
                <li><Icon name="calendar" size={30} />Weekly and standing-week rates</li>
                <li><Icon name="receipt" size={30} />Itemized invoice every stay</li>
                <li><Icon name="bin" size={30} />Leave your things between trips</li>
                <li><Icon name="pin" size={30} />Downtown + the Annex, more coming</li>
              </ul>
            </div>
            <InquiryForm suite={suite} setSuite={setSuite} />
          </div>
        </section>
      </main>

      <LandingFooter line="Private furnished suites in Toronto for people who work here every week, and the companies that send them." />
      <StickyCta label="Get my rate" note="Weekly rates · Toronto" />
    </div>
  );
}
