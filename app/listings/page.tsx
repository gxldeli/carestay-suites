"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Search, Users } from "lucide-react";
import { formatShortDate, getNextDateInput, getTorontoToday, isValidDateInput } from "@/app/lib/date-input";

interface Listing {
  id: number | string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  price: number;
  sqft: number;
  img: string;
  available: boolean;
  maxGuests?: number;
  bedrooms?: number;
  reviewCount?: number;
  reviewAvg?: number;
  availabilityStatus?: string;
  isCustom?: boolean;
  bookable?: boolean;
  featured?: boolean;
}

type AvailabilityState = "idle" | "loading" | "verified" | "error";

function ListingPhoto({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(!src);
  if (failed) return <div className="listing-media-fallback"><strong>CareStay Suites</strong><span>Photo unavailable</span></div>;
  return <img src={src} alt={alt} className="listing-img" onError={() => setFailed(true)} />;
}

function isUnavailable(listing: Listing): boolean {
  return listing.isCustom === true || listing.bookable === false || ["Booked", "Waitlist Only"].includes(listing.availabilityStatus || "");
}

function StatusPill({ listing, dateMatched }: { listing: Listing; dateMatched: boolean }) {
  if (listing.isCustom) return <span className="status-pill status-booked">Example · not bookable</span>;
  if (isUnavailable(listing)) return <span className="status-pill status-booked">Fully booked</span>;
  if (dateMatched) return <span className="status-pill status-match">Date match</span>;
  if (listing.availabilityStatus === "Almost Booked") return <span className="status-pill status-limited">Limited</span>;
  return <span className="status-pill status-check">Check dates</span>;
}

function ListingCard({ listing, href, dateMatched }: { listing: Listing; href: string; dateMatched: boolean }) {
  return (
    <li>
      <Link href={href} className="listing-link">
        <article className="listing-card">
          <div className="listing-media">
            <ListingPhoto src={listing.img} alt={listing.title} />
            <div className="listing-tags">
              <span className="location-pill">{listing.location}</span>
              <StatusPill listing={listing} dateMatched={dateMatched} />
            </div>
          </div>
          <div className="listing-body">
            <h3>{listing.title}</h3>
            <p className="listing-location">{listing.location} · approximate area</p>
            <p className="listing-specs">
              {[
                listing.maxGuests ? `${listing.maxGuests} guest${listing.maxGuests === 1 ? "" : "s"}` : null,
                listing.bedrooms ? `${listing.bedrooms} bedroom${listing.bedrooms === 1 ? "" : "s"}` : null,
                listing.beds ? `${listing.beds} bed${listing.beds === 1 ? "" : "s"}` : null,
                listing.baths ? `${listing.baths} bath${listing.baths === 1 ? "" : "s"}` : null,
              ].filter(Boolean).join(" · ")}
            </p>
            <div className="listing-footer">
              <span className="listing-price">{listing.price ? <>From <strong>${listing.price.toLocaleString()}</strong></> : <strong>Rate on request</strong>}</span>
              <span className="view-suite">View suite →</span>
            </div>
          </div>
        </article>
      </Link>
    </li>
  );
}

export default function AllListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [where, setWhere] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [bedFilter, setBedFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [dateError, setDateError] = useState("");
  const [availabilityState, setAvailabilityState] = useState<AvailabilityState>("idle");
  const [dateMatchedIds, setDateMatchedIds] = useState<Set<string>>(new Set());
  const today = getTorontoToday();

  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const parsedGuests = Number(params.get("guests") || "1");
      const parsedCheckIn = params.get("checkIn") || "";
      const parsedCheckOut = params.get("checkOut") || "";
      const hasValidDatePair = isValidDateInput(parsedCheckIn) && isValidDateInput(parsedCheckOut) && parsedCheckIn >= getTorontoToday() && parsedCheckOut > parsedCheckIn;
      setWhere(params.get("where") || params.get("destination") || "");
      setCheckIn(hasValidDatePair ? parsedCheckIn : "");
      setCheckOut(hasValidDatePair ? parsedCheckOut : "");
      setGuests(String(Number.isInteger(parsedGuests) && parsedGuests >= 1 && parsedGuests <= 20 ? parsedGuests : 1));
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/listings", { signal: controller.signal })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") setListings(data.listings || []);
        else setLoadError(true);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setLoadError(true);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!checkIn && !checkOut) {
      setAvailabilityState("idle");
      setDateMatchedIds(new Set());
      return;
    }
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setAvailabilityState("idle");
      setDateMatchedIds(new Set());
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams({ checkIn, checkOut, guests });
    setAvailabilityState("loading");
    fetch(`/api/availability?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || data.status !== "success" || !data.verified) throw new Error("Availability unavailable");
        setDateMatchedIds(new Set((data.listingIds || []).map(String)));
        setAvailabilityState("verified");
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setDateMatchedIds(new Set());
        setAvailabilityState("error");
      });
    return () => controller.abort();
  }, [checkIn, checkOut, guests]);

  const cities = useMemo(() => {
    const unique = Array.from(new Set(listings.filter((listing) => !listing.isCustom).map((listing) => listing.location).filter(Boolean)));
    return unique.sort((a, b) => a.localeCompare(b));
  }, [listings]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (where.trim()) params.set("where", where.trim());
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", guests);
    return params.toString();
  }, [where, checkIn, checkOut, guests]);

  const matchesFilters = (listing: Listing, strictCapacity = true) => {
    const destination = where.trim().toLowerCase();
    if (destination && !`${listing.title} ${listing.location}`.toLowerCase().includes(destination)) return false;
    if (areaFilter !== "all" && !listing.location.toLowerCase().includes(areaFilter.toLowerCase())) return false;
    const bedroomCount = listing.bedrooms || 0;
    if (bedFilter === "1" && bedroomCount !== 1) return false;
    if (bedFilter === "2" && bedroomCount !== 2) return false;
    if (bedFilter === "3" && bedroomCount < 3) return false;
    if (strictCapacity && Number(guests) > 1 && (!listing.maxGuests || listing.maxGuests < Number(guests))) return false;
    return true;
  };

  const connectedMatches = listings
    .filter((listing) => !isUnavailable(listing))
    .filter((listing) => matchesFilters(listing))
    .filter((listing) => availabilityState !== "verified" || dateMatchedIds.has(String(listing.id)))
    .sort((a, b) => Number(b.featured || false) - Number(a.featured || false));
  const unavailableMatches = listings
    .filter((listing) => !listing.isCustom && isUnavailable(listing))
    .filter((listing) => matchesFilters(listing, false));
  const showcaseMatches = listings
    .filter((listing) => listing.isCustom)
    .filter((listing) => matchesFilters(listing, false));

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const submittedWhere = String(formData.get("where") || "").trim();
    const submittedCheckIn = String(formData.get("checkIn") || "");
    const submittedCheckOut = String(formData.get("checkOut") || "");
    const submittedGuests = String(formData.get("guests") || "1");
    if ((submittedCheckIn && !submittedCheckOut) || (!submittedCheckIn && submittedCheckOut)) {
      setDateError("Add both dates, or leave both open.");
      return;
    }
    if (submittedCheckIn && submittedCheckOut && submittedCheckOut <= submittedCheckIn) {
      setDateError("Check-out must be after check-in.");
      return;
    }
    setDateError("");
    setWhere(submittedWhere);
    setCheckIn(submittedCheckIn);
    setCheckOut(submittedCheckOut);
    setGuests(submittedGuests);
    const submittedParams = new URLSearchParams();
    if (submittedWhere) submittedParams.set("where", submittedWhere);
    if (submittedCheckIn) submittedParams.set("checkIn", submittedCheckIn);
    if (submittedCheckOut) submittedParams.set("checkOut", submittedCheckOut);
    submittedParams.set("guests", submittedGuests);
    const nextUrl = `/listings?${submittedParams.toString()}`;
    window.history.pushState({}, "", nextUrl);
  };

  const clearSearch = () => {
    setWhere("");
    setCheckIn("");
    setCheckOut("");
    setGuests("1");
    setBedFilter("all");
    setAreaFilter("all");
    setDateError("");
    window.history.pushState({}, "", "/listings");
  };

  const summary = [
    where.trim() || "Toronto & GTA",
    checkIn && checkOut ? `${formatShortDate(checkIn)} – ${formatShortDate(checkOut)}` : "Dates open",
    `${guests} guest${guests === "1" ? "" : "s"}`,
  ].join(" · ");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}body{font-family:'DM Sans',system-ui,sans-serif;color:var(--ink);background:var(--paper);-webkit-font-smoothing:antialiased}.wrap{max-width:1200px;margin:0 auto;width:100%;padding:0 24px}.nav-links{display:flex;align-items:center;gap:28px}.nav-mobile{display:none}.nav-link{color:var(--ink-soft);text-decoration:none;font-size:14px;font-weight:600}.nav-link:hover{color:var(--accent)}.nav-cta{background:var(--accent);color:#fff;padding:10px 22px;border-radius:999px;font-weight:700;font-size:13px;text-decoration:none}
        .search-hero{padding:48px 0 30px;background:linear-gradient(155deg,#f7f3ed 0%,#fffdf9 48%,#e8eff3 100%);border-bottom:1px solid var(--line)}.search-heading{font-family:'Cormorant Garamond',serif;font-size:42px;line-height:1.05;letter-spacing:-.025em;margin-bottom:8px}.search-sub{color:var(--ink-soft);font-size:15px;line-height:1.6;margin-bottom:22px}.stay-search{display:grid;grid-template-columns:1.35fr 1fr 1fr .75fr auto;align-items:stretch;background:rgba(255,255,255,.97);border:1px solid rgba(30,42,50,.1);border-radius:20px;padding:8px;box-shadow:0 18px 40px rgba(30,42,50,.12)}.stay-field{display:flex;align-items:center;gap:10px;min-width:0;padding:10px 15px;border-right:1px solid var(--line)}.stay-field svg{color:var(--accent);flex:0 0 auto}.stay-field label{display:block;font-size:10px;font-weight:800;letter-spacing:.07em;text-transform:uppercase;color:var(--ink-soft);margin-bottom:4px}.stay-field input,.stay-field select{border:0;background:transparent;width:100%;min-width:0;color:var(--ink);font:600 14px/1.3 'DM Sans',system-ui,sans-serif;outline:none;padding:0}.stay-field select{appearance:none;-webkit-appearance:none}.search-button{border:0;border-radius:14px;background:var(--accent);color:#fff;padding:0 21px;min-height:58px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;white-space:nowrap}.search-error{grid-column:1/-1;padding:8px 12px 2px;color:#a13c34;font-size:12px;font-weight:700}.search-summary{display:flex;justify-content:space-between;gap:14px;align-items:center;flex-wrap:wrap;margin-top:14px;font-size:12px;color:var(--ink-soft)}.clear-button{border:0;background:transparent;color:var(--accent);font-weight:800;cursor:pointer;font-family:inherit}
        .filters{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin:20px 0}.filter-select{min-height:42px;border:1px solid var(--line);border-radius:999px;padding:9px 34px 9px 15px;background:var(--surface);color:var(--ink);font:700 12px 'DM Sans',system-ui,sans-serif;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23536570' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 13px center}.city-scroll{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none}.city-scroll::-webkit-scrollbar{display:none}.city-button{padding:9px 15px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--ink-soft);font:700 12px 'DM Sans',system-ui,sans-serif;cursor:pointer;white-space:nowrap}.city-button.active{border-color:rgba(45,43,255,.45);background:rgba(45,43,255,.08);color:var(--accent)}
        .results-head{display:flex;justify-content:space-between;align-items:end;gap:20px;margin:28px 0 18px}.results-head h2{font-family:'Cormorant Garamond',serif;font-size:32px;line-height:1.1}.results-note{font-size:13px;color:var(--ink-soft);line-height:1.5;max-width:520px}.availability-message{padding:12px 15px;border-radius:12px;background:var(--surface-blue);border:1px solid rgba(45,43,255,.12);font-size:12px;color:var(--ink-soft);line-height:1.5;margin-bottom:18px}.listings-grid{list-style:none;display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.listing-link{text-decoration:none;color:inherit}.listing-card{height:100%;background:var(--surface);border-radius:18px;overflow:hidden;border:1px solid var(--line);box-shadow:var(--shadow);transition:transform .2s,box-shadow .2s}.listing-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lift)}.listing-media{height:220px;position:relative;overflow:hidden;background:linear-gradient(145deg,#e8eef2 0%,#f7f3ed 52%,#dfe7ed 100%)}.listing-img{position:relative;z-index:1;width:100%;height:220px;object-fit:cover;display:block}.listing-media-fallback{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--ink-soft);gap:4px}.listing-media-fallback strong{font-family:'Cormorant Garamond',serif;font-size:24px;color:var(--ink)}.listing-media-fallback span{font-size:11px;font-weight:700}.listing-tags{position:absolute;z-index:2;left:10px;bottom:10px;display:flex;gap:6px;flex-wrap:wrap}.location-pill,.status-pill{color:#fff;padding:5px 10px;border-radius:999px;font-size:11px;font-weight:800;backdrop-filter:blur(10px)}.location-pill{background:rgba(23,38,48,.86)}.status-check{background:rgba(45,43,255,.92)}.status-match{background:rgba(22,117,82,.94)}.status-limited{background:rgba(190,105,18,.95)}.status-booked{background:rgba(30,42,50,.92)}.listing-body{padding:16px 18px}.listing-body h3{font-family:'Cormorant Garamond',serif;font-size:21px;line-height:1.15;margin-bottom:5px}.listing-location{font-size:13px;color:var(--ink-soft);margin-bottom:12px}.listing-specs{font-size:12px;color:var(--ink-soft);margin-bottom:14px;min-height:16px}.listing-footer{display:flex;justify-content:space-between;align-items:center;gap:10px;border-top:1px solid var(--line);padding-top:14px}.listing-price{font-size:11px;color:var(--ink-soft)}.listing-price strong{font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--ink)}.view-suite{background:rgba(45,43,255,.08);color:var(--accent);padding:8px 13px;border-radius:9px;font-size:12px;font-weight:800}.empty-state{text-align:center;padding:54px 20px;background:var(--surface);border:1px solid var(--line);border-radius:18px}.empty-state h3{font-family:'Cormorant Garamond',serif;font-size:27px;margin-bottom:7px}.empty-state p{font-size:14px;color:var(--ink-soft);line-height:1.6}.secondary-results{margin-top:48px;padding-top:32px;border-top:1px solid var(--line)}
        @media(max-width:1024px){.stay-search{grid-template-columns:1.3fr 1fr 1fr .75fr}.search-button{grid-column:1/-1;margin-top:6px;min-height:52px}.stay-field:nth-of-type(4){border-right:0}.listings-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:820px){.nav-links{display:none!important}.nav-mobile{display:block!important}}
        @media(max-width:700px){.search-hero{padding-top:32px}.search-heading{font-size:34px}.stay-search{grid-template-columns:1fr 1fr}.stay-field{min-height:62px;border-bottom:1px solid var(--line)}.stay-field:nth-of-type(odd){border-right:1px solid var(--line)}.stay-field:nth-of-type(even){border-right:0}.stay-field:first-child{grid-column:1/-1;border-right:0}.stay-field:nth-of-type(4){border-bottom:0}.search-button{grid-column:1/-1}.results-head{align-items:start;flex-direction:column;gap:7px}}
        @media(max-width:600px){.wrap{padding:0 18px}.listings-grid{grid-template-columns:1fr}.filters{align-items:stretch}.filter-select{width:100%}.city-scroll{width:100%}.listing-media,.listing-img{height:210px}}
        @media(max-width:390px){.stay-field:first-child,.stay-field:nth-of-type(4){grid-column:1/-1}.stay-field{padding:9px 11px}.stay-field:nth-of-type(4){border-right:0}}
        @media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
      ` }} />

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(255,253,249,0.96)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 72 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}><div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,var(--accent),var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#fff" }}>CS</div><span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, color: "var(--ink)" }}>CareStay <span style={{ fontWeight: 400, color: "var(--ink-soft)" }}>Suites</span></span></Link>
          <div className="nav-links">{[{ label: "Listings", href: "/listings" }, { label: "Healthcare", href: "/healthcare" }, { label: "Corporate", href: "/corporate" }, { label: "About", href: "/about" }, { label: "Contact", href: "/#contact" }].map((item) => <a key={item.label} href={item.href} className="nav-link">{item.label}</a>)}<a href="/#contact" className="nav-cta">Inquire Now</a></div>
          <button className="nav-mobile" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", fontSize: 28, color: "var(--ink)", cursor: "pointer" }}>{menuOpen ? "✕" : "☰"}</button>
        </div>
        {menuOpen && <div style={{ background: "rgba(255,253,249,0.99)", padding: "16px 24px 24px", borderTop: "1px solid var(--line)" }}>{[{ label: "Listings", href: "/listings" }, { label: "Healthcare", href: "/healthcare" }, { label: "Corporate", href: "/corporate" }, { label: "About", href: "/about" }, { label: "Contact", href: "/#contact" }].map((item) => <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} style={{ display: "block", color: "var(--ink)", textDecoration: "none", fontSize: 17, padding: "14px 0", borderBottom: "1px solid var(--line)" }}>{item.label}</a>)}</div>}
      </nav>

      <main style={{ paddingTop: 72 }}>
        <section className="search-hero" aria-labelledby="suite-search-title">
          <div className="wrap">
            <h1 id="suite-search-title" className="search-heading">Find a suite that fits your stay.</h1>
            <p className="search-sub">Search connected CareStay inventory by area, dates, and group size.</p>
            <form action="/listings" method="get" role="search" className="stay-search" onSubmit={submitSearch}>
              <div className="stay-field"><MapPin size={19} aria-hidden="true" /><div style={{ minWidth: 0, width: "100%" }}><label htmlFor="listings-where">Where</label><input id="listings-where" name="where" type="text" placeholder="Toronto or a neighbourhood" value={where} onChange={(event) => setWhere(event.target.value)} /></div></div>
              <div className="stay-field"><CalendarDays size={19} aria-hidden="true" /><div style={{ minWidth: 0, width: "100%" }}><label htmlFor="listings-check-in">Check in</label><input id="listings-check-in" name="checkIn" type="date" min={today} value={checkIn} aria-invalid={!!dateError} onChange={(event) => { setCheckIn(event.target.value); setDateError(""); }} /></div></div>
              <div className="stay-field"><CalendarDays size={19} aria-hidden="true" /><div style={{ minWidth: 0, width: "100%" }}><label htmlFor="listings-check-out">Check out</label><input id="listings-check-out" name="checkOut" type="date" min={getNextDateInput(checkIn) || today} value={checkOut} aria-invalid={!!dateError} aria-describedby={dateError ? "listings-date-error" : undefined} onChange={(event) => { setCheckOut(event.target.value); setDateError(""); }} /></div></div>
              <div className="stay-field"><Users size={19} aria-hidden="true" /><div style={{ minWidth: 0, width: "100%" }}><label htmlFor="listings-guests">Guests</label><select id="listings-guests" name="guests" value={guests} onChange={(event) => setGuests(event.target.value)}>{Array.from({ length: 10 }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count} guest{count === 1 ? "" : "s"}</option>)}</select></div></div>
              <button type="submit" className="search-button"><Search size={18} aria-hidden="true" /> Search suites</button>
              {dateError && <p id="listings-date-error" className="search-error" role="alert">{dateError}</p>}
            </form>
            <div className="search-summary"><span>{summary}</span><button type="button" className="clear-button" onClick={clearSearch}>Clear search</button></div>
          </div>
        </section>

        <div className="wrap" style={{ paddingTop: 1, paddingBottom: 72 }}>
          <div className="filters">
            <label style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clipPath: "inset(50%)" }} htmlFor="bed-filter">Bedrooms</label>
            <select id="bed-filter" className="filter-select" value={bedFilter} onChange={(event) => setBedFilter(event.target.value)}><option value="all">Any bedrooms</option><option value="1">1 bedroom</option><option value="2">2 bedrooms</option><option value="3">3+ bedrooms</option></select>
            <div className="city-scroll" aria-label="Filter by area">{["All areas", ...cities].map((city) => { const value = city === "All areas" ? "all" : city; const active = areaFilter === value; return <button key={city} type="button" className={`city-button${active ? " active" : ""}`} aria-pressed={active} onClick={() => setAreaFilter(value)}>{city}</button>; })}</div>
          </div>

          <section aria-labelledby="results-title" aria-live="polite" aria-busy={loading || availabilityState === "loading"}>
            <div className="results-head"><div><h2 id="results-title">{loading ? "Finding suites…" : connectedMatches.length === 0 ? "No suites match your search" : `${connectedMatches.length} suite${connectedMatches.length === 1 ? "" : "s"} match your search`}</h2></div><p className="results-note">{summary}</p></div>
            {checkIn && checkOut && availabilityState === "loading" && <div className="availability-message">Checking connected inventory for those dates…</div>}
            {checkIn && checkOut && availabilityState === "verified" && <div className="availability-message">Date matches are checked against connected HostAway inventory. Final booking details are confirmed by the CareStay team.</div>}
            {checkIn && checkOut && availabilityState === "error" && <div className="availability-message">Live date matching is temporarily unavailable. These suites fit your other filters; the team will confirm exact availability.</div>}

            {loading ? <div className="empty-state"><p>Loading CareStay suites…</p></div> : loadError ? <div className="empty-state"><h3>Suites are temporarily unavailable</h3><p>Please refresh in a moment, or tell the CareStay team what you need.</p><a href="/#contact" style={{ display: "inline-block", marginTop: 16, color: "var(--accent)", fontWeight: 800, textDecoration: "none" }}>Contact CareStay →</a></div> : connectedMatches.length > 0 ? (
              <ul className="listings-grid">{connectedMatches.map((listing) => <ListingCard key={listing.id} listing={listing} href={`/listings/${listing.id}${queryString ? `?${queryString}` : ""}`} dateMatched={availabilityState === "verified" && dateMatchedIds.has(String(listing.id))} />)}</ul>
            ) : (
              <div className="empty-state"><h3>No exact matches yet</h3><p>Try opening up your area, dates, or group size. You can also tell us what you need and we&apos;ll help.</p><div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginTop: 16 }}><button type="button" className="clear-button" onClick={clearSearch}>Clear filters</button><a href="/#contact" style={{ color: "var(--accent)", fontWeight: 800, textDecoration: "none", fontSize: 13 }}>Tell us what you need →</a></div></div>
            )}
          </section>

          {!loading && !loadError && unavailableMatches.length > 0 && (
            <section className="secondary-results" aria-labelledby="unavailable-title"><div className="results-head"><div><h2 id="unavailable-title">Currently unavailable</h2><p className="results-note" style={{ marginTop: 7 }}>These connected suites are not currently accepting inquiries for new stays.</p></div></div><ul className="listings-grid">{unavailableMatches.map((listing) => <ListingCard key={listing.id} listing={listing} href={`/listings/${listing.id}${queryString ? `?${queryString}` : ""}`} dateMatched={false} />)}</ul></section>
          )}

          {!loading && !loadError && showcaseMatches.length > 0 && (
            <section className="secondary-results" aria-labelledby="showcase-title"><div className="results-head"><div><h2 id="showcase-title">Suite inspiration</h2><p className="results-note" style={{ marginTop: 7 }}>These are non-bookable examples, shown for style and neighbourhood inspiration. They are not active CareStay listings.</p></div></div><ul className="listings-grid">{showcaseMatches.map((listing) => <ListingCard key={listing.id} listing={listing} href={`/listings/${listing.id}${queryString ? `?${queryString}` : ""}`} dateMatched={false} />)}</ul></section>
          )}
        </div>
      </main>

      <footer style={{ background: "var(--night)", color: "rgba(255,255,255,.68)", padding: "32px 24px" }}><div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", fontSize: 12 }}><span>© 2026 CareStay Suites</span><span>Professionally managed furnished stays across Toronto</span></div></footer>
    </>
  );
}
