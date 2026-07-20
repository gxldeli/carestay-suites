"use client";

declare global { interface Window { fbq: (...args: unknown[]) => void; } }

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Wifi, Coffee, UtensilsCrossed, Snowflake, Flame, WashingMachine, Wind, Tv, Car, Dumbbell, Waves, ArrowUpDown, Sun, GlassWater, Shirt, Laptop, Bell, ShieldCheck, Droplets, Bed, Sandwich, Microwave, ShowerHead, PawPrint, Lock, Zap, Accessibility, Check, Fan, Bath, DoorOpen, ArmchairIcon, SprayCan, Refrigerator, Baby, Sofa, Wine, Cookie, Thermometer, Glasses, Footprints, Moon, HandMetal, type LucideIcon, FireExtinguisher } from "lucide-react";
import type { ReactNode } from "react";
import { hasRestrictedDurationLanguage } from "@/app/lib/public-listing-copy";
import { getNextDateInput, getTorontoToday, isValidDateInput } from "@/app/lib/date-input";

interface ReviewItem { id: string; name: string; stars: number; text: string; date: string; verified: boolean; stayInfo?: string }
interface ReviewData { totalCount: number; items: ReviewItem[] }
const CARESTAY_STANDARD: { icon: ReactNode; name: string; desc: string }[] = [
  { icon: "🏠", name: "Fully Furnished", desc: "Comfortable spaces ready for everyday living" },
  { icon: "🔑", name: "Easy Check-In", desc: "A straightforward arrival experience" },
  { icon: "📶", name: "Connected", desc: "Reliable Wi-Fi for work and downtime" },
  { icon: "🧹", name: "Professionally Managed", desc: "Property care from a local operations team" },
  { icon: "💬", name: "Responsive Support", desc: "Real help when you need it" },
];

function Nav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(255,253,249,0.95)" : "rgba(255,253,249,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(30,42,50,0.06)", transition: "all 0.4s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 72 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,var(--accent),var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#fff" }}>CS</div>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, color: "var(--ink)" }}>CareStay <span style={{ fontWeight: 400, color: "rgba(30,42,50,0.6)" }}>Suites</span></span>
        </Link>
        <div className="nav-links">
          {[{ l: "Listings", h: "/listings" }, { l: "Healthcare", h: "/healthcare" }, { l: "Corporate", h: "/corporate" }, { l: "About", h: "/about" }, { l: "Contact", h: "/#contact" }].map(i => <a key={i.l} href={i.h} className="nav-link">{i.l}</a>)}
          <a href="#inquiry" className="nav-cta">Inquire Now</a>
        </div>
        <button className="nav-mobile" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)} style={{ background: "none", border: "none", fontSize: 28, color: "var(--ink)", cursor: "pointer" }}>{open ? "\u2715" : "\u2630"}</button>
      </div>
      {open && (
        <div style={{ background: "rgba(255,253,249,0.98)", padding: "16px 24px 24px", borderTop: "1px solid rgba(30,42,50,0.06)" }}>
          {[{ l: "Listings", h: "/listings" }, { l: "Healthcare", h: "/healthcare" }, { l: "Corporate", h: "/corporate" }, { l: "About", h: "/about" }, { l: "Contact", h: "#inquiry" }].map(i => <a key={i.l} href={i.h} onClick={() => setOpen(false)} style={{ display: "block", color: "rgba(30,42,50,0.8)", textDecoration: "none", fontSize: 17, padding: "14px 0", borderBottom: "1px solid rgba(30,42,50,0.06)" }}>{i.l}</a>)}
          <a href="#inquiry" onClick={() => setOpen(false)} style={{ display: "block", background: "var(--accent)", color: "#fff", textAlign: "center", padding: 16, borderRadius: 10, fontWeight: 700, fontSize: 16, marginTop: 16, textDecoration: "none" }}>Inquire Now</a>
        </div>
      )}
    </nav>
  );
}

interface ListingData { id: number | string; title: string; location: string; beds: number; baths: number; price: number; sqft: number; img: string; tag: string; available: boolean; desc: string; description?: string; images?: string[]; nearbyHospital?: string; hospitalDistance?: string; featured?: boolean; videoUrl?: string; amenities?: string[]; maxGuests?: number; bedrooms?: number; availabilityStatus?: string; isCustom?: boolean; bookable?: boolean }

