"use client";
import React, { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  async function handleUpload() {
    if (!file) return;
    setStatus("Uploading & processing…");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/upload", {
      method: "POST",
      body: form
    });
    if(!res.ok){
      const t = await res.text();
      setStatus("Error: "+t);
      return;
    }
    const data = await res.json();
    localStorage.setItem("case", JSON.stringify(data));
    window.location.href = "/results";
  }

  return (
    <main style={{maxWidth: 720, margin: "40px auto", fontFamily: "ui-sans-serif"}}>
      <h1 style={{fontSize: 28, fontWeight: 700}}>AI Forensic Timeline</h1>
      <p>Upload a ZIP (EVTX/registry/prefetch/etc.) or a single file (.evtx/.csv/.json/.plaso).</p>
      <input type="file" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
      <div style={{marginTop: 12}}>
        <button onClick={handleUpload} disabled={!file} style={{padding:"10px 16px"}}>
          Analyze
        </button>
      </div>
      <p style={{marginTop:12}}>{status}</p>
    </main>
  );
}
