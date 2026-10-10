import { useEffect, useMemo, useState } from "react";
import { Search, Plus, TrendingUp, Building2, Wallet, X, Pencil, Trash2, ExternalLink, ArrowUpRight } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
const emptyForm = { name: "", industry: "", description: "", fundingGoal: "", amountRaised: "0", founder: "", website: "" };

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function App() {
  const [startups, setStartups] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadStartups(query = search) {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API}/startups?search=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Could not load startups. Is the backend running?");
      setStartups(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadStartups(""); }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadStartups(search), 250);
    return () => clearTimeout(timer);
  }, [search]);

  const stats = useMemo(() => ({
    count: startups.length,
    goal: startups.reduce((sum, item) => sum + Number(item.fundingGoal || 0), 0),
    raised: startups.reduce((sum, item) => sum + Number(item.amountRaised || 0), 0)
  }), [startups]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(startup) {
    setEditingId(startup._id);
    setForm({
      name: startup.name || "",
      industry: startup.industry || "",
      description: startup.description || "",
      fundingGoal: String(startup.fundingGoal ?? ""),
      amountRaised: String(startup.amountRaised ?? 0),
      founder: startup.founder || "",
      website: startup.website || ""
    });
    setModalOpen(true);
  }

  function updateField(event) {
    setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submitForm(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        fundingGoal: Number(form.fundingGoal),
        amountRaised: Number(form.amountRaised || 0)
      };
      const response = await fetch(
        `${API}/startups${editingId ? `/${editingId}` : ""}`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to save startup.");
      setModalOpen(false);
      await loadStartups();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteStartup(id) {
    if (!window.confirm("Delete this startup listing?")) return;
    try {
      const response = await fetch(`${API}/startups/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to delete startup.");
      await loadStartups();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="VentureBoard home">
          <span className="brand-mark"><TrendingUp size={21}/></span>
          <span>venture<span className="brand-light">board</span></span>
        </a>
        <nav><a className="nav-active" href="#startups">Explore startups</a><a href="#about">About</a></nav>
        <button className="primary-button top-cta" onClick={openCreate}><Plus size={17}/> List your startup</button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="pulse"></span> THE NEXT BIG THING STARTS HERE</div>
            <h1>Great ideas deserve<br/><span>great investors.</span></h1>
            <p>Discover ambitious startups, explore their vision, and see what they're building next.</p>
            <a className="hero-link" href="#startups">Explore opportunities <ArrowUpRight size={17}/></a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
            <div className="art-card card-back"><span>PORTFOLIO GROWTH</span><strong>+28.4%</strong><div className="mini-bars"><i/><i/><i/><i/><i/><i/><i/><i/></div></div>
            <div className="art-card card-front"><span className="art-icon"><Building2 size={19}/></span><span>STARTUP SPOTLIGHT</span><strong>Ideas into impact.</strong><div className="art-line"></div><small>Discover what's possible.</small></div>
            <div className="floating-dot dot-one"></div><div className="floating-dot dot-two"></div>
          </div>
        </section>

        <section className="stats-grid" aria-label="Startup summary">
          <div className="stat-card"><span className="stat-icon violet"><Building2 size={19}/></span><div><span className="stat-label">STARTUPS FOUND</span><strong>{stats.count}</strong><small>Matching your search</small></div></div>
          <div className="stat-card"><span className="stat-icon green"><Wallet size={19}/></span><div><span className="stat-label">TOTAL FUNDING GOALS</span><strong>{money(stats.goal)}</strong><small>Across listed startups</small></div></div>
          <div className="stat-card"><span className="stat-icon orange"><TrendingUp size={19}/></span><div><span className="stat-label">TOTAL AMOUNT RAISED</span><strong>{money(stats.raised)}</strong><small>Reported by startups</small></div></div>
        </section>

        <section id="startups" className="listings-section">
          <div className="section-heading">
            <div><div className="eyebrow dark-eyebrow">DISCOVER & INVEST</div><h2>Explore startups</h2><p>Find companies building the future.</p></div>
            <button className="primary-button" onClick={openCreate}><Plus size={17}/> Add startup</button>
          </div>
          <label className="search-box"><Search size={19}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search startups or industries..." aria-label="Search startups or industries"/>{search && <button className="clear-search" onClick={() => setSearch("")} aria-label="Clear search"><X size={16}/></button>}</label>
          {error && <div className="error-banner" role="alert">{error}</div>}
          {loading ? <div className="empty-state">Loading startup listings...</div> : startups.length === 0 ? (
            <div className="empty-state"><span className="empty-icon"><Building2 size={24}/></span><h3>{search ? "No matching startups" : "Your startup directory starts here"}</h3><p>{search ? "Try a different name or industry." : "Add a startup to see it appear in the directory."}</p>{!search && <button className="primary-button" onClick={openCreate}><Plus size={17}/> Add the first startup</button>}</div>
          ) : (
            <div className="startup-grid">
              {startups.map(startup => {
                const progress = Math.min(100, Math.round((Number(startup.amountRaised) / Math.max(1, Number(startup.fundingGoal))) * 100));
                return <article className="startup-card" key={startup._id}>
                  <div className="startup-card-top"><span className="company-avatar">{startup.name.trim().charAt(0).toUpperCase()}</span><span className="industry-tag">{startup.industry}</span></div>
                  <h3>{startup.name}</h3><p className="founder">Founded by {startup.founder || "Not specified"}</p>
                  <p className="description">{startup.description}</p>
                  <div className="funding-labels"><span>Funding progress</span><strong>{progress}%</strong></div>
                  <div className="progress-track"><span style={{width: `${progress}%`}}/></div>
                  <div className="funding-numbers"><div><strong>{money(startup.amountRaised)}</strong><span>raised</span></div><div className="goal-number"><strong>{money(startup.fundingGoal)}</strong><span>funding goal</span></div></div>
                  <div className="card-actions">
                    {startup.website && <a href={startup.website} target="_blank" rel="noreferrer" className="website-link">Website <ExternalLink size={14}/></a>}
                    <span className="action-spacer"></span>
                    <button onClick={() => openEdit(startup)} className="icon-button" aria-label={`Edit ${startup.name}`} title="Edit"><Pencil size={16}/></button>
                    <button onClick={() => deleteStartup(startup._id)} className="icon-button danger" aria-label={`Delete ${startup.name}`} title="Delete"><Trash2 size={16}/></button>
                  </div>
                </article>;
              })}
            </div>
          )}
        </section>
        <section id="about" className="about-strip"><div><span className="eyebrow">BUILT FOR BOLD IDEAS</span><h2>Every big company started somewhere.</h2><p>A simple place to share a vision, track funding goals, and discover emerging businesses.</p></div><button className="secondary-button" onClick={openCreate}>List your startup <ArrowUpRight size={17}/></button></section>
      </main>

      <footer><a className="brand footer-brand" href="#"><span className="brand-mark"><TrendingUp size={18}/></span><span>venture<span className="brand-light">board</span></span></a><span>Built to help ambitious ideas get noticed.</span><span>Student portfolio project · 2026</span></footer>

      {modalOpen && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
        <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-header"><div><span className="eyebrow dark-eyebrow">{editingId ? "UPDATE LISTING" : "SHARE YOUR VISION"}</span><h2 id="modal-title">{editingId ? "Edit startup" : "Add a startup"}</h2></div><button className="icon-button" onClick={() => setModalOpen(false)} aria-label="Close dialog"><X size={19}/></button></div>
          <form onSubmit={submitForm} className="startup-form">
            <label>Startup name *<input name="name" required maxLength="100" value={form.name} onChange={updateField} placeholder="e.g. GreenFuture"/></label>
            <label>Industry *<input name="industry" required maxLength="80" value={form.industry} onChange={updateField} placeholder="e.g. Clean Energy"/></label>
            <label className="full-field">Description *<textarea name="description" required maxLength="1200" rows="3" value={form.description} onChange={updateField} placeholder="What problem does your startup solve?"/></label>
            <label>Funding goal (₹) *<input name="fundingGoal" type="number" required min="1" value={form.fundingGoal} onChange={updateField} placeholder="5000000"/></label>
            <label>Amount raised (₹)<input name="amountRaised" type="number" min="0" value={form.amountRaised} onChange={updateField} placeholder="0"/></label>
            <label>Founder name<input name="founder" maxLength="100" value={form.founder} onChange={updateField} placeholder="Founder name"/></label>
            <label>Website URL<input name="website" type="url" value={form.website} onChange={updateField} placeholder="https://example.com"/></label>
            <div className="form-footer"><span>* Required fields</span><button className="primary-button" type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Save changes" : "Create listing"}</button></div>
          </form>
        </section>
      </div>}
    </div>
  );
}

export default App;
