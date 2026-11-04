"use client";
import {useMemo,useState} from "react";
import type {Calculator} from "@/lib/calculators";
const currencies=["USD","EUR","GBP","PKR","AUD","CAD","INR"];
const cash=(n:number,c:string)=>new Intl.NumberFormat("en-US",{style:"currency",currency:c,maximumFractionDigits:2}).format(Number.isFinite(n)?n:0);
export default function CalculatorTool({tool}:{tool:Calculator}){
const [currency,setCurrency]=useState("USD");
const [v,setV]=useState<Record<string,number>>(()=>Object.fromEntries(tool.fields.map(f=>[f.key,f.defaultValue])));
const [mode,setMode]=useState("price");
const percentageLimits:Record<string,number>={targetMargin:99.99,paymentFee:99.99,marketFee:99.99,margin:99.99,tier50:100,tier100:100,tier500:100};
const visibleFields=tool.fields.filter(f=>tool.slug!=="markup-calculator"||(mode==="price"?f.key!=="margin":mode==="reverse"?["cost","price"].includes(f.key):["markup","margin"].includes(f.key)));
const invalid=visibleFields.filter(f=>!Number.isFinite(v[f.key])||v[f.key]<0||(f.min===1&&v[f.key]<=0)||(percentageLimits[f.key]!==undefined&&v[f.key]>percentageLimits[f.key]));
const x=(k:string)=>Number(v[k]??0);
const results=useMemo(()=>{
const pct=(n:number)=>n.toFixed(2)+"%";
switch(tool.slug){
case "profit-margin-calculator":{
const gross=x("price")-x("cost"),net=gross-x("expenses"),target= x("targetMargin")<100?(x("cost")+x("expenses"))/(1-x("targetMargin")/100):NaN;
return [["Gross profit",cash(gross,currency)],["Net profit",cash(net,currency)],["Net profit margin",x("price")>0?pct(net/x("price")*100):"Enter a selling price"],["Markup on product cost",x("cost")>0?pct(net/x("cost")*100):"Enter product cost"],["Selling price for target margin",Number.isFinite(target)?cash(target,currency):"Target margin must be below 100%"]];}
case "markup-calculator":{
if(mode==="reverse"){const amount=x("price")-x("cost");return [["Markup amount",cash(amount,currency)],["Markup percentage",x("cost")>0?pct(amount/x("cost")*100):"Enter a cost"],["Profit margin",x("price")>0?pct(amount/x("price")*100):"Enter a selling price"]];}
if(mode==="conversion"){const markup=x("markup"),margin=x("margin");return [["Margin from entered markup",markup>=0?pct(markup/(100+markup)*100):"—"],["Markup from entered margin",margin>=0&&margin<100?pct(margin/(100-margin)*100):"Margin must be below 100%"]];}
const amount=x("cost")*x("markup")/100,s=x("cost")+amount;
return [["Markup amount",cash(amount,currency)],["Selling price",cash(s,currency)],["Profit margin",s>0?pct(amount/s*100):"—"],["Bulk item 1 selling price",cash(x("bulk1")*(1+x("markup")/100),currency)],["Bulk item 2 selling price",cash(x("bulk2")*(1+x("markup")/100),currency)],["Bulk item 3 selling price",cash(x("bulk3")*(1+x("markup")/100),currency)]];}
case "selling-price-calculator":{
const base=x("cost")+x("shipping")+x("ads"),fees=(x("paymentFee")+x("marketFee"))/100,margin=x("margin")/100,den=1-fees-margin;
const price=den>0?base/den:NaN;
return [["Minimum profitable selling price",Number.isFinite(price)?cash(price,currency):"Combined fees and margin must be below 100%"],["Estimated profit at target",Number.isFinite(price)?cash(price*(1-fees)-base,currency):"—"],["Scenario: 20% margin",fees<.8?cash(base/(1-fees-.2),currency):"Not available"],["Scenario: 30% margin",fees<.7?cash(base/(1-fees-.3),currency):"Not available"],["Scenario: 40% margin",fees<.6?cash(base/(1-fees-.4),currency):"Not available"]];}
case "break-even-calculator":{
const contribution=x("price")-x("variable"),valid=contribution>0,be=valid?Math.ceil(x("fixed")/contribution):0,target=valid?Math.ceil((x("fixed")+x("targetProfit"))/contribution):0;
const scenario=(units:number)=>units*contribution-x("fixed");
return [["Contribution per unit",cash(contribution,currency)],["Break-even units",valid?be.toLocaleString():"Selling price must exceed variable cost"],["Break-even revenue",valid?cash(be*x("price"),currency):"—"],["Units for target profit",valid?target.toLocaleString():"—"],["Profit / loss at 50 units",cash(scenario(50),currency)],["Profit / loss at 100 units",cash(scenario(100),currency)],["Profit / loss at 200 units",cash(scenario(200),currency)]];}
case "landed-cost-calculator":{
const total=x("purchase")+x("freight")+x("insurance")+x("duties")+x("brokerage");
return [["Total landed cost",cash(total,currency)],["Landed cost per unit",x("quantity")>0?cash(total/x("quantity"),currency):"Enter a quantity"],["Freight and import charges",cash(x("freight")+x("insurance")+x("duties")+x("brokerage"),currency)]];}
case "ecommerce-profit-calculator":{
const nonAd=x("product")+x("fulfillment")+x("fees")+x("refunds")+x("overhead"),beforeAds=x("revenue")-nonAd,profit=beforeAds-x("ads");
return [["Monthly net profit",cash(profit,currency)],["Profit per order",x("orders")>0?cash(profit/x("orders"),currency):"Enter orders"],["Net profit margin",x("revenue")>0?pct(profit/x("revenue")*100):"Enter revenue"],["Break-even ROAS",beforeAds>0?(x("revenue")/beforeAds).toFixed(2)+"x":"Not available"]];}
case "wholesale-price-calculator":{
const cost=x("production")+x("labor")+x("packaging"),den=1-x("margin")/100,w=den>0?cost/den:NaN,r=w*(1+x("retailMarkup")/100);
return [["Unit production cost",cash(cost,currency)],["Base wholesale price",Number.isFinite(w)?cash(w,currency):"Margin must be below 100%"],["Suggested retail price",Number.isFinite(r)?cash(r,currency):"—"],["Retailer gross profit",Number.isFinite(r)?cash(r-w,currency):"—"],["50+ units wholesale price",Number.isFinite(w)?cash(w*(1-x("tier50")/100),currency):"—"],["100+ units wholesale price",Number.isFinite(w)?cash(w*(1-x("tier100")/100),currency):"—"],["500+ units wholesale price",Number.isFinite(w)?cash(w*(1-x("tier500")/100),currency):"—"]];}
case "product-cost-calculator":{
const total=x("materials")+x("labor")+x("packaging")+x("freight")+x("handling")+x("overhead");
return [["Total production cost",cash(total,currency)],["Cost per unit",x("quantity")>0?cash(total/x("quantity"),currency):"Enter batch quantity"],["Non-material costs",cash(total-x("materials"),currency)]];}
default:return [];
}},[v,tool.slug,currency,mode]);
const loadExample=()=>setV(Object.fromEntries(tool.fields.map(f=>[f.key,f.defaultValue])));
return <section className="calc-panel" aria-label={tool.title}><div className="calc-fields"><div className="calc-title-row"><div><h2>Enter your numbers</h2><p>Results update as you change the values.</p></div><label className="currency-picker">Currency<select value={currency} onChange={e=>setCurrency(e.target.value)}>{currencies.map(c=><option key={c}>{c}</option>)}</select></label></div>
{tool.slug==="markup-calculator"&&<label className="calc-field"><span>Calculation mode</span><select value={mode} onChange={e=>setMode(e.target.value)}><option value="price">Cost to selling price + bulk prices</option><option value="reverse">Selling price to markup</option><option value="conversion">Markup and margin conversion</option></select></label>}
{visibleFields.map(f=><label className="calc-field" key={f.key}><span>{f.label}</span><input type="number" min={f.min??0} max={percentageLimits[f.key]} step="any" value={v[f.key]} aria-invalid={invalid.some(i=>i.key===f.key)} onChange={e=>setV(s=>({...s,[f.key]:e.target.value===""?0:Number(e.target.value)}))}/></label>)}
{invalid.length>0&&<p className="validation-note">Check your inputs: values cannot be negative, quantities must be above zero, target margins and fees must be below 100%, and bulk discounts cannot exceed 100%.</p>}
</div><div className="calc-results"><span className="eyebrow">YOUR RESULTS</span>{results.map(([label,value])=><div className="result-row" key={label}><span>{label}</span><strong>{invalid.length?"Check inputs":value}</strong></div>)}<p className="calc-note">Estimates only. Use consistent currencies and verify applicable costs, taxes, duties and fees. Currency selection changes display only; it does not convert exchange rates.</p><button className="secondary-button" onClick={loadExample}>Reset values</button> <button className="secondary-button" onClick={()=>{loadExample();setMode("price")}}>Load example</button></div></section>;
}