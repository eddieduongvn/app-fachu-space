import { useEffect, useMemo, useState } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import './App.css'

const allNavItems = [
  { path: '/', label: 'Dashboard', hint: 'Overview', icon: '◫', roles: ['CEO', 'PM', 'Sales', 'HR'] },
  { path: '/projects', label: 'Projects', hint: 'Portfolio', icon: '▣', roles: ['CEO', 'PM'] },
  { path: '/tasks', label: 'Tasks', hint: 'Execution', icon: '✓', roles: ['CEO', 'PM'] },
  { path: '/crm', label: 'CRM', hint: 'Pipeline', icon: '◎', roles: ['CEO', 'Sales'] },
  { path: '/team', label: 'Team', hint: 'People', icon: '◌', roles: ['CEO', 'HR'] },
  { path: '/finance', label: 'Finance', hint: 'Cashflow', icon: '◈', roles: ['CEO'] },
  { path: '/orders', label: 'Orders', hint: 'Operations', icon: '▤', roles: ['CEO', 'PM', 'Sales'] },
  { path: '/procurement', label: 'Procurement', hint: 'Suppliers', icon: '◭', roles: ['CEO', 'PM'] },
  { path: '/leave', label: 'HR Leave', hint: 'People ops', icon: '☰', roles: ['CEO', 'HR'] },
]

const initialData = {
  summary: {
    eyebrow: 'Executive summary',
    title: 'Strong momentum with healthy revenue growth and manageable delivery risk.',
    description:
      'Revenue is trending above plan, pipeline remains solid, and only two programs need immediate executive attention this week.',
    heroTags: ['Revenue +12.4%', '18 live projects', '14 overdue tasks'],
    quickStats: [
      { label: 'Cash runway', value: '14.2 mo' },
      { label: 'Gross margin', value: '28.6%' },
      { label: 'Pipeline coverage', value: '3.4x' },
    ],
    metrics: [
      { label: 'Monthly Revenue', value: '$284,000', delta: '+12.4%', note: 'vs last month' },
      { label: 'Active Projects', value: '18', delta: '+3', note: 'across product and delivery' },
      { label: 'Overdue Tasks', value: '14', delta: '-6', note: 'recovered from last week peak' },
      { label: 'Team Performance', value: '89%', delta: '+4.1%', note: 'delivery efficiency score' },
    ],
  },
  monthlyRevenue: [
    { month: 'Jan', revenue: 148, target: 132 },
    { month: 'Feb', revenue: 162, target: 140 },
    { month: 'Mar', revenue: 157, target: 146 },
    { month: 'Apr', revenue: 184, target: 158 },
    { month: 'May', revenue: 192, target: 168 },
    { month: 'Jun', revenue: 208, target: 176 },
    { month: 'Jul', revenue: 226, target: 184 },
  ],
  performanceTrend: [
    { team: 'Delivery', score: 92 },
    { team: 'Product', score: 86 },
    { team: 'Sales', score: 89 },
    { team: 'Operations', score: 84 },
  ],
  workloadSplit: [
    { name: 'Healthy', value: 62, color: '#2563eb' },
    { name: 'Busy', value: 26, color: '#8b5cf6' },
    { name: 'Overloaded', value: 12, color: '#f97316' },
  ],
  projects: [
    {
      id: 1,
      name: 'Meta Growth Summit Launch',
      status: 'On Track',
      owner: 'Linh Tran',
      deadline: 'Apr 26, 2026',
      progress: 78,
      budget: '$84,000',
      priority: 'High',
      summary: 'Regional event launch with partner enablement and analytics handoff.',
    },
    {
      id: 2,
      name: 'Retail BI Revamp',
      status: 'At Risk',
      owner: 'Minh Pham',
      deadline: 'May 03, 2026',
      progress: 61,
      budget: '$112,000',
      priority: 'High',
      summary: 'Modernize retail reporting stack with margin visibility across stores.',
    },
    {
      id: 3,
      name: 'CRM Migration Phase 2',
      status: 'Planning',
      owner: 'An Vo',
      deadline: 'May 15, 2026',
      progress: 34,
      budget: '$58,000',
      priority: 'Medium',
      summary: 'Second wave migration with automation, lead scoring and training rollout.',
    },
    {
      id: 4,
      name: 'B2B Client Portal',
      status: 'On Track',
      owner: 'Duc Nguyen',
      deadline: 'Apr 30, 2026',
      progress: 84,
      budget: '$96,000',
      priority: 'Medium',
      summary: 'Customer portal for onboarding, billing and implementation tracking.',
    },
  ],
  tasks: {
    'To do': [
      { id: 1, title: 'Draft Q2 board report', meta: 'CEO office · Due tomorrow' },
      { id: 2, title: 'Finalize enterprise pricing deck', meta: 'Sales ops · 3 reviewers' },
    ],
    Doing: [
      { id: 3, title: 'Prepare summit partner assets', meta: 'Marketing · 78% done' },
      { id: 4, title: 'Build cash flow forecast v2', meta: 'Finance · In validation' },
    ],
    Review: [{ id: 5, title: 'Approve roadmap slides', meta: 'Product council · Waiting sign-off' }],
    Done: [{ id: 6, title: 'Launch executive KPI hub', meta: 'Data team · Published' }],
  },
  deals: [
    { id: 1, company: 'Amazon US Store', value: 120000, stage: 'Proposal', owner: 'Trang Hoang', close: 'Apr 28' },
    { id: 2, company: 'TikTok Shop EU', value: 82000, stage: 'Negotiation', owner: 'Khanh Bui', close: 'Apr 19' },
    { id: 3, company: 'Walmart Marketplace', value: 156000, stage: 'Discovery', owner: 'Phuong Dao', close: 'May 09' },
  ],
  team: [
    { id: 1, name: 'Linh Tran', role: 'Project Director', workload: 72, focus: '3 active programs', utilization: 'Healthy' },
    { id: 2, name: 'Minh Pham', role: 'Operations Manager', workload: 88, focus: 'Risk recovery', utilization: 'Busy' },
    { id: 3, name: 'An Vo', role: 'CRM Lead', workload: 64, focus: 'Migration + training', utilization: 'Healthy' },
    { id: 4, name: 'Trang Hoang', role: 'Account Executive', workload: 91, focus: 'Late-stage deals', utilization: 'Overloaded' },
  ],
  finance: {
    cashIn: '$428,000',
    cashOut: '$291,000',
    runway: '14.2 months',
    burn: '$46,000 / month',
    invoices: [
      { id: 1, client: 'Amazon US Store', amount: '$48,000', status: 'Pending', due: 'Apr 20' },
      { id: 2, client: 'TikTok Shop EU', amount: '$31,500', status: 'Paid', due: 'Apr 12' },
      { id: 3, client: 'Shopify DTC Brand', amount: '$22,000', status: 'Overdue', due: 'Apr 08' },
    ],
  },
  orders: [
    { id: 1, code: 'SO-2401', customer: 'Amazon US Store', amount: '$64,000', status: 'Processing' },
    { id: 2, code: 'SO-2402', customer: 'Walmart Marketplace', amount: '$41,500', status: 'Ready to ship' },
  ],
  procurement: [
    { id: 1, vendor: 'BluePeak Media', category: 'Marketing', amount: '$8,400', status: 'Approved' },
    { id: 2, vendor: 'CloudStack', category: 'Infrastructure', amount: '$12,800', status: 'Pending' },
  ],
  leave: [
    { id: 1, employee: 'An Vo', type: 'Annual leave', days: 2, status: 'Approved' },
    { id: 2, employee: 'Minh Pham', type: 'WFH request', days: 1, status: 'Pending' },
  ],
}

