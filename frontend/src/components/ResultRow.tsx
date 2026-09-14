import type { RecordSummary } from "../types";

interface Props {
  record: RecordSummary;
  showRelevance: boolean;
  selected: boolean;
  onSelect: (record: RecordSummary) => void;
}

export default function ResultRow({ record, showRelevance, selected, onSelect }: Props) {
  return (
    <article className={`record-row ${selected ? "selected" : ""}`}>
      <div className="record-recid"><span className="label">Record</span>{record.recid}</div>
      <div>
        <button className="record-title" type="button" onClick={() => onSelect(record)}>{record.title}</button>
        <div className="record-stats">
          <div className="stat"><span className="label">Experiment</span><span className="value">{record.experiment}</span></div>
          <div className="stat"><span className="label">Type</span><span className="value">{record.type}</span></div>
          <div className="stat"><span className="label">Collision energy</span><span className="value">{record.collision_energy}</span></div>
          <div className="stat"><span className="label">Formed</span><span className="value">{record.date_published}</span></div>
        </div>
        {record.abstract && <p className="record-abstract">{record.abstract}</p>}
        {showRelevance && record.why && <p className="relevance-why">Why this matches: {record.why}</p>}
        <div className="record-actions">
          <button className="text-button" type="button" onClick={() => onSelect(record)}>Explore dataset <span>→</span></button>
          <a className="record-link" href={record.url} target="_blank" rel="noreferrer">CERN source ↗</a>
        </div>
      </div>
    </article>
  );
}
