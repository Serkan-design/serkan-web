import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Trash2, ExternalLink, LogOut, TrendingDown, Package, Activity, AlertCircle, RefreshCcw } from 'lucide-react'

const Dashboard = ({ onLogout }) => {
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({ totalProducts: 0, activeProducts: 0, totalChecks: 0 })
  const [loading, setLoading] = useState(true)
  const [newUrl, setNewUrl] = useState('')
  const [newTarget, setNewTarget] = useState('')
  const [error, setError] = useState('')

  const fetchAll = async () => {
    try {
      const token = localStorage.getItem('token')
      const config = { headers: { Authorization: `Bearer ${token}` } }
      const [prodRes, statsRes] = await Promise.all([
        axios.get('/api/products', config),
        axios.get('/api/stats', config)
      ])
      setProducts(prodRes.data)
      setStats(statsRes.data)
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) onLogout()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/products', { url: newUrl, targetPrice: parseFloat(newTarget) }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setNewUrl('')
      setNewTarget('')
      fetchAll()
    } catch (err) {
      setError(err.response?.data?.message || 'Ürün eklenemedi')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğine emin misin?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchAll()
    } catch (err) {}
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Dashboard <span style={{ color: 'var(--primary)' }}>.</span></h1>
        <button onClick={onLogout} className="glass" style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)' }}>
          <LogOut size={18} /> Çıkış Yap
        </button>
      </header>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem' }}>
        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Package size={24} color="var(--primary)" />
            <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.totalProducts}</span>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Toplam Ürün</p>
        </div>
        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <Activity size={24} color="var(--success)" />
            <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.activeProducts}</span>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Aktif Takipler</p>
        </div>
        <div className="glass" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <RefreshCcw size={24} color="var(--warning)" />
            <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stats.totalChecks}</span>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Toplam Tarama</p>
        </div>
      </div>

      {/* Add Product Form */}
      <div className="glass" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} /> Yeni Takip Başlat
        </h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Ürün Linki (Trendyol, Amazon, HB...)" 
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            style={{ flex: '1', minWidth: '280px' }}
            required
          />
          <input 
            type="number" 
            placeholder="Hedef Fiyat (Opsiyonel)" 
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            style={{ width: '150px' }}
          />
          <button type="submit" style={{ padding: '0.8rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: '600' }}>
            Ekle
          </button>
        </form>
        {error && <p style={{ color: 'var(--danger)', marginTop: '0.5rem', fontSize: '0.85rem' }}>{error}</p>}
      </div>

      {/* Product List */}
      <h3 style={{ marginBottom: '1.2rem' }}>Takip Edilen Ürünler</h3>
      {loading ? <p>Yükleniyor...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
          {products.map(p => (
            <div key={p.id} className="glass animate-in" style={{ padding: '1.2rem', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', textTransform: 'uppercase' }}>
                  {p.site}
                </span>
                <button onClick={() => handleDelete(p.id)} style={{ color: 'var(--danger)', background: 'transparent' }}>
                  <Trash2 size={18} />
                </button>
              </div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.8rem', height: '2.5rem', overflow: 'hidden' }}>{p.name}</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mevcut</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--success)' }}>{p.currentPrice} TL</p>
                </div>
                {p.targetPrice && (
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hedef</p>
                    <p style={{ fontSize: '1rem', fontWeight: '600' }}>{p.targetPrice} TL</p>
                  </div>
                )}
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <a href={p.url} target="_blank" rel="noreferrer" style={{ 
                  flex: '1', textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', 
                  borderRadius: '6px', fontSize: '0.8rem', color: 'white', textDecoration: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}>
                  <ExternalLink size={14} /> Ürüne Git
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard
