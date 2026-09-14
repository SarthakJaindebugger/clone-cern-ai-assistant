import { useMemo, useState } from "react";
import type { RecordSummary, SearchResponse } from "../types";
import ResultRow from "./ResultRow";

interface Props { result: SearchResponse; selectedRecid?: string | number; onSelect: (record: RecordSummary) => void; }
const all = "All";

export default function ResultsFeed({ result, selectedRecid, onSelect }: Props) {
  const [experiment, setExperiment] = useState(all);
  const [type, setType] = useState(all);
  const [date, setDate] = useState(all);
  const experiments = useMemo(() => [all, ...Array.from(new Set(result.results.map((r) => r.experiment).filter(Boolean)))], [result]);
  const types = useMemo(() => [all, ...Array.from(new Set(result.results.map((r) => r.type).filter(Boolean)))], [result]);
  const filtered = result.results.filter((r) => (experiment === all || r.experiment === experiment) && (type === all || r.type === type) && (date === all || r.date_published.startsWith(date)));
  if (!result.results.length) return <div className="empty-state">No records matched “{result.search_terms}”. Try broader terms, an experiment name, particle, or collision energy.</div>;
  return <section className="results-area">
    <div className="results-header"><div><p className="eyebrow">Dataset catalogue</p><h2>Search results</h2></div><span className="count">{filtered.length} of {result.total_matches.toLocaleString()} records</span></div>
    <div className="filter-bar" aria-label="Dataset filters">
      <label>Experiment<select value={experiment} onChange={(e) => setExperiment(e.target.value)}>{experiments.map((option) => <option key={option}>{option}</option>)}</select></label>
      <label>Record type<select value={type} onChange={(e) => setType(e.target.value)}>{types.map((option) => <option key={option}>{option}</option>)}</select></label>
      <label>Date formed<select value={date} onChange={(e) => setDate(e.target.value)}><option>All</option>{Array.from(new Set(result.results.map((r) => r.date_published.slice(0, 4)).filter((year) => /^\d{4}$/.test(year)))).map((year) => <option key={year}>{year}</option>)}</select></label>
      <button type="button" className="clear-filter" onClick={() => { setExperiment(all); setType(all); setDate(all); }}>Clear filters</button>
    </div>
    <p className="filter-note">{result.llm_ranked ? "Results are ranked for your request." : "Results use CERN Open Data relevance."} Refine the list with CERN metadata filters, then select a dataset for its full record.</p>
    <div className="feed">{filtered.map((r) => <ResultRow key={r.recid} record={r} showRelevance={result.llm_ranked} selected={selectedRecid === r.recid} onSelect={onSelect} />)}</div>
    {!filtered.length && <p className="no-filter-results">No datasets match these filters. Clear them to see all search results.</p>}
  </section>;
}
