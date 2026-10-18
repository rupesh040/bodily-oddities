import React, { useEffect, useRef, useState, useMemo, useId } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowRight, ArrowLeft, Bookmark, Search, X, ChevronDown, ChevronRight, Brain, Eye, Ear, Heart, Sparkles, Shuffle, MoveRight, Activity, Fingerprint, Bone, Hand, CircleHelp, Check, Clock3, Menu, BookOpen, ExternalLink, SlidersHorizontal, Volume2, Zap, Smile, Wind, Dna } from 'lucide-react';
import rawTopics from './data/topics.json';
import './styles.css';

const topics = rawTopics.map(t => ({ ...t, regions: Array.isArray(t.regions) ? t.regions : [t.region || 'Whole body'], tags: t.tags || [], details: t.details || [], sources: t.sources || [] }));
const regionConfig = [
  ['All oddities', Sparkles, 'all'], ['Brain', Brain, 'purple'], ['Eyes', Eye, 'blue'], ['Ears', Ear, 'peach'],
  ['Nerves', Zap, 'yellow'], ['Muscle', Hand, 'green'], ['Skin and hair', Fingerprint, 'pink'],
  ['Bones and joints', Bone, 'blue'], ['Heart and blood', Heart, 'pink'], ['Mouth and throat', Smile, 'peach'],
  ['Nose', Wind, 'green'], ['Internal organs', Activity, 'yellow'], ['Whole body', Dna, 'purple']
];
const kinds = ['All kinds', ...new Set(topics.map(t => t.kind).filter(Boolean))];
const normalize = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const isRegion = (t,r) => r === 'All oddities' || t.regions.some(v => normalize(v) === normalize(r) || (r === 'Bones and joints' && v === 'Bones') || (r === 'Mouth and throat' && v === 'Mouth') || (r === 'Skin and hair' && v === 'Skin') || (r === 'Heart and blood' && v === 'Heart'));
const getTopic = key => topics.find(t => normalize(t.title).includes(normalize(key))) || topics[0];
const featuredOrder = ['Aphantasia', 'Photic sneeze', 'Ear rumbling', 'Goosebumps', 'Hypnic', 'Afterimages'];
const featured = featuredOrder.map(getTopic).filter((t,i,a) => a.findIndex(v => v.id === t.id) === i);
const regionStyle = t => regionConfig.find(([name]) => isRegion(t,name) && name !== 'All oddities') || regionConfig[1];
const getStorage = () => { try { return JSON.parse(localStorage.getItem('bodily-saved') || '[]'); } catch { return []; } };

function Mark({size=28}) { return <span className="brand-mark"><Brain size={size}/></span>; }

