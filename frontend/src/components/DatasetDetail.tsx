import type { RecordDetail } from "../types";

interface Props {
  record: RecordDetail | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}

function formatBytes(bytes: number | null | undefined) {
  if (!bytes) return "Not specified";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index > 1 ? 1 : 0)} ${units[index]}`;
}

function fileFormat(filename: string) {
  const extension = filename.split(".").pop()?.toUpperCase();
  return extension && extension !== filename.toUpperCase() ? extension : "Data file";
}

function suggestion(record: RecordDetail) {
  const context = [record.experiment, record.type, record.collision_type, record.abstract]
    .join(" ")
    .toLowerCase();
  if (context.includes("simulation") || context.includes("mc")) {
    return "Use this as a labelled reference sample for reconstruction validation, detector-response studies, or training a classifier before evaluating it on collision data.";
  }
  if (context.includes("higgs")) {
    return "A useful downstream starting point is an event-classification workflow: engineer kinematic features, train a signal-versus-background model, then compare its selections with published analyses.";
  }
  return "Start with exploratory event analysis and quality checks, then build a reproducible feature table for anomaly detection, classification, or reconstruction studies. Validate every result against the accompanying CERN documentation.";
}

export default function DatasetDetail({ record, loading, error, onClose }: Props) {
  if (!record && !loading && !error) return null;

  return (
    <aside className="dataset-detail" aria-live="polite">
      <div className="detail-heading">
        <div>
          <p className="eyebrow">Selected dataset</p>
          <h2>{record?.title || (loading ? "Opening dataset…" : "Dataset unavailable")}</h2>
        </div>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Close dataset details">×</button>
      </div>

      {loading && <div className="detail-loading">Retrieving the complete CERN Open Data record…</div>}
      {error && <div className="error-banner detail-error">{error}</div>}

      {record && !loading && (
        <>
          <div className="detail-overview">
            <div><span>Experiment</span><strong>{record.experiment}</strong></div>
            <div><span>Record type</span><strong>{record.type}</strong></div>
            <div><span>Date of formation</span><strong>{record.date_published}</strong></div>
            <div><span>Files</span><strong>{record.file_count}</strong></div>
          </div>

          <section className="detail-section">
            <h3>Description</h3>
            <p>{record.abstract || "CERN Open Data has not supplied a description for this record."}</p>
          </section>

          <section className="detail-section detail-grid">
            <div>
              <h3>Dataset size</h3>
              <p className="detail-emphasis">{formatBytes(record.files.reduce((total, file) => total + (file.size || 0), 0))}</p>
              <p className="helper-text">Combined size of the files exposed in this record.</p>
            </div>
            <div>
              <h3>Format</h3>
              <p className="detail-emphasis">{record.files[0] ? fileFormat(record.files[0].filename) : "Not specified"}</p>
              {record.files[0] && <code className="file-example">{record.files[0].filename}</code>}
            </div>
          </section>

          <section className="detail-section suggestion-card">
            <p className="eyebrow">AI-guided downstream suggestion</p>
            <p>{suggestion(record)}</p>
          </section>

          <section className="detail-section">
            <h3>How to install and use</h3>
            <ol className="steps-list">
              <li>Read the record documentation and confirm the data licence before downloading.</li>
              <li>Download a small representative file first, then inspect its schema with the analysis tools appropriate to its format.</li>
              <li>Keep the record ID and source link in your notebook or analysis README for reproducibility.</li>
            </ol>
          </section>

          <section className="detail-section">
            <h3>Files and examples</h3>
            {record.files.length ? (
              <div className="file-list">
                {record.files.slice(0, 5).map((file) => (
                  <a key={file.filename} href={file.uri || record.url} target="_blank" rel="noreferrer" className="file-row">
                    <span>{file.filename}</span><small>{fileFormat(file.filename)} · {formatBytes(file.size)}</small>
                  </a>
                ))}
              </div>
            ) : <p>No file-level metadata is available from the record.</p>}
          </section>

          <section className="detail-section citations">
            <h3>Sources & citations</h3>
            <p>Cite this dataset using its CERN Open Data record ID ({record.recid}) and the source record below.</p>
            <a href={record.url} target="_blank" rel="noreferrer">CERN Open Data record {record.recid} ↗</a>
            {record.license && <p className="helper-text">Licence: {record.license}</p>}
          </section>
        </>
      )}
    </aside>
  );
}
