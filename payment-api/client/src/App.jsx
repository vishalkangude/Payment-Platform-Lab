import React, { useEffect, useState } from 'react'
import {
  LayoutDashboard, CreditCard, Users, BarChart3, Settings, Activity,
  Plus, Search, CheckCircle2, Clock3, XCircle, RefreshCw
} from 'lucide-react'

function App() {
  const [page, setPage] = useState('Dashboard')
  const [dashboard, setDashboard] = useState(null)
  const [payments, setPayments] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  async function loadData() {
    setLoading(true)
    try {
      const [d, p, c] = await Promise.all([
        fetch('/api/dashboard').then(r => r.json()),
        fetch('/api/payments').then(r => r.json()),
        fetch('/api/customers').then(r => r.json())
      ])
      setDashboard(d)
      setPayments(p)
      setCustomers(c)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  async function createPayment(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: form.get('customer'),
        amount: Number(form.get('amount')),
        method: form.get('method')
      })
    })
    setShowModal(false)
    loadData()
  }

  const nav = [
    ['Dashboard', LayoutDashboard],
    ['Payments', CreditCard],
    ['Customers', Users],
    ['Reports', BarChart3],
    ['Settings', Settings]
  ]

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><div className="brandIcon">P</div><div><b>PayFlow</b><span>Payment Platform</span></div></div>
        <nav>{nav.map(([name, Icon]) =>
          <button className={page === name ? 'active' : ''} onClick={() => setPage(name)} key={name}>
            <Icon size={18}/>{name}
          </button>
        )}</nav>
        <div className="sideStatus"><span className="dot"/>All systems operational</div>
      </aside>

      <main className="main">
        <header>
          <div><div className="eyebrow">PAYMENT OPERATIONS</div><h1>{page}</h1></div>
          <div className="headerActions">
            <button className="iconBtn" onClick={loadData}><RefreshCw size={18}/></button>
            <button className="primary" onClick={() => setShowModal(true)}><Plus size={18}/> New Payment</button>
          </div>
        </header>

        {loading ? <div className="loading">Loading payment platform...</div> :
          page === 'Dashboard' ? <Dashboard dashboard={dashboard} payments={payments} /> :
          page === 'Payments' ? <Payments payments={payments} /> :
          page === 'Customers' ? <Customers customers={customers} /> :
          page === 'Reports' ? <Reports payments={payments} /> :
          <SettingsPage />
        }
      </main>

      {showModal && <div className="modalBack">
        <form className="modal" onSubmit={createPayment}>
          <h2>Create payment</h2>
          <p>Create a new payment transaction in the platform.</p>
          <label>Customer<input name="customer" placeholder="Customer name" required/></label>
          <label>Amount<input name="amount" type="number" min="1" placeholder="Amount" required/></label>
          <label>Method<select name="method"><option>Card</option><option>UPI</option><option>Bank Transfer</option></select></label>
          <div className="modalActions">
            <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="primary">Create Payment</button>
          </div>
        </form>
      </div>}
    </div>
  )
}

function Dashboard({dashboard, payments}) {
  const cards = [
    ['Total volume', `₹${dashboard.totalVolume.toLocaleString()}`, 'This month'],
    ['Successful', dashboard.successful, 'Transactions'],
    ['Pending', dashboard.pending, 'Awaiting action'],
    ['Success rate', `${dashboard.successRate}%`, 'Current period']
  ]
  return <section>
    <div className="cards">{cards.map(([a,b,c]) =>
      <div className="card" key={a}><span>{a}</span><strong>{b}</strong><small>{c}</small></div>
    )}</div>
    <div className="grid2">
      <div className="panel">
        <div className="panelHead"><h2>Recent transactions</h2><span>Live</span></div>
        <table><thead><tr><th>Payment</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead><tbody>
          {payments.slice(0,6).map(p =>
            <tr key={p.id}><td>{p.id}</td><td>{p.customer}</td><td>₹{p.amount.toLocaleString()}</td><td><Status status={p.status}/></td></tr>
          )}
        </tbody></table>
      </div>
      <div className="panel">
        <div className="panelHead"><h2>System health</h2><Activity size={18}/></div>
        <Health name="Payment API" value="Healthy"/>
        <Health name="Database" value="Healthy"/>
        <Health name="Application" value="Healthy"/>
        <Health name="Platform" value="Healthy"/>
      </div>
    </div>
  </section>
}

function Payments({payments}) {
  return <section><div className="panel">
    <div className="panelHead"><h2>All payments</h2><div className="search"><Search size={16}/> Search</div></div>
    <table><thead><tr><th>ID</th><th>Customer</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th></tr></thead><tbody>
      {payments.map(p =>
        <tr key={p.id}><td>{p.id}</td><td>{p.customer}</td><td>₹{p.amount.toLocaleString()}</td><td>{p.method}</td><td><Status status={p.status}/></td><td>{p.date}</td></tr>
      )}
    </tbody></table>
  </div></section>
}

function Customers({customers}) {
  return <section><div className="panel">
    <div className="panelHead"><h2>Customers</h2></div>
    <table><thead><tr><th>Customer</th><th>Email</th><th>Transactions</th><th>Total spend</th></tr></thead><tbody>
      {customers.map(c =>
        <tr key={c.id}><td>{c.name}</td><td>{c.email}</td><td>{c.transactions}</td><td>₹{c.totalSpend.toLocaleString()}</td></tr>
      )}
    </tbody></table>
  </div></section>
}

function Reports({payments}) {
  const total = payments.reduce((s,p) => s+p.amount, 0)
  return <section>
    <div className="cards">
      <div className="card"><span>Transaction count</span><strong>{payments.length}</strong><small>All loaded transactions</small></div>
      <div className="card"><span>Total processed</span><strong>₹{total.toLocaleString()}</strong><small>Sample environment</small></div>
    </div>
    <div className="panel"><h2>Operational report</h2><p className="muted">This can later connect to Azure Monitor and Application Insights telemetry.</p></div>
  </section>
}

function SettingsPage() {
  return <section><div className="panel settings">
    <h2>Platform settings</h2>
    <div><b>Environment</b><span>Development</span></div>
    <div><b>Architecture</b><span>Single application port</span></div>
    <div><b>Deployment</b><span>Docker → ACR → AKS</span></div>
    <div><b>Monitoring</b><span>Azure Monitor + Application Insights</span></div>
  </div></section>
}

function Status({status}) {
  const Icon = status === 'Successful' ? CheckCircle2 : status === 'Pending' ? Clock3 : XCircle
  return <span className={`status ${status.toLowerCase()}`}><Icon size={14}/>{status}</span>
}

function Health({name,value}) {
  return <div className="health"><span><i className="dot"/>{name}</span><b>{value}</b></div>
}

export default App