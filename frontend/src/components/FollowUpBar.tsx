import { FormEvent, useState } from "react";
interface Props { datasetTitle?: string; onSubmit: (question: string) => void; loading: boolean; }
export default function FollowUpBar({ datasetTitle, onSubmit, loading }: Props) {
  const [question, setQuestion] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); if (!question.trim() || loading) return; onSubmit(question.trim()); setQuestion(""); }
  return <form className="follow-up-bar" onSubmit={submit}><div className="follow-up-context"><span className="sparkle">✦</span><span>{datasetTitle ? `Ask about ${datasetTitle}` : "Ask a follow-up question"}</span></div><input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. Which format is best for Python analysis?" aria-label="Follow-up question" /><button type="submit" disabled={loading}>{loading ? "Working…" : "Ask"}</button></form>;
}
