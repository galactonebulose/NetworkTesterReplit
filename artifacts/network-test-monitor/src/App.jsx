import { useMemo, useState } from 'react';
import { initialTests, networkTypes, testStatuses } from './data.js';

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (name === 'pulse') return <svg {...common}><path d="M3 12h4l3-8 4 16 3-8h4" /></svg>;
  if (name === 'plus') return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
  if (name === 'search') return <svg {...common}><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.3 4.3" /></svg>;
  if (name === 'trash') return <svg {...common}><path d="M4 7h16M10 11v6m4-6v6M5.5 7l.8 13h11.4l.8-13M9 7V4h6v3" /></svg>;
  if (name === 'signal') return <svg {...common}><path d="M4 20V9m5 11V5m5 15v-8m5 8V3" /></svg>;
  if (name === 'wifi') return <svg {...common}><path d="M3 9a14 14 0 0 1 18 0M6.5 12.5a9 9 0 0 1 11 0M10 16a3.5 3.5 0 0 1 4 0M12 20h.01" /></svg>;
  if (name === 'empty') return <svg {...common}><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M8 10h8M8 14h5" /></svg>;
  return null;
}

const blankForm = { name: '', networkType: '', latency: '', packetLoss: '', status: '' };

function NetworkGlyph({ type }) {
  const isWifi = type === 'Wi-Fi';
  return <span className={`network-glyph ${isWifi ? 'wifi' : type === '4G' ? 'four-g' : ''}`} aria-hidden="true">
    <Icon name={isWifi ? 'wifi' : 'signal'} size={15} />
  </span>;
}

function MetricCard({ label, value, unit, note, kind }) {
  return <article className={`metric-card ${kind || ''}`} data-testid={`metric-${kind || 'total'}`}>
    <div className="metric-label">{label}</div>
    <div className="metric-value">{value}{unit && <span className="metric-unit">{unit}</span>}</div>
    <div className="metric-note">{note}</div>
  </article>;
}