export default function ListingPage() {
  const params = useParams();
  const rawId = params.id as string;
  const [listing, setListing] = useState<ListingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [moveOut, setMoveOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [searchArea, setSearchArea] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const inquiryRef = useRef<HTMLDivElement>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef(0);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewTotalCount, setReviewTotalCount] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  useEffect(() => {
    if (lightboxOpen) lightboxCloseRef.current?.focus();
  }, [lightboxOpen]);
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxOpen(false); if (e.key === "ArrowRight") goNext(); if (e.key === "ArrowLeft") goPrev(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  const images = listing?.images?.length ? listing.images.slice(0, 30) : listing?.img ? [listing.img] : [];
  const availableImages = images.filter((image) => !failedImages.has(image));
  const currentImg = selectedImg && !failedImages.has(selectedImg) ? selectedImg : availableImages[0] || "";
  const currentIdx = Math.max(0, availableImages.indexOf(currentImg));
  const goNext = () => { if (availableImages.length > 1) setSelectedImg(availableImages[(currentIdx + 1) % availableImages.length]); };
  const goPrev = () => { if (availableImages.length > 1) setSelectedImg(availableImages[(currentIdx - 1 + availableImages.length) % availableImages.length]); };
  const markImageFailed = (image: string) => {
    setFailedImages((current) => {
      if (current.has(image)) return current;
      const next = new Set(current);
      next.add(image);
      return next;
    });
    if (selectedImg === image) setSelectedImg("");
  };
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { dx < 0 ? goNext() : goPrev(); }
  };
  useEffect(() => {
    setFailedImages(new Set());
    setSelectedImg("");
  }, [rawId]);
  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const parsedGuests = Number(search.get("guests") || "1");
    const parsedCheckIn = search.get("checkIn") || "";
    const parsedCheckOut = search.get("checkOut") || "";
    const hasValidDatePair = isValidDateInput(parsedCheckIn) && isValidDateInput(parsedCheckOut) && parsedCheckIn >= getTorontoToday() && parsedCheckOut > parsedCheckIn;
    setMoveIn(hasValidDatePair ? parsedCheckIn : "");
    setMoveOut(hasValidDatePair ? parsedCheckOut : "");
    setSearchArea(search.get("where") || search.get("destination") || "");
    setGuests(String(Number.isInteger(parsedGuests) && parsedGuests >= 1 && parsedGuests <= 20 ? parsedGuests : 1));
  }, []);
  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 20); };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    fetch(`/api/listings/${encodeURIComponent(rawId)}`)
      .then(r => r.json())
      .then(data => {
        if (data.status === "success" && data.listing) {
          const match = data.listing;
            setListing({
              id: match.id, title: match.title, location: match.location, beds: match.beds, baths: match.baths,
              price: match.price, sqft: match.sqft, img: match.images?.[0] || match.img, tag: match.location || "GTA",
              available: match.available !== false, desc: match.description || "", description: match.description, images: match.images,
              nearbyHospital: match.nearbyHospital || "", hospitalDistance: match.hospitalDistance || "", featured: match.featured || false, videoUrl: match.videoUrl || "", amenities: match.amenities || [],
              maxGuests: match.maxGuests || undefined, bedrooms: match.bedrooms || undefined, availabilityStatus: match.availabilityStatus || "Available",
              isCustom: match.isCustom === true, bookable: match.bookable !== false,
            });
        } else setLoadError(true);
        setLoading(false);
      })
      .catch(() => { setLoadError(true); setLoading(false); });
  }, [rawId]);
  useEffect(() => {
    if (!listing) return;
    document.title = `${listing.title} | CareStay Suites - Furnished Housing GTA`;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = `${listing.title} - ${listing.beds} bed/${listing.baths} bath furnished apartment in ${listing.location}. Professionally managed and fully equipped for flexible stays.`;
  }, [listing]);
  useEffect(() => {
    if (!listing) return;
    fetch(`/api/listings/${listing.id}/reviews`).then(r => r.json()).then(data => {
      if (data.status === "success" && data.reviews) {
        const rd = data.reviews as ReviewData;
        const manuallyAddedReviews = rd.items.filter((review) => !review.id.startsWith("rev-gen-") && !hasRestrictedDurationLanguage(review.text));
        setReviews(manuallyAddedReviews);
        setReviewTotalCount(manuallyAddedReviews.length);
      }
    }).catch(() => {});
  }, [listing]);
  const avgStars = reviews.length > 0 ? reviews.reduce((a, r) => a + r.stars, 0) / reviews.length : 0;
  const ratingLabel = avgStars >= 4.5 ? "Exceptional" : avgStars >= 4.0 ? "Excellent" : avgStars >= 3.5 ? "Very Good" : "Good";
  const displayTotalCount = reviewTotalCount || reviews.length;
  const isShowcase = listing?.isCustom === true;
  const isComingSoon = listing ? !listing.available && !isShowcase : false;
  const availStatus = isShowcase ? "Example" : listing?.availabilityStatus || "Available";
  const isWaitlist = !isShowcase && (availStatus === "Waitlist Only" || availStatus === "Booked");
  const ctaLabel = isShowcase ? "Ask About Similar Suites" : isWaitlist || isComingSoon ? "Join Waitlist" : "Inquire Now";
  const ctaHeading = isShowcase ? "Looking for a Suite Like This?" : isWaitlist || isComingSoon ? "Join the Waitlist for This Suite" : "Inquire About This Suite";
  const ctaSub = isShowcase ? "This is a non-bookable example. Tell us what you need and we’ll look for a real match." : isWaitlist || isComingSoon ? "Be first to know when this suite becomes available." : "Fill out the form below and our team will follow up shortly.";
  const today = getTorontoToday();
  const departureMin = getNextDateInput(moveIn) || today;
  const returnParams = new URLSearchParams();
  if (searchArea) returnParams.set("where", searchArea);
  if (moveIn) returnParams.set("checkIn", moveIn);
  if (moveOut) returnParams.set("checkOut", moveOut);
  if (guests) returnParams.set("guests", guests);
  const listingsHref = `/listings${returnParams.toString() ? `?${returnParams.toString()}` : ""}`;
  const handleSubmit = async () => {
    if (!email) {
      setSubmitError("Please add your email address.");
      return;
    }
    if ((moveIn && !moveOut) || (!moveIn && moveOut) || (moveIn && moveOut && moveOut <= moveIn)) {
      setSubmitError("Please choose a valid check-in and check-out date.");
      return;
    }
    const tags = isWaitlist || isComingSoon ? ["carestay-waitlist", "listing-waitlist"] : [];
    const search = new URLSearchParams(window.location.search);
    const destination = search.get("where") || search.get("destination") || searchArea || listing?.location || "";
    const searchContext = [`Guests: ${guests}`, destination ? `Preferred area: ${destination}` : ""].filter(Boolean).join("\n");
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, phone, moveIn, moveOut, message: [searchContext, message].filter(Boolean).join("\n\n"), listing: listing?.title, tags: [...tags, "professional-stays"] }) });
      if (!response.ok) throw new Error("Inquiry could not be sent");
      if (typeof window !== "undefined" && window.fbq) { window.fbq("track", "Lead"); }
      setSubmitted(true);
    } catch {
      setSubmitError("We couldn’t send that inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 16, color: "rgba(30,42,50,0.5)" }}>Loading...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700 }}>{loadError ? "Suites are temporarily unavailable" : "Listing not found"}</h1>
        {loadError && <p style={{ color: "var(--ink-soft)", textAlign: "center", maxWidth: 480 }}>Please refresh in a moment, or browse back to the CareStay homepage.</p>}
        <Link href="/#listings" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Back to all suites</Link>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'DM Sans',system-ui,sans-serif;color:var(--ink);background:var(--paper);-webkit-font-smoothing:antialiased}
        .wrap{max-width:1200px;margin:0 auto;width:100%;padding:0 24px}
        .nav-links{display:flex;align-items:center;gap:28px}
        .nav-mobile{display:none}
        .nav-link{color:var(--ink-soft);text-decoration:none;font-size:14px;font-weight:600}
        .nav-link:hover{color:var(--accent)}
        .nav-cta{background:var(--accent);color:#fff;padding:10px 22px;border-radius:999px;font-weight:700;font-size:13px;text-decoration:none}
        .detail-grid{display:grid;grid-template-columns:1fr 380px;gap:40px;align-items:start}
        @media(max-width:768px){
          .nav-links{display:none!important}
          .nav-mobile{display:block!important}
          .detail-grid{grid-template-columns:1fr!important}
          .gallery-thumbs{justify-content:flex-start}
          .cs-standard-grid{grid-template-columns:1fr!important}
          .footer-cols{grid-template-columns:1fr!important}
          .amenity-grid{grid-template-columns:1fr 1fr!important}
          .detail-sidebar{display:none!important}
          .mobile-sticky-bar{display:flex!important}
          .inquiry-form-grid{grid-template-columns:1fr!important}
          .map-iframe{height:300px!important}
        }
        .detail-sidebar{display:block}
        .mobile-sticky-bar{display:none}
        .gallery-thumbs::-webkit-scrollbar{height:6px}
        .gallery-thumbs::-webkit-scrollbar-track{background:var(--paper-alt);border-radius:3px}
        .gallery-thumbs::-webkit-scrollbar-thumb{background:var(--accent2);border-radius:3px}
        .gallery-thumbs{scrollbar-width:thin;scrollbar-color:var(--accent2) var(--paper-alt)}
        .gallery-main{height:clamp(300px,55vw,500px);background:linear-gradient(145deg,#e8eef2 0%,#f7f3ed 52%,#dfe7ed 100%)}
        .gallery-fallback{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:var(--ink-soft);gap:5px}
        .gallery-fallback strong{font-family:'Cormorant Garamond',serif;font-size:30px;color:var(--ink)}
        .gallery-fallback span{font-size:12px;font-weight:700;letter-spacing:.02em}
      ` }} />

      <Nav scrolled={scrolled} />

      <main style={{ paddingTop: 72 }}>
        {/* Gallery */}
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px 0" }}>
          <div
            className="gallery-main"
            style={{ borderRadius: 16, overflow: "hidden", maxHeight: 500, position: "relative" }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              aria-label="Open photo gallery"
              onClick={() => setLightboxOpen(true)}
              style={{ position: "absolute", inset: 0, zIndex: 1, display: "block", width: "100%", height: "100%", padding: 0, border: 0, background: "transparent", cursor: "pointer" }}
            >
              {!currentImg && <div className="gallery-fallback"><strong>CareStay Suites</strong><span>Photo unavailable</span></div>}
              {currentImg && <img
                key={currentImg}
                src={currentImg}
                alt={listing.title}
                onError={() => markImageFailed(currentImg)}
                style={{ width: "100%", height: "100%", maxHeight: 500, objectFit: "cover", display: "block" }}
              />}
            </button>
            {/* Gallery Badges */}
            <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 8, zIndex: 2 }}>
              {listing.featured && (
                <span style={{ background: "#d4a844", color: "#1a1200", padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: "0.02em", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>Featured Suite</span>
              )}
              {reviews.length > 0 && avgStars >= 4.8 && (
                <span style={{ background: "rgba(23,38,48,0.9)", color: "#fff", padding: "5px 12px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: "0.02em", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>◆ Highest Rated</span>
              )}
            </div>
            {availableImages.length > 1 && (
              <>
                <button type="button" aria-label="Previous photo" onClick={goPrev} style={{ position: "absolute", zIndex: 2, left: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>‹</button>
                <button type="button" aria-label="Next photo" onClick={goNext} style={{ position: "absolute", zIndex: 2, right: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>›</button>
                <div style={{ position: "absolute", zIndex: 2, bottom: 12, right: 12, background: "rgba(0,0,0,0.6)", color: "#fff", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600 }}>{currentIdx + 1} / {availableImages.length}</div>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {availableImages.length > 1 && (
            <div className="gallery-thumbs" style={{ display: "flex", gap: 8, overflowX: "auto", paddingTop: 12, paddingBottom: 4 }}>
              {availableImages.map((imgUrl, i) => (
                <button
                  type="button"
                  key={imgUrl}
                  aria-label={`Show photo ${i + 1}`}
                  onClick={() => setSelectedImg(imgUrl)}
                  style={{ flexShrink: 0, width: 72, height: 48, borderRadius: 8, overflow: "hidden", border: currentImg === imgUrl ? "2px solid var(--accent)" : "2px solid rgba(30,42,50,0.1)", cursor: "pointer", padding: 0, background: "none" }}
                >
                  <img src={imgUrl} alt={`${listing.title} ${i + 1}`} loading="lazy" decoding="async" onError={() => markImageFailed(imgUrl)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="wrap" style={{ paddingTop: 32 }}>
          <div className="detail-grid">
            {/* Left — Details */}
            <div>
              {/* Badges */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <span style={{ background: "rgba(94,129,148,0.1)", color: "var(--accent2)", padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{listing.tag}</span>
                <span style={{ background: availStatus === "Almost Booked" ? "rgba(205,119,20,0.12)" : availStatus === "Example" || availStatus === "Waitlist Only" || availStatus === "Booked" ? "rgba(30,42,50,0.1)" : "rgba(45,43,255,0.1)", color: availStatus === "Almost Booked" ? "#a75d10" : availStatus === "Example" || availStatus === "Waitlist Only" || availStatus === "Booked" ? "var(--ink)" : "var(--accent)", padding: "5px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
                  {availStatus === "Example" ? "Example · not bookable" : availStatus === "Almost Booked" ? "Limited availability" : availStatus === "Waitlist Only" || availStatus === "Booked" ? "Fully booked" : "Check your dates"}
                </span>
                {listing.featured && (
                  <span style={{ background: "rgba(185,130,79,0.15)", color: "var(--gold)", padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>★ Featured</span>
                )}
              </div>

              {/* Title */}
              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 700, lineHeight: 1.1, marginBottom: 6 }}>{listing.title}</h1>

              {/* Mini Review Link */}
              {reviews.length > 0 && <a href="#reviews" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#9a682f", fontSize: 13, fontWeight: 600, textDecoration: "none", marginBottom: 8 }}>
                <span style={{ display: "inline-flex", gap: 1 }}>
                  {[1,2,3,4,5].map(i => {
                    const fill = Math.min(1, Math.max(0, avgStars - (i - 1)));
                    return (
                      <span key={i} style={{ position: "relative", display: "inline-block", width: 14, height: 14, fontSize: 14, lineHeight: 1 }}>
                        <span style={{ color: "rgba(30,42,50,0.15)" }}>★</span>
                        <span style={{ position: "absolute", left: 0, top: 0, width: `${fill * 100}%`, overflow: "hidden", color: "var(--gold)" }}>★</span>
                      </span>
                    );
                  })}
                </span>
                <span>{avgStars.toFixed(1)} · {displayTotalCount} reviews</span>
              </a>}

              {/* Specs */}
              <p style={{ fontSize: 15, color: "rgba(30,42,50,0.5)", marginBottom: 24, lineHeight: 1.6 }}>
                {[
                  listing.maxGuests ? `${listing.maxGuests} guest${listing.maxGuests !== 1 ? "s" : ""}` : null,
                  listing.bedrooms ? `${listing.bedrooms} bedroom${listing.bedrooms !== 1 ? "s" : ""}` : null,
                  listing.beds ? `${listing.beds} bed${listing.beds !== 1 ? "s" : ""}` : null,
                  listing.baths ? `${listing.baths} bath${listing.baths !== 1 ? "s" : ""}` : null,
                ].filter(Boolean).join(" · ")}
              </p>

              {/* Video Walkthrough */}
              {listing.videoUrl && (() => {
                const m = listing.videoUrl!.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
                const vid = m ? m[1] : null;
                return vid ? (
                  <div style={{ marginBottom: 48 }}>
                    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, marginBottom: 20 }}>Take a Virtual Tour</h2>
                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 16, overflow: "hidden", background: "var(--surface)", border: "1px solid rgba(30,42,50,0.08)" }}>
                      <iframe src={`https://www.youtube.com/embed/${vid}`} title="Video Walkthrough" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} />
                    </div>
                    <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 12, lineHeight: 1.6 }}>Use the walkthrough to get a clearer look at the suite before you inquire.</p>
                  </div>
                ) : null;
              })()}

              {/* Description */}
              <div style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(30,42,50,0.7)", marginBottom: 48 }}>
                {(() => {
                  const fullText = listing.desc || listing.description || "";
                  const lines = fullText.split("\n");
                  const truncated = !showFullDesc && fullText.length > 400;
                  const displayLines = truncated ? fullText.substring(0, 400).split("\n") : lines;
                  return (
                    <>
                      <div style={{ position: "relative" }}>
                        {displayLines.map((line, i) => <p key={i} style={{ marginBottom: line.trim() ? 12 : 0 }}>{line}{truncated && i === displayLines.length - 1 ? "..." : ""}</p>)}
                        {truncated && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 48, background: "linear-gradient(transparent, var(--paper))" }} />}
                      </div>
                      {fullText.length > 400 && (
                        <button onClick={() => setShowFullDesc(!showFullDesc)} style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px 0 0", fontFamily: "inherit" }}>
                          {showFullDesc ? "Show Less" : "See More"}
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>


              {/* Amenities */}
              <div style={{ marginBottom: 48 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, marginBottom: 20 }}>Amenities</h2>
                {(() => {
                    const iconMap: Record<string, LucideIcon> = {
                      "wifi": Wifi, "wireless internet": Wifi, "wireless": Wifi, "internet": Wifi,
                      "kitchen": UtensilsCrossed,
                      "cooking basics": UtensilsCrossed,
                      "parking": Car, "free parking": Car, "garage": Car, "street parking": Car,
                      "washer": WashingMachine, "laundry": WashingMachine, "washing machine": WashingMachine,
                      "dryer": Wind,
                      "air conditioning": Snowflake, "ac": Snowflake, "a/c": Snowflake, "central air": Snowflake,
                      "heating": Flame, "heat": Flame, "central heating": Flame,
                      "indoor fireplace": Flame, "fireplace": Flame,
                      "tv": Tv, "cable tv": Tv, "smart tv": Tv, "television": Tv,
                      "gym": Dumbbell, "fitness": Dumbbell, "fitness center": Dumbbell, "exercise equipment": Dumbbell,
                      "pool": Waves, "swimming pool": Waves,
                      "elevator": ArrowUpDown, "lift": ArrowUpDown,
                      "balcony": Sun, "patio": Sun, "deck": Sun, "terrace": Sun, "patio or balcony": Sun,
                      "dishwasher": GlassWater,
                      "coffee maker": Coffee, "coffee": Coffee, "espresso machine": Coffee,
                      "iron": Shirt,
                      "hair dryer": Fan, "hairdryer": Fan,
                      "workspace": Laptop, "dedicated workspace": Laptop, "laptop friendly workspace": Laptop,
                      "smart lock": Lock, "lockbox": Lock, "keypad": Lock, "self check-in": Lock,
                      "subway": Car, "transit": Car,
                      "soaking tub": Bath, "bathtub": Bath, "hot tub": Bath,
                      "concierge": Bell, "doorman": Bell, "front desk": Bell,
                      "pet friendly": PawPrint, "pets allowed": PawPrint,
                      "microwave": Microwave, "oven": Flame, "stove": Flame, "refrigerator": Refrigerator, "fridge": Refrigerator, "freezer": Refrigerator,
                      "smoke detector": Bell,
                      "carbon monoxide detector": ShieldCheck,
                      "fire extinguisher": FireExtinguisher,
                      "first aid kit": ShieldCheck,
                      "hangers": Shirt, "closet": Sofa, "clothing storage": Sofa,
                      "bed linens": Bed, "linens": Bed, "towels": Bed, "extra pillows": Bed, "extra pillows and blankets": Bed,
                      "shampoo": Droplets,
                      "essentials": SprayCan,
                      "toiletries": Droplets,
                      "toaster": Sandwich,
                      "outdoor furniture": ArmchairIcon,
                      "cleaning products": SprayCan, "cleaning before checkout": SprayCan,
                      "bbq grill": Flame, "bbq": Flame, "barbecue": Flame,
                      "rain shower": ShowerHead, "shower": ShowerHead,
                      "shower gel": Droplets, "body soap": Droplets,
                      "suitable for children": Baby, "family friendly": Baby,
                      "suitable for infants": Baby,
                      "bathrobe": Shirt,
                      "wine glasses": Wine,
                      "baking sheet": Cookie,
                      "hot water": Thermometer,
                      "private entrance": DoorOpen,
                      "ev charger": Zap,
                      "wheelchair accessible": Accessibility,
                      "dishes and silverware": GlassWater,
                    };
                    const getIcon = (name: string): LucideIcon => {
                      const lower = name.toLowerCase().trim();
                      if (iconMap[lower]) return iconMap[lower];
                      for (const [key, icon] of Object.entries(iconMap)) {
                        if (lower.includes(key) || key.includes(lower)) return icon;
                      }
                      return Check;
                    };

                    // Deduplicate: merge "Internet"/"Wireless Internet"/"Wireless" into "WiFi"
                    const WIFI_VARIANTS = new Set(["internet", "wireless internet", "wireless", "wifi"]);
                    const rawAmenities = listing.amenities || [];

                    // Deduplicate
                    const seen = new Set<string>();
                    let hasWifi = false;
                    const deduped: string[] = [];
                    for (const a of rawAmenities) {
                      const lower = a.toLowerCase().trim();
                      if (WIFI_VARIANTS.has(lower)) {
                        if (!hasWifi) { hasWifi = true; deduped.push("WiFi"); }
                        continue;
                      }
                      if (seen.has(lower)) continue;
                      seen.add(lower);
                      deduped.push(a);
                    }

                    // Sort by priority
                    const PRIORITY: Record<string, number> = {
                      "wifi": 1, "coffee maker": 2, "coffee": 2, "kitchen": 3, "air conditioning": 4,
                      "washer": 5, "washing machine": 5, "dryer": 6, "free parking": 7, "parking": 7, "street parking": 7,
                      "tv": 8, "cable tv": 8, "smart tv": 8, "workspace": 9, "dedicated workspace": 9,
                      "laptop friendly workspace": 9, "heating": 10, "hair dryer": 11, "iron": 12,
                      "balcony": 13, "patio": 13, "patio or balcony": 13, "pool": 14, "swimming pool": 14,
                      "gym": 15, "fitness center": 15, "pet friendly": 16, "pets allowed": 16,
                    };
                    const getPriority = (name: string) => PRIORITY[name.toLowerCase().trim()] || 100;
                    const sorted = [...deduped].sort((a, b) => {
                      const pa = getPriority(a), pb = getPriority(b);
                      if (pa !== pb) return pa - pb;
                      return a.localeCompare(b);
                    });

                    if (sorted.length === 0) {
                      return <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.7 }}>Exact amenities for this suite are available from the CareStay team.</p>;
                    }
                    const visible = showAllAmenities ? sorted : sorted.slice(0, 9);
                    return (
                      <>
                        <div className="amenity-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                          {visible.map((a: string, i: number) => {
                            const IconComp = getIcon(a);
                            return (
                              <div key={`${a}-${i}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(30,42,50,0.03)", border: "1px solid rgba(30,42,50,0.06)", borderRadius: 10 }}>
                                <IconComp size={18} strokeWidth={1.5} style={{ color: "rgba(30,42,50,0.6)", flexShrink: 0 }} />
                                <span style={{ fontSize: 13, color: "rgba(30,42,50,0.7)", fontWeight: 500 }}>{a}</span>
                              </div>
                            );
                          })}
                        </div>
                        {sorted.length > 9 && (
                          <button onClick={() => setShowAllAmenities(!showAllAmenities)} style={{ background: "rgba(30,42,50,0.04)", border: "1px solid rgba(30,42,50,0.1)", borderRadius: 10, padding: "12px 24px", color: "var(--accent)", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "inherit", marginTop: 12 }}>
                            {showAllAmenities ? "Show Less" : `See More (${sorted.length - 9} more)`}
                          </button>
                        )}
                      </>
                    );
                  })()}
              </div>

              {/* CareStay Standard */}
              <div style={{ marginBottom: 48 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, marginBottom: 20 }}>The CareStay Standard</h2>
                <div className="cs-standard-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {CARESTAY_STANDARD.map((item) => (
                    <div key={item.name} style={{ background: "rgba(30,42,50,0.03)", border: "1px solid rgba(30,42,50,0.06)", borderRadius: 12, padding: "16px 18px", display: "flex", gap: 14, alignItems: "center" }}>
                      <span style={{ fontSize: 24 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 2 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Where You'll Be — approximate area only */}
              {(() => {
                const mapQuery = encodeURIComponent(listing.location + ", Ontario, Canada");
                return (
                <div style={{ marginBottom: 48 }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, marginBottom: 20 }}>Where You&apos;ll Be</h2>
                  <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(30,42,50,0.06)" }}>
                    <iframe
                      className="map-iframe"
                      src={`https://maps.google.com/maps?q=${mapQuery}&z=12&output=embed`}
                      style={{ width: "100%", height: 400, border: "none", display: "block" }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Approximate area for ${listing.location}`}
                    />
                  </div>
                  <div style={{ marginTop: 12, fontSize: 15, color: "rgba(30,42,50,0.6)", fontWeight: 500 }}>
                    📍 {listing.location} · Approximate area. Exact arrival details are shared after booking.
                  </div>
                </div>
                );
              })()}

              {/* Guest Reviews */}
              {reviews.length > 0 && (
              <div id="reviews" style={{ marginBottom: 48 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Guest Reviews</h2>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 24 }}>
                  <span style={{ color: "var(--gold)", fontSize: 18 }}>{"★".repeat(Math.round(avgStars))}{"☆".repeat(5 - Math.round(avgStars))}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--gold)" }}>{avgStars.toFixed(1)}</span>
                  <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>{ratingLabel} · {displayTotalCount} reviews</span>
                </div>
                {(showAllReviews ? reviews : reviews.slice(0, 3)).map(r => (
                  <div key={r.id} style={{ background: "rgba(30,42,50,0.03)", border: "1px solid rgba(30,42,50,0.06)", borderRadius: 14, padding: "20px 22px", marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>{r.name}</span>
                          {r.verified && <span style={{ color: "var(--accent2)", fontSize: 13 }} title="Verified Guest">✓ <span style={{ fontSize: 11, fontWeight: 500 }}>Verified</span></span>}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(30,42,50,0.3)" }}>
                          {r.date && <span>{r.date}</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                        {[1,2,3,4,5].map(i => (
                          <span key={i} style={{ fontSize: 18, color: i <= r.stars ? "#f0c040" : "rgba(30,42,50,0.15)" }}>★</span>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(30,42,50,0.6)" }}>{r.text}</p>
                  </div>
                ))}
                {reviews.length > 3 && !showAllReviews && (
                  <button onClick={() => setShowAllReviews(true)} style={{ background: "rgba(30,42,50,0.04)", border: "1px solid rgba(30,42,50,0.1)", borderRadius: 10, padding: "12px 24px", color: "var(--accent)", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "inherit", marginTop: 4 }}>
                    See More Reviews
                  </button>
                )}
              </div>
              )}
            </div>

            {/* Right — Booking Card */}
            <div className="detail-sidebar" style={{ position: "sticky", top: 88 }}>
              <div style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 18, padding: 28, boxShadow: "var(--shadow)" }}>
                <div style={{ marginBottom: 8 }}>{listing.price ? <><span style={{ fontSize: 13, color: "var(--ink-faint)", marginRight: 6 }}>From</span><span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 36, color: "var(--ink)" }}>${listing.price.toLocaleString()}</span></> : <span style={{ fontSize: 18, fontWeight: 700 }}>Rate on request</span>}</div>
                {reviews.length > 0 && <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
                  <span style={{ color: "var(--gold)", fontSize: 14 }}>{"★".repeat(Math.round(avgStars))}</span>
                  <span style={{ fontSize: 13, color: "var(--gold)" }}>{avgStars.toFixed(1)} · {displayTotalCount} reviews</span>
                </div>}

                <div className="inquiry-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}><div><label style={{ display: "block", fontSize: 10, color: "var(--ink-soft)", marginBottom: 4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }} htmlFor="sidebar-arrival">Check in</label><input id="sidebar-arrival" type="date" min={today} value={moveIn} onChange={e => setMoveIn(e.target.value)} style={{ width: "100%", background: "rgba(30,42,50,0.04)", border: "1px solid rgba(30,42,50,0.08)", borderRadius: 10, padding: "12px 10px", color: "var(--ink)", fontSize: 13, outline: "none", fontFamily: "inherit", colorScheme: "light" }} /></div><div><label style={{ display: "block", fontSize: 10, color: "var(--ink-soft)", marginBottom: 4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }} htmlFor="sidebar-departure">Check out</label><input id="sidebar-departure" type="date" min={departureMin} value={moveOut} onChange={e => setMoveOut(e.target.value)} style={{ width: "100%", background: "rgba(30,42,50,0.04)", border: "1px solid rgba(30,42,50,0.08)", borderRadius: 10, padding: "12px 10px", color: "var(--ink)", fontSize: 13, outline: "none", fontFamily: "inherit", colorScheme: "light" }} /></div></div>
                <div style={{ marginBottom: 14 }}><label style={{ display: "block", fontSize: 10, color: "var(--ink-soft)", marginBottom: 4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }} htmlFor="sidebar-guests">Guests</label><select id="sidebar-guests" value={guests} onChange={e => setGuests(e.target.value)} style={{ width: "100%", background: "rgba(30,42,50,0.04)", border: "1px solid rgba(30,42,50,0.08)", borderRadius: 10, padding: "12px 14px", color: "var(--ink)", fontSize: 14, outline: "none", fontFamily: "inherit" }}>{Array.from({ length: Math.max(10, listing.maxGuests || 0) }, (_, index) => index + 1).slice(0, 20).map((count) => <option key={count} value={count}>{count} guest{count === 1 ? "" : "s"}</option>)}</select></div>

                <a href="#inquiry" style={{ display: "block", width: "100%", padding: "16px 0", background: "var(--accent)", color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: 15, textAlign: "center", textDecoration: "none", fontFamily: "inherit" }}>
                  {ctaLabel}
                </a>

                <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(45,43,255,0.05)", borderRadius: 10, border: "1px solid rgba(45,43,255,0.1)" }}>
                  <div style={{ fontSize: 13, color: "var(--accent)", fontWeight: 600, marginBottom: 4 }}>Professional Stay Support</div>
                  <div style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.5 }}>Ask about corporate coordination, relocation support, healthcare assignments, or insurance placements.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div id="inquiry" ref={inquiryRef} className="wrap" style={{ paddingTop: 60, paddingBottom: 20 }}>
          <div style={{ maxWidth: 680, margin: "0 auto", background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 20, padding: "36px 32px", boxShadow: "var(--shadow)" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "var(--ink)", marginBottom: 6, textAlign: "center" }}>{ctaHeading}</h2>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", textAlign: "center", marginBottom: 28 }}>{ctaSub}</p>

            {!submitted ? (
              <form
                onSubmit={(event) => { event.preventDefault(); void handleSubmit(); }}
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div className="inquiry-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label htmlFor="inquiry-name" style={{ display: "block", fontSize: 11, color: "var(--ink-soft)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Full Name</label>
                    <input id="inquiry-name" name="name" autoComplete="name" type="text" placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", background: "rgba(30,42,50,0.04)", border: "1px solid rgba(30,42,50,0.08)", borderRadius: 10, padding: "13px 16px", color: "var(--ink)", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                  </div>
                  <div>
                    <label htmlFor="inquiry-email" style={{ display: "block", fontSize: 11, color: "var(--ink-soft)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label>
                    <input id="inquiry-email" name="email" autoComplete="email" type="email" required placeholder="name@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", background: "rgba(30,42,50,0.04)", border: "1px solid rgba(30,42,50,0.08)", borderRadius: 10, padding: "13px 16px", color: "var(--ink)", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                  </div>
                </div>
                <div>
                  <label htmlFor="inquiry-phone" style={{ display: "block", fontSize: 11, color: "var(--ink-soft)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Phone</label>
                  <input id="inquiry-phone" name="phone" autoComplete="tel" type="tel" placeholder="(647) 000-0000" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: "100%", background: "rgba(30,42,50,0.04)", border: "1px solid rgba(30,42,50,0.08)", borderRadius: 10, padding: "13px 16px", color: "var(--ink)", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                </div>
                <div className="inquiry-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}><div><label style={{ display: "block", fontSize: 11, color: "var(--ink-soft)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }} htmlFor="inquiry-arrival">Check in</label><input id="inquiry-arrival" name="checkIn" type="date" min={today} value={moveIn} onChange={e => setMoveIn(e.target.value)} style={{ width: "100%", background: "rgba(30,42,50,0.04)", border: "1px solid rgba(30,42,50,0.08)", borderRadius: 10, padding: "13px 16px", color: "var(--ink)", fontSize: 14, outline: "none", fontFamily: "inherit", colorScheme: "light" }} /></div><div><label style={{ display: "block", fontSize: 11, color: "var(--ink-soft)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }} htmlFor="inquiry-departure">Check out</label><input id="inquiry-departure" name="checkOut" type="date" min={departureMin} value={moveOut} onChange={e => setMoveOut(e.target.value)} style={{ width: "100%", background: "rgba(30,42,50,0.04)", border: "1px solid rgba(30,42,50,0.08)", borderRadius: 10, padding: "13px 16px", color: "var(--ink)", fontSize: 14, outline: "none", fontFamily: "inherit", colorScheme: "light" }} /></div></div>
                <div><label style={{ display: "block", fontSize: 11, color: "var(--ink-soft)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }} htmlFor="inquiry-guests">Guests</label><select id="inquiry-guests" name="guests" value={guests} onChange={e => setGuests(e.target.value)} style={{ width: "100%", background: "rgba(30,42,50,0.04)", border: "1px solid rgba(30,42,50,0.08)", borderRadius: 10, padding: "13px 16px", color: "var(--ink)", fontSize: 14, outline: "none", fontFamily: "inherit" }}>{Array.from({ length: Math.max(10, listing.maxGuests || 0) }, (_, index) => index + 1).slice(0, 20).map((count) => <option key={count} value={count}>{count} guest{count === 1 ? "" : "s"}</option>)}</select></div>
                <div>
                  <label htmlFor="inquiry-message" style={{ display: "block", fontSize: 11, color: "var(--ink-soft)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Message / Special Requests</label>
                  <textarea id="inquiry-message" name="message" placeholder="Any special requests or questions..." value={message} onChange={e => setMessage(e.target.value)} rows={3} style={{ width: "100%", background: "rgba(30,42,50,0.04)", border: "1px solid rgba(30,42,50,0.08)", borderRadius: 10, padding: "13px 16px", color: "var(--ink)", fontSize: 14, outline: "none", fontFamily: "inherit", resize: "vertical" }} />
                </div>
                {submitError && <p role="alert" style={{ color: "#a13c34", fontSize: 13, fontWeight: 600 }}>{submitError}</p>}
                <button type="submit" disabled={submitting} style={{ width: "100%", padding: "16px 0", background: "var(--accent)", color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: 15, textAlign: "center", border: "none", cursor: submitting ? "wait" : "pointer", opacity: submitting ? .7 : 1, fontFamily: "inherit", marginTop: 4 }}>
                  {submitting ? "Sending…" : isWaitlist ? "Join Waitlist" : "Submit Inquiry"}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>Inquiry Sent!</div>
                <div style={{ fontSize: 14, color: "rgba(30,42,50,0.5)" }}>Our team will be in touch shortly.</div>
              </div>
            )}
          </div>
        </div>

        {/* Back link */}
        <div className="wrap" style={{ padding: "60px 24px 40px" }}>
          <Link href={listingsHref} style={{ color: "var(--accent)", fontSize: 14, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(45,43,255,0.3)", paddingBottom: 2 }}>
            Browse all suites
          </Link>
        </div>

        {/* Feedback Section */}
        <section style={{ background: "var(--paper-alt)", padding: "60px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "var(--ink)", marginBottom: 12 }}>Designed For You. Shaped By You.</h2>
            <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.7, marginBottom: 20 }}>We&apos;re always improving CareStay based on feedback from the people and organizations we serve.</p>
            <a href="mailto:feedback@carestaysuites.com" style={{ color: "var(--accent)", fontSize: 14, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(45,43,255,0.3)", paddingBottom: 2 }}>Send us feedback →</a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: "var(--night)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "48px 24px 32px" }}>
        <div className="wrap">
          <div className="footer-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
            <div style={{ maxWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,var(--accent),var(--accent2))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#fff" }}>CS</div>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>CareStay Suites</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", lineHeight: 1.6 }}>Professionally managed furnished stays for professionals and organizations across the Greater Toronto Area.</p>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.82)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Quick Links</div>
              {[{ label: "Browse Suites", href: "/listings" }, { label: "Healthcare", href: "/healthcare" }, { label: "Corporate", href: "/corporate" }, { label: "How It Works", href: "/#how-it-works" }, { label: "Contact", href: "/#contact" }].map(l => (
                <a key={l.label} href={l.href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.58)", textDecoration: "none", marginBottom: 8 }}>{l.label}</a>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.82)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Contact</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginBottom: 8 }}>info@carestaysuites.com</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", marginBottom: 8 }}>35 Mariner Terrace, Toronto, ON M5V 3V9</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.58)" }}>Toronto, Ontario</p>
            </div>
          </div>
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)" }}>© 2026 CareStay Suites. All rights reserved.</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.42)" }}>Operated by BookedHosts</span>
          </div>
        </div>
      </footer>

      {/* Desktop Lightbox */}
      {lightboxOpen && (
        <div role="dialog" aria-modal="true" aria-label="Suite photo gallery" onClick={() => setLightboxOpen(false)} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
          <button ref={lightboxCloseRef} type="button" aria-label="Close photo gallery" onClick={() => setLightboxOpen(false)} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", color: "#fff", fontSize: 32, cursor: "pointer", zIndex: 201 }}>✕</button>
          {availableImages.length > 1 && (
            <>
              <button type="button" aria-label="Previous photo" onClick={e => { e.stopPropagation(); goPrev(); }} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", color: "#fff", fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 201 }}>‹</button>
              <button type="button" aria-label="Next photo" onClick={e => { e.stopPropagation(); goNext(); }} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", color: "#fff", fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 201 }}>›</button>
            </>
          )}
          <div style={{ color: "rgba(255,255,255,0.72)", textAlign: "center", fontSize: 14 }}>Photo update in progress</div>
          {currentImg && <img key={`lightbox-${currentImg}`} onClick={e => e.stopPropagation()} onError={() => markImageFailed(currentImg)} src={currentImg} alt={listing.title} style={{ position: "absolute", maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: 12 }} />}
          {availableImages.length > 1 && (
            <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.72)", fontSize: 14, fontWeight: 600 }}>{currentIdx + 1} / {availableImages.length}</div>
          )}
        </div>
      )}

      {/* Mobile Sticky Price Bar */}
      <div className="mobile-sticky-bar" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "rgba(255,253,249,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--line)", boxShadow: "0 -8px 30px rgba(30,42,50,0.12)", padding: "12px 24px", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div>{listing.price ? <><span style={{ fontSize: 11, color: "var(--ink-faint)", marginRight: 5 }}>From</span><span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 24, color: "var(--ink)" }}>${listing.price.toLocaleString()}</span></> : <span style={{ fontSize: 13, fontWeight: 700 }}>Rate on request</span>}</div>
          {reviews.length > 0 && <div style={{ fontSize: 11, color: "#a36f31", marginTop: 2 }}>★ {avgStars.toFixed(1)} · {displayTotalCount} reviews</div>}
        </div>
        <a href="#inquiry" style={{ background: "var(--accent)", color: "#fff", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none", whiteSpace: "nowrap" }}>{ctaLabel}</a>
      </div>
    </>
  );
}
