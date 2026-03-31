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
  availabilityStatus?: string;
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
  videoUrl?: string;
  hidden?: boolean;
  availabilityStatus?: string;
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

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", background: "#12151a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 28, width: "90%", maxWidth: 720, maxHeight: "80vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 18, cursor: "pointer", padding: "4px 10px", borderRadius: 6 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const s = status || "Available";
  const map: Record<string, { bg: string; color: string }> = {
    "Available": { bg: "rgba(0,255,170,0.15)", color: "#0fa" },
    "Almost Booked": { bg: "rgba(255,160,0,0.15)", color: "#ffa000" },
    "Waitlist Only": { bg: "rgba(0,140,255,0.15)", color: "#08f" },
    "Booked": { bg: "rgba(255,60,60,0.15)", color: "#f66" },
  };
  const c = map[s] || map["Available"];
  return <span style={{ background: c.bg, color: c.color, padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{s}</span>;
}

const TABS = [
  { key: "settings", label: "Site Settings" },
  { key: "hostaway", label: "HostAway Listings" },
  { key: "custom", label: "Custom Listings" },
  { key: "reviews", label: "Reviews" },
] as const;

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("settings");
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
  const [siteAddress, setSiteAddress] = useState("35 Mariner Terrace, Toronto, ON M5V 3V9");
  const [siteHeroTagline, setSiteHeroTagline] = useState("");
  const [siteStatProps, setSiteStatProps] = useState("60+");
  const [siteStatPros, setSiteStatPros] = useState("150+");
  const [siteStatHospitals, setSiteStatHospitals] = useState("30+");
  const [siteStatRating, setSiteStatRating] = useState("4.9");
  const [bannerEnabled, setBannerEnabled] = useState(true);
  const [bannerText, setBannerText] = useState("🏥 New suites dropping soon — join the waitlist");
  const [bannerButtonText, setBannerButtonText] = useState("Join");
  const [bannerLinkUrl, setBannerLinkUrl] = useState("/#contact");
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

  // Edit custom listing state
  const [editingCustomId, setEditingCustomId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editBeds, setEditBeds] = useState("1");
  const [editBaths, setEditBaths] = useState("1");
  const [editPrice, setEditPrice] = useState("");
  const [editSqft, setEditSqft] = useState("");
  const [editImg, setEditImg] = useState("");
  const [editHospital, setEditHospital] = useState("");
  const [editDistance, setEditDistance] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editTub, setEditTub] = useState(false);
  const [editStandard, setEditStandard] = useState(false);
  const [editFeatured, setEditFeatured] = useState(false);
  const [editSortOrder, setEditSortOrder] = useState("50");
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [editHidden, setEditHidden] = useState(false);
  const [editAvailStatus, setEditAvailStatus] = useState("Available");
  const [addPhotoInput, setAddPhotoInput] = useState("");
  const [bulkPhotoInput, setBulkPhotoInput] = useState("");

  // Bulk selection & search
  const [selectedHostaway, setSelectedHostaway] = useState<Set<number>>(new Set());
  const [selectedCustom, setSelectedCustom] = useState<Set<string>>(new Set());
  const [haSearch, setHaSearch] = useState("");
  const [clSearch, setClSearch] = useState("");
  const [toast, setToast] = useState("");

  const openEditCustom = (cl: CustomListing) => {
    setEditingCustomId(cl.id);
    setEditTitle(cl.title);
    setEditLocation(cl.location);
    setEditBeds(String(cl.beds));
    setEditBaths(String(cl.baths));
    setEditPrice(String(cl.price));
    setEditSqft(String(cl.sqft));
    setEditImg((cl.images || []).join("\n"));
    setEditHospital(cl.nearbyHospital || "");
    setEditDistance(cl.hospitalDistance || "");
    setEditDesc(cl.description || "");
    setEditTub(!!cl.soakingTub);
    setEditStandard(!!cl.carestayStandard);
    setEditFeatured(!!cl.featured);
    setEditSortOrder(String(cl.sortOrder ?? 50));
    setEditVideoUrl(cl.videoUrl || "");
    setEditHidden(!!cl.hidden);
    setEditAvailStatus(cl.availabilityStatus || "Available");
    setAddPhotoInput("");
  };

  const saveEditCustom = async () => {
    if (!editingCustomId || !editTitle || !editPrice) return alert("Title and price required");
    const imgLines = editImg.split("\n").map(s => s.trim()).filter(Boolean);
    setSaving("editCustom");
    await adminPost("updateCustomListing", {
      id: editingCustomId,
      title: editTitle, location: editLocation, beds: Number(editBeds), baths: Number(editBaths),
      price: Number(editPrice), sqft: Number(editSqft), img: imgLines[0] || "", images: imgLines,
      description: editDesc, nearbyHospital: editHospital, hospitalDistance: editDistance,
      soakingTub: editTub, carestayStandard: editStandard, featured: editFeatured, sortOrder: Number(editSortOrder),
      videoUrl: editVideoUrl, hidden: editHidden, availabilityStatus: editAvailStatus,
    });
    setSaving(null);
    setEditingCustomId(null);
  };

  const moveCustomListing = async (id: string, direction: "up" | "down") => {
    const idx = overrides.customListings.findIndex(cl => cl.id === id);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= overrides.customListings.length) return;
    const a = overrides.customListings[idx];
    const b = overrides.customListings[swapIdx];
    const aSort = a.sortOrder ?? 50;
    const bSort = b.sortOrder ?? 50;
    setSaving("moveCustom");
    await adminPost("updateCustomListing", { id: a.id, sortOrder: bSort });
    await adminPost("updateCustomListing", { id: b.id, sortOrder: aSort });
    setSaving(null);
  };

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
    if (listData.status === "success") setListings(listData.listings || []);
    if (adminData.status === "success") setOverrides(adminData.data);
    if (settingsData.status === "success" && settingsData.settings) {
      const s = settingsData.settings;
      setSiteEmail(s.contactEmail || "info@carestaysuites.com");
      setSiteAddress(s.companyAddress || "35 Mariner Terrace, Toronto, ON M5V 3V9");
      setSiteHeroTagline(s.heroTagline || "");
      setSiteStatProps(s.statProperties || "60+");
      setSiteStatPros(s.statHealthcarePros || "150+");
      setSiteStatHospitals(s.statHospitalPartnerships || "30+");
      setSiteStatRating(s.statAverageRating || "4.9");
      setBannerEnabled(s.bannerEnabled !== false);
      setBannerText(s.bannerText || "🏥 New suites dropping soon — join the waitlist");
      setBannerButtonText(s.bannerButtonText || "Join");
      setBannerLinkUrl(s.bannerLinkUrl || "/#contact");
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
    await adminPost("updateListing", { id: String(id), [field]: value });
    setSaving(null);
  };

  const saveExpandedOverrides = async (id: number, fields: Partial<ListingOverride>) => {
    setSaving(`${id}-expanded`);
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
      nearbyHospital: newHospital, hospitalDistance: newDistance, soakingTub: newTub, carestayStandard: newStandard, featured: newFeatured, availabilityStatus: "Available",
    });
    setNewTitle(""); setNewLocation(""); setNewBeds("1"); setNewBaths("1"); setNewPrice(""); setNewSqft("");
    setNewImg(""); setNewHospital(""); setNewDistance(""); setNewDesc(""); setNewTub(false); setNewStandard(false); setNewFeatured(false);
  };

  const deleteCustom = async (id: string, name?: string) => {
    if (!confirm(`Are you sure you want to delete "${name || "this listing"}"?`)) return;
    await adminPost("deleteCustomListing", { id });
    showToast("Listing deleted");
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 2000); };

  const bulkHostaway = async (field: string, value: unknown) => {
    for (const id of Array.from(selectedHostaway)) {
      await adminPost("updateListing", { id: String(id), [field]: value });
    }
    setSelectedHostaway(new Set());
    showToast(`Updated ${selectedHostaway.size} listings`);
  };

  const bulkCustom = async (field: string, value: unknown) => {
    for (const id of Array.from(selectedCustom)) {
      await adminPost("updateCustomListing", { id, [field]: value });
    }
    setSelectedCustom(new Set());
    showToast(`Updated ${selectedCustom.size} listings`);
  };

  const filteredHostaway = listings.filter(l => {
    if (!haSearch) return true;
    const q = haSearch.toLowerCase();
    const ov = overrides.listings[String(l.id)] || {};
    return (ov.titleOverride || l.title).toLowerCase().includes(q) || l.location.toLowerCase().includes(q);
  });

  const filteredCustom = overrides.customListings.filter(cl => {
    if (!clSearch) return true;
    const q = clSearch.toLowerCase();
    return cl.title.toLowerCase().includes(q) || cl.location.toLowerCase().includes(q);
  });

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
      {/* Toast */}
      {toast && <div style={{ position: "fixed", top: 24, right: 24, zIndex: 2000, background: "#14b8a6", color: "#000", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700, boxShadow: "0 4px 20px rgba(0,0,0,0.4)", animation: "fadeIn 0.2s" }}>{toast}</div>}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 700 }}>CareStay Admin</h1>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{listings.length} HostAway listings &middot; {overrides.customListings.length} custom listings</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={async () => { if (confirm("Reset ALL featured flags to OFF for every listing?")) { await adminPost("resetAllFeatured", {}); alert("All featured flags reset. Reload to see changes."); window.location.reload(); } }} style={{ padding: "8px 16px", background: "rgba(255,77,77,0.15)", color: "#f66", border: "1px solid rgba(255,77,77,0.2)", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
              Reset All Featured
            </button>
            <button onClick={() => { sessionStorage.removeItem(PW_KEY); setAuthed(false); }} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              Log Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 0, marginBottom: 28, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ padding: "12px 24px", background: "none", border: "none", borderBottom: activeTab === t.key ? "2px solid #14b8a6" : "2px solid transparent", color: activeTab === t.key ? "#14b8a6" : "rgba(255,255,255,0.45)", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>{t.label}</button>
          ))}
        </div>

        {/* ═══ TAB: Site Settings ═══ */}
        {activeTab === "settings" && <div style={cardStyle}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Site Settings</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Contact Email</div>
              <input value={siteEmail} onChange={e => setSiteEmail(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Company Address</div>
              <input value={siteAddress} onChange={e => setSiteAddress(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
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
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>Announcement Banner</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Banner Enabled</div>
                <button onClick={() => setBannerEnabled(!bannerEnabled)} style={{ ...inputStyle, cursor: "pointer", textAlign: "left", color: bannerEnabled ? "#0fa" : "rgba(255,255,255,0.4)" }}>{bannerEnabled ? "ON" : "OFF"}</button>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Button Text</div>
                <input value={bannerButtonText} onChange={e => setBannerButtonText(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Link URL</div>
                <input value={bannerLinkUrl} onChange={e => setBannerLinkUrl(e.target.value)} placeholder="/#contact" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Banner Text</div>
              <input value={bannerText} onChange={e => setBannerText(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={async () => {
              setSaving("settings");
              const pw = sessionStorage.getItem(PW_KEY) || password;
              await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw, settings: { contactEmail: siteEmail, companyAddress: siteAddress, heroTagline: siteHeroTagline, statProperties: siteStatProps, statHealthcarePros: siteStatPros, statHospitalPartnerships: siteStatHospitals, statAverageRating: siteStatRating, bannerEnabled: bannerEnabled, bannerText: bannerText, bannerButtonText: bannerButtonText, bannerLinkUrl: bannerLinkUrl } }) });
              setSaving(null);
              setSettingsSaved(true);
              setTimeout(() => setSettingsSaved(false), 2000);
            }} style={btnStyle} disabled={saving === "settings"}>
              {saving === "settings" ? "Saving..." : "Save Settings"}
            </button>
            {settingsSaved && <span style={{ fontSize: 13, color: "#0fa" }}>Saved!</span>}
          </div>
        </div>}

        {/* ═══ TAB: HostAway Listings ═══ */}
        {activeTab === "hostaway" && <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 16, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>HostAway Listings ({filteredHostaway.length})</h2>
            <input placeholder="Search by title or location..." value={haSearch} onChange={e => setHaSearch(e.target.value)} style={{ ...inputStyle, width: 280, padding: "8px 14px" }} />
          </div>
          {selectedHostaway.size > 0 && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 16, padding: "12px 16px", background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.2)", borderRadius: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#14b8a6", marginRight: 8 }}>{selectedHostaway.size} selected</span>
              <select onChange={e => { if (e.target.value) { bulkHostaway("availabilityStatus", e.target.value); e.target.value = ""; } }} style={{ ...inputStyle, width: "auto", padding: "6px 10px", fontSize: 12 }}><option value="">Set Status...</option><option value="Available">Available</option><option value="Almost Booked">Almost Booked</option><option value="Waitlist Only">Waitlist Only</option><option value="Booked">Booked</option></select>
              <button onClick={() => bulkHostaway("hidden", false)} style={{ padding: "6px 12px", background: "rgba(0,255,170,0.12)", color: "#0fa", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Show</button>
              <button onClick={() => bulkHostaway("hidden", true)} style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Hide</button>
              <button onClick={() => bulkHostaway("featured", true)} style={{ padding: "6px 12px", background: "rgba(240,192,64,0.12)", color: "#f0c040", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Feature</button>
              <button onClick={() => bulkHostaway("featured", false)} style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Unfeature</button>
            </div>
          )}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}><input type="checkbox" checked={filteredHostaway.length > 0 && filteredHostaway.every(l => selectedHostaway.has(l.id))} onChange={e => { if (e.target.checked) setSelectedHostaway(new Set(filteredHostaway.map(l => l.id))); else setSelectedHostaway(new Set()); }} /></th>
                  <th style={thStyle}>Listing</th>
                  <th style={thStyle}>Location</th>
                  <th style={thStyle}>Price</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Featured</th>
                  <th style={thStyle}>Visible</th>
                  <th style={thStyle}></th>
                </tr>
              </thead>
              <tbody>
                {filteredHostaway.map((l) => {
                  const ov = overrides.listings[String(l.id)] || {};
                  return (
                    <tr key={l.id} style={{ transition: "background 0.15s" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td style={tdStyle}><input type="checkbox" checked={selectedHostaway.has(l.id)} onChange={e => { const s = new Set(selectedHostaway); if (e.target.checked) s.add(l.id); else s.delete(l.id); setSelectedHostaway(s); }} /></td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {l.img && <img src={l.img} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23222' width='40' height='40'/%3E%3Ctext x='50%25' y='50%25' fill='%23555' font-size='14' text-anchor='middle' dy='.35em'%3E?%3C/text%3E%3C/svg%3E"; }} />}
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{ov.titleOverride || l.title}</div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>ID: {l.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={tdStyle}>{l.location}</td>
                      <td style={tdStyle}>{ov.priceOverride ? `$${ov.priceOverride.toLocaleString()}` : `$${l.price.toLocaleString()}`}/mo</td>
                      <td style={tdStyle}><StatusBadge status={ov.availabilityStatus} /></td>
                      <td style={tdStyle}><Toggle checked={!!ov.featured} onChange={(v) => updateOverride(l.id, "featured", v)} /></td>
                      <td style={tdStyle}><Toggle checked={!ov.hidden} onChange={(v) => updateOverride(l.id, "hidden", !v)} /></td>
                      <td style={tdStyle}><button onClick={() => setExpandedId(l.id)} style={{ background: "rgba(20,184,166,0.15)", color: "#14b8a6", border: "1px solid rgba(20,184,166,0.3)", borderRadius: 6, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Edit</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {(() => {
            const l = expandedId !== null ? listings.find(x => x.id === expandedId) : null;
            if (!l) return null;
            const ov = overrides.listings[String(l.id)] || {};
            return (
              <Modal open={true} onClose={() => setExpandedId(null)} title={`Edit: ${ov.titleOverride || l.title}`}>
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
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Availability Status</label>
                  <select style={{ ...inputStyle, width: 220, cursor: "pointer" }} value={ov.availabilityStatus || "Available"} onChange={e => saveExpandedOverrides(l.id, { availabilityStatus: e.target.value })}>
                    <option value="Available">Available</option>
                    <option value="Almost Booked">Almost Booked</option>
                    <option value="Waitlist Only">Waitlist Only</option>
                    <option value="Booked">Booked</option>
                  </select>
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
              </Modal>
            );
          })()}
        </div>}

        {/* ═══ TAB: Custom Listings ═══ */}
        {activeTab === "custom" && <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 16, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Custom Listings ({filteredCustom.length})</h2>
            <input placeholder="Search by title or location..." value={clSearch} onChange={e => setClSearch(e.target.value)} style={{ ...inputStyle, width: 280, padding: "8px 14px" }} />
          </div>
          {selectedCustom.size > 0 && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 16, padding: "12px 16px", background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.2)", borderRadius: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#14b8a6", marginRight: 8 }}>{selectedCustom.size} selected</span>
              <select onChange={e => { if (e.target.value) { bulkCustom("availabilityStatus", e.target.value); e.target.value = ""; } }} style={{ ...inputStyle, width: "auto", padding: "6px 10px", fontSize: 12 }}><option value="">Set Status...</option><option value="Available">Available</option><option value="Almost Booked">Almost Booked</option><option value="Waitlist Only">Waitlist Only</option><option value="Booked">Booked</option></select>
              <button onClick={() => bulkCustom("hidden", false)} style={{ padding: "6px 12px", background: "rgba(0,255,170,0.12)", color: "#0fa", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Show</button>
              <button onClick={() => bulkCustom("hidden", true)} style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Hide</button>
              <button onClick={() => bulkCustom("featured", true)} style={{ padding: "6px 12px", background: "rgba(240,192,64,0.12)", color: "#f0c040", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Feature</button>
              <button onClick={() => bulkCustom("featured", false)} style={{ padding: "6px 12px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Unfeature</button>
            </div>
          )}
          {filteredCustom.length > 0 && (
            <div style={{ overflowX: "auto", marginBottom: 24 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}><input type="checkbox" checked={filteredCustom.length > 0 && filteredCustom.every(cl => selectedCustom.has(cl.id))} onChange={e => { if (e.target.checked) setSelectedCustom(new Set(filteredCustom.map(cl => cl.id))); else setSelectedCustom(new Set()); }} /></th>
                    <th style={thStyle}>Listing</th>
                    <th style={thStyle}>Location</th>
                    <th style={thStyle}>Price</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Featured</th>
                    <th style={thStyle}>Visible</th>
                    <th style={thStyle}>Order</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustom.map((cl, idx) => (
                    <tr key={cl.id} style={{ transition: "background 0.15s" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td style={tdStyle}><input type="checkbox" checked={selectedCustom.has(cl.id)} onChange={e => { const s = new Set(selectedCustom); if (e.target.checked) s.add(cl.id); else s.delete(cl.id); setSelectedCustom(s); }} /></td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {cl.images?.[0] && <img src={cl.images[0]} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23222' width='40' height='40'/%3E%3Ctext x='50%25' y='50%25' fill='%23555' font-size='14' text-anchor='middle' dy='.35em'%3E?%3C/text%3E%3C/svg%3E"; }} />}
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{cl.title}</div>
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{cl.beds}bd / {cl.baths}ba</div>
                          </div>
                        </div>
                      </td>
                      <td style={tdStyle}>{cl.location}</td>
                      <td style={tdStyle}>${cl.price.toLocaleString()}/mo</td>
                      <td style={tdStyle}><StatusBadge status={cl.availabilityStatus} /></td>
                      <td style={tdStyle}><Toggle checked={!!cl.featured} onChange={async (v) => { await adminPost("updateCustomListing", { id: cl.id, featured: v }); }} /></td>
                      <td style={tdStyle}><Toggle checked={!cl.hidden} onChange={async (v) => { await adminPost("updateCustomListing", { id: cl.id, hidden: !v }); }} /></td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: 4 }}>
                          <button disabled={idx === 0} onClick={() => moveCustomListing(cl.id, "up")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, color: idx === 0 ? "rgba(255,255,255,0.15)" : "#fff", fontSize: 12, padding: "2px 8px", cursor: idx === 0 ? "default" : "pointer", fontFamily: "inherit" }}>▲</button>
                          <button disabled={idx === overrides.customListings.length - 1} onClick={() => moveCustomListing(cl.id, "down")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, color: idx === overrides.customListings.length - 1 ? "rgba(255,255,255,0.15)" : "#fff", fontSize: 12, padding: "2px 8px", cursor: idx === overrides.customListings.length - 1 ? "default" : "pointer", fontFamily: "inherit" }}>▼</button>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button onClick={() => openEditCustom(cl)} style={{ background: "rgba(20,184,166,0.15)", color: "#14b8a6", border: "1px solid rgba(20,184,166,0.3)", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Edit</button>
                          <button onClick={() => deleteCustom(cl.id, cl.title)} style={{ background: "rgba(255,77,77,0.12)", color: "#f66", border: "none", borderRadius: 6, padding: "6px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Expanded edit form for custom listing */}
          {editingCustomId && (() => {
            const cl = overrides.customListings.find(x => x.id === editingCustomId);
            if (!cl) return null;
            return (
              <Modal open={true} onClose={() => setEditingCustomId(null)} title={`Edit: ${cl.title}`}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Title *</label><input style={inputStyle} value={editTitle} onChange={e => setEditTitle(e.target.value)} /></div>
                  <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Location</label><input style={inputStyle} value={editLocation} onChange={e => setEditLocation(e.target.value)} /></div>
                  <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Beds</label><input style={inputStyle} type="number" value={editBeds} onChange={e => setEditBeds(e.target.value)} /></div>
                  <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Baths</label><input style={inputStyle} type="number" value={editBaths} onChange={e => setEditBaths(e.target.value)} /></div>
                  <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Monthly Price * ($)</label><input style={inputStyle} type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} /></div>
                  <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Sqft</label><input style={inputStyle} type="number" value={editSqft} onChange={e => setEditSqft(e.target.value)} /></div>
                  <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Nearby Hospital</label><input style={inputStyle} value={editHospital} onChange={e => setEditHospital(e.target.value)} /></div>
                  <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Hospital Distance</label><input style={inputStyle} value={editDistance} onChange={e => setEditDistance(e.target.value)} /></div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Photos ({editImg.split("\n").filter(s => s.trim()).length}) — first image is cover</label>
                  {editImg.trim() && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
                      {editImg.split("\n").filter(s => s.trim()).map((url, i, arr) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: i === 0 ? "rgba(0,255,170,0.06)" : "rgba(255,255,255,0.02)", border: i === 0 ? "1px solid rgba(0,255,170,0.15)" : "1px solid rgba(255,255,255,0.06)", borderRadius: 8 }}>
                          <img src={url.trim()} alt={`Photo ${i + 1}`} style={{ width: 64, height: 44, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='44'%3E%3Crect fill='%23222' width='64' height='44'/%3E%3Ctext x='50%25' y='50%25' fill='%23f66' font-size='10' text-anchor='middle' dy='.35em'%3EBroken%3C/text%3E%3C/svg%3E"; }} />
                          <span style={{ fontSize: 11, color: i === 0 ? "#0fa" : "rgba(255,255,255,0.4)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{i === 0 ? "Cover · " : ""}{url.trim().split("/").pop()}</span>
                          <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                            <button disabled={i === 0} onClick={() => { const lines = editImg.split("\n").filter(s => s.trim()); [lines[i - 1], lines[i]] = [lines[i], lines[i - 1]]; setEditImg(lines.join("\n")); }} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, color: i === 0 ? "rgba(255,255,255,0.15)" : "#fff", fontSize: 11, padding: "2px 6px", cursor: i === 0 ? "default" : "pointer", fontFamily: "inherit" }}>▲</button>
                            <button disabled={i === arr.length - 1} onClick={() => { const lines = editImg.split("\n").filter(s => s.trim()); [lines[i], lines[i + 1]] = [lines[i + 1], lines[i]]; setEditImg(lines.join("\n")); }} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, color: i === arr.length - 1 ? "rgba(255,255,255,0.15)" : "#fff", fontSize: 11, padding: "2px 6px", cursor: i === arr.length - 1 ? "default" : "pointer", fontFamily: "inherit" }}>▼</button>
                            <button onClick={() => { const lines = editImg.split("\n").filter(s => s.trim()); lines.splice(i, 1); setEditImg(lines.join("\n")); }} style={{ background: "rgba(255,77,77,0.12)", border: "none", borderRadius: 4, color: "#f66", fontSize: 11, padding: "2px 6px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8 }}>
                    <input style={{ ...inputStyle, flex: 1 }} placeholder="Paste new image URL..." value={addPhotoInput} onChange={e => setAddPhotoInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && addPhotoInput.trim()) { setEditImg(prev => (prev.trim() ? prev.trim() + "\n" : "") + addPhotoInput.trim()); setAddPhotoInput(""); } }} />
                    <button onClick={() => { if (addPhotoInput.trim()) { setEditImg(prev => (prev.trim() ? prev.trim() + "\n" : "") + addPhotoInput.trim()); setAddPhotoInput(""); } }} style={{ ...btnStyle, padding: "8px 16px", fontSize: 12 }}>Add</button>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Bulk Add — paste multiple URLs (one per line)</label>
                    <textarea rows={4} style={{ ...inputStyle, minHeight: 70, resize: "vertical", marginBottom: 6 }} value={bulkPhotoInput} onChange={e => setBulkPhotoInput(e.target.value)} placeholder="Paste multiple image URLs here, one per line" />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => { const urls = bulkPhotoInput.split("\n").map(s => s.trim()).filter(Boolean); if (urls.length) { setEditImg(prev => { const existing = prev.trim(); return existing ? existing + "\n" + urls.join("\n") : urls.join("\n"); }); setBulkPhotoInput(""); } }} style={{ ...btnStyle, padding: "8px 16px", fontSize: 12 }}>Add All ({bulkPhotoInput.split("\n").filter(s => s.trim()).length})</button>
                      <button onClick={async () => { try { const text = await navigator.clipboard.readText(); if (text.trim()) { setBulkPhotoInput(prev => prev.trim() ? prev.trim() + "\n" + text.trim() : text.trim()); } } catch { /* clipboard denied */ } }} style={{ padding: "8px 16px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Paste from clipboard</button>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Description</label>
                  <textarea style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} value={editDesc} onChange={e => setEditDesc(e.target.value)} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Video Walkthrough URL</label>
                  <input style={inputStyle} value={editVideoUrl} onChange={e => setEditVideoUrl(e.target.value)} placeholder="e.g., https://www.youtube.com/watch?v=ABC123" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 12 }}>
                  <div><label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Sort Order</label><input style={{ ...inputStyle, width: 100 }} type="number" value={editSortOrder} onChange={e => setEditSortOrder(e.target.value)} /></div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "block", marginBottom: 4, fontWeight: 600, textTransform: "uppercase" }}>Availability Status</label>
                  <select style={{ ...inputStyle, width: 220, cursor: "pointer" }} value={editAvailStatus} onChange={e => setEditAvailStatus(e.target.value)}>
                    <option value="Available">Available</option>
                    <option value="Almost Booked">Almost Booked</option>
                    <option value="Waitlist Only">Waitlist Only</option>
                    <option value="Booked">Booked</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: 24, marginBottom: 16, flexWrap: "wrap" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
                    <Toggle checked={!editHidden} onChange={v => setEditHidden(!v)} /> Visible
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
                    <Toggle checked={editTub} onChange={setEditTub} /> Soaking Tub
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
                    <Toggle checked={editStandard} onChange={setEditStandard} /> CareStay Standard
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
                    <Toggle checked={editFeatured} onChange={setEditFeatured} /> <span style={{ color: "#f0c040" }}>Featured</span>
                  </label>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <button onClick={saveEditCustom} style={btnStyle} disabled={saving === "editCustom"}>{saving === "editCustom" ? "Saving..." : "Save Changes"}</button>
                  <button onClick={() => setEditingCustomId(null)} style={{ padding: "10px 20px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
                  {saving === "editCustom" && <span style={{ fontSize: 12, color: "#0fa" }}>Saving...</span>}
                </div>
              </Modal>
            );
          })()}

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
                  <img key={i} src={url.trim()} alt={`Preview ${i + 1}`} style={{ width: 60, height: 42, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)" }} onError={e => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='42'%3E%3Crect fill='%23222' width='60' height='42'/%3E%3Ctext x='50%25' y='50%25' fill='%23f66' font-size='10' text-anchor='middle' dy='.35em'%3EBroken%3C/text%3E%3C/svg%3E"; }} />
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
        </div>}

        {/* ═══ TAB: Reviews ═══ */}
        {activeTab === "reviews" && <div style={cardStyle}>
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
        </div>}
      </div>
    </div>
  );
}