const STORAGE_KEY = 'nexa-ops-demo-data'
const roleProfiles = {
  CEO: { banner: 'Global executive command view', summary: 'Worldwide sales, operations and finance visibility', notifications: [{ id: 1, text: 'Board report due in 2h', read: false }, { id: 2, text: 'One invoice overdue', read: false }, { id: 3, text: '2 projects need attention', read: true }] },
  PM: { banner: 'Marketplace operations view', summary: 'Order execution, supplier flow and delivery focus', notifications: [{ id: 4, text: 'Sprint review at 3 PM', read: false }, { id: 5, text: '1 project at risk', read: false }, { id: 6, text: 'Vendor request pending', read: true }] },
  Sales: { banner: 'Global sales command view', summary: 'Cross-border orders, clients and marketplace revenue', notifications: [{ id: 7, text: '2 deals in negotiation', read: false }, { id: 8, text: 'Follow up Amazon US Store today', read: true }, { id: 9, text: '1 order ready to ship', read: false }] },
  HR: { banner: 'People and fulfillment workforce view', summary: 'Staffing, leave and fulfillment staffing control', notifications: [{ id: 10, text: '2 leave requests pending', read: false }, { id: 11, text: 'Workload exceeds threshold', read: false }, { id: 12, text: 'New hiring note to review', read: true }] },
}

const currency = (value) => `$${Number(value || 0).toLocaleString()}`

