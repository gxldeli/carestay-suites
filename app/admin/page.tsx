"use client";

import { useState, useEffect, useCallback } from "react";

interface ListingOverride {
  priceOverride?: number;
  hidden?: boolean;
  soakingTub?: boolean;
  carestayStandard?: boolean;
  titleOverride?: string;
  descriptionOverride?: string;
  nearbyHospital?: string;
  hospitalDistance?: string;
  sortOrder?: number;
  featured?: boolean;
  videoUrl?: string;
}

interface ApiListing {
  id: number;
  title: string;
  location: string;
  beds: number;
  baths: number;
  price: number;
  sqft: number;
  img: string;
  description?: string;
}

interface CustomListing {
  id: string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  price: number;
  sqft: number;
  img: string;
  images: string[];
  description: string;
  nearbyHospital: string;
  hospitalDistance: string;
  soakingTub: boolean;
  carestayStandard: boolean;
  sortOrder?: number;
  featured?: boolean;
}

interface ReviewItem {
  id: string;
  name: string;
  stars: number;
  text: string;
  date: string;
  verified: boolean;
  stayInfo?: string;
}

interface ListingReviews {
  totalCount: number;
  items: ReviewItem[];
}

interface OverridesData {
  listings: Record<string, ListingOverride>;
  customListings: CustomListing[];
  reviews: Record<string, ListingReviews>;
}

const PW_KEY = "carestay_admin_pw";