function TopicArt({topic,large=false}) {
  const uid=useId().replace(/:/g,'');
  const r=topic.regions.join(' ').toLowerCase();
  const title=topic.title.toLowerCase();
  const type=r.includes('eye') ? 'eye' : r.includes('ear') ? 'ear' : r.includes('brain') || r.includes('nerve') ? 'brain' : r.includes('heart') || r.includes('blood') ? 'heart' : r.includes('bone') ? 'bone' : r.includes('skin') || title.includes('goose') ? 'skin' : 'body';
  const palette={eye:['#b8cedd','#5b8b9f'],ear:['#f1c4ad','#bc7e67'],brain:['#c9bee6','#8c79b9'],heart:['#e6b9c7','#b46683'],bone:['#d4d7e1','#9ba1b8'],skin:['#c9d6b6','#89a16a'],body:['#bcd4c9','#73a58c']}[type];
  return <div className={`topic-art art-${type} ${large?'art-large':''}`} aria-hidden="true">
    <svg viewBox="0 0 320 190" fill="none">
      <defs><linearGradient id={`g${uid}`} x1="110" y1="30" x2="210" y2="160" gradientUnits="userSpaceOnUse"><stop stopColor="#fff"/><stop offset=".3" stopColor={palette[0]}/><stop offset="1" stopColor={palette[1]}/></linearGradient><filter id={`s${uid}`}><feDropShadow dx="0" dy="10" stdDeviation="7" floodColor={palette[1]} floodOpacity=".24"/></filter></defs>
      <ellipse cx="160" cy="164" rx="64" ry="7" fill={palette[1]} opacity=".10"/>
      <g filter={`url(#s${uid})`} fill={`url(#g${uid})`} stroke={palette[1]} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      {type==='brain' && <><path d="M158 43c-15-17-38-7-42 8-18-3-34 14-30 29-16 10-13 35 2 42-3 18 14 32 32 26 10 13 29 10 38-1V43Z"/><path d="M162 43c15-17 38-7 42 8 18-3 34 14 30 29 16 10 13 35-2 42 3 18-14 32-32 26-10 13-29 10-38-1V43Z"/><g fill="none" opacity=".7" strokeWidth="3"><path d="M116 51c17 2 27 15 18 29m-47 0c9-3 25 2 23 18m-22 24c11-13 32-11 35 4m-3 22c-1-14 12-28 25-25m-14-34c17 3 17 16 10 22m63-60c-17 2-27 15-18 29m47 0c-9-3-25 2-23 18m22 24c-11-13-32-11-35 4m3 22c1-14-12-28-25-25m14-34c-17 3-17 16-10 22"/></g></>}
      {type==='eye' && <><path d="M65 100c44-69 145-69 190 0-45 69-146 69-190 0Z" fill="#f7fbfc"/><circle cx="160" cy="100" r="45"/><circle cx="160" cy="100" r="28" fill={palette[1]}/><circle cx="160" cy="100" r="16" fill="#354c58"/>{Array.from({length:24},(_,i)=><path key={i} d="M160 58v10" transform={`rotate(${i*15} 160 100)`} opacity=".5"/>)}<circle cx="149" cy="87" r="10" fill="white" stroke="none"/><path d="M66 96c45-65 144-65 188 0" strokeWidth="4"/></>}
      {type==='ear' && <><path d="M134 145c-18-9-34-31-33-59 0-32 22-53 53-53s53 20 53 48c0 27-20 35-26 56-6 26-27 35-42 20Z"/><path d="M131 122c-8-12-17-26-15-41 3-20 17-33 36-33s38 13 37 31c0 13-9 21-20 31m-30-6c-18-27 19-47 30-26 5 11-10 19-18 20-9 3-9 17-2 22 15 13 5 32-6 28" fill="none" strokeWidth="6" opacity=".65"/></>}
      {type==='heart' && <><path d="m153 51-1-24 16-3 8 31c18-3 32 9 33 25 2 13-3 41-24 58l-23 22c-35-10-59-31-63-56-3-21 7-41 25-42 9-1 17 3 22 8Z"/><path d="m126 61-8-21 15-7 12 29m32-8 15-21 11 9-15 22m-28 5-3 29 23 25m-23-25-31 16m29-13-4 36" fill="none" strokeWidth="8"/></>}
      {type==='bone' && <path d="M107 62c-18 4-22-19-8-27 13-8 25 2 26 13l68 65c11-5 24-1 25 11 2 12-8 20-18 17-2 13-15 18-24 11-10-7-8-19-3-24l-64-65c-1 0-1 0-2-1Z"/>}
      {type==='skin' && <><path d="M76 121c27-17 57 12 83 0s54 13 85-4v25c-31 17-60-8-85 4s-56-17-83 0v-25Z"/>{[95,126,158,190,221].map((x,i)=><g key={x}><path d={`M${x} ${119+i%2*4}q-9-31 1-53`} strokeWidth="3"/><ellipse cx={x} cy={119+i%2*4} rx="7" ry="4" fill={palette[0]}/></g>)}</>}
      {type==='body' && <><circle cx="160" cy="48" r="20"/><path d="M141 74c-12 4-19 17-20 34l-9 23c-3 10 9 15 14 6l15-27 1 43c0 13 16 13 17 1l1-27 2 27c1 12 17 12 17-1l1-43 15 27c5 9 17 4 14-6l-9-23c-1-17-8-30-20-34Z"/></>}
      </g><circle cx="252" cy="46" r="3" fill={palette[0]}/><circle cx="74" cy="139" r="4" fill={palette[0]}/>
    </svg>
  </div>;
}