// Assignment: the inline Add Test form exposes every required test field plus submit and cancel actions.
function TestForm({ onAdd, onCancel }) {
  const [form, setForm] = useState(blankForm);
  const [errors, setErrors] = useState({});

  const changeField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: '' }));
  };

  // Assignment: validate each field explicitly and keep errors adjacent to the relevant control.
  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    const latency = Number(form.latency);
    const packetLoss = Number(form.packetLoss);
    if (!form.name.trim()) nextErrors.name = 'Enter a test name.';
    if (!networkTypes.includes(form.networkType)) nextErrors.networkType = 'Choose a network type.';
    if (form.latency.trim() === '' || !Number.isFinite(latency) || latency < 0) nextErrors.latency = 'Enter a valid latency of 0 or more.';
    if (form.packetLoss.trim() === '' || !Number.isFinite(packetLoss) || packetLoss < 0 || packetLoss > 100) nextErrors.packetLoss = 'Enter a value from 0 to 100.';
    if (!testStatuses.includes(form.status)) nextErrors.status = 'Choose a status.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onAdd({ name: form.name.trim(), networkType: form.networkType, latency, packetLoss, status: form.status });
    setForm(blankForm);
    setErrors({});
  };

  const field = (name, label, control) => <div className="field">
    <label htmlFor={`test-${name}`}>{label}</label>
    {control}
    <div className="field-error" id={`error-${name}`} role="alert">{errors[name]}</div>
  </div>;

  return <form className="form-panel" onSubmit={submit} noValidate data-testid="form-add-test">
    <div className="form-heading">
      <h2>Add a network test</h2>
      <span className="form-hint">All fields are required</span>
    </div>
    <div className="form-grid">
      {field('name', 'Test name', <input id="test-name" className="control" name="name" value={form.name} onChange={changeField} placeholder="e.g. Core API probe" aria-invalid={Boolean(errors.name)} aria-describedby="error-name" data-testid="input-test-name" />)}
      {field('networkType', 'Network type', <select id="test-networkType" className="control" name="networkType" value={form.networkType} onChange={changeField} aria-invalid={Boolean(errors.networkType)} aria-describedby="error-networkType" data-testid="select-network-type"><option value="">Select network</option>{networkTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select>)}
      {field('latency', 'Latency (ms)', <input id="test-latency" className="control" name="latency" type="number" min="0" step="any" value={form.latency} onChange={changeField} placeholder="0" aria-invalid={Boolean(errors.latency)} aria-describedby="error-latency" data-testid="input-latency" />)}
      {field('packetLoss', 'Packet loss (%)', <input id="test-packetLoss" className="control" name="packetLoss" type="number" min="0" max="100" step="any" value={form.packetLoss} onChange={changeField} placeholder="0" aria-invalid={Boolean(errors.packetLoss)} aria-describedby="error-packetLoss" data-testid="input-packet-loss" />)}
      {field('status', 'Status', <select id="test-status" className="control" name="status" value={form.status} onChange={changeField} aria-invalid={Boolean(errors.status)} aria-describedby="error-status" data-testid="select-test-status"><option value="">Select status</option>{testStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select>)}
    </div>
    <div className="form-actions">
      <button className="secondary-button" type="button" onClick={onCancel} data-testid="button-cancel-test">Cancel</button>
      <button className="primary-button" type="submit" data-testid="button-submit-test">Add test</button>
    </div>
  </form>;
}

function App() {
  // Assignment: all tests live in React state; every metric and table row uses this same source.
  const [tests, setTests] = useState(initialTests);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [isAdding, setIsAdding] = useState(false);

  // Assignment: overview metrics are calculated from the full test list, never from filtered rows.
  const metrics = useMemo(() => {
    const passed = tests.filter((test) => test.status === 'Passed').length;
    const failed = tests.filter((test) => test.status === 'Failed').length;
    const avgLatency = tests.length ? tests.reduce((sum, test) => sum + test.latency, 0) / tests.length : 0;
    return { total: tests.length, passed, failed, avgLatency };
  }, [tests]);

  // Assignment: case-insensitive name search and status selection combine without changing metrics.
  const visibleTests = useMemo(() => tests.filter((test) => {
    const matchesName = test.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || test.status === statusFilter;
    return matchesName && matchesStatus;
  }), [tests, query, statusFilter]);

  // Assignment: add validated tests with a unique ID so the table and all metrics update from one state list.
  const addTest = (test) => {
    const nextNumber = tests.reduce((largest, item) => {
      const match = item.id.match(/(\d+)$/);
      return Math.max(largest, match ? Number(match[1]) : 0);
    }, 2048) + 1;
    setTests((current) => [{ ...test, id: `NT-${nextNumber}` }, ...current]);
    setIsAdding(false);
  };

  // Assignment: deleting a row removes it from shared state, recalculating every overview metric.
  const removeTest = (id) => setTests((current) => current.filter((test) => test.id !== id));

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark"><Icon name="pulse" size={19} /></span>
        <span className="brand-name">Network Test Monitor</span>
        <span className="brand-sub">ENGINEERING / DIAGNOSTICS</span>
      </div>
      <div className="connection"><span className="live-dot" /><span className="connection-label">Monitor ready</span></div>
    </header>

    <main className="main">
      <section aria-labelledby="page-title">
        <div className="heading-row">
          <div>
            <p className="eyebrow">Network diagnostics / overview</p>
            <h1 id="page-title">Test results</h1>
            <p className="page-description">A clear read on connection health, latency, and packet loss.</p>
          </div>
          {/* Assignment: the visible Add Test action opens and closes the inline form. */}
          <button className="primary-button" type="button" onClick={() => setIsAdding((open) => !open)} aria-expanded={isAdding} data-testid="button-add-test">
            <Icon name="plus" size={16} /> Add test
          </button>
        </div>

        <div className="metric-grid" aria-label="Test overview metrics">
          <MetricCard label="Total tests" value={metrics.total} note="Across all networks" kind="total" />
          <MetricCard label="Passed" value={metrics.passed} note="Healthy results" kind="passed" />
          <MetricCard label="Failed" value={metrics.failed} note="Needs attention" kind="failed" />
          <MetricCard label="Average latency" value={metrics.total === 0 ? '0' : metrics.avgLatency.toFixed(1)} unit="ms" note="All tests, including running" kind="latency" />
        </div>
      </section>

      <section className="tests-panel" aria-labelledby="tests-heading">
        <div className="panel-head">
          <div className="panel-title-wrap">
            <h2 className="panel-title" id="tests-heading">Network tests</h2>
            <span className="record-count" data-testid="text-visible-count">{visibleTests.length} shown</span>
          </div>
        </div>

        {isAdding && <TestForm onAdd={addTest} onCancel={() => setIsAdding(false)} />}

        <div className="filter-row">
          <div className="search-wrap">
            <span className="search-icon"><Icon name="search" size={16} /></span>
            <input className="control search-input" type="search" placeholder="Search test names..." value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search test names" data-testid="input-search-tests" />
          </div>
          <span className="filter-caption">Filter by status</span>
          <select className="control status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter tests by status" data-testid="select-status-filter">
            {['All Statuses', ...testStatuses].map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>

        {/* Assignment: distinguish an actually empty collection from an empty filtered result. */}
        {tests.length === 0 ? <div className="empty-state" data-testid="empty-no-tests">
          <div className="empty-mark"><Icon name="empty" size={21} /></div>
          <h3>No tests in this monitor</h3>
          <p>Add a network test to start tracking latency, packet loss, and connection outcomes.</p>
          <button className="primary-button" type="button" onClick={() => setIsAdding(true)} data-testid="button-empty-add-test"><Icon name="plus" size={15} /> Add your first test</button>
        </div> : visibleTests.length === 0 ? <div className="empty-state" data-testid="empty-no-matches">
          <div className="empty-mark"><Icon name="search" size={20} /></div>
          <h3>No matching tests</h3>
          <p>Try another test name or change the status filter to see more results.</p>
        </div> : <div className="table-scroll">
          {/* Assignment: the table shows every requested field, status badge, and row-level delete action. */}
          <table data-testid="table-network-tests">
            <thead><tr>
              <th scope="col">Test name</th><th scope="col">Network type</th><th scope="col">Latency (ms)</th><th scope="col">Packet loss (%)</th><th scope="col">Status</th><th scope="col">Actions</th>
            </tr></thead>
            <tbody>
              {visibleTests.map((test) => <tr key={test.id} data-testid={`row-test-${test.id}`}>
                <td><div className="test-name">{test.name}</div><div className="test-id">{test.id}</div></td>
                <td><span className="network-cell"><NetworkGlyph type={test.networkType} />{test.networkType}</span></td>
                <td><span className="numeric latency-number">{test.latency}</span></td>
                <td><span className="numeric loss-number">{test.packetLoss}%</span></td>
                <td><span className={`status-badge status-${test.status.toLowerCase()}`} data-testid={`status-test-${test.id}`}>{test.status}</span></td>
                <td><button className="delete-button" type="button" title={`Delete ${test.name}`} aria-label={`Delete ${test.name}`} onClick={() => removeTest(test.id)} data-testid={`button-delete-${test.id}`}><Icon name="trash" size={16} /></button></td>
              </tr>)}
            </tbody>
          </table>
        </div>}
        <div className="table-footer">
          <span>Results reflect the current test list</span>
          <span className="footer-live"><span className="live-dot" /> Live monitor</span>
        </div>
      </section>
    </main>
  </div>;
}

export default App;