/* ─── Styles ─── */
const inputStyle: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" };
const btnStyle: React.CSSProperties = { padding: "10px 20px", background: "linear-gradient(135deg,#0fa,#0af)", color: "#0a0c0f", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" };
const thStyle: React.CSSProperties = { padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid rgba(255,255,255,0.08)" };
const tdStyle: React.CSSProperties = { padding: "10px 12px", fontSize: 14, borderBottom: "1px solid rgba(255,255,255,0.05)", verticalAlign: "middle" };
const cardStyle: React.CSSProperties = { background: "#12151a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, marginBottom: 24 };

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{ width: 44, height: 24, borderRadius: 12, border: "none", background: checked ? "#0fa" : "rgba(255,255,255,0.1)", position: "relative", cursor: "pointer", transition: "background 0.2s" }}
    >
      <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 3, left: checked ? 23 : 3, transition: "left 0.2s" }} />
    </button>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [listings, setListings] = useState<ApiListing[]>([]);
  const [overrides, setOverrides] = useState<OverridesData>({ listings: {}, customListings: [], reviews: {} });
  const [reviewListingId, setReviewListingId] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [revName, setRevName] = useState("");
  const [revStars, setRevStars] = useState("5");
  const [revText, setRevText] = useState("");
  const [revDate, setRevDate] = useState(new Date().toISOString().split("T")[0]);
  const [revVerified, setRevVerified] = useState(true);
  const [revStayInfo, setRevStayInfo] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Site settings
  const [siteEmail, setSiteEmail] = useState("info@carestaysuites.com");
  const [siteHeroTagline, setSiteHeroTagline] = useState("");
  const [siteStatProps, setSiteStatProps] = useState("60+");
  const [siteStatPros, setSiteStatPros] = useState("150+");
  const [siteStatHospitals, setSiteStatHospitals] = useState("30+");
  const [siteStatRating, setSiteStatRating] = useState("4.9");
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Custom listing form
  const [newTitle, setNewTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newBeds, setNewBeds] = useState("1");
  const [newBaths, setNewBaths] = useState("1");
  const [newPrice, setNewPrice] = useState("");
  const [newSqft, setNewSqft] = useState("");
  const [newImg, setNewImg] = useState("");
  const [newHospital, setNewHospital] = useState("");
  const [newDistance, setNewDistance] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTub, setNewTub] = useState(false);
  const [newStandard, setNewStandard] = useState(false);
  const [newFeatured, setNewFeatured] = useState(false);

  const storedPw = typeof window !== "undefined" ? sessionStorage.getItem(PW_KEY) : null;

  useEffect(() => {
    if (storedPw === "carestay2026") setAuthed(true);
  }, [storedPw]);

  const loadData = useCallback(async () => {
    const [listRes, adminRes, settingsRes] = await Promise.all([
      fetch("/api/listings?includeHidden=true"),
      fetch("/api/admin"),
      fetch("/api/settings"),
    ]);
    const listData = await listRes.json();
    const adminData = await adminRes.json();
    const settingsData = await settingsRes.json();
    console.log("[Admin] Loaded listings:", listData.count, "overrides:", Object.keys(adminData.data?.listings || {}).length);
    if (listData.status === "success") setListings(listData.listings || []);
    if (adminData.status === "success") setOverrides(adminData.data);
    if (settingsData.status === "success" && settingsData.settings) {
      const s = settingsData.settings;
      setSiteEmail(s.contactEmail || "info@carestaysuites.com");
      setSiteHeroTagline(s.heroTagline || "");
      setSiteStatProps(s.statProperties || "60+");
      setSiteStatPros(s.statHealthcarePros || "150+");
      setSiteStatHospitals(s.statHospitalPartnerships || "30+");
      setSiteStatRating(s.statAverageRating || "4.9");
    }
  }, []);

  useEffect(() => {
    if (authed) loadData();
  }, [authed, loadData]);

  const adminPost = async (action: string, payload: Record<string, unknown>) => {
    const pw = sessionStorage.getItem(PW_KEY) || password;
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw, action, payload }),
    });
    const data = await res.json();
    if (data.status === "success") setOverrides(data.data);
    return data;
  };

  const handleLogin = () => {
    if (password === "carestay2026") {
      sessionStorage.setItem(PW_KEY, password);
      setAuthed(true);
    } else {
      alert("Wrong password");
    }
  };

  const updateOverride = async (id: string | number, field: string, value: unknown) => {
    const key = `${id}-${field}`;
    setSaving(key);
    console.log("[Admin] Updating override:", { id: String(id), field, value });
    const result = await adminPost("updateListing", { id: String(id), [field]: value });
    console.log("[Admin] Update result:", result.status, "overrides for", id, ":", result.data?.listings?.[String(id)]);
    setSaving(null);
  };

  const saveExpandedOverrides = async (id: number, fields: Partial<ListingOverride>) => {
    setSaving(`${id}-expanded`);
    console.log("[Admin] Saving expanded overrides for", id, fields);
    await adminPost("updateListing", { id: String(id), ...fields });
    setSaving(null);
  };

  const SHOWCASE_PRESETS = [
    { title: "Yorkville Penthouse", location: "Downtown Toronto", beds: "2", baths: "2", price: "4500", sqft: "950", hospital: "Mount Sinai", distance: "5 min walk", desc: "Luxury penthouse in Toronto's most prestigious neighborhood. Walking distance to Mount Sinai and SickKids.", imgs: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800\nhttps://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", tub: true, standard: true },
    { title: "Liberty Village Loft", location: "Liberty Village", beds: "1", baths: "1", price: "2700", sqft: "620", hospital: "St. Joseph's", distance: "8 min drive", desc: "Industrial-chic loft with high ceilings and exposed brick.", imgs: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800\nhttps://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", tub: false, standard: true },
    { title: "Vaughan Metropolitan", location: "Vaughan", beds: "2", baths: "1", price: "3000", sqft: "780", hospital: "Mackenzie Health", distance: "12 min drive", desc: "Brand new condo at VMC with direct subway access.", imgs: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800\nhttps://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800", tub: false, standard: false },
    { title: "SickKids Quarter", location: "University District", beds: "1", baths: "1", price: "3100", sqft: "540", hospital: "SickKids", distance: "5 min walk", desc: "Steps from SickKids and Princess Margaret. Ideal for pediatric nurses.", imgs: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800\nhttps://images.unsplash.com/photo-1484154218962-a197022b5858?w=800", tub: true, standard: true },
    { title: "Burlington Lakefront", location: "Burlington", beds: "2", baths: "1", price: "3100", sqft: "810", hospital: "Joseph Brant", distance: "10 min drive", desc: "Waterfront living with charming downtown Burlington nearby.", imgs: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800\nhttps://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800", tub: false, standard: true },
  ];

  const applyPreset = (idx: number) => {
    const p = SHOWCASE_PRESETS[idx];
    setNewTitle(p.title); setNewLocation(p.location); setNewBeds(p.beds); setNewBaths(p.baths);
    setNewPrice(p.price); setNewSqft(p.sqft); setNewHospital(p.hospital); setNewDistance(p.distance);
    setNewDesc(p.desc); setNewImg(p.imgs); setNewTub(p.tub); setNewStandard(p.standard);
  };

  const addCustomListing = async () => {
    if (!newTitle || !newPrice) return alert("Title and price are required");
    const imgLines = newImg.split("\n").map(s => s.trim()).filter(Boolean);
    await adminPost("addCustomListing", {
      title: newTitle, location: newLocation, beds: Number(newBeds), baths: Number(newBaths),
      price: Number(newPrice), sqft: Number(newSqft), img: imgLines[0] || "", images: imgLines, description: newDesc,
      nearbyHospital: newHospital, hospitalDistance: newDistance, soakingTub: newTub, carestayStandard: newStandard, featured: newFeatured,
    });
    setNewTitle(""); setNewLocation(""); setNewBeds("1"); setNewBaths("1"); setNewPrice(""); setNewSqft("");
    setNewImg(""); setNewHospital(""); setNewDistance(""); setNewDesc(""); setNewTub(false); setNewStandard(false); setNewFeatured(false);
  };

  const deleteCustom = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    await adminPost("deleteCustomListing", { id });
  };

  /* ─── Login Screen ─── */
  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0c0f", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
        <div style={{ ...cardStyle, width: 360, textAlign: "center" }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 8 }}>CareStay Admin</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Enter password to continue</p>
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{ ...inputStyle, marginBottom: 16 }}
          />
          <button onClick={handleLogin} style={{ ...btnStyle, width: "100%" }}>Log In</button>
        </div>
      </div>
    );
  }

  /* ─── Admin Panel ─── */
  return (
    <div style={{ minHeight: "100vh", background: "#0a0c0f", fontFamily: "'DM Sans',system-ui,sans-serif", color: "#fff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700 }}>CareStay Admin</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{listings.length} HostAway listings &middot; {overrides.customListings.length} custom listings</p>
          </div>
          <button onClick={() => { sessionStorage.removeItem(PW_KEY); setAuthed(false); }} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            Log Out
          </button>
        </div>

        {/* Site Settings */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Site Settings</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Contact Email</div>
              <input value={siteEmail} onChange={e => setSiteEmail(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Average Rating</div>
              <input value={siteStatRating} onChange={e => setSiteStatRating(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Hero Tagline (homepage subtitle)</div>
            <textarea value={siteHeroTagline} onChange={e => setSiteHeroTagline(e.target.value)} rows={2} placeholder="Leave empty for default" style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Properties Managed</div>
              <input value={siteStatProps} onChange={e => setSiteStatProps(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Healthcare Pros Housed</div>
              <input value={siteStatPros} onChange={e => setSiteStatPros(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Hospital Partnerships</div>
              <input value={siteStatHospitals} onChange={e => setSiteStatHospitals(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={async () => {
              setSaving("settings");
              const pw = sessionStorage.getItem(PW_KEY) || password;
              await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw, settings: { contactEmail: siteEmail, heroTagline: siteHeroTagline, statProperties: siteStatProps, statHealthcarePros: siteStatPros, statHospitalPartnerships: siteStatHospitals, statAverageRating: siteStatRating } }) });
              setSaving(null);
              setSettingsSaved(true);
              setTimeout(() => setSettingsSaved(false), 2000);
            }} style={btnStyle} disabled={saving === "settings"}>
              {saving === "settings" ? "Saving..." : "Save Settings"}
            </button>
            {settingsSaved && <span style={{ fontSize: 13, color: "#0fa" }}>Saved!</span>}
          </div>
        </div>

        {/* HostAway Listings Table */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>HostAway Listings</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Listing</th>
                  <th style={thStyle}>Location</th>
                  <th style={thStyle}>API Price</th>
                  <th style={thStyle}>Override $/mo</th>
                  <th style={thStyle}>Sort</th>
                  <th style={thStyle}>Featured</th>
                  <th style={thStyle}>Visible</th>
                  <th style={thStyle}>Soaking Tub</th>
                  <th style={thStyle}>CareStay Std</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => {
                  const ov = overrides.listings[String(l.id)] || {};
                  const isExpanded = expandedId === l.id;
                  return (
                    <tr key={l.id} onClick={() => setExpandedId(isExpanded ? null : l.id)} style={{ cursor: "pointer" }}>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {l.img && <img src={l.img} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }} />}
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{ov.titleOverride || l.title}</div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>ID: {l.id} {isExpanded ? "▲" : "▼"}</div>
                          </div>
                        </div>
                      </td>
                      <td style={tdStyle}>{l.location}</td>
                      <td style={tdStyle}>${l.price.toLocaleString()}</td>
                      <td style={tdStyle} onClick={e => e.stopPropagation()}>
                        <input
                          type="number" placeholder="—"
                          value={ov.priceOverride ?? ""}
                          onChange={(e) => updateOverride(l.id, "priceOverride", e.target.value ? Number(e.target.value) : undefined)}
                          style={{ ...inputStyle, width: 100, padding: "6px 10px" }}
                        />
                        {saving === `${l.id}-priceOverride` && <span style={{ fontSize: 10, color: "#0fa", marginLeft: 4 }}>saving...</span>}
                      </td>
                      <td style={tdStyle} onClick={e => e.stopPropagation()}>
                        <input type="number" min="1" max="99" value={ov.sortOrder ?? 50} onChange={(e) => updateOverride(l.id, "sortOrder", e.target.value ? Number(e.target.value) : 50)} style={{ ...inputStyle, width: 56, padding: "4px 6px", textAlign: "center" }} />
                      </td>
                      <td style={tdStyle} onClick={e => e.stopPropagation()}><Toggle checked={!!ov.featured} onChange={(v) => updateOverride(l.id, "featured", v)} /></td>
                      <td style={tdStyle} onClick={e => e.stopPropagation()}><Toggle checked={!ov.hidden} onChange={(v) => updateOverride(l.id, "hidden", !v)} /></td>
                      <td style={tdStyle} onClick={e => e.stopPropagation()}><Toggle checked={!!ov.soakingTub} onChange={(v) => updateOverride(l.id, "soakingTub", v)} /></td>
                      <td style={tdStyle} onClick={e => e.stopPropagation()}><Toggle checked={!!ov.carestayStandard} onChange={(v) => updateOverride(l.id, "carestayStandard", v)} /></td>
                    </tr>
                  );
                })}
              </tbody>
              {/* Expanded Edit Form — rendered outside table */}
            </table>
          </div>
          {expandedId !== null && (() => {
            const l = listings.find(x => x.id === expandedId);
            if (!l) return null;
            const ov = overrides.listings[String(l.id)] || {};
            return (
              <div style={{ background: "rgba(0,255,170,0.03)", border: "1px solid rgba(0,255,170,0.1)", borderRadius: 12, padding: 20, marginTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0fa" }}>Edit: {l.title}</h3>
                  <button onClick={() => setExpandedId(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer" }}>✕</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Title Override</label>
                    <input style={inputStyle} defaultValue={ov.titleOverride || ""} placeholder={l.title} onBlur={e => { if (e.target.value !== (ov.titleOverride || "")) saveExpandedOverrides(l.id, { titleOverride: e.target.value || undefined }); }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Price Override ($/mo)</label>
                    <input style={inputStyle} type="number" defaultValue={ov.priceOverride ?? ""} placeholder={String(l.price)} onBlur={e => { if (String(e.target.value) !== String(ov.priceOverride ?? "")) saveExpandedOverrides(l.id, { priceOverride: e.target.value ? Number(e.target.value) : undefined }); }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Nearby Hospital</label>
                    <input style={inputStyle} defaultValue={ov.nearbyHospital || ""} placeholder="e.g., Toronto General" onBlur={e => { if (e.target.value !== (ov.nearbyHospital || "")) saveExpandedOverrides(l.id, { nearbyHospital: e.target.value || undefined }); }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Hospital Distance</label>
                    <input style={inputStyle} defaultValue={ov.hospitalDistance || ""} placeholder="e.g., 5 min walk" onBlur={e => { if (e.target.value !== (ov.hospitalDistance || "")) saveExpandedOverrides(l.id, { hospitalDistance: e.target.value || undefined }); }} />
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Description Override</label>
                  <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} defaultValue={ov.descriptionOverride || l.description || ""} placeholder="Override the API description..." onBlur={e => { const currentDefault = ov.descriptionOverride || l.description || ""; if (e.target.value !== currentDefault) saveExpandedOverrides(l.id, { descriptionOverride: e.target.value || undefined }); }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Video Walkthrough URL</label>
                  <input style={inputStyle} defaultValue={ov.videoUrl || ""} placeholder="e.g., https://www.youtube.com/watch?v=ABC123" onBlur={e => { if (e.target.value !== (ov.videoUrl || "")) saveExpandedOverrides(l.id, { videoUrl: e.target.value || undefined }); }} />
                </div>
                <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    <Toggle checked={!ov.hidden} onChange={(v) => saveExpandedOverrides(l.id, { hidden: !v })} /> Visible
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    <Toggle checked={!!ov.soakingTub} onChange={(v) => saveExpandedOverrides(l.id, { soakingTub: v })} /> Soaking Tub
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    <Toggle checked={!!ov.carestayStandard} onChange={(v) => saveExpandedOverrides(l.id, { carestayStandard: v })} /> CareStay Standard
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                    <Toggle checked={!!ov.featured} onChange={(v) => saveExpandedOverrides(l.id, { featured: v })} /> <span style={{ color: "#f0c040" }}>Featured</span>
                  </label>
                  {saving === `${expandedId}-expanded` && <span style={{ fontSize: 12, color: "#0fa" }}>Saving...</span>}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Custom Listings */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Custom Listings</h2>
          {overrides.customListings.length > 0 && (
            <div style={{ overflowX: "auto", marginBottom: 24 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Listing</th>
                    <th style={thStyle}>Location</th>
                    <th style={thStyle}>Price</th>
                    <th style={thStyle}>Hospital</th>
                    <th style={thStyle}>Tub</th>
                    <th style={thStyle}>CS Std</th>
                    <th style={thStyle}></th>
                  </tr>
                </thead>
                <tbody>
                  {overrides.customListings.map((cl) => (
                    <tr key={cl.id}>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{cl.title}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{cl.beds}bd / {cl.baths}ba / {cl.sqft}sqft</div>
                      </td>
                      <td style={tdStyle}>{cl.location}</td>
                      <td style={tdStyle}>${cl.price.toLocaleString()}/mo</td>
                      <td style={tdStyle}>{cl.nearbyHospital}{cl.hospitalDistance ? ` (${cl.hospitalDistance})` : ""}</td>
                      <td style={tdStyle}>{cl.soakingTub ? "Yes" : "No"}</td>
                      <td style={tdStyle}>{cl.carestayStandard ? "Yes" : "No"}</td>
                      <td style={tdStyle}>
                        <button onClick={() => deleteCustom(cl.id)} style={{ background: "rgba(255,77,77,0.15)", color: "#f66", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Quick Add Showcase */}
          <div style={{ marginBottom: 20, padding: "14px 16px", background: "rgba(0,170,255,0.04)", border: "1px solid rgba(0,170,255,0.12)", borderRadius: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0af", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Quick Add Showcase</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SHOWCASE_PRESETS.map((p, i) => (
                <button key={i} onClick={() => applyPreset(i)} style={{ padding: "6px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* Add Custom Listing Form */}
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: "rgba(255,255,255,0.7)" }}>Add Custom Listing</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Title *</label><input style={inputStyle} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g., Luxury Downtown Suite" /></div>
            <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Location</label><input style={inputStyle} value={newLocation} onChange={(e) => setNewLocation(e.target.value)} placeholder="e.g., King West Village" /></div>
            <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Beds</label><input style={inputStyle} type="number" value={newBeds} onChange={(e) => setNewBeds(e.target.value)} /></div>
            <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Baths</label><input style={inputStyle} type="number" value={newBaths} onChange={(e) => setNewBaths(e.target.value)} /></div>
            <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Monthly Price * ($)</label><input style={inputStyle} type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="3200" /></div>
            <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Sqft</label><input style={inputStyle} type="number" value={newSqft} onChange={(e) => setNewSqft(e.target.value)} placeholder="750" /></div>
            <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Nearby Hospital</label><input style={inputStyle} value={newHospital} onChange={(e) => setNewHospital(e.target.value)} placeholder="Toronto General" /></div>
            <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Hospital Distance</label><input style={inputStyle} value={newDistance} onChange={(e) => setNewDistance(e.target.value)} placeholder="5 min walk" /></div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Image URLs (one per line)</label>
            <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={newImg} onChange={(e) => setNewImg(e.target.value)} placeholder={"https://images.unsplash.com/photo-1...\nhttps://images.unsplash.com/photo-2..."} />
            {newImg.trim() && (
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                {newImg.split("\n").filter(s => s.trim()).map((url, i) => (
                  <img key={i} src={url.trim()} alt={`Preview ${i + 1}`} style={{ width: 60, height: 42, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)" }} />
                ))}
              </div>
            )}
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Description</label>
            <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Brief description of the listing..." />
          </div>
          <div style={{ display: "flex", gap: 24, marginBottom: 16 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
              <Toggle checked={newTub} onChange={setNewTub} /> Soaking Tub
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
              <Toggle checked={newStandard} onChange={setNewStandard} /> CareStay Standard
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
              <Toggle checked={newFeatured} onChange={setNewFeatured} /> <span style={{ color: "#f0c040" }}>Featured</span>
            </label>
          </div>
          <button onClick={addCustomListing} style={btnStyle}>Add Listing</button>
        </div>

        {/* Reviews Management */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Reviews Management</h2>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Select Listing</label>
            <select
              style={{ ...inputStyle, cursor: "pointer" }}
              value={reviewListingId || ""}
              onChange={e => { setReviewListingId(e.target.value || null); setEditingReviewId(null); }}
            >
              <option value="">— Choose a listing —</option>
              {listings.map(l => <option key={l.id} value={String(l.id)}>{l.title} (ID: {l.id})</option>)}
              {overrides.customListings.map(cl => <option key={cl.id} value={cl.id}>{cl.title} (Custom)</option>)}
            </select>
          </div>

          {reviewListingId && (() => {
            const rd = overrides.reviews?.[reviewListingId] || { totalCount: 0, items: [] };
            const avgStars = rd.items.length > 0 ? rd.items.reduce((a, r) => a + r.stars, 0) / rd.items.length : 0;
            return (
              <div>
                {/* Total count setting */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, padding: "14px 16px", background: "rgba(0,255,170,0.03)", border: "1px solid rgba(0,255,170,0.1)", borderRadius: 10 }}>
                  <div>
                    <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Display Total Count</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="number" min="0" value={rd.totalCount} onChange={async (e) => { await adminPost("updateReviewSettings", { listingId: reviewListingId, totalCount: Number(e.target.value) || 0 }); }} style={{ ...inputStyle, width: 80, padding: "6px 10px", textAlign: "center" }} />
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>reviews shown in header (even if fewer are written)</span>
                    </div>
                  </div>
                  {rd.items.length > 0 && (
                    <div style={{ marginLeft: "auto", textAlign: "right" }}>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{rd.items.length} written · avg {avgStars.toFixed(1)}★</div>
                    </div>
                  )}
                </div>

                {/* Existing reviews */}
                {rd.items.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>Reviews ({rd.items.length})</h3>
                    {rd.items.map(r => (
                      <div key={r.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 16px", marginBottom: 8 }}>
                        {editingReviewId === r.id ? (
                          <div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", gap: 8, marginBottom: 8 }}>
                              <input style={inputStyle} defaultValue={r.name} id={`edit-name-${r.id}`} placeholder="Name" />
                              <input style={{ ...inputStyle, textAlign: "center" }} type="number" min="1" max="5" defaultValue={r.stars} id={`edit-stars-${r.id}`} />
                              <input style={inputStyle} type="date" defaultValue={r.date} id={`edit-date-${r.id}`} />
                            </div>
                            <textarea style={{ ...inputStyle, minHeight: 50, resize: "vertical", marginBottom: 8 }} defaultValue={r.text} id={`edit-text-${r.id}`} />
                            <input style={{ ...inputStyle, marginBottom: 8 }} defaultValue={r.stayInfo || ""} id={`edit-stayInfo-${r.id}`} placeholder="e.g., Stayed 2 months" />
                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                                <input type="checkbox" defaultChecked={r.verified} id={`edit-verified-${r.id}`} /> Verified
                              </label>
                              <button onClick={async () => {
                                const name = (document.getElementById(`edit-name-${r.id}`) as HTMLInputElement).value;
                                const stars = Number((document.getElementById(`edit-stars-${r.id}`) as HTMLInputElement).value);
                                const text = (document.getElementById(`edit-text-${r.id}`) as HTMLTextAreaElement).value;
                                const date = (document.getElementById(`edit-date-${r.id}`) as HTMLInputElement).value;
                                const verified = (document.getElementById(`edit-verified-${r.id}`) as HTMLInputElement).checked;
                                const stayInfo = (document.getElementById(`edit-stayInfo-${r.id}`) as HTMLInputElement).value;
                                await adminPost("updateReview", { listingId: reviewListingId, reviewId: r.id, name, stars, text, date, verified, stayInfo });
                                setEditingReviewId(null);
                              }} style={{ ...btnStyle, padding: "6px 14px", fontSize: 12 }}>Save</button>
                              <button onClick={() => setEditingReviewId(null)} style={{ padding: "6px 14px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                <span style={{ fontWeight: 700, fontSize: 13 }}>{r.name}</span>
                                {r.verified && <span style={{ color: "#0af", fontSize: 12 }}>✓ Verified</span>}
                                <span style={{ color: "#f0c040", fontSize: 12 }}>{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</span>
                                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{r.date}</span>
                                {r.stayInfo && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>· {r.stayInfo}</span>}
                              </div>
                              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{r.text}</p>
                            </div>
                            <div style={{ display: "flex", gap: 6, flexShrink: 0, marginLeft: 12 }}>
                              <button onClick={() => setEditingReviewId(r.id)} style={{ background: "rgba(0,170,255,0.12)", color: "#0af", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Edit</button>
                              <button onClick={async () => { if (confirm("Delete this review?")) await adminPost("deleteReview", { listingId: reviewListingId, reviewId: r.id }); }} style={{ background: "rgba(255,77,77,0.12)", color: "#f66", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Del</button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add review form */}
                <div style={{ padding: "16px 18px", background: "rgba(0,170,255,0.03)", border: "1px solid rgba(0,170,255,0.1)", borderRadius: 10 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0af", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>Add Review</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 1fr", gap: 8, marginBottom: 8 }}>
                    <input style={inputStyle} value={revName} onChange={e => setRevName(e.target.value)} placeholder="Reviewer name" />
                    <input style={{ ...inputStyle, textAlign: "center" }} type="number" min="1" max="5" value={revStars} onChange={e => setRevStars(e.target.value)} placeholder="Stars" />
                    <input style={inputStyle} type="date" value={revDate} onChange={e => setRevDate(e.target.value)} />
                  </div>
                  <textarea style={{ ...inputStyle, minHeight: 50, resize: "vertical", marginBottom: 8 }} value={revText} onChange={e => setRevText(e.target.value)} placeholder="Review text..." />
                  <input style={{ ...inputStyle, marginBottom: 8 }} value={revStayInfo} onChange={e => setRevStayInfo(e.target.value)} placeholder="Stay info (e.g., Stayed 2 months)" />
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                      <Toggle checked={revVerified} onChange={setRevVerified} /> Verified Guest
                    </label>
                    <button onClick={async () => {
                      if (!revName || !revText) return alert("Name and text required");
                      await adminPost("addReview", { listingId: reviewListingId, name: revName, stars: Number(revStars), text: revText, date: revDate, verified: revVerified, stayInfo: revStayInfo });
                      setRevName(""); setRevStars("5"); setRevText(""); setRevDate(new Date().toISOString().split("T")[0]); setRevVerified(true); setRevStayInfo("");
                    }} style={btnStyle}>Add Review</button>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
