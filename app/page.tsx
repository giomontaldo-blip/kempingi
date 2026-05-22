import { VOIVODATY } from "../lib/voivodaty";

export const revalidate = 3600;

export default async function HomePage() {
  return (
    <div id="main-content">
      <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 20px",borderBottom:"1px solid #eee"}}>
        <a href="/" style={{display:"flex",alignItems:"center",gap:"8px",textDecoration:"none"}}>
          <svg width="28" height="30" viewBox="0 0 52 56">
            <polygon points="6,47 26,7 46,47" fill="#1D9E75"/>
            <polygon points="17,47 26,31 35,47" fill="#E1F5EE"/>
            <line x1="1" y1="50" x2="51" y2="50" stroke="#0F6E56" strokeWidth="3.5" strokeLinecap="round"/>
          </svg>
          <span style={{fontSize:"20px",fontWeight:500,color:"#111"}}>kempingi<span style={{color:"#1D9E75"}}>.com</span></span>
        </a>
        <nav style={{display:"flex",gap:"20px",fontSize:"14px"}}>
          <a href="/kempingi/" style={{color:"#555",textDecoration:"none"}}>Województwa</a>
          <a href="/obszar/" style={{color:"#555",textDecoration:"none"}}>Obszary</a>
          <a href="/kategoria/" style={{color:"#555",textDecoration:"none"}}>Kategorie</a>
        </nav>
      </header>

      <section style={{background:"#E1F5EE",padding:"40px 20px",textAlign:"center"}}>
        <h1 style={{fontSize:"28px",fontWeight:500,color:"#085041",marginBottom:"8px"}}>Najlepsze kempingi w Polsce</h1>
        <p style={{color:"#0F6E56",marginBottom:"24px",fontSize:"14px"}}>Ponad 2 000 kempingów w całym kraju</p>
        <div style={{display:"flex",gap:"8px",maxWidth:"500px",margin:"0 auto"}}>
          <input type="search" placeholder="Szukaj kempingu..." style={{flex:1,padding:"10px 14px",border:"1px solid #9FE1CB",borderRadius:"8px",fontSize:"14px"}} aria-label="Szukaj kempingów"/>
          <button style={{padding:"10px 20px",background:"#1D9E75",color:"white",border:"none",borderRadius:"8px",fontSize:"14px",fontWeight:500,cursor:"pointer"}}>Szukaj</button>
        </div>
      </section>

      <section style={{padding:"24px 20px"}}>
        <h2 style={{fontSize:"16px",fontWeight:500,marginBottom:"16px"}}>Kempingi według województwa</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",gap:"8px"}}>
          {VOIVODATY.map((v) => (
            <a key={v.slug} href={`/kempingi/${v.slug}/`} style={{display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid #e5e7eb",borderRadius:"8px",padding:"8px 12px",textDecoration:"none",color:"#111"}}>
              <span style={{fontSize:"13px"}}>{v.name}</span>
            </a>
          ))}
        </div>
      </section>

      <footer style={{padding:"16px 20px",borderTop:"1px solid #eee",display:"flex",justifyContent:"space-between",fontSize:"12px",color:"#999"}}>
        <span>© 2026 kempingi.com</span>
        <nav style={{display:"flex",gap:"16px"}}>
          <a href="/o-nas/" style={{color:"#999",textDecoration:"none"}}>O nas</a>
          <a href="/kontakt/" style={{color:"#999",textDecoration:"none"}}>Kontakt</a>
        </nav>
      </footer>
    </div>
  );
}
