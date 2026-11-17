"use client";

import { useState } from "react";
import { Icon, ArrivalTableScene } from "@/app/components/landing/illustrations";
import { Faq, LandingFooter, LandingNav, SectionHead, Steps, StickyCta, SuitesSection, scrollToForm, sendInquiry, type SubmitState } from "@/app/components/landing/Landing";
import { SUITES, priceLabel } from "@/app/components/landing/suites";

/* Avatar: couples (and the person planning for them) booking a 2–5 night occasion stay.
   Copy is built from the Nov 2026 Reddit deep dive (Marketing/Avatar Research — Reddit Deep Dive). */

const OCCASIONS = [
  { key: "Anniversary", icon: "heart", line: "Flowers they actually like, bubbly on ice, and a card in your words waiting on the pillow." },
  { key: "Birthday", icon: "cake", line: "A cake from the bakery you pick, a banner as cheesy as you want, and breakfast in bed." },
  { key: "Proposal", icon: "ring", line: "We style the room, hide the photographer and time it to the minute. You just say the words." },
  { key: "Babymoon", icon: "stars", line: "Zero-proof bubbly, a long bath, and dinner that comes to you. Nowhere to be." },
  { key: "Just because", icon: "board", line: "A board, a movie, a fire, and absolutely no plans." },
  { key: "Wedding night", icon: "robe", line: "Slippers for the heels, makeup wipes, electrolytes, and something to eat at midnight." },
];

const PAINS = [
  { icon: "door", title: "They won't let your decorator in", body: "Outside vendors need sign-off, candles are banned, and the 'romance package' is chocolates on a tray." },
  { icon: "board", title: "You arrive at 10 p.m., starving", body: "The kitchen's closed, room service is a laminated menu, and the room is just a room." },
  { icon: "flowers", title: "Roses at twice the price", body: "Hotel flowers and strawberries often cost double what they do down the street." },
  { icon: "building", title: "A hallway full of strangers", body: "Ice machine, elevator ding, a bachelor party next door. Not the night you planned." },
];

const INCLUDED = [
  { icon: "board", title: "A welcome board", body: "Cheese, fruit and something sweet, waiting on the table." },
  { icon: "bubbly", title: "Something sparkling", body: "Chilled and ready, or a zero-proof bottle if you'd rather." },
  { icon: "robe", title: "Robes + slippers", body: "Laid out on the bed when you walk in." },
  { icon: "stars", title: "The stay-in mood", body: "Low lamps, LED candles, a star projector, Netflix ready." },
  { icon: "card", title: "A handwritten card", body: "Your words or ours, waiting on the pillow." },
  { icon: "clock", title: "Late check-out, when we can", body: "Ask. If the calendar allows it, sleep in." },
];

const TIERS = [
  {
    key: "setup-little-things", name: "The Little Things", for: "For birthdays and 'just because.'",
    items: ["Fresh flowers in a vase", "Chocolate-dipped strawberries", "LED candles throughout", "Your card, handwritten"],
  },
  {
    key: "setup-the-evening", name: "The Evening", for: "For anniversaries and big birthdays.", feature: true,
    items: ["Everything in The Little Things", "+ A full supper board for two", "+ Bath set: salts, candles, tub tray", "+ Star projector + your playlist", "+ Breakfast delivered next morning", "+ Late check-out held for you"],
  },
  {
    key: "setup-the-big-one", name: "The Big One", for: "For proposals and milestones.",
    items: ["Everything in The Evening", "+ Full room styling to your brief", "+ A hidden photographer, 30 minutes", "+ Dinner booked, credit in an envelope", "+ A timed surprise knock", "+ Keepsake kit: camera + flutes to keep"],
  },
];

const ADDONS = [
  { icon: "tray", title: "Breakfast in bed", body: "Delivered at the time you pick." },
  { icon: "stones", title: "Couples massage", body: "In the suite, by a licensed therapist." },
  { icon: "cake", title: "Cake from your bakery", body: "Name the place. We pick it up." },
  { icon: "flowers", title: "Their favourite flowers", body: "Sourced and in water before you arrive." },
  { icon: "card", title: "Dinner, booked", body: "Reservation made, credit in an envelope." },
  { icon: "door", title: "The surprise knock", body: "Something delivered 30 minutes after check-in." },
  { icon: "balloon", title: "Banner + balloons", body: "As cheesy as you want. We won't judge." },
  { icon: "camera", title: "Keepsake kit", body: "A disposable camera and two flutes to keep." },
  { icon: "ring", title: "Proposal plan", body: "Timing, styling, a hidden photographer." },
  { icon: "robe", title: "Wedding-night kit", body: "Slippers, wipes, electrolytes, snacks." },
  { icon: "clock", title: "Late check-out", body: "Sleep in. Leave when you're ready." },
  { icon: "music", title: "Your playlist", body: "Queued on the speaker when you walk in." },
];