function App() {
  const [region,setRegion]=useState('All oddities');
  const [kind,setKind]=useState('All kinds');
  const [query,setQuery]=useState('');
  const [showAll,setShowAll]=useState(false);
  const [saved,setSaved]=useState(getStorage);
  const [savedOnly,setSavedOnly]=useState(false);
  const [article,setArticle]=useState(null);
  const [info,setInfo]=useState(false);
  const [lab,setLab]=useState(false);
  const [mobileMenu,setMobileMenu]=useState(false);
  const [toast,setToast]=useState('');
  const [filterOpen,setFilterOpen]=useState(false);
  const searchRef=useRef(null);
  const articleRef=useRef(null);
  const savedRef=useRef(saved);
  savedRef.current=saved;

  useEffect(()=>{ try {localStorage.setItem('bodily-saved',JSON.stringify(saved));}catch{} },[saved]);
  useEffect(()=>{if(!toast)return;const id=setTimeout(()=>setToast(''),2400);return()=>clearTimeout(id);},[toast]);
  const openTopic=t=>{setArticle(t);const hash=`#oddity/${t.slug||t.id}`;if(location.hash!==hash)history.pushState({bodilyArticle:true},'',hash);};
  const closeTopic=()=>{setArticle(null);if(location.hash.startsWith('#oddity/')){if(history.state?.bodilyArticle)history.back();else history.replaceState(null,'',location.pathname+location.search);}};
  useEffect(()=>{const sync=()=>{let slug;try{slug=decodeURIComponent(location.hash.replace('#oddity/',''));}catch{setArticle(null);return;}const t=location.hash.startsWith('#oddity/')?topics.find(t=>t.slug===slug||t.id===slug):null;setArticle(t||null);};sync();window.addEventListener('popstate',sync);window.addEventListener('hashchange',sync);return()=>{window.removeEventListener('popstate',sync);window.removeEventListener('hashchange',sync);};},[]);
  useEffect(()=>{
    const onKey=e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();document.getElementById('explore').scrollIntoView({behavior:'smooth'});searchRef.current?.focus();}if(e.key==='Escape'){closeTopic();setInfo(false);setLab(false);setMobileMenu(false);}};
    window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);
  },[]);
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:.08});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));return()=>observer.disconnect();
  },[showAll,region,query,savedOnly,kind]);
  const save=(t,e)=>{e?.stopPropagation();const exists=savedRef.current.includes(t.id);setSaved(s=>exists?s.filter(id=>id!==t.id):[...s,t.id]);setToast(exists?'Removed from your collection':'Saved to your collection');};
  const filtered=useMemo(()=>topics.filter(t=>isRegion(t,region)&&(kind==='All kinds'||t.kind===kind)&&(!savedOnly||saved.includes(t.id))&&`${t.title} ${t.summary} ${t.regions.join(' ')} ${t.tags.join(' ')} ${t.kind}`.toLowerCase().includes(query.toLowerCase())),[region,kind,query,savedOnly,saved]);
  const isFiltered=region!=='All oddities'||kind!=='All kinds'||query||savedOnly;
  const displayed=isFiltered||showAll?filtered:featured;
  const explore=()=>{setMobileMenu(false);document.getElementById('explore').scrollIntoView({behavior:'smooth'});};
  const home=()=>{setRegion('All oddities');setKind('All kinds');setQuery('');setShowAll(false);setSavedOnly(false);};
  const random=()=>openTopic(topics[Math.floor(Math.random()*topics.length)]);
  const chooseRegion=r=>{setRegion(r);setSavedOnly(false);setShowAll(true);};

  return <>
    <a className="skip-link" href="#explore">Skip to discoveries</a>
    <header className="site-header">
      <div className="nav-shell">
        <a href="#" className="brand" onClick={home} aria-label="Bodily Oddities home"><Mark size={25}/><span>bodily<span className="brand-light">oddities</span><span className="brand-dot">.</span></span></a>
        <nav className={mobileMenu?'nav-links mobile-open':'nav-links'} aria-label="Main navigation">
          <button onClick={explore} className="active">Discover</button>
          <button onClick={()=>{explore();setFilterOpen(true);}}>The body</button>
          <button onClick={()=>{setLab(true);setMobileMenu(false);}}>Try it yourself <span className="new-dot"/></button>
          <button onClick={()=>{setInfo(true);setMobileMenu(false);}}>Our curiosity</button>
        </nav>
        <div className="nav-actions"><button className={`icon-button saved-nav ${savedOnly?'selected':''}`} title="Your saved discoveries" aria-pressed={savedOnly} aria-label={`Saved discoveries, ${saved.length}`} onClick={()=>{setSavedOnly(!savedOnly);setRegion('All oddities');setQuery('');setKind('All kinds');explore();}}><Bookmark size={19}/>{saved.length>0&&<span className="save-count">{saved.length}</span>}</button><span className="nav-divider"/><button className="surprise-nav" onClick={random}><Shuffle size={15}/> Surprise me</button><button className="icon-button mobile-toggle" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="Toggle menu" aria-expanded={mobileMenu}><Menu size={21}/></button></div>
      </div>
    </header>

    <main>
      <section className="hero section-wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="tiny-spark">✦</span> A FIELD GUIDE TO BEING HUMAN</div>
          <h1>Your body.<br/>Endlessly<br/><span>extraordinary.</span></h1>
          <p>Strange little things. Fascinating science.<br className="desktop-break"/> Discover the wonderfully weird world within you.</p>
          <div className="hero-ctas"><button className="button button-dark" onClick={explore}>Feed your curiosity <ArrowRight size={17}/></button><button className="text-button" onClick={random}><Shuffle size={16}/> Surprise me</button></div>
          <div className="hero-note"><span className="overlap-dots"><i/><i/><i/></span><span>{topics.length} oddities. One remarkable you.</span></div>
        </div>
        <div className="hero-visual">
          <div className="orbit orbit-one"/><div className="orbit orbit-two"/>
          <img className="hero-brain" src="/images/brain-hero.png" alt="An original sculpted lavender brain, floating in a soft pool of light" fetchPriority="high"/>
          <span className="hero-label label-one"><span className="label-dot"/> UNEXPECTED BY NATURE</span>
          <button className="floating-fact" onClick={()=>openTopic(getTopic('Aphantasia'))}><span className="fact-icon"><Eye size={19}/></span><span><small>A LITTLE MIND-BENDING</small><strong>Can you picture an apple?</strong><span>Not everyone can. <ArrowUpRight size={12}/></span></span></button>
          <div className="visual-caption"><span className="caption-line"/> THE MOST INTERESTING THING<br/> YOU’LL EVER EXPLORE IS YOU.</div>
          <span className="visual-spark spark-one">✦</span><span className="visual-spark spark-two">+</span>
        </div>
      </section>

      <div className="promise-bar"><div className="section-wrap promise-inner"><span><BookOpen size={16}/> Real science. Simply explained.</span><i/><span><Clock3 size={16}/> Big ideas. Bite-sized reads.</span><i/><span><Sparkles size={16}/> A little wonder in your everyday.</span></div></div>

      <section id="explore" className="explore section-wrap">
        <div className="section-heading reveal"><div><div className="eyebrow">FOLLOW YOUR CURIOSITY</div><h2>There’s a whole world in you.</h2><p>Start anywhere. Find something that makes you go “wait, really?”</p></div><span className="library-count">{topics.length} discoveries <span className="green-dot"/></span></div>
        <div className="library-controls reveal"><div className="category-tabs" aria-label="Filter by body region">{regionConfig.slice(0,7).map(([name,Icon])=><button key={name} aria-pressed={region===name&&!savedOnly} className={region===name&&!savedOnly?'category-tab selected':'category-tab'} onClick={()=>chooseRegion(name)}><Icon size={16}/>{name==='Skin and hair'?'Skin & hair':name}</button>)}<button className={`category-tab more-tab ${filterOpen?'selected':''}`} onClick={()=>setFilterOpen(!filterOpen)} aria-expanded={filterOpen}>More <ChevronDown size={14}/></button></div></div>
        {filterOpen&&<div className="expanded-filters"><div><span className="filter-label">MORE TO EXPLORE</span><div className="filter-options">{regionConfig.slice(7).map(([name,Icon])=><button aria-pressed={region===name} className={region===name?'selected':''} onClick={()=>chooseRegion(name)} key={name}><Icon size={15}/>{name}</button>)}</div></div><label className="kind-select">Kind of curiosity<select value={kind} onChange={e=>{setKind(e.target.value);setShowAll(true);}}>{kinds.map(k=><option key={k}>{k}</option>)}</select></label></div>}
        <div className="results-bar"><div className="results-label">{savedOnly?<><Bookmark size={15}/> Your collection</>:isFiltered?<>{filtered.length} discoveries {region!=='All oddities'?`· ${region}`:''}</>:showAll?'The complete collection':'A few favorites to get you started'}{isFiltered&&<button className="clear-filters" onClick={()=>{setQuery('');setRegion('All oddities');setKind('All kinds');setSavedOnly(false);}}>Clear <X size={12}/></button>}</div><div className="search-field"><Search size={17}/><input ref={searchRef} type="search" placeholder="Search your curiosity…" aria-label="Search all oddities" value={query} onChange={e=>setQuery(e.target.value)}/><kbd>/</kbd></div></div>
        <div className="topic-grid">{displayed.map((t,i)=><article key={t.id} className="topic-card reveal" style={{'--delay':`${i%3*60}ms`}}><button className="card-open" onClick={()=>openTopic(t)} aria-label={`Read about ${t.title}`}><TopicArt topic={t}/><div className="card-content"><div className="card-meta"><span className={`region-dot dot-${regionStyle(t)[2]}`}/><span>{t.regions[0]}</span><span className="meta-divider">·</span><span>{t.kind}</span></div><h3>{t.title}<ArrowUpRight size={18}/></h3><p>{t.summary}</p><div className="card-bottom"><span><Clock3 size={12}/> {Math.max(1,Math.ceil((t.summary+' '+t.details.map(d=>d.text).join(' ')).split(' ').length/180))} min of wonder</span><span className="quick-read">Quick read <ArrowRight size={13}/></span></div></div></button><button className={`bookmark-button ${saved.includes(t.id)?'is-saved':''}`} onClick={e=>save(t,e)} aria-pressed={saved.includes(t.id)} aria-label={`${saved.includes(t.id)?'Unsave':'Save'} ${t.title}`} title={saved.includes(t.id)?'Remove from collection':'Save for later'}><Bookmark size={17} fill={saved.includes(t.id)?'currentColor':'none'}/></button></article>)}</div>
        {displayed.length===0&&<div className="empty-state"><Search size={32}/><h3>{savedOnly?'Your curiosity collection starts here.':'No oddities found. Yet.'}</h3><p>{savedOnly?'Tap the bookmark on any discovery to keep it for later.':'Try a word like “sleep”, “eyes”, or “sound”.'}</p><button className="button button-light" onClick={()=>{setSavedOnly(false);setQuery('');setRegion('All oddities');setKind('All kinds');}}>Explore all discoveries <ArrowRight size={16}/></button></div>}
        {!showAll&&!isFiltered&&<div className="view-all"><button className="button button-light" onClick={()=>setShowAll(true)}>Explore all {topics.length} oddities <ArrowRight size={16}/></button><span>There’s always something you didn’t know.</span></div>}
      </section>

      <section id="try" className="try-section section-wrap reveal"><div className="try-panel"><div className="try-copy"><div className="eyebrow"><span className="live-dot"/> CURIOSITY, HANDS-ON</div><h2>Don’t just read it.<br/><span>Experience it.</span></h2><p>Your body is a pretty incredible science lab.<br/>Try a little experiment. Meet a new side of you.</p><button className="button button-dark" onClick={()=>setLab(true)}>Try something surprising <ArrowUpRight size={17}/></button><span className="try-note">No equipment. Just you and a little curiosity.</span></div><button className="experiment-preview" onClick={()=>setLab(true)} aria-label="Open the afterimage experiment"><span className="experiment-number">EXPERIMENT 01 / YOUR EYES</span><div className="illusion"><div className="illusion-ring ring-a"/><div className="illusion-ring ring-b"/><div className="illusion-ring ring-c"/><div className="illusion-center">+</div><div className="illusion-line line-h"/><div className="illusion-line line-v"/></div><div className="experiment-caption"><span>Seeing isn’t always believing.</span><span className="round-arrow"><ArrowUpRight size={21}/></span></div></button></div></section>

      <section className="discovery-banner section-wrap reveal"><div className="discovery-icon"><Sparkles size={29}/></div><div><span className="eyebrow">ONE MORE BEFORE YOU GO</span><h2>A tiny discovery. A new perspective.</h2><p>Let your next rabbit hole find you.</p></div><button className="button button-light" onClick={random}><Shuffle size={16}/> Take me somewhere new</button></section>
    </main>

    <footer className="footer"><div className="section-wrap footer-top"><div><a href="#" className="brand" onClick={home}><Mark size={24}/><span>bodily<span className="brand-light">oddities</span><span className="brand-dot">.</span></span></a><p>A little wonder. A lot of you.</p></div><div className="footer-links"><button onClick={explore}>Explore the collection</button><button onClick={()=>setInfo(true)}>About this project</button><a href="https://bodilyoddities.com/" target="_blank" rel="noreferrer">The original inspiration <ArrowUpRight size={13}/></a></div></div><div className="section-wrap footer-bottom"><span>Made for curious humans.</span><span>Educational exploration. Not personal medical advice.</span><span>Stay wonderfully weird. <Sparkles size={12}/></span></div></footer>

    {toast&&<div className="toast" role="status"><Check size={17}/>{toast}</div>}
    {article&&<Modal onClose={closeTopic} className="article-modal"><div className="article-art"><TopicArt topic={article} large/><button className={`article-save icon-button ${saved.includes(article.id)?'selected':''}`} onClick={e=>save(article,e)} aria-pressed={saved.includes(article.id)} aria-label="Save article"><Bookmark fill={saved.includes(article.id)?'currentColor':'none'} size={20}/></button></div><div className="article-body"><div className="card-meta"><span className="region-dot dot-purple"/>{article.regions.join(' · ')} <span>·</span> {article.kind}</div><h2>{article.title}</h2><div className="summary-box"><span className="eyebrow"><Sparkles size={13}/> THE SHORT VERSION</span><p>{article.summary}</p></div>{article.prevalence&&<div className="prevalence"><Dna size={19}/><div><small>HOW COMMON?</small><span>{article.prevalence}</span></div></div>}{article.details.filter(d=>d.text).map((d,i)=><section className="article-section" key={i}><h3>{d.title}</h3><p>{d.text}</p></section>)}{article.tags.length>0&&<div className="article-tags">{(article.tagLabels||article.tags).map(tag=><span key={tag}>{tag}</span>)}</div>}<div className="article-sources"><h3>Keep exploring</h3><a href={article.sourceUrl} target="_blank" rel="noreferrer">Read the original Bodily Oddities entry <ExternalLink size={14}/></a>{article.sources.filter(s=>s.url!==article.sourceUrl).slice(0,3).map((s,i)=><a key={i} href={s.url} target="_blank" rel="noreferrer">{s.title||'Research source'} <ExternalLink size={13}/></a>)}{article.sources.filter(s=>s.url!==article.sourceUrl).length>3&&<details className="more-sources"><summary>All {article.sources.filter(s=>s.url!==article.sourceUrl).length} research & further-reading links</summary>{article.sources.filter(s=>s.url!==article.sourceUrl).slice(3).map((s,i)=><a key={i} href={s.url} target="_blank" rel="noreferrer">{s.title||'Further reading'} <ExternalLink size={13}/></a>)}</details>}</div><p className="article-disclaimer">For curiosity and learning. If an experience is new, painful, persistent, or worrying, seek advice from a qualified health professional.</p><div className="article-next"><button className="text-button" onClick={()=>{const next=topics[(topics.indexOf(article)+1)%topics.length];openTopic(next);articleRef.current?.scrollTo(0,0);document.querySelector('.modal')?.scrollTo(0,0);}}>One more discovery <ArrowRight size={16}/></button><button className="text-button" onClick={()=>{const link=location.href;if(navigator.clipboard?.writeText)navigator.clipboard.writeText(link).then(()=>setToast('Discovery link copied')).catch(()=>setToast('Copy this page’s address to share'));else setToast('Copy this page’s address to share');}}>Copy link <ExternalLink size={14}/></button></div></div></Modal>}
    {info&&<Modal onClose={()=>setInfo(false)} className="info-modal"><Mark size={34}/><div className="eyebrow">A FIELD GUIDE TO BEING HUMAN</div><h2>A little science.<br/>A lot of wonder.</h2><p>Most of us live in our bodies without noticing just how surprising they are. This is a space to slow down, look closer, and enjoy the odd little details of being human.</p><p>The original collection is by Demjan Vester. This independent redesign is inspired by <a href="https://bodilyoddities.com/" target="_blank" rel="noreferrer">Bodily Oddities</a>. It brings the reference collection together with fresh short summaries, accessible reading views, and playful experiments. Every entry links back to its original page and available research references.</p><div className="info-stats"><div><strong>{topics.length}</strong><span>discoveries</span></div><div><strong>12</strong><span>body regions</span></div><div><strong>∞</strong><span>curiosity</span></div></div><p className="info-fineprint">The source catalog can change over time. Commonness estimates and evidence vary between studies. This is educational content, not a diagnostic tool. Apple-inspired visual design; no affiliation with Apple or the reference site.</p><button className="button button-dark" onClick={()=>{setInfo(false);explore();}}>Find your next discovery <ArrowRight size={16}/></button></Modal>}
    {lab&&<Modal onClose={()=>setLab(false)} className="lab-modal"><Experiment onRead={()=>{setLab(false);openTopic(getTopic('Afterimages'));}}/></Modal>}
  </>;
}

