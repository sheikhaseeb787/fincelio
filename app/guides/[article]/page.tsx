import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {guides} from "@/lib/guides";
import {SiteHeader,SiteFooter} from "@/app/components/site-chrome";
export function generateStaticParams(){return guides.map(guide=>({article:guide.slug}));}
export async function generateMetadata({params}:{params:{article:string}}):Promise<Metadata>{
 const {article}=params;const guide=guides.find(item=>item.slug===article);
 if(!guide)return {};
 return {title:guide.title,description:guide.description,alternates:{canonical:"/guides/"+guide.slug+"/"}};
}
export default async function GuideArticle({params}:{params:Promise<{article:string}>}){
 const {article}=await params;const guide=guides.find(item=>item.slug===article);if(!guide)notFound();
 return <><SiteHeader/><main className="site-shell"><div className="breadcrumbs"><Link href="/">Home</Link> / <Link href="/guides/">Guides</Link> / {guide.title}</div><header className="page-intro"><span className="eyebrow">FINCELIO GUIDE</span><h1>{guide.title}</h1><p>{guide.intro}</p></header><article className="content-article">{guide.sections.map(section=><section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}<h2>Related calculators</h2><div className="related-grid"><Link href="/profit-margin-calculator/">Profit Margin Calculator →</Link><Link href="/markup-calculator/">Markup Calculator →</Link><Link href="/selling-price-calculator/">Selling Price Calculator →</Link><Link href="/landed-cost-calculator/">Landed Cost Calculator →</Link></div></article></main><SiteFooter/></>;
}