const STEPS = [
  { icon: "calendar", title: "Pick dates + the occasion", body: "Thirty seconds. Tell us what you're celebrating and which set-up you like." },
  { icon: "card", title: "Answer five quick questions", body: "Their favourite flowers, drinks, allergies, and whether it's a surprise. That's it." },
  { icon: "door", title: "Open the door", body: "Everything's set before you get there. You just walk in." },
];

const FAQ = [
  { q: "Is the whole suite ours?", a: "Yes. Every suite is a private one-bedroom apartment. No shared spaces, no lobby, no front desk, no one else's kids in the hallway." },
  { q: "Can you keep it a surprise?", a: "Yes. We only coordinate with you, and nothing goes to your partner. Tick 'it's a surprise' on the form and we'll handle the rest quietly." },
  { q: "Can I bring my own decorations, or my own decorator?", a: "Of course. Unlike most hotels, we're happy to let you (or someone you hire) set up. We just ask for LED candles only, and no confetti or glitter." },
  { q: "Is alcohol included?", a: "Every couples stay gets something sparkling, with a zero-proof option if you prefer. Tell us on the form." },
  { q: "Do you do proposals?", a: "Yes. The Big One covers styling, a hidden photographer and timing. Bring the plan, even if it's half-formed, and we'll work it out with you." },
  { q: "Can I add things after I book?", a: "Yes. Add flowers, a cake or breakfast any time up to a couple of days before you arrive." },
  { q: "Where are the suites?", a: "Downtown near Wellesley & Sherbourne (The Earl, with the soaking tub and fireplace), and in the Annex on Bathurst near Bloor. More Toronto suites are on the way." },
];

const SETUPS = ["Just the stay (welcome board included)", "The Little Things", "The Evening", "The Big One", "Not sure yet"];