function Modal({children,onClose,className=''}) {
  const ref=useRef(null);
  useEffect(()=>{
    const previous=document.activeElement;document.body.style.overflow='hidden';
    const controls=()=>[...ref.current.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),[tabindex="0"]')];
    (controls()[0]||ref.current).focus();
    const trap=e=>{if(e.key!=='Tab')return;const focusable=controls();const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&(document.activeElement===first||document.activeElement===ref.current)){e.preventDefault();last?.focus();}else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===ref.current)){e.preventDefault();first?.focus();}};
    ref.current.addEventListener('keydown',trap);return()=>{document.body.style.overflow='';previous?.focus();};
  },[]);
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><div className={`modal ${className}`} role="dialog" aria-modal="true" aria-label={className==='article-modal'?'Discovery reading view':className==='lab-modal'?'Interactive afterimage experiment':'About Bodily Oddities'} tabIndex="-1" ref={ref}><button className="modal-close icon-button" onClick={onClose} aria-label="Close dialog"><X size={20}/></button>{children}</div></div>;
}

function Experiment({onRead}) {
  const [stage,setStage]=useState('ready');
  const [remaining,setRemaining]=useState(20);
  useEffect(()=>{if(stage!=='stare')return;setRemaining(20);const timer=setInterval(()=>setRemaining(s=>{if(s<=1){clearInterval(timer);setStage('observe');return 0;}return s-1;}),1000);return()=>clearInterval(timer);},[stage]);
  return <><div className="eyebrow"><Eye size={15}/> THE AFTERIMAGE EXPERIMENT</div><h2>A little trick<br/>of the light.</h2><p className="lab-intro">Your visual system adjusts to what it sees. Let’s catch it in the act.</p><div className={`lab-canvas stage-${stage}`}><div className="lab-disc">{stage==='stare'||stage==='ready'?<div className="color-disc"><span>+</span></div>:<span className="observe-plus">+</span>}</div><span className="lab-status">{stage==='stare'?`Keep looking at the + · ${remaining}s`:stage==='observe'?'Keep looking at the + on the white background':'One color. Twenty seconds. A small surprise.'}</span>{stage==='stare'&&<div className="lab-progress"><div style={{width:`${(20-remaining)*5}%`}}/></div>}</div><div className="lab-instructions"><span className="step-badge">{stage==='ready'?'01':stage==='stare'?'02':'03'}</span><div><h3>{stage==='ready'?'Find the center.':stage==='stare'?'Stay with the little plus.':'Notice anything?'}</h3><p>{stage==='ready'?'Tap Start, then look gently at the + for 20 seconds. Use a comfortable screen brightness.':stage==='stare'?'Keep your gaze on the +. The color will disappear when the timer ends. Blink naturally; stop if uncomfortable.':'You may see a faint pink or reddish circle after the cyan disappears. It fades as your visual system readjusts. Experiences vary.'}</p></div></div><div className="lab-actions"><button className="button button-dark" disabled={stage==='stare'} onClick={()=>setStage('stare')}>{stage==='ready'?'Start the experiment':stage==='stare'?'A little patience…':'Try it again'} <ArrowRight size={16}/></button><button className="text-button" onClick={onRead}>Why does this happen? <ArrowUpRight size={16}/></button></div><p className="lab-footnote">A screen-based color illusion. Never look at the sun or bright lights to create an afterimage.</p></>;
}

createRoot(document.getElementById('root')).render(<App/>);
