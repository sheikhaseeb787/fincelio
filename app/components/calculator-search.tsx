"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {calculators} from "@/lib/calculators";
export default function CalculatorSearch(){
 const [query,setQuery]=useState("");
 const matches=useMemo(()=>{const q=query.trim().toLowerCase();return q?calculators.filter(c=>(c.title+" "+c.description+" "+c.category).toLowerCase().includes(q)):[]},[query]);
 return <div className="calculator-search"><label htmlFor="tool-search">Search all calculators</label><input id="tool-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try “profit margin” or “shipping cost”…"/>{query.trim()&&<div className="search-results" aria-live="polite">{matches.length?matches.map(c=><Link key={c.slug} href={"/"+c.slug+"/"}>{c.title}<span>Open calculator →</span></Link>):<p>No matching calculator. Try a different search.</p>}</div>}</div>;
}