function InquiryForm({ occasion, setOccasion, suite, setSuite, setup, setSetup, gift, setGift }: {
  occasion: string; setOccasion: (s: string) => void; suite: string; setSuite: (s: string) => void;
  setup: string; setSetup: (s: string) => void; gift: boolean; setGift: (b: boolean) => void;
}) {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const [surprise, setSurprise] = useState(false);
  const [f, setF] = useState({ name: "", email: "", phone: "", arrive: "", leave: "", forWho: "", notes: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.email) { setError("Add your email so we can send your quote."); return; }
    setState("sending"); setError("");
    const message = [
      `Occasion: ${occasion || "Not said"}`,
      `Set-up: ${setup}`,
      `Suite: ${suite || "No preference"}`,
      `Surprise: ${surprise ? "Yes, coordinate with me only" : "No"}`,
      gift ? `Planning for someone else: yes${f.forWho ? ` (${f.forWho})` : ""}` : "",
      f.notes ? `Notes: ${f.notes}` : "",
    ].filter(Boolean).join("\n");
    const ok = await sendInquiry({
      name: f.name, email: f.email, phone: f.phone, moveIn: f.arrive, moveOut: f.leave, message, listing: suite,
      source: "couples", tags: ["couples", ...(gift ? ["couples-gift"] : [])],
    });
    setState(ok ? "done" : "error");
    if (!ok) setError("That didn't send. Try again, or email info@carestaysuites.com.");
  };

  if (state === "done") {
    return (
      <div className="lp-form lp-done">
        <Icon name="heart" size={64} />
        <h3>Leave it with us.</h3>
        <p>We&apos;ll reply by email with availability and a quote for your set-up. {surprise ? "We'll keep it between us." : ""}</p>
        <a href="#suites" className="lp-btn lp-btn--ghost">Look at the suites again</a>
      </div>
    );
  }

  return (
    <form className="lp-form" onSubmit={submit} noValidate>
      <div className="lp-form-row">
        <div className="lp-field"><label htmlFor="c-name">Your name</label><input id="c-name" autoComplete="name" value={f.name} onChange={set("name")} placeholder="Alex Morgan" /></div>
        <div className="lp-field"><label htmlFor="c-email">Email</label><input id="c-email" type="email" autoComplete="email" required value={f.email} onChange={set("email")} placeholder="you@email.com" /></div>
      </div>
      <div className="lp-form-row">
        <div className="lp-field"><label htmlFor="c-arrive">Arrive</label><input id="c-arrive" type="date" value={f.arrive} onChange={set("arrive")} /></div>
        <div className="lp-field"><label htmlFor="c-leave">Leave</label><input id="c-leave" type="date" value={f.leave} onChange={set("leave")} /></div>
      </div>
      <div className="lp-form-row">
        <div className="lp-field"><label htmlFor="c-occasion">Occasion</label>
          <select id="c-occasion" value={occasion} onChange={(e) => setOccasion(e.target.value)}>
            <option value="">Choose one</option>{OCCASIONS.map((o) => <option key={o.key}>{o.key}</option>)}<option>Something else</option>
          </select>
        </div>
        <div className="lp-field"><label htmlFor="c-setup">Set-up</label>
          <select id="c-setup" value={setup} onChange={(e) => setSetup(e.target.value)}>{SETUPS.map((s) => <option key={s}>{s}</option>)}</select>
        </div>
      </div>
      <div className="lp-form-row">
        <div className="lp-field"><label htmlFor="c-suite">Suite</label>
          <select id="c-suite" value={suite} onChange={(e) => setSuite(e.target.value)}><option value="">No preference</option>{SUITES.map((s) => <option key={s.id}>{s.name}</option>)}<option>Waitlist: new Toronto suites</option></select>
        </div>
        <div className="lp-field"><label htmlFor="c-phone">Phone</label><input id="c-phone" type="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} placeholder="(647) 000-0000" /></div>
      </div>
      <div className="lp-checks">
        <label className="lp-check"><input type="checkbox" checked={surprise} onChange={(e) => setSurprise(e.target.checked)} />It&apos;s a surprise. Coordinate with me only.</label>
        <label className="lp-check"><input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} />I&apos;m planning this for someone else.</label>
      </div>
      {gift && <div className="lp-field"><label htmlFor="c-for">Who is it for?</label><input id="c-for" value={f.forWho} onChange={set("forWho")} placeholder="My parents, the bride and groom, my best friend…" /></div>}
      <div className="lp-field"><label htmlFor="c-notes">Tell us about them</label><textarea id="c-notes" value={f.notes} onChange={set("notes")} placeholder="Favourite flowers, what they drink, allergies, the thing they mentioned once and forgot about…" /></div>
      {error && <p className="lp-form-error" role="alert">{error}</p>}
      <button className="lp-btn" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Check dates + get my quote"}</button>
      <p className="lp-form-note">We reply by email with availability and a quote. Nothing is booked until you say yes.</p>
    </form>
  );
}