function LoginPage({ onLogin }) {
  return (
    <div className="login-shell">
      <div className="login-card panel">
        <div className="brand-mark">NX</div>
        <p className="eyebrow">FACHU ECOM</p>
        <h2>FACHU Command Control Center</h2>
        <p className="login-copy">Đăng nhập vào workspace điều hành doanh nghiệp, dự án, CRM và hiệu suất đội ngũ.</p>
        <div className="login-form">
          <input defaultValue="ceo@fachu-ecom.com" placeholder="Email" />
          <input defaultValue="demo-password" type="password" placeholder="Password" />
          <button className="primary login-button" onClick={onLogin}>Đăng nhập bản demo</button>
        </div>
      </div>
    </div>
  )
}

function Modal({ open, title, children, onClose }) {
  if (!open) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="icon-button" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)} />
    </label>
  )
}

function TextAreaField({ label, value, onChange }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

function SummaryCard({ data }) {
  return (
    <div className="hero-card panel">
      <div className="hero-copy">
        <p className="eyebrow">{data.summary.eyebrow}</p>
        <h3>{data.summary.title}</h3>
        <p>{data.summary.description}</p>
        <div className="hero-tags">
          {data.summary.heroTags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
      <div className="hero-side">
        {data.summary.quickStats.map((stat) => (
          <div key={stat.label} className="mini-stat">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}

function DashboardPage({ data, activeRole }) {
  return (
    <>
      <section className="section hero-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h3>{roleProfiles[activeRole].banner}</h3>
            <p className="role-summary">{roleProfiles[activeRole].summary}</p>
          </div>
        </div>
        <SummaryCard data={data} />
        <div className="module-tabs">
          <div className="module-tab active">Executive</div>
          <div className="module-tab">Operations</div>
          <div className="module-tab">Revenue</div>
        </div>
        <div className="metrics-grid">
          {data.summary.metrics.map((metric) => (
            <article key={metric.label} className="metric-card">
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <div className="metric-meta">
                <em>{metric.delta}</em>
                <p>{metric.note}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="dashboard-grid">
          <article className="panel chart-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Revenue trend</p>
                <h3>Monthly revenue momentum</h3>
              </div>
            </div>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data.monthlyRevenue}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.18)" />
                  <XAxis dataKey="month" stroke="var(--muted)" />
                  <YAxis stroke="var(--muted)" />
                  <Tooltip />
                  <Area type="monotone" dataKey="target" stroke="#94a3b8" fill="transparent" />
                  <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="url(#revenueFill)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="panel chart-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Team performance</p>
                <h3>Operational quality snapshot</h3>
              </div>
            </div>
            <div className="chart-wrap small-chart">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data.performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.18)" />
                  <XAxis dataKey="team" stroke="var(--muted)" />
                  <YAxis stroke="var(--muted)" domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" radius={[12, 12, 0, 0]} fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}

function ProjectsPage({ projects, onOpenProject, onEditProject, onCreateProject, onDeleteProject }) {
  const [statusFilter, setStatusFilter] = useState('All')
  const [query, setQuery] = useState('')
  const filteredProjects = useMemo(() => projects.filter((project) => {
    const matchesStatus = statusFilter === 'All' || project.status === statusFilter
    const matchesQuery = project.name.toLowerCase().includes(query.toLowerCase()) || project.owner.toLowerCase().includes(query.toLowerCase())
    return matchesStatus && matchesQuery
  }), [projects, query, statusFilter])

  return (
    <section className="section">
      <div className="section-heading filters-row">
        <div>
          <p className="eyebrow">Projects</p>
          <h3>Project portfolio</h3>
        </div>
        <div className="filters">
          <button className="primary small-button" onClick={onCreateProject}>+ New project</button>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search project or owner" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All</option>
            <option>On Track</option>
            <option>At Risk</option>
            <option>Planning</option>
          </select>
        </div>
      </div>
      <div className="table-panel panel">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Status</th>
              <th>Owner</th>
              <th>Deadline</th>
              <th>Budget</th>
              <th>Progress</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id}>
                <td>
                  <div className="table-title">
                    <strong>{project.name}</strong>
                    <p>{project.summary}</p>
                  </div>
                </td>
                <td><span className={`status ${project.status.toLowerCase().replace(/\s/g, '-')}`}>{project.status}</span></td>
                <td>{project.owner}</td>
                <td>{project.deadline}</td>
                <td>{project.budget}</td>
                <td>
                  <div className="progress-cell">
                    <div className="progress-bar"><div style={{ width: `${project.progress}%` }} /></div>
                    <span>{project.progress}%</span>
                  </div>
                </td>
                <td><div className="row-actions"><button className="link-button" onClick={() => onOpenProject(project)}>Details</button><button className="ghost-button small-button" onClick={() => onEditProject(project)}>Edit</button><button className="ghost-button small-button danger" onClick={() => onDeleteProject(project.id)}>Delete</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function TasksPage({ tasks, onEditTask, onCreateTask, onDeleteTask }) {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Tasks</p>
          <h3>Execution board</h3>
        </div>
      </div>
      <div className="kanban-grid">
        {Object.entries(tasks).map(([column, items]) => (
          <article key={column} className="panel kanban-column">
            <div className="kanban-header">
              <h4>{column}</h4>
              <div className="row-actions"><span>{items.length}</span><button className="ghost-button small-button" onClick={() => onCreateTask(column)}>+ Add</button></div>
            </div>
            <div className="kanban-items">
              {items.map((item) => (
                <div key={item.id} className="task-card erp-card">
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.meta}</p>
                  </div>
                  <div className="row-actions"><button className="ghost-button small-button" onClick={() => onEditTask(column, item)}>Edit</button><button className="ghost-button small-button danger" onClick={() => onDeleteTask(column, item.id)}>Delete</button></div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function CrmPage({ deals, onEditDeal, onCreateDeal, onDeleteDeal }) {
  return (
    <section className="section two-column">
      <article className="panel">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">CRM</p>
            <h3>Pipeline overview</h3>
          </div>
          <button className="primary small-button" onClick={onCreateDeal}>+ New deal</button>
        </div>
        <div className="table-panel compact-table">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Deal value</th>
                <th>Stage</th>
                <th>Owner</th>
                <th>Close</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {deals.map((deal) => (
                <tr key={deal.id}>
                  <td>{deal.company}</td>
                  <td>{currency(deal.value)}</td>
                  <td>{deal.stage}</td>
                  <td>{deal.owner}</td>
                  <td>{deal.close}</td>
                  <td><div className="row-actions"><button className="ghost-button small-button" onClick={() => onEditDeal(deal)}>Edit</button><button className="ghost-button small-button danger" onClick={() => onDeleteDeal(deal.id)}>Delete</button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <article className="panel chart-panel">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Deal size</p>
            <h3>Pipeline value distribution</h3>
          </div>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={deals} layout="vertical" margin={{ left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148,163,184,0.18)" />
              <XAxis type="number" stroke="var(--muted)" />
              <YAxis dataKey="company" type="category" width={110} stroke="var(--muted)" />
              <Tooltip formatter={(value) => currency(value)} />
              <Bar dataKey="value" radius={[0, 10, 10, 0]} fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  )
}

function TeamPage({ team, onEditMember, onCreateMember, onDeleteMember }) {
  return (
    <section className="section two-column">
      <article className="panel">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Team</p>
            <h3>Current workload</h3>
          </div>
          <button className="primary small-button" onClick={onCreateMember}>+ Add member</button>
        </div>
        <div className="team-list">
          {team.map((member) => (
            <div key={member.id} className="team-card erp-card">
              <div className="team-head">
                <div>
                  <strong>{member.name}</strong>
                  <span>{member.role}</span>
                </div>
                <div className="row-actions"><button className="ghost-button small-button" onClick={() => onEditMember(member)}>Edit</button><button className="ghost-button small-button danger" onClick={() => onDeleteMember(member.id)}>Delete</button></div>
              </div>
              <div className="progress-bar slim"><div style={{ width: `${member.workload}%` }} /></div>
              <div className="team-footer">
                <p>{member.focus}</p>
                <span className={`util-badge ${member.utilization.toLowerCase()}`}>{member.utilization}</span>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="panel chart-panel">
        <div className="section-heading compact">
          <div>
            <p className="eyebrow">Workload chart</p>
            <h3>Allocation by team member</h3>
          </div>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={team}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.18)" />
              <XAxis dataKey="name" stroke="var(--muted)" interval={0} angle={-18} textAnchor="end" height={70} />
              <YAxis stroke="var(--muted)" domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="workload" radius={[10, 10, 0, 0]} fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  )
}


function FinancePage({ finance }) {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Finance</p>
          <h3>Cashflow and invoice control</h3>
        </div>
      </div>
      <div className="metrics-grid">
        <article className="metric-card"><span>Cash In</span><strong>{finance.cashIn}</strong></article>
        <article className="metric-card"><span>Cash Out</span><strong>{finance.cashOut}</strong></article>
        <article className="metric-card"><span>Runway</span><strong>{finance.runway}</strong></article>
        <article className="metric-card"><span>Burn Rate</span><strong>{finance.burn}</strong></article>
      </div>
      <div className="table-panel panel">
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody>
            {finance.invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.client}</td>
                <td>{invoice.amount}</td>
                <td>{invoice.status}</td>
                <td>{invoice.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}


function OrdersPage({ orders }) {
  return (
    <section className="section">
      <div className="section-heading"><div><p className="eyebrow">Orders</p><h3>Sales order tracking</h3></div></div>
      <div className="table-panel panel"><table><thead><tr><th>Code</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td>{order.code}</td><td>{order.customer}</td><td>{order.amount}</td><td>{order.status}</td></tr>)}</tbody></table></div>
    </section>
  )
}

function ProcurementPage({ procurement }) {
  return (
    <section className="section">
      <div className="section-heading"><div><p className="eyebrow">Procurement</p><h3>Supplier and spend requests</h3></div></div>
      <div className="table-panel panel"><table><thead><tr><th>Vendor</th><th>Category</th><th>Amount</th><th>Status</th></tr></thead><tbody>{procurement.map((item) => <tr key={item.id}><td>{item.vendor}</td><td>{item.category}</td><td>{item.amount}</td><td>{item.status}</td></tr>)}</tbody></table></div>
    </section>
  )
}

function LeavePage({ leave }) {
  return (
    <section className="section">
      <div className="section-heading"><div><p className="eyebrow">HR Leave</p><h3>Leave and people operations</h3></div></div>
      <div className="table-panel panel"><table><thead><tr><th>Employee</th><th>Type</th><th>Days</th><th>Status</th></tr></thead><tbody>{leave.map((item) => <tr key={item.id}><td>{item.employee}</td><td>{item.type}</td><td>{item.days}</td><td>{item.status}</td></tr>)}</tbody></table></div>
    </section>
  )
}

function NotificationsPanel({ notifications, onToggleRead, onOpenMini, onMarkAllRead, onClearRead, unreadOnly, setUnreadOnly }) {
  return (
    <div className="activity-panel">
      <div className="section-heading compact">
        <div>
          <p className="eyebrow">Notifications</p>
        </div>
        <div className="row-actions">
          <button className="ghost-button small-button" onClick={() => setUnreadOnly((prev) => !prev)}>{unreadOnly ? 'Show all' : 'Unread only'}</button>
          <button className="ghost-button small-button" onClick={onMarkAllRead}>Mark all read</button>
          <button className="ghost-button small-button" onClick={onClearRead}>Clear read</button>
          <button className="ghost-button small-button" onClick={onOpenMini}>Mini view</button>
        </div>
      </div>
      <div className="activity-list">
        {notifications.map((item) => (
          <button key={item.id} className={`activity-item notif-item ${item.read ? 'read' : 'unread'}`} onClick={() => onToggleRead(item.id)}>
            <span>{item.text}</span>
            <strong>{item.read ? 'Read' : 'Unread'}</strong>
          </button>
        ))}
      </div>
    </div>
  )
}

function CalendarPanel() {
  return (
    <div className="activity-panel">
      <p className="eyebrow">Calendar</p>
      <div className="activity-list">
        <div className="activity-item">09:00 · Weekly leadership standup</div>
        <div className="activity-item">13:30 · Client review with Nova Retail</div>
        <div className="activity-item">16:00 · Finance cashflow sync</div>
      </div>
    </div>
  )
}

function ApprovalsPanel({ activeRole }) {
  const approvals = {
    CEO: ['Approve procurement request #PR-203', 'Approve budget exception for Retail BI'],
    PM: ['Approve sprint scope change', 'Approve vendor timeline extension'],
    Sales: ['Approve discount for Nova Retail', 'Approve revised quote for Walmart Marketplace'],
    HR: ['Approve leave request for An Vo', 'Approve hiring request for analyst role'],
  }

  return (
    <div className="activity-panel">
      <p className="eyebrow">Approvals</p>
      <div className="activity-list">
        {approvals[activeRole].map((item, index) => (
          <div key={`${item}-${index}`} className="activity-item">{item}</div>
        ))}
      </div>
    </div>
  )
}

function App() {
  const [loggedIn, setLoggedIn] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [taskEditor, setTaskEditor] = useState(null)
  const [memberEditor, setMemberEditor] = useState(null)
  const [projectEditor, setProjectEditor] = useState(null)
  const [dealEditor, setDealEditor] = useState(null)
  const [dashboardEditor, setDashboardEditor] = useState(false)
  const [toast, setToast] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(true)
  const [miniNotifOpen, setMiniNotifOpen] = useState(false)
  const [notificationsByRole, setNotificationsByRole] = useState(() => ({
    CEO: roleProfiles.CEO.notifications,
    PM: roleProfiles.PM.notifications,
    Sales: roleProfiles.Sales.notifications,
    HR: roleProfiles.HR.notifications,
  }))
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [activeRole, setActiveRole] = useState('CEO')
  const navItems = allNavItems.filter((item) => item.roles.includes(activeRole))
  const [activityLog, setActivityLog] = useState([
    'CEO viewed project portfolio',
    'Sales updated a late-stage deal',
    'HR adjusted workload for team',
  ])
  const [data, setData] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : initialData
    } catch {
      return initialData
    }
  })

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const resetData = () => {
    setData(initialData)
    window.localStorage.removeItem(STORAGE_KEY)
    notify('Đã reset dữ liệu mẫu')
  }

  const exportData = () => downloadJson('nexa-ops-data.json', data)
  const importData = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      setData(JSON.parse(text))
    } catch {
      alert('JSON không hợp lệ, sếp kiểm tra lại file nhé.')
    } finally {
      event.target.value = ''
    }
  }

  const notify = (message) => {
    setToast(message)
    setActivityLog((prev) => [message, ...prev].slice(0, 8))
    window.clearTimeout(window.__nexaToastTimer)
    window.__nexaToastTimer = window.setTimeout(() => setToast(''), 2200)
  }

  const saveTask = () => {
    setData((draft) => ({
      ...draft,
      tasks: {
        ...draft.tasks,
        [taskEditor.column]: draft.tasks[taskEditor.column].some((task) => task.id === taskEditor.item.id)
          ? draft.tasks[taskEditor.column].map((task) => (task.id === taskEditor.item.id ? taskEditor.item : task))
          : [...draft.tasks[taskEditor.column], taskEditor.item],
      },
    }))
    setTaskEditor(null)
    notify('Đã lưu task')
  }

  const saveMember = () => {
    setData((draft) => ({
      ...draft,
      team: draft.team.some((member) => member.id === memberEditor.id)
        ? draft.team.map((member) => (member.id === memberEditor.id ? memberEditor : member))
        : [...draft.team, memberEditor],
    }))
    setMemberEditor(null)
    notify('Đã lưu nhân sự')
  }

  const saveProject = () => {
    setData((draft) => ({
      ...draft,
      projects: draft.projects.some((project) => project.id === projectEditor.id)
        ? draft.projects.map((project) => (project.id === projectEditor.id ? projectEditor : project))
        : [...draft.projects, projectEditor],
    }))
    setProjectEditor(null)
    notify('Đã lưu project')
  }

  const saveDeal = () => {
    setData((draft) => ({
      ...draft,
      deals: draft.deals.some((deal) => deal.id === dealEditor.id)
        ? draft.deals.map((deal) => (deal.id === dealEditor.id ? dealEditor : deal))
        : [...draft.deals, dealEditor],
    }))
    setDealEditor(null)
    notify('Đã lưu deal CRM')
  }

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />

  return (
    <div className={`app-shell ${darkMode ? 'theme-dark' : ''}`}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <div>
            <div className="brand-mark">NX</div>
            <div className="brand-copy">
              <h1>FACHU Command</h1>
              <p>Global e-commerce operations ERP</p>
            </div>
          </div>
          <div className="workspace-switcher">
            <span>Workspace</span>
            <strong>FACHU ECOM</strong>
            <select value={activeRole} onChange={(e) => setActiveRole(e.target.value)} className="role-switcher">
              <option>CEO</option>
              <option>PM</option>
              <option>Sales</option>
              <option>HR</option>
            </select>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'}>
              <div className="nav-item-inner">
                <span className="nav-icon">{item.icon}</span>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.hint}</span>
                </div>
              </div>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-card">
          <span>Quarter target</span>
          <strong>$1.2M revenue</strong>
          <p>81% completed, strong pipeline coverage for the remaining month.</p>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">CEO Dashboard</p>
            <h2>Business overview and execution health</h2>
            <p className="role-summary">Live on app.fachu.space, auto-deployed from GitHub.</p>
          </div>
          <div className="topbar-right">
            <div className="search-box">Role: {activeRole} · ERP-style UI, edit through action buttons</div>
            <div className="topbar-actions">
              <label className="ghost-button file-label">Import JSON<input type="file" accept="application/json" onChange={importData} hidden /></label>
              <button className="notif-button" onClick={() => setNotificationsOpen((prev) => !prev)}><span className="notif-icon">◉</span><span className="notif-badge">{notificationsByRole[activeRole].filter((item) => !item.read).length}</span>{notificationsOpen ? 'Hide notifications' : 'Show notifications'}</button>
              <button onClick={exportData}>Export JSON</button>
              <button onClick={resetData}>Reset dữ liệu</button>
              <button onClick={() => setDarkMode((prev) => !prev)}>{darkMode ? 'Light mode' : 'Dark mode'}</button>
              <button onClick={() => setLoggedIn(false)}>Log out</button>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<DashboardPage data={data} activeRole={activeRole} />} />
          <Route path="/projects" element={<ProjectsPage projects={data.projects} onOpenProject={setSelectedProject} onEditProject={(project) => setProjectEditor({ ...project })} onCreateProject={() => setProjectEditor({ id: Date.now(), name: 'New Project', status: 'Planning', owner: 'Unassigned', deadline: 'TBD', progress: 0, budget: '$0', priority: 'Medium', summary: 'New project summary' })} onDeleteProject={(id) => { setData((draft) => ({ ...draft, projects: draft.projects.filter((project) => project.id !== id) })); notify('Đã xoá project') }} />} />
          <Route path="/tasks" element={<TasksPage tasks={data.tasks} onEditTask={(column, item) => setTaskEditor({ column, item: { ...item } })} onCreateTask={(column) => setTaskEditor({ column, item: { id: Date.now(), title: 'New task', meta: 'Add details' } })} onDeleteTask={(column, id) => { setData((draft) => ({ ...draft, tasks: { ...draft.tasks, [column]: draft.tasks[column].filter((task) => task.id !== id) } })); notify('Đã xoá task') }} />} />
          <Route path="/crm" element={<CrmPage deals={data.deals} onEditDeal={(deal) => setDealEditor({ ...deal })} onCreateDeal={() => setDealEditor({ id: Date.now(), company: 'New company', value: 0, stage: 'Qualified', owner: 'Unassigned', close: 'TBD' })} onDeleteDeal={(id) => { setData((draft) => ({ ...draft, deals: draft.deals.filter((deal) => deal.id !== id) })); notify('Đã xoá deal') }} />} />
          <Route path="/team" element={<TeamPage team={data.team} onEditMember={(member) => setMemberEditor({ ...member })} onCreateMember={() => setMemberEditor({ id: Date.now(), name: 'New member', role: 'New role', workload: 0, focus: 'Add focus', utilization: 'Healthy' })} onDeleteMember={(id) => { setData((draft) => ({ ...draft, team: draft.team.filter((member) => member.id !== id) })); notify('Đã xoá nhân sự') }} />} />
          <Route path="/finance" element={<FinancePage finance={data.finance} />} />
          <Route path="/orders" element={<OrdersPage orders={data.orders} />} />
          <Route path="/procurement" element={<ProcurementPage procurement={data.procurement} />} />
          <Route path="/leave" element={<LeavePage leave={data.leave} />} />
        </Routes>
      </main>

      <aside className={`detail-drawer ${selectedProject ? 'open' : ''}`}>
        <div className={`glass-stack notif-drawer ${notificationsOpen ? 'open' : 'closed'}`}>
          <NotificationsPanel notifications={(unreadOnly ? notificationsByRole[activeRole].filter((item) => !item.read) : notificationsByRole[activeRole])} unreadOnly={unreadOnly} setUnreadOnly={setUnreadOnly} onOpenMini={() => setMiniNotifOpen(true)} onMarkAllRead={() => setNotificationsByRole((prev) => ({ ...prev, [activeRole]: prev[activeRole].map((item) => ({ ...item, read: true })) }))} onClearRead={() => setNotificationsByRole((prev) => ({ ...prev, [activeRole]: prev[activeRole].filter((item) => !item.read) }))} onToggleRead={(id) => setNotificationsByRole((prev) => ({ ...prev, [activeRole]: prev[activeRole].map((item) => item.id === id ? { ...item, read: !item.read } : item) }))} />
          <ApprovalsPanel activeRole={activeRole} />
          <CalendarPanel />
        </div>
        <div className="activity-panel">
          <p className="eyebrow">Recent actions</p>
          <div className="activity-list">
            {activityLog.map((item, index) => (
              <div key={`${item}-${index}`} className="activity-item">{item}</div>
            ))}
          </div>
        </div>
        {selectedProject ? (
          <>
            <div className="drawer-header">
              <div>
                <p className="eyebrow">Project details</p>
                <h3>{selectedProject.name}</h3>
              </div>
              <button className="icon-button" onClick={() => setSelectedProject(null)}>×</button>
            </div>
            <p className="drawer-copy">{selectedProject.summary}</p>
            <div className="drawer-grid">
              <div className="mini-stat"><span>Status</span><strong>{selectedProject.status}</strong></div>
              <div className="mini-stat"><span>Owner</span><strong>{selectedProject.owner}</strong></div>
              <div className="mini-stat"><span>Deadline</span><strong>{selectedProject.deadline}</strong></div>
              <div className="mini-stat"><span>Budget</span><strong>{selectedProject.budget}</strong></div>
            </div>
          </>
        ) : (
          <div className="drawer-placeholder">
            <p className="eyebrow">Project details</p>
            <h3>Select a project</h3>
            <p>Bấm Details ở tab Projects để xem thêm.</p>
          </div>
        )}
      </aside>

      <Modal open={!!taskEditor} title="Edit task" onClose={() => setTaskEditor(null)}>
        {taskEditor && (
          <div className="modal-form">
            <Field label="Task name" value={taskEditor.item.title} onChange={(value) => setTaskEditor((prev) => ({ ...prev, item: { ...prev.item, title: value } }))} />
            <Field label="Meta" value={taskEditor.item.meta} onChange={(value) => setTaskEditor((prev) => ({ ...prev, item: { ...prev.item, meta: value } }))} />
            <div className="modal-actions">
              <button className="ghost-button" onClick={() => setTaskEditor(null)}>Cancel</button>
              <button className="primary" onClick={saveTask}>Save changes</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!memberEditor} title="Edit team member" onClose={() => setMemberEditor(null)}>
        {memberEditor && (
          <div className="modal-form">
            <Field label="Name" value={memberEditor.name} onChange={(value) => setMemberEditor((prev) => ({ ...prev, name: value }))} />
            <Field label="Role" value={memberEditor.role} onChange={(value) => setMemberEditor((prev) => ({ ...prev, role: value }))} />
            <Field label="Workload" type="number" value={memberEditor.workload} onChange={(value) => setMemberEditor((prev) => ({ ...prev, workload: value }))} />
            <Field label="Focus" value={memberEditor.focus} onChange={(value) => setMemberEditor((prev) => ({ ...prev, focus: value }))} />
            <Field label="Utilization" value={memberEditor.utilization} onChange={(value) => setMemberEditor((prev) => ({ ...prev, utilization: value }))} />
            <div className="modal-actions">
              <button className="ghost-button" onClick={() => setMemberEditor(null)}>Cancel</button>
              <button className="primary" onClick={saveMember}>Save changes</button>
            </div>
          </div>
        )}
      </Modal>
      <Modal open={!!projectEditor} title="Edit project" onClose={() => setProjectEditor(null)}>
        {projectEditor && (
          <div className="modal-form">
            <Field label="Project name" value={projectEditor.name} onChange={(value) => setProjectEditor((prev) => ({ ...prev, name: value }))} />
            <Field label="Status" value={projectEditor.status} onChange={(value) => setProjectEditor((prev) => ({ ...prev, status: value }))} />
            <Field label="Owner" value={projectEditor.owner} onChange={(value) => setProjectEditor((prev) => ({ ...prev, owner: value }))} />
            <Field label="Deadline" value={projectEditor.deadline} onChange={(value) => setProjectEditor((prev) => ({ ...prev, deadline: value }))} />
            <Field label="Budget" value={projectEditor.budget} onChange={(value) => setProjectEditor((prev) => ({ ...prev, budget: value }))} />
            <Field label="Progress" type="number" value={projectEditor.progress} onChange={(value) => setProjectEditor((prev) => ({ ...prev, progress: value }))} />
            <TextAreaField label="Summary" value={projectEditor.summary} onChange={(value) => setProjectEditor((prev) => ({ ...prev, summary: value }))} />
            <div className="modal-actions">
              <button className="ghost-button" onClick={() => setProjectEditor(null)}>Cancel</button>
              <button className="primary" onClick={saveProject}>Save changes</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!dealEditor} title="Edit deal" onClose={() => setDealEditor(null)}>
        {dealEditor && (
          <div className="modal-form">
            <Field label="Company" value={dealEditor.company} onChange={(value) => setDealEditor((prev) => ({ ...prev, company: value }))} />
            <Field label="Deal value" type="number" value={dealEditor.value} onChange={(value) => setDealEditor((prev) => ({ ...prev, value: value }))} />
            <Field label="Stage" value={dealEditor.stage} onChange={(value) => setDealEditor((prev) => ({ ...prev, stage: value }))} />
            <Field label="Owner" value={dealEditor.owner} onChange={(value) => setDealEditor((prev) => ({ ...prev, owner: value }))} />
            <Field label="Close" value={dealEditor.close} onChange={(value) => setDealEditor((prev) => ({ ...prev, close: value }))} />
            <div className="modal-actions">
              <button className="ghost-button" onClick={() => setDealEditor(null)}>Cancel</button>
              <button className="primary" onClick={saveDeal}>Save changes</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={dashboardEditor} title="Dashboard settings" onClose={() => setDashboardEditor(false)}>
        <div className="modal-form">
          <Field label="Eyebrow" value={data.summary.eyebrow} onChange={(value) => setData((draft) => ({ ...draft, summary: { ...draft.summary, eyebrow: value } }))} />
          <Field label="Title" value={data.summary.title} onChange={(value) => setData((draft) => ({ ...draft, summary: { ...draft.summary, title: value } }))} />
          <TextAreaField label="Description" value={data.summary.description} onChange={(value) => setData((draft) => ({ ...draft, summary: { ...draft.summary, description: value } }))} />
          <div className="modal-actions">
            <button className="ghost-button" onClick={() => setDashboardEditor(false)}>Close</button>
          </div>
        </div>
      </Modal>

    </div>
  )
}

export default App
