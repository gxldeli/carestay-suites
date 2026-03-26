"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Wifi, Coffee, UtensilsCrossed, Snowflake, Flame, WashingMachine, Wind, Tv, Car, Dumbbell, Waves, ArrowUpDown, Sun, GlassWater, Shirt, Laptop, Bell, ShieldCheck, Droplets, Bed, Sandwich, Microwave, ShowerHead, PawPrint, Lock, Zap, Accessibility, Check, Fan, Bath, DoorOpen, ArmchairIcon, SprayCan, Refrigerator, Baby, Sofa, Wine, Cookie, Thermometer, Glasses, Footprints, Moon, HandMetal, type LucideIcon, FireExtinguisher } from "lucide-react";
import type { ReactNode } from "react";

interface ReviewItem { id: string; name: string; stars: number; text: string; date: string; verified: boolean; stayInfo?: string }
interface ReviewData { totalCount: number; items: ReviewItem[] }
const DEFAULT_REVIEWS: ReviewItem[] = [
  { id: "d1", name: "Sarah M.", stars: 5, text: "Best housing I\u2019ve found in 4 years of travel nursing. The scrubs and foot massager were such thoughtful touches. Finally felt like someone actually thought about what we need.", date: "2026-02-15", verified: true, stayInfo: "Stayed 3 months" },
  { id: "d2", name: "Dr. James K.", stars: 5, text: "Clean, quiet, and exactly what was advertised. The video walkthrough gave me total confidence before committing. Would recommend to any colleague.", date: "2026-01-28", verified: true, stayInfo: "Stayed 6 weeks" },
  { id: "d3", name: "Maria L.", stars: 5, text: "Finally a place that understands shift work. Blackout curtains and white noise machine saved my sleep between night shifts. The soaking tub is a lifesaver.", date: "2026-03-05", verified: true, stayInfo: "Stayed 2 months" },
];

