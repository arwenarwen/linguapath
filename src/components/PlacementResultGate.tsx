import React from "react";
import { FREE_PLAN_RULES } from "../data/placementConfig";

export default function PlacementResultGate({ placedLevel, isPro = false, onStartPreview, onGoPro }) {
  if (isPro || placedLevel === "A1") return null;
  return <div style={{borderRadius:24,padding:20,background:"rgba(255,255,255,0.74)",border:"1.5px solid rgba(245,165,36,0.25)",boxShadow:"0 10px 28px rgba(245,165,36,0.12)",color:"#4a2800"}}>
    <div style={{fontSize:11,fontWeight:900,letterSpacing:2,textTransform:"uppercase",color:"#c9840a",marginBottom:8}}>Level preview</div>
    <div style={{fontFamily:"var(--font-display)",fontWeight:900,fontSize:28,marginBottom:8}}>You placed into {placedLevel}</div>
    <div style={{fontSize:15,lineHeight:1.7,color:"rgba(74,40,0,0.72)",marginBottom:16}}>Nice work — you do not need to start from zero. On the free plan, you can preview {FREE_PLAN_RULES.previewLessonsForPlacedUsers} lessons in {placedLevel}. Upgrade to Pro to continue the full path.</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>
      <button onClick={onStartPreview} style={{borderRadius:18,padding:"16px 18px",border:"1.5px solid rgba(245,165,36,0.18)",background:"rgba(255,255,255,0.75)",textAlign:"left",cursor:"pointer",color:"#4a2800"}}><div style={{fontWeight:900,marginBottom:4}}>Start preview</div><div style={{fontSize:13,color:"rgba(74,40,0,0.62)"}}>Preview a few lessons at {placedLevel} first.</div></button>
      <button onClick={onGoPro} style={{borderRadius:18,padding:"16px 18px",border:"none",background:"#f5a524",textAlign:"left",cursor:"pointer",color:"#fff"}}><div style={{fontWeight:900,marginBottom:4}}>Unlock Pro</div><div style={{fontSize:13,opacity:0.92}}>Continue your full {placedLevel} trail with unlimited access.</div></button>
    </div>
  </div>;
}
