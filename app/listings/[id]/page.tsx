"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const LISTINGS: Record<string, {
  title: string; location: string; neighborhood: string;
  beds: number; baths: number; price: number; sqft: number;
  images: string[]; nearbyHospital: string; hospitalDistance: string;
  available: boolean; description: string; tag: string;
  amenities: string[];
}> = {
  "1": { title: "The Pinnacle Suite", location: "Downtown Toronto", neighborhood: "Discovery District", beds: 1, baths: 1, price: 2800, sqft: 580, tag: "Near UHN", images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80","https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80"], nearbyHospital: "Toronto General Hospital", hospitalDistance: "8 min drive", available: true, description: "Modern 1-bedroom in the heart of downtown, steps from the PATH system. Floor-to-ceiling windows with city views. Perfect for medical professionals at UHN.", amenities: ["WiFi","Parking","In-Unit Laundry","Gym","Concierge","Smart Lock","Full Kitchen","Smart TV"] },
  "2": { title: "Lakeview Residence", location: "Harbourfront", neighborhood: "CityPlace", beds: 2, baths: 1, price: 3600, sqft: 820, tag: "Near St. Michael's", images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80","https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80"], nearbyHospital: "St. Michael's Hospital", hospitalDistance: "12 min drive", available: true, description: "Spacious 2-bedroom with stunning lake views. Open concept living with premium finishes. Easy TTC access to all downtown hospitals.", amenities: ["WiFi","Parking","In-Unit Laundry","Pool","Lake View","Smart Lock","Full Kitchen","Smart TV","Soaking Tub"] },
  "3": { title: "Midtown Medical Suite", location: "Yonge & Eglinton", neighborhood: "Midtown", beds: 1, baths: 1, price: 2600, sqft: 540, tag: "Near Sunnybrook", images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80","https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80"], nearbyHospital: "Sunnybrook Hospital", hospitalDistance: "15 min drive", available: false, description: "Bright 1-bedroom in the midtown core. Walking distance to Yonge-Eglinton Centre. Quick commute to Sunnybrook via Bayview.", amenities: ["WiFi","Parking","In-Unit Laundry","Rooftop","Gym","Smart Lock","Full Kitchen"] },
  "4": { title: "King West Luxury", location: "King West Village", neighborhood: "King West", beds: 2, baths: 2, price: 4100, sqft: 920, tag: "Near Toronto Western", images: ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80","https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80"], nearbyHospital: "Toronto Western Hospital", hospitalDistance: "10 min drive", available: true, description: "Premium 2-bed/2-bath in one of Toronto's most desirable neighborhoods. High-end finishes throughout. Minutes from UHN's Toronto Western campus.", amenities: ["WiFi","Parking","In-Unit Laundry","Gym","Rooftop","Concierge","Smart Lock","Full Kitchen","Smart TV","Soaking Tub"] },
  "5": { title: "Scarborough Heights", location: "Scarborough", neighborhood: "Scarborough Town Centre", beds: 2, baths: 1, price: 2800, sqft: 780, tag: "Near Scarborough Health", images: ["https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&q=80","https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80"], nearbyHospital: "Scarborough Health Network", hospitalDistance: "7 min drive", available: true, description: "Affordable 2-bedroom close to Scarborough Health Network. Quiet residential area with easy highway access. Great value for longer stays.", amenities: ["WiFi","Parking","In-Unit Laundry","Balcony","Full Kitchen","Soaking Tub"] },
  "6": { title: "North York Terrace", location: "North York", neighborhood: "Yonge & Sheppard", beds: 1, baths: 1, price: 2500, sqft: 520, tag: "Near North York General", images: ["https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80","https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&q=80"], nearbyHospital: "North York General Hospital", hospitalDistance: "10 min drive", available: true, description: "Modern 1-bedroom steps from Sheppard-Yonge subway. Quick access to North York General. Building has gym, party room, and rooftop terrace.", amenities: ["WiFi","Parking","In-Unit Laundry","Gym","Subway Access","Smart Lock","Full Kitchen"] },
};

const STANDARD = [
  { icon: "🕶", name: "Blue Light Glasses", desc: "3 pairs in different strengths" },
  { icon: "👕", name: "Spare Scrubs (S/M/L)", desc: "Always a backup ready" },
  { icon: "🦶", name: "Foot Massager", desc: "Shiatsu relief after 12hr shifts" },
  { icon: "🌙", name: "Blackout + White Noise", desc: "Day-sleep setup for nights" },
  { icon: "💆", name: "Massage Gun", desc: "Full body recovery tool" },
];

function Styles() {
  return <style>{`
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'DM Sans',system-ui,sans-serif;color:#fff;background:#0a0c0f}
    /* Nav */
    .n{position:fixed;top:0;left:0;right:0;z-index:100;transition:all .4s}
    .n-in{max-width:1200px;margin:0 auto;padding:0 24px;display:flex;justify-content:space-between;align-items:center;height:72px}
    .n-logo{display:flex;align-items:center;gap:10px;text-decoration:none}
    .n-mark{width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,#0fa,#0af);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;color:#0a0c0f}
    .n-name{font-family:'Cormorant Garamond',serif;font-weight:700;font-size:20px;color:#fff}
    .n-name span{font-weight:400;color:rgba(255,255,255,.6)}
    .n-links{display:flex;align-items:center;gap:28px}
    .n-link{color:rgba(255,255,255,.7);text-decoration:none;font-size:14px;font-weight:500}
    .n-cta{background:linear-gradient(135deg,#0fa,#0af);color:#0a0c0f;padding:10px 22px;border-radius:8px;font-weight:700;font-size:13px;text-decoration:none}
    .n-mob{display:none;background:none;border:none;font-size:28px;color:#fff;cursor:pointer}
    .n-dd{background:rgba(10,12,15,.98);padding:16px 24px 24px;border-top:1px solid rgba(255,255,255,.06)}
    .n-dd a{display:block;color:rgba(255,255,255,.8);text-decoration:none;font-size:17px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.06)}
    .n-dd-cta{display:block;background:linear-gradient(135deg,#0fa,#0af);color:#0a0c0f;text-align:center;padding:16px;border-radius:10px;font-weight:700;font-size:16px;margin-top:16px;text-decoration:none}
    /* Gallery */
    .gal{display:grid;grid-template-columns:2fr 1fr;gap:8px;border-radius:16px;overflow:hidden;margin-bottom:32px}
    .gal-main{width:100%;height:400px;object-fit:cover;display:block}
    .gal-side{display:flex;flex-direction:column;gap:8px}
    .gal-side img{width:100%;height:196px;object-fit:cover;display:block}
    /* Layout */
    .wrap{max-width:1000px;margin:0 auto;padding:100px 24px 40px}
    .grid{display:grid;grid-template-columns:1.4fr 1fr;gap:40px;align-items:start}
    /* Left */
    .badges{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
    .badge{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700}
    .badge-tag{background:rgba(0,255,170,.12);color:#0fa}
    .badge-avail{background:rgba(0,255,170,.12);color:#0fa}
    .badge-wait{background:rgba(255,77,77,.12);color:#f66}
    .badge-tub{background:rgba(0,255,170,.06);border:1px solid rgba(0,255,170,.12);color:#0fa;display:inline-flex;align-items:center;gap:6px}
    h1{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:700;margin-bottom:8px}
    .loc{font-size:15px;color:rgba(255,255,255,.5);margin-bottom:20px}
    .specs{display:flex;gap:16px;margin-bottom:24px;flex-wrap:wrap}
    .spec{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px 18px;text-align:center}
    .spec-n{font-size:18px;font-weight:700}
    .spec-l{font-size:11px;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.04em;margin-top:2px}
    .desc{font-size:15px;color:rgba(255,255,255,.6);line-height:1.7;margin-bottom:28px}
    .hosp{background:rgba(0,170,255,.08);border:1px solid rgba(0,170,255,.15);border-radius:12px;padding:16px 20px;display:flex;align-items:center;gap:14px;margin-bottom:20px}
    .hosp-icon{width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#0fa,#0af);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
    .hosp-name{font-size:15px;font-weight:700}
    .hosp-dist{font-size:13px;color:rgba(255,255,255,.5)}
    .stitle{font-size:14px;font-weight:700;color:#0fa;text-transform:uppercase;letter-spacing:.08em;margin:28px 0 14px}
    .std-row{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:8px}
    .std-chip{background:rgba(0,255,170,.06);border:1px solid rgba(0,255,170,.15);border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:8px;font-size:13px;color:#0fa;font-weight:600}
    .am-row{display:flex;flex-wrap:wrap;gap:8px}
    .am-tag{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:8px;padding:8px 14px;font-size:13px;color:rgba(255,255,255,.7)}
    /* Sidebar */
    .side{position:sticky;top:100px}
    .side-card{background:#12151a;border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:28px 24px}
    .side-price{font-family:'Cormorant Garamond',serif;font-size:40px;font-weight:700}
    .side-mo{font-size:16px;color:rgba(255,255,255,.4);margin-left:4px}
    .side-note{font-size:12px;color:rgba(255,255,255,.35);margin:4px 0 20px}
    .si{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:13px 16px;color:#fff;font-size:14px;outline:none;font-family:inherit;margin-bottom:10px}
    .si:focus{border-color:rgba(0,255,170,.4)}
    .sl{display:block;font-size:11px;font-weight:600;color:rgba(255,255,255,.45);margin-bottom:5px;text-transform:uppercase;letter-spacing:.04em}
    .sbtn{width:100%;background:linear-gradient(135deg,#0fa,#0af);color:#0a0c0f;padding:15px;border-radius:10px;font-weight:800;font-size:15px;border:none;cursor:pointer;font-family:inherit;margin-top:6px}
    .sfine{font-size:11px;color:rgba(255,255,255,.25);text-align:center;margin-top:10px}
    /* Feedback */
    .fb{margin-top:60px;background:rgba(0,255,170,.03);border:1px solid rgba(0,255,170,.1);border-radius:16px;padding:36px 28px;text-align:center}
    .fb h3{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:700;margin:12px 0 10px}
    .fb p{font-size:15px;color:rgba(255,255,255,.5);line-height:1.7;max-width:520px;margin:0 auto 20px}
    .fb a{display:inline-block;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:#fff;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none}
    /* Footer */
    .ft{background:#0a0c0f;border-top:1px solid rgba(255,255,255,.05);padding:48px 24px 32px;margin-top:60px}
    .ft-in{max-width:1000px;margin:0 auto;display:flex;justify-content:space-between;flex-wrap:wrap;gap:40px}
    .ft-links{display:flex;gap:48px;flex-wrap:wrap}
    .ft-col-title{font-size:11px;font-weight:700;color:rgba(255,255,255,.5);margin-bottom:12px;letter-spacing:.06em;text-transform:uppercase}
    .ft-link{display:block;font-size:13px;color:rgba(255,255,255,.35);text-decoration:none;margin-bottom:8px}
    .ft-bot{max-width:1000px;margin:32px auto 0;padding-top:24px;border-top:1px solid rgba(255,255,255,.05);display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px}
    .ft-bot span{font-size:12px;color:rgba(255,255,255,.2)}
    @media(max-width:768px){
      .n-links{display:none!important}
      .n-mob{display:block!important}
      .gal{grid-template-columns:1fr}
      .gal-main{height:260px}
      .gal-side{flex-direction:row}
      .gal-side img{height:130px;width:50%}
      .grid{grid-template-columns:1fr}
      .side{position:static;margin-top:32px}
      h1{font-size:28px}
      .ft-in{flex-direction:column}
      .ft-links{flex-direction:column;gap:28px}
    }
  `}</style>;
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  return (
    <nav className="n" style={{ background: scrolled ? "rgba(10,12,15,.95)" : "rgba(10,12,15,.8)", backdropFilter: "blur(20px)", borderBottom: scrolled ? "1px solid rgba(255,255,255,.06)" : "none" }}>
      <div className="n-in">
        <Link href="/" className="n-logo"><div className="n-mark">CS</div><span className="n-name">CareStay <span>Suites</span></span></Link>
        <div className="n-links">
          {["Listings","Healthcare","About","Contact"].map(i=><a key={i} href={`/#${i.toLowerCase()}`} className="n-link">{i}</a>)}
          <a href="/#contact" className="n-cta">Inquire Now</a>
        </div>
        <button className="n-mob" onClick={()=>setOpen(!open)}>{open?"✕":"☰"}</button>
      </div>
      {open&&<div className="n-dd">
        {["Listings","Healthcare","About","Contact"].map(i=><a key={i} href={`/#${i.toLowerCase()}`} onClick={()=>setOpen(false)}>{i}</a>)}
        <a href="/#contact" onClick={()=>setOpen(false)} className="n-dd-cta">Inquire Now</a>
      </div>}
    </nav>
  );
}

export default function ListingDetail() {
  const params = useParams();
  const id = params?.id as string;
  const listing = LISTINGS[id];
  const [submitted, setSubmitted] = useState(false);

  if (!listing) return (
    <><Styles /><Nav /><div className="wrap" style={{textAlign:"center",paddingTop:200}}>
      <h1>Suite Not Found</h1>
      <p style={{color:"rgba(255,255,255,.5)",marginBottom:24}}>This listing may no longer be available.</p>
      <Link href="/" style={{color:"#0fa",textDecoration:"none",fontWeight:600}}>← Back to all suites</Link>
    </div></>
  );

  const hasTub = listing.amenities.includes("Soaking Tub");

  return (
    <>
      <Styles />
      <Nav />
      <div className="wrap">
        <Link href="/" style={{color:"rgba(255,255,255,.5)",textDecoration:"none",fontSize:14,display:"inline-flex",alignItems:"center",gap:6,marginBottom:24}}>← Back to all suites</Link>

        {/* Gallery */}
        <div className="gal">
          <img src={listing.images[0]} alt={listing.title} className="gal-main" />
          <div className="gal-side">
            {listing.images.slice(1,3).map((img,i)=><img key={i} src={img} alt={`${listing.title} ${i+2}`} />)}
          </div>
        </div>

        {/* Content */}
        <div className="grid">
          <div>
            {/* Badges */}
            <div className="badges">
              <span className="badge badge-tag">{listing.tag}</span>
              <span className={`badge ${listing.available?"badge-avail":"badge-wait"}`}>{listing.available?"✓ Available Now":"Waitlist"}</span>
            </div>

            <h1>{listing.title}</h1>
            <p className="loc">{listing.neighborhood}, {listing.location}</p>

            <div className="specs">
              <div className="spec"><div className="spec-n">{listing.beds}</div><div className="spec-l">Bedrooms</div></div>
              <div className="spec"><div className="spec-n">{listing.baths}</div><div className="spec-l">Bathrooms</div></div>
              <div className="spec"><div className="spec-n">{listing.sqft}</div><div className="spec-l">Sq Ft</div></div>
            </div>

            <p className="desc">{listing.description}</p>

            {/* Hospital */}
            <div className="hosp">
              <div className="hosp-icon">🏥</div>
              <div><div className="hosp-name">{listing.nearbyHospital}</div><div className="hosp-dist">{listing.hospitalDistance} from this suite</div></div>
            </div>

            {/* Tub */}
            {hasTub && <div style={{marginBottom:8}}><span className="badge badge-tub">🛁 Soaking Tub Included</span></div>}

            {/* CareStay Standard */}
            <div className="stitle">The CareStay Standard — Included</div>
            <div className="std-row">
              {STANDARD.map((s,i)=><div key={i} className="std-chip">{s.icon} {s.name}</div>)}
            </div>

            {/* Amenities */}
            <div className="stitle">Amenities</div>
            <div className="am-row">
              {listing.amenities.filter(a=>a!=="Soaking Tub").map((a,i)=><span key={i} className="am-tag">{a}</span>)}
            </div>
          </div>

          {/* Sidebar */}
          <div className="side">
            <div className="side-card">
              <div><span className="side-price">${listing.price.toLocaleString()}</span><span className="side-mo">/month</span></div>
              <p className="side-note">All-in pricing. No hidden fees. Utilities included.</p>
              {!submitted ? <>
                <div><label className="sl">Full Name</label><input className="si" placeholder="Jane Smith" /></div>
                <div><label className="sl">Email</label><input className="si" type="email" placeholder="jane@hospital.ca" /></div>
                <div><label className="sl">Phone</label><input className="si" type="tel" placeholder="(647) 000-0000" /></div>
                <div><label className="sl">Move-in Date</label><input className="si" placeholder="e.g., April 15" /></div>
                <div><label className="sl">Duration</label><input className="si" placeholder="e.g., 3 months" /></div>
                <button className="sbtn" onClick={()=>setSubmitted(true)}>Request This Suite</button>
                <p className="sfine">We respond within 24 hours. No obligation.</p>
              </> : <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:36,marginBottom:10}}>✓</div>
                <p style={{fontWeight:700,fontSize:16,marginBottom:6}}>Request Received</p>
                <p style={{fontSize:13,color:"rgba(255,255,255,.5)"}}>We&apos;ll be in touch within 24 hours.</p>
              </div>}
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="fb">
          <div style={{fontSize:32}}>💬</div>
          <h3>Designed For You. Shaped By You.</h3>
          <p>Every CareStay suite is built around what healthcare professionals actually need. If there&apos;s something that would make your stay better — we want to hear it. If it makes sense, we add it to every property.</p>
          <a href="mailto:feedback@carestaysuites.com?subject=Suite Feedback">Share Your Feedback →</a>
        </div>
      </div>

      {/* Footer */}
      <footer className="ft">
        <div className="ft-in">
          <div style={{maxWidth:280}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div className="n-mark" style={{width:32,height:32,fontSize:14}}>CS</div>
              <span style={{fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:18,color:"#fff"}}>CareStay Suites</span>
            </div>
            <p style={{fontSize:13,color:"rgba(255,255,255,.3)",lineHeight:1.6}}>Premium furnished housing for healthcare professionals across the Greater Toronto Area.</p>
          </div>
          <div className="ft-links">
            <div>
              <div className="ft-col-title">Quick Links</div>
              {[["Browse Suites","/#listings"],["Healthcare","/#healthcare"],["How It Works","/#about"],["Contact","/#contact"]].map(([l,h])=><Link key={l} href={h} className="ft-link">{l}</Link>)}
            </div>
            <div>
              <div className="ft-col-title">Contact</div>
              <p className="ft-link">info@carestaysuites.com</p>
              <p className="ft-link">(647) 499-3889</p>
              <p className="ft-link">Toronto, Ontario</p>
            </div>
          </div>
        </div>
        <div className="ft-bot">
          <span>© 2026 CareStay Suites. All rights reserved.</span>
          <span>Operated by BookedHosts</span>
        </div>
      </footer>
    </>
  );
}