const FALLBACK_LISTINGS = [
  { id: 1, title: "The Pinnacle Suite", location: "Downtown Toronto", beds: 1, baths: 1, price: 2800, sqft: 580, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80", tag: "Near UHN", available: true, desc: "A sleek studio in the heart of downtown Toronto, steps from University Health Network. Fully furnished with blackout blinds, high-speed Wi-Fi, and everything a healthcare professional needs." },
  { id: 2, title: "Lakeview Residence", location: "Harbourfront", beds: 2, baths: 1, price: 3600, sqft: 820, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80", tag: "Near St. Michael's", available: true, desc: "Spacious two-bedroom with stunning lake views. Walking distance to St. Michael's Hospital. In-suite laundry, full kitchen, and a dedicated workspace." },
  { id: 3, title: "Midtown Medical Suite", location: "Yonge & Eglinton", beds: 1, baths: 1, price: 2600, sqft: 540, img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80", tag: "Near Sunnybrook", available: false, desc: "Cozy midtown suite near Sunnybrook Health Sciences Centre. Quick TTC access, quiet neighbourhood, and move-in ready with all essentials." },
  { id: 4, title: "King West Luxury", location: "King West Village", beds: 2, baths: 2, price: 4100, sqft: 920, img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80", tag: "Near Toronto Western", available: true, desc: "Premium two-bed, two-bath in King West. Minutes from Toronto Western Hospital. Rooftop terrace access, gym, and concierge." },
  { id: 5, title: "Scarborough Heights", location: "Scarborough", beds: 2, baths: 1, price: 2800, sqft: 780, img: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80", tag: "Near Scarborough Health", available: true, desc: "Bright and spacious two-bedroom near Scarborough Health Network. Free parking included, quiet residential area, and fully equipped kitchen." },
  { id: 6, title: "North York Terrace", location: "North York", beds: 1, baths: 1, price: 2500, sqft: 520, img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80", tag: "Near North York General", available: true, desc: "Affordable one-bedroom near North York General Hospital. Direct subway access, on-site laundry, and a peaceful terrace." },
];

const CARESTAY_STANDARD: { icon: ReactNode; name: string; desc: string }[] = [
  { icon: "🕶", name: "Blue Light Glasses", desc: "3 pairs in different strengths" },
  { icon: "👕", name: "Spare Scrubs", desc: "S, M, L — always a backup ready" },
  { icon: "🦶", name: "Foot Massager", desc: "Shiatsu relief after 12hr shifts" },
  { icon: "🌙", name: "Blackout + White Noise", desc: "Day-sleep setup for nights" },
  { icon: "💆", name: "Massage Gun", desc: "Full body recovery tool" },
];

function Nav({ scrolled }: { scrolled: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: scrolled ? "rgba(10,12,15,0.95)" : "rgba(10,12,15,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", transition: "all 0.4s" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: 72 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg,#0fa,#0af)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#0a0c0f" }}>CS</div>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 20, color: "#fff" }}>CareStay <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>Suites</span></span>
        </Link>
        <div className="nav-links">
          {[{ l: "Listings", h: "/listings" }, { l: "Healthcare", h: "/healthcare" }, { l: "Corporate", h: "/corporate" }, { l: "About", h: "/about" }, { l: "Contact", h: "/#contact" }].map(i => <a key={i.l} href={i.h} className="nav-link">{i.l}</a>)}
          <a href="#inquiry" className="nav-cta">Inquire Now</a>
        </div>
        <button className="nav-mobile" onClick={() => setOpen(!open)} style={{ background: "none", border: "none", fontSize: 28, color: "#fff", cursor: "pointer" }}>{open ? "\u2715" : "\u2630"}</button>
      </div>
      {open && (
        <div style={{ background: "rgba(10,12,15,0.98)", padding: "16px 24px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {[{ l: "Listings", h: "/listings" }, { l: "Healthcare", h: "/healthcare" }, { l: "Corporate", h: "/corporate" }, { l: "About", h: "/about" }, { l: "Contact", h: "#inquiry" }].map(i => <a key={i.l} href={i.h} onClick={() => setOpen(false)} style={{ display: "block", color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 17, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{i.l}</a>)}
          <a href="#inquiry" onClick={() => setOpen(false)} style={{ display: "block", background: "linear-gradient(135deg,#0fa,#0af)", color: "#0a0c0f", textAlign: "center", padding: 16, borderRadius: 10, fontWeight: 700, fontSize: 16, marginTop: 16, textDecoration: "none" }}>Inquire Now</a>
        </div>
      )}
    </nav>
  );
}

interface ListingData { id: number | string; title: string; location: string; beds: number; baths: number; price: number; sqft: number; img: string; tag: string; available: boolean; desc: string; description?: string; images?: string[]; nearbyHospital?: string; featured?: boolean; videoUrl?: string; amenities?: string[]; latitude?: number; longitude?: number; maxGuests?: number; bedrooms?: number; address?: string }

export default function ListingPage() {
  const params = useParams();
  const rawId = params.id as string;
  const numericId = Number(rawId);
  const fallback = FALLBACK_LISTINGS.find((l) => l.id === numericId);
  const [listing, setListing] = useState<ListingData | null>(fallback || null);
  const [loading, setLoading] = useState(!fallback);
  const [scrolled, setScrolled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [moveOut, setMoveOut] = useState("");
  const [message, setMessage] = useState("");
  const inquiryRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const touchStartX = useRef(0);
  const [reviews, setReviews] = useState<ReviewItem[]>(DEFAULT_REVIEWS);
  const [reviewTotalCount, setReviewTotalCount] = useState(0);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxOpen(false); if (e.key === "ArrowRight") goNext(); if (e.key === "ArrowLeft") goPrev(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  const images = listing?.images?.length ? listing.images.slice(0, 30) : listing ? [listing.img] : [];
  const currentImg = selectedImg || listing?.img || "";
  const currentIdx = images.indexOf(currentImg);
  const goNext = () => { if (images.length > 1) setSelectedImg(images[(currentIdx + 1) % images.length]); };
  const goPrev = () => { if (images.length > 1) setSelectedImg(images[(currentIdx - 1 + images.length) % images.length]); };
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) { dx < 0 ? goNext() : goPrev(); }
  };
  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 20); };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    fetch(`/api/listings`)
      .then(r => r.json())
      .then(data => {
        if (data.status === "success" && data.listings) {
          const match = data.listings.find((l: { id: number | string }) => String(l.id) === rawId);
          if (match) {
            setListing({
              id: match.id, title: match.title, location: match.location, beds: match.beds, baths: match.baths,
              price: match.price, sqft: match.sqft, img: match.images?.[0] || match.img, tag: match.location || "GTA",
              available: true, desc: match.description || "", description: match.description, images: match.images,
              nearbyHospital: match.nearbyHospital || "", featured: match.featured || false, videoUrl: match.videoUrl || "", amenities: match.amenities || [],
              address: match.address || "", latitude: match.latitude ?? undefined, longitude: match.longitude ?? undefined,
              maxGuests: match.maxGuests || undefined, bedrooms: match.bedrooms || undefined,
            });
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [rawId]);
  useEffect(() => {
    if (!listing) return;
    document.title = `${listing.title} | CareStay Suites - Furnished Housing GTA`;
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = `${listing.title} - ${listing.beds} bed/${listing.baths} bath furnished apartment in ${listing.location}. Month-to-month. All-in pricing. Near ${listing.nearbyHospital || "major hospitals"}.`;
  }, [listing]);
  useEffect(() => {
    if (!listing) return;
    fetch("/api/admin").then(r => r.json()).then(data => {
      if (data.status === "success" && data.data?.reviews) {
        const rd = data.data.reviews[String(listing.id)] as ReviewData | undefined;
        if (rd && rd.items.length > 0) {
          setReviews(rd.items);
          setReviewTotalCount(rd.totalCount || rd.items.length);
        } else {
          setReviewTotalCount(DEFAULT_REVIEWS.length);
        }
      }
    }).catch(() => {});
  }, [listing]);
  const avgStars = reviews.length > 0 ? reviews.reduce((a, r) => a + r.stars, 0) / reviews.length : 4.9;
  const ratingLabel = avgStars >= 4.5 ? "Exceptional" : avgStars >= 4.0 ? "Excellent" : avgStars >= 3.5 ? "Very Good" : "Good";
  const displayTotalCount = reviewTotalCount || reviews.length;
  const isComingSoon = listing ? !listing.available : false;
  const handleSubmit = async () => {
    const tags = isComingSoon ? ["carestay-waitlist", "listing-waitlist"] : [];
    await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, phone, moveIn, moveOut, message, listing: listing?.title, tags }) });
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>Loading...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700 }}>Listing not found</h1>
        <Link href="/#listings" style={{ color: "#0fa", textDecoration: "none", fontWeight: 600 }}>Back to all suites</Link>
      </div>
    );
  }

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'DM Sans',system-ui,sans-serif;color:#fff;background:#0a0c0f;-webkit-font-smoothing:antialiased}
        .wrap{max-width:1200px;margin:0 auto;width:100%;padding:0 24px}
        .nav-links{display:flex;align-items:center;gap:28px}
        .nav-mobile{display:none}
        .nav-link{color:rgba(255,255,255,0.7);text-decoration:none;font-size:14px;font-weight:500}
        .nav-link:hover{color:#fff}
        .nav-cta{background:linear-gradient(135deg,#0fa,#0af);color:#0a0c0f;padding:10px 22px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none}
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
        .gallery-thumbs::-webkit-scrollbar-track{background:#12151a;border-radius:3px}
        .gallery-thumbs::-webkit-scrollbar-thumb{background:#333;border-radius:3px}
        .gallery-thumbs{scrollbar-width:thin;scrollbar-color:#333 #12151a}
      `}</style>

      <Nav scrolled={scrolled} />

      <main style={{ paddingTop: 72 }}>
        {/* Gallery */}
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px 0" }}>
          <div
            style={{ borderRadius: 16, overflow: "hidden", maxHeight: 500, position: "relative", cursor: "pointer" }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => setLightboxOpen(true)}
          >
            <img
              src={currentImg}
              alt={listing.title}
              style={{ width: "100%", height: "100%", maxHeight: 500, objectFit: "cover", display: "block" }}
            />
            {/* Gallery Badges */}
            <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 8, zIndex: 2 }}>
              {listing.featured && (
                <span onClick={e => e.stopPropagation()} style={{ background: "#d4a844", color: "#1a1200", padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, letterSpacing: "0.02em", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>★ Guest Favourite</span>
              )}
              {avgStars >= 4.8 && (
                <span onClick={e => e.stopPropagation()} style={{ background: "rgba(255,255,255,0.9)", color: "#1a1a1a", padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, letterSpacing: "0.02em", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>◆ Highest Rated</span>
              )}
            </div>
            {images.length > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); goPrev(); }} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>‹</button>
                <button onClick={e => { e.stopPropagation(); goNext(); }} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>›</button>
                <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.6)", color: "#fff", padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600 }}>{currentIdx + 1} / {images.length}</div>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {listing.images && listing.images.length > 1 && (
            <div className="gallery-thumbs" style={{ display: "flex", gap: 8, overflowX: "auto", paddingTop: 12, paddingBottom: 4 }}>
              {listing.images.slice(0, 30).map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(imgUrl)}
                  style={{ flexShrink: 0, width: 72, height: 48, borderRadius: 8, overflow: "hidden", border: (selectedImg || listing.img) === imgUrl ? "2px solid #0fa" : "2px solid rgba(255,255,255,0.1)", cursor: "pointer", padding: 0, background: "none" }}
                >
                  <img src={imgUrl} alt={`${listing.title} ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
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
                <span style={{ background: "rgba(0,170,255,0.1)", color: "#0af", padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>{listing.tag}</span>
                <span style={{ background: listing.available ? "rgba(0,255,170,0.15)" : "rgba(255,77,77,0.15)", color: listing.available ? "#0fa" : "#f66", padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>
                  {listing.available ? "Available" : "Waitlist"}
                </span>
                {listing.featured && (
                  <span style={{ background: "rgba(240,192,64,0.15)", color: "#f0c040", padding: "5px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700 }}>★ Featured</span>
                )}
              </div>

              {/* Title */}
              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 700, lineHeight: 1.1, marginBottom: 6 }}>{listing.title}</h1>

              {/* Mini Review Link */}
              <a href="#reviews" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#f0c040", fontSize: 13, fontWeight: 600, textDecoration: "none", marginBottom: 8 }}>
                <span style={{ display: "inline-flex", gap: 1 }}>
                  {[1,2,3,4,5].map(i => {
                    const fill = Math.min(1, Math.max(0, avgStars - (i - 1)));
                    return (
                      <span key={i} style={{ position: "relative", display: "inline-block", width: 14, height: 14, fontSize: 14, lineHeight: 1 }}>
                        <span style={{ color: "rgba(255,255,255,0.15)" }}>★</span>
                        <span style={{ position: "absolute", left: 0, top: 0, width: `${fill * 100}%`, overflow: "hidden", color: "#f0c040" }}>★</span>
                      </span>
                    );
                  })}
                </span>
                <span>{avgStars.toFixed(1)} · {displayTotalCount} reviews</span>
              </a>

              {/* Specs */}
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", marginBottom: 24, lineHeight: 1.6 }}>
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
                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: 16, overflow: "hidden", background: "#12151a", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <iframe src={`https://www.youtube.com/embed/${vid}`} title="Video Walkthrough" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} />
                    </div>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 12, lineHeight: 1.6 }}>Every CareStay suite includes a video walkthrough so you know exactly what you&apos;re getting. No surprises.</p>
                  </div>
                ) : null;
              })()}

              {/* Description */}
              <div style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.7)", marginBottom: 48 }}>
                {(() => {
                  const fullText = listing.desc || listing.description || "";
                  const lines = fullText.split("\n");
                  const truncated = !showFullDesc && fullText.length > 400;
                  const displayLines = truncated ? fullText.substring(0, 400).split("\n") : lines;
                  return (
                    <>
                      <div style={{ position: "relative" }}>
                        {displayLines.map((line, i) => <p key={i} style={{ marginBottom: line.trim() ? 12 : 0 }}>{line}{truncated && i === displayLines.length - 1 ? "..." : ""}</p>)}
                        {truncated && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 48, background: "linear-gradient(transparent, #0a0c10)" }} />}
                      </div>
                      {fullText.length > 400 && (
                        <button onClick={() => setShowFullDesc(!showFullDesc)} style={{ background: "none", border: "none", color: "#0fa", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px 0 0", fontFamily: "inherit" }}>
                          {showFullDesc ? "Show Less" : "See More"}
                        </button>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Hospital Badge */}
              {listing.nearbyHospital && (
                <div style={{ marginBottom: 48, padding: "16px 20px", background: "rgba(0,170,255,0.06)", border: "1px solid rgba(0,170,255,0.15)", borderRadius: 12, display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 22 }}>🏥</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0af" }}>Near {listing.nearbyHospital}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Convenient commute for healthcare professionals</div>
                  </div>
                </div>
              )}

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
                    const DEFAULT_AMENITIES = ["WiFi", "Kitchen", "Air Conditioning", "Heating", "Washer", "Dryer", "TV", "Hair Dryer", "Iron", "Coffee Maker", "Workspace", "Free Parking"];
                    const rawAmenities = listing.amenities && listing.amenities.length > 0 ? listing.amenities : DEFAULT_AMENITIES;

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

                    const visible = showAllAmenities ? sorted : sorted.slice(0, 9);
                    return (
                      <>
                        <div className="amenity-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                          {visible.map((a: string, i: number) => {
                            const IconComp = getIcon(a);
                            return (
                              <div key={`${a}-${i}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10 }}>
                                <IconComp size={18} strokeWidth={1.5} style={{ color: "rgba(255,255,255,0.6)", flexShrink: 0 }} />
                                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 500 }}>{a}</span>
                              </div>
                            );
                          })}
                        </div>
                        {sorted.length > 9 && (
                          <button onClick={() => setShowAllAmenities(!showAllAmenities)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 24px", color: "#0fa", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "inherit", marginTop: 12 }}>
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
                    <div key={item.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "16px 18px", display: "flex", gap: 14, alignItems: "center" }}>
                      <span style={{ fontSize: 24 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Where You'll Be — Map */}
              {(() => {
                const hasCoords = listing.latitude != null && listing.longitude != null && (listing.latitude !== 0 || listing.longitude !== 0);
                const mapQuery = hasCoords
                  ? `${listing.latitude},${listing.longitude}`
                  : encodeURIComponent(listing.location + ", Ontario, Canada");
                return (
                <div style={{ marginBottom: 48 }}>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, marginBottom: 20 }}>Where You&apos;ll Be</h2>
                  <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <iframe
                      className="map-iframe"
                      src={`https://maps.google.com/maps?q=${mapQuery}&z=13&output=embed`}
                      style={{ width: "100%", height: 400, border: "none", display: "block", filter: "invert(0.9) hue-rotate(180deg) brightness(1.1) contrast(1.1)" }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Map location"
                    />
                  </div>
                  <div style={{ marginTop: 12, fontSize: 15, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>
                    📍 {listing.location}
                  </div>
                </div>
                );
              })()}

              {/* Guest Reviews */}
              <div id="reviews" style={{ marginBottom: 48 }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Guest Reviews</h2>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 24 }}>
                  <span style={{ color: "#f0c040", fontSize: 18 }}>{"★".repeat(Math.round(avgStars))}{"☆".repeat(5 - Math.round(avgStars))}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#f0c040" }}>{avgStars.toFixed(1)}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{ratingLabel} · {displayTotalCount} reviews</span>
                </div>
                {(showAllReviews ? reviews : reviews.slice(0, 3)).map(r => (
                  <div key={r.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 22px", marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{r.name}</span>
                          {r.verified && <span style={{ color: "#0af", fontSize: 13 }} title="Verified Guest">✓ <span style={{ fontSize: 11, fontWeight: 500 }}>Verified</span></span>}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                          {r.date && <span>{r.date}</span>}
                          {r.stayInfo && <span>· {r.stayInfo}</span>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                        {[1,2,3,4,5].map(i => (
                          <span key={i} style={{ fontSize: 18, color: i <= r.stars ? "#f0c040" : "rgba(255,255,255,0.15)" }}>★</span>
                        ))}
                      </div>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.6)" }}>{r.text}</p>
                  </div>
                ))}
                {reviews.length > 3 && !showAllReviews && (
                  <button onClick={() => setShowAllReviews(true)} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 24px", color: "#0fa", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "inherit", marginTop: 4 }}>
                    See More Reviews
                  </button>
                )}
              </div>
            </div>

            {/* Right — Booking Card */}
            <div className="detail-sidebar" style={{ position: "sticky", top: 88 }}>
              <div style={{ background: "#12151a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 28 }}>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 36, color: "#fff" }}>${listing.price.toLocaleString()}</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", marginLeft: 6 }}>/mo</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
                  <span style={{ color: "#f0c040", fontSize: 14 }}>{"★".repeat(Math.round(avgStars))}</span>
                  <span style={{ fontSize: 13, color: "#f0c040" }}>{avgStars.toFixed(1)} · {displayTotalCount} reviews</span>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Preferred Move-in</div>
                  <input type="text" placeholder="e.g., April 15" value={moveIn} onChange={e => setMoveIn(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                </div>

                <a href="#inquiry" style={{ display: "block", width: "100%", padding: "16px 0", background: "linear-gradient(135deg,#0fa,#0af)", color: "#0a0c0f", borderRadius: 10, fontWeight: 700, fontSize: 15, textAlign: "center", textDecoration: "none", fontFamily: "inherit" }}>
                  {isComingSoon ? "Join Waitlist" : "Inquire Now"}
                </a>

                <div style={{ marginTop: 20, padding: "14px 16px", background: "rgba(0,255,170,0.05)", borderRadius: 10, border: "1px solid rgba(0,255,170,0.1)" }}>
                  <div style={{ fontSize: 13, color: "#0fa", fontWeight: 600, marginBottom: 4 }}>Healthcare Rate</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>Special pricing available for nurses, doctors, and medical staff with valid credentials.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry Form */}
        <div id="inquiry" ref={inquiryRef} className="wrap" style={{ paddingTop: 60, paddingBottom: 20 }}>
          <div style={{ maxWidth: 680, margin: "0 auto", background: "#12151a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "36px 32px" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 6, textAlign: "center" }}>{isComingSoon ? "Join the Waitlist for This Suite" : "Inquire About This Suite"}</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 28 }}>{isComingSoon ? "Be first to know when this suite becomes available." : "Fill out the form below and we\u0027ll get back to you within 24 hours."}</p>

            {!submitted ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div className="inquiry-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Full Name</div>
                    <input type="text" placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</div>
                    <input type="email" placeholder="jane@hospital.ca" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Phone</div>
                  <input type="tel" placeholder="(647) 000-0000" value={phone} onChange={e => setPhone(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                </div>
                <div className="inquiry-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Move-in Date</div>
                    <input type="date" value={moveIn} onChange={e => setMoveIn(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit", colorScheme: "dark" }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Move-out Date</div>
                    <input type="date" value={moveOut} onChange={e => setMoveOut(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit", colorScheme: "dark" }} />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Message / Special Requests</div>
                  <textarea placeholder="Any special requests or questions..." value={message} onChange={e => setMessage(e.target.value)} rows={3} style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "13px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit", resize: "vertical" }} />
                </div>
                <button onClick={handleSubmit} style={{ width: "100%", padding: "16px 0", background: "linear-gradient(135deg,#0fa,#0af)", color: "#0a0c0f", borderRadius: 10, fontWeight: 700, fontSize: 15, textAlign: "center", border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}>
                  Submit Inquiry
                </button>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Inquiry Sent!</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>We&apos;ll be in touch within 24 hours.</div>
              </div>
            )}
          </div>
        </div>

        {/* Back link */}
        <div className="wrap" style={{ padding: "60px 24px 40px" }}>
          <Link href="/#listings" style={{ color: "#0fa", fontSize: 14, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(0,255,170,0.3)", paddingBottom: 2 }}>
            Browse all suites
          </Link>
        </div>

        {/* Feedback Section */}
        <section style={{ background: "#0d1117", padding: "60px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 12 }}>Designed For You. Shaped By You.</h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 20 }}>We&apos;re always improving CareStay based on feedback from healthcare professionals like you.</p>
            <a href="mailto:feedback@carestaysuites.com" style={{ color: "#0fa", fontSize: 14, fontWeight: 600, textDecoration: "none", borderBottom: "1px solid rgba(0,255,170,0.3)", paddingBottom: 2 }}>Send us feedback →</a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ background: "#0a0c0f", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "48px 24px 32px" }}>
        <div className="wrap">
          <div className="footer-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
            <div style={{ maxWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#0fa,#0af)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#0a0c0f" }}>CS</div>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>CareStay Suites</span>
              </div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", lineHeight: 1.6 }}>Premium furnished housing for healthcare professionals, primarily across the Greater Toronto Area.</p>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Quick Links</div>
              {[{ label: "Browse Suites", href: "/#listings" }, { label: "Healthcare", href: "/healthcare" }, { label: "How It Works", href: "/#about" }, { label: "Contact", href: "/#contact" }].map(l => (
                <a key={l.label} href={l.href} style={{ display: "block", fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none", marginBottom: 8 }}>{l.label}</a>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Contact</div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>info@carestaysuites.com</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>35 Mariner Terrace, Toronto, ON M5V 3V9</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Toronto, Ontario</p>
            </div>
          </div>
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>© 2026 CareStay Suites. All rights reserved.</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>Operated by BookedHosts</span>
          </div>
        </div>
      </footer>

      {/* Desktop Lightbox */}
      {lightboxOpen && (
        <div onClick={() => setLightboxOpen(false)} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
          <button onClick={() => setLightboxOpen(false)} style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", color: "#fff", fontSize: 32, cursor: "pointer", zIndex: 201 }}>✕</button>
          {images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); goPrev(); }} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 201 }}>‹</button>
              <button onClick={e => { e.stopPropagation(); goNext(); }} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 201 }}>›</button>
            </>
          )}
          <img onClick={e => e.stopPropagation()} src={currentImg} alt={listing.title} style={{ maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain", borderRadius: 12 }} />
          {images.length > 1 && (
            <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 600 }}>{currentIdx + 1} / {images.length}</div>
          )}
        </div>
      )}

      {/* Mobile Sticky Price Bar */}
      <div className="mobile-sticky-bar" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "rgba(10,12,15,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "12px 24px", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: 24, color: "#fff" }}>${listing.price.toLocaleString()}</span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginLeft: 4 }}>/mo</span>
          </div>
          <div style={{ fontSize: 11, color: "#f0c040", marginTop: 2 }}>★ {avgStars.toFixed(1)} · {displayTotalCount} reviews</div>
        </div>
        <a href="#inquiry" style={{ background: "linear-gradient(135deg,#0fa,#0af)", color: "#0a0c0f", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none", whiteSpace: "nowrap" }}>{isComingSoon ? "Join Waitlist" : "Inquire Now"}</a>
      </div>
    </>
  );
}