export default function CouplesPage() {
  const [occasion, setOccasion] = useState("Anniversary");
  const [suite, setSuite] = useState("");
  const [setup, setSetup] = useState(SETUPS[0]);
  const [gift, setGift] = useState(false);
  const current = OCCASIONS.find((o) => o.key === occasion) ?? OCCASIONS[0];
  const ask = (name: string) => { setSuite(name); scrollToForm(); };
  const pickSetup = (name: string) => { setSetup(name); scrollToForm(); };

  return (
    <div className="lp lp--cpl">
      <LandingNav cta="Plan our stay" />

      {/* 1. Hero */}
      <header className="lp-hero">
        <div className="lp-wrap lp-hero-grid">
          <div>
            <div className="lp-kicker">Toronto getaways for two</div>
            <h1 className="lp-h1">Walk in. <em>It&apos;s already done.</em></h1>
            <p className="lp-hero-sub">Private Toronto suites for anniversaries, birthdays, proposals and plain old &ldquo;we need a night.&rdquo; Tell us the occasion and we set the room before you arrive. No lobby, no kids&apos; pool, no neighbours through the wall.</p>
            <div className="lp-hero-ctas">
              <a href="#inquiry" className="lp-btn">Plan our stay</a>
              <a href="#suites" className="lp-btn lp-btn--light">See the suites</a>
            </div>
            <ul className="lp-proof">
              <li><Icon name="board" size={26} />Food on the table when you arrive</li>
              <li><Icon name="tub" size={26} />Soaking tub + fireplace at The Earl</li>
              <li><Icon name="key" size={26} />The whole suite, just you two</li>
            </ul>
          </div>
          <div className="lp-mosaic-wrap" style={{ position: "relative" }}>
            <div className="lp-mosaic">
              <figure><img src="/suites/earl-living-fireplace.webp" alt="The Earl living room with the gas fireplace lit" /><figcaption>The Earl · fireplace</figcaption></figure>
              <figure><img src="/suites/earl-soaking-tub.webp" alt="Freestanding soaking tub at The Earl" /><figcaption>Soaking tub</figcaption></figure>
              <figure><img src="/suites/earl-patio-evening.webp" alt="Private garden patio with a bottle of wine" /><figcaption>Private patio</figcaption></figure>
            </div>
            <div className="lp-float">
              <h4>Before you arrive</h4>
              <small>Your set-up checklist, done for you</small>
              <ul>
                <li><Icon name="check" size={20} />Lamps low, candles on</li>
                <li><Icon name="check" size={20} />Board + bubbly on the table</li>
                <li><Icon name="check" size={20} />Robes out, your card on the pillow</li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* 2. Self-select the occasion */}
        <section className="lp-section">
          <div className="lp-wrap">
            <SectionHead center eyebrow="What are we celebrating?" title={<>Pick the occasion. <em>We&apos;ll build the night.</em></>} />
            <div className="lp-occasions" role="radiogroup" aria-label="Occasion">
              {OCCASIONS.map((o) => (
                <button key={o.key} role="radio" aria-checked={o.key === occasion} className={`lp-occasion${o.key === occasion ? " is-on" : ""}`} onClick={() => setOccasion(o.key)}>
                  <Icon name={o.icon} size={32} />{o.key}
                </button>
              ))}
            </div>
            <div className="lp-occasion-line" aria-live="polite">
              <p>&ldquo;{current.line}&rdquo;</p>
              <button className="lp-btn" onClick={scrollToForm}>Plan {/^[AEIOU]/.test(current.key) ? "an" : "a"} {current.key.toLowerCase()} stay</button>
            </div>
          </div>
        </section>

        {/* 3. Why not a hotel */}
        <section className="lp-section lp-section--alt">
          <div className="lp-wrap">
            <SectionHead eyebrow="Why not a hotel?" title={<>Hotels make surprises hard. <em>We make them the job.</em></>} />
            <div className="lp-pains">
              {PAINS.map((p) => (
                <div className="lp-pain" key={p.title}><Icon name={p.icon} size={52} /><h3>{p.title}</h3><p>{p.body}</p></div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Included in every stay */}
        <section className="lp-section">
          <div className="lp-wrap lp-split">
            <div className="lp-art"><ArrivalTableScene /></div>
            <div>
              <SectionHead eyebrow="In every couples stay" title={<>The first ten minutes <em>are the whole trip.</em></>} sub="Couples remember walking in tired to food on the table more than any petals on the bed. So every couples stay starts there." />
              <ul className="lp-included">
                {INCLUDED.map((i) => <li key={i.title}><Icon name={i.icon} size={46} /><div><h3>{i.title}</h3><p>{i.body}</p></div></li>)}
              </ul>
              <div className="lp-free"><Icon name="heart" size={22} />Included with every couples booking. No add-on needed.</div>
            </div>
          </div>
        </section>

        {/* 5. The offer ladder */}
        <section className="lp-section lp-section--alt">
          <div className="lp-wrap">
            <SectionHead center eyebrow="Set-ups" title={<>Pick a set-up. <em>It&apos;s done before you get there.</em></>} sub="Every set-up is styled in the suite before you arrive, so the first thing you see is the finished thing." />
            <div className="lp-tiers">
              {TIERS.map((t) => (
                <div className={`lp-tier${t.feature ? " lp-tier--feature" : ""}`} key={t.key}>
                  {t.feature && <span className="lp-tier-badge">Our favourite</span>}
                  <Icon name={t.key === "setup-little-things" ? "flowers" : t.key === "setup-the-evening" ? "bubbly" : "ring"} size={52} />
                  <h3>{t.name}</h3>
                  <p className="lp-tier-for">{t.for}</p>
                  <div className="lp-tier-price">{priceLabel(t.key)}</div>
                  <ul className="lp-tier-list">{t.items.map((i) => <li key={i} className={i.startsWith("+") ? "is-plus" : ""}>{i.replace(/^\+ /, "")}</li>)}</ul>
                  <button className={`lp-btn${t.feature ? "" : " lp-btn--ghost"}`} onClick={() => pickSetup(t.name)}>Choose {t.name}</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Add-ons */}
        <section className="lp-section">
          <div className="lp-wrap">
            <SectionHead eyebrow="Add anything" title={<>Make it <em>theirs.</em></>} sub="Add these to any stay, with or without a set-up. Tell us on the form or after you book." />
            <div className="lp-addons">
              {ADDONS.map((a) => <div className="lp-addon" key={a.title}><Icon name={a.icon} size={42} /><h3>{a.title}</h3><p>{a.body}</p></div>)}
            </div>
            <div style={{ marginTop: 26 }} className="lp-gift">
              <Icon name="card" size={64} />
              <div>
                <h3>Planning this for someone else?</h3>
                <p>Booking your parents&apos; anniversary, or surprising the bride and groom? Buy the stay, the set-up or both as a gift, even if your name isn&apos;t on the booking. We coordinate with you, not them.</p>
              </div>
              <button className="lp-btn" onClick={() => { setGift(true); scrollToForm(); }}>Plan a gift stay</button>
            </div>
          </div>
        </section>

        {/* 7. Winter angle: tub + fireplace beat a hot tub */}
        <section className="lp-section lp-section--dark">
          <div className="lp-wrap lp-split">
            <div>
              <SectionHead eyebrow="The Earl, all year" title={<>Forget the hot tub. <em>Stay in.</em></>} sub="Outdoor hot tubs are lukewarm half the year, and you're sitting outside in a Toronto January. The Earl has a deep freestanding soaking tub, a rain shower and a gas fireplace, all indoors and all yours." />
              <ul className="lp-ticks" style={{ color: "#fff" }}>
                <li><Icon name="tub" size={28} />Freestanding soaking tub + rain shower</li>
                <li><Icon name="fireplace" size={28} />Gas fireplace in the living room</li>
                <li><Icon name="garden" size={28} />A private garden patio for warm nights</li>
                <li><Icon name="bubbly" size={28} />Wine fridge, wine glasses, gas range</li>
              </ul>
              <div style={{ marginTop: 28 }}><button className="lp-btn" onClick={() => ask("The Earl")}>Plan a stay at The Earl</button></div>
            </div>
            <div className="lp-photo-pair">
              <img src="/suites/earl-soaking-tub.webp" alt="The Earl's freestanding soaking tub" loading="lazy" />
              <img src="/suites/earl-fireplace.webp" alt="The Earl's gas fireplace" loading="lazy" />
            </div>
          </div>
        </section>

        {/* 8. Proof: suites */}
        <SuitesSection mode="couples" eyebrow="The suites" title={<>Three suites. <em>Real photos.</em></>} sub="Every photo is the actual suite you'd stay in. No stock images, no 'similar unit.'" onAsk={ask} />

        {/* 9. How it works */}
        <section className="lp-section">
          <div className="lp-wrap">
            <SectionHead center eyebrow="How it works" title={<>You plan the night. <em>We set the room.</em></>} />
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
              <div className="lp-eyebrow" style={{ color: "#f3c98a" }}>Plan our stay</div>
              <h2 className="lp-h2">Tell us the occasion. <em style={{ color: "#f3c98a" }}>We&apos;ll handle the rest.</em></h2>
              <p className="lp-sub">We reply with availability and a quote for your set-up. Nothing is booked until you say yes.</p>
              <ul>
                <li><Icon name="board" size={30} />Welcome board + bubbly included</li>
                <li><Icon name="door" size={30} />Set up before you arrive</li>
                <li><Icon name="heart" size={30} />Surprises kept quiet</li>
                <li><Icon name="pin" size={30} />Downtown + the Annex, more coming</li>
              </ul>
            </div>
            <InquiryForm occasion={occasion} setOccasion={setOccasion} suite={suite} setSuite={setSuite} setup={setup} setSetup={setSetup} gift={gift} setGift={setGift} />
          </div>
        </section>
      </main>

      <LandingFooter line="Private Toronto suites for two, set up before you arrive. Anniversaries, birthdays, proposals and nights you just need." />
      <StickyCta label="Plan our stay" note="Getaways for two · Toronto" />
    </div>
  );
}
