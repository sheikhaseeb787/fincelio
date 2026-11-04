"use client";
import {useMemo,useState} from "react";
import type {Calculator} from "@/lib/calculators";
const cash=(n:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2}).format(Number.isFinite(n)?n:0);
export default function CalculatorTool({tool}:{tool:Calculator}){
const [v,setV]=useState<Record<string,number>>(()=>Object.fromEntries(tool.fields.map(f=>[f.key,f.defaultValue])));
const results=useMemo(()=>{const x=(k:string)=>Number(v[k]||0);switch(tool.slug){
case "profit-margin-calculator":{const p=x("price")-x("cost")-x("expenses");return [["Net profit",cash(p)],["Profit margin",x("price")>0?(p/x("price")*100).toFixed(2)+"%":"—"],["Markup",x("cost")>0?(p/x("cost")*100).toFixed(2)+"%":"—"]];}
case "markup-calculator":{const m=x("cost")*x("markup")/100,s=x("cost")+m;return [["Markup amount",cash(m)],["Selling price",cash(s)],["Profit margin",s>0?(m/s*100).toFixed(2)+"%":"—"]];}
case "selling-price-calculator":{const b=x("cost")+x("shipping")+x("ads"),d=1-(x("fees")+x("margin"))/100,p=d>0?b/d:0;return [["Suggested selling price",d>0?cash(p):"Reduce fees and target margin"],["Estimated profit",cash(p-b-p*x("fees")/100)]];}
case "break-even-calculator":{const c=x("price")-x("variable"),u=c>0?Math.ceil(x("fixed")/c):0;return [["Break-even units",c>0?u.toLocaleString():"Price must exceed variable cost"],["Break-even revenue",c>0?cash(u*x("price")):"—"]];}
case "landed-cost-calculator":{const t=x("purchase")+x("freight")+x("insurance")+x("duty")+x("handling");return [["Total landed cost",cash(t)],["Cost per unit",x("quantity")>0?cash(t/x("quantity")):"Enter quantity"]];}
case "ecommerce-profit-calculator":{const p=x("revenue")-x("product")-x("fulfillment")-x("fees")-x("ads")-x("refunds")-x("overhead");return [["Estimated net profit",cash(p)],["Profit per order",x("orders")>0?cash(p/x("orders")):"—"],["Net margin",x("revenue")>0?(p/x("revenue")*100).toFixed(2)+"%":"—"]];}
case "wholesale-price-calculator":{const d=1-x("margin")/100,w=d>0?x("cost")/d:0,r=w*(1+x("retailMarkup")/100);return [["Wholesale price",d>0?cash(w):"Margin must be below 100%"],["Suggested retail price",d>0?cash(r):"—"],["Retailer gross profit",d>0?cash(r-w):"—"]];}
case "product-cost-calculator":{const t=x("materials")+x("labor")+x("packaging")+x("freight")+x("overhead");return [["Total production cost",cash(t)],["Cost per unit",x("quantity")>0?cash(t/x("quantity")):"Enter quantity"]];}
default:return []; }},[v,tool.slug]);
return <section className="calc-panel"><div className="calc-fields"><h2>Enter your numbers</h2><p>Results update as you change the values.</p>{tool.fields.map(f=><label className="calc-field" key={f.key}><span>{f.label}</span><input type="number" min="0" step="any" value={v[f.key]} onChange={e=>setV(s=>({...s,[f.key]:Number(e.target.value)}))}/></label>)}</div><div className="calc-results"><span className="eyebrow">YOUR RESULTS</span>{results.map(([label,value])=><div className="result-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}<p className="calc-note">Estimates only. Use consistent currencies and verify applicable costs, taxes and fees.</p><button className="secondary-button" onClick={()=>setV(Object.fromEntries(tool.fields.map(f=>[f.key,f.defaultValue])))}>Reset values</button></div></section>;
}
