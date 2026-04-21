'use client'
import { useEffect, useRef } from 'react'

export default function HomePage() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W, H, stars = [], nebulas = [], shooters = [], frame = 0
    let scrollY = 0

    function rnd(a, b) { return a + Math.random() * (b - a) }

    function init() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
      stars = []
      for (let i = 0; i < 380; i++) {
        stars.push({
          x: Math.random(), y: Math.random(),
          r: rnd(0.15, 1.8), a: rnd(0.3, 1),
          ts: rnd(0.004, 0.018), to: Math.random() * Math.PI * 2,
          col: Math.random() < 0.3 ? '#a0d8ff' : Math.random() < 0.5 ? '#00ffcc' : '#ffffff',
          par: rnd(0.06, 0.28)
        })
      }
      nebulas = [
        { x: 0.12, y: 0.22, r: 0.42, c: '0,100,220', i: 0.20, par: 0.07 },
        { x: 0.80, y: 0.50, r: 0.35, c: '100,0,210', i: 0.16, par: 0.13 },
        { x: 0.48, y: 0.06, r: 0.30, c: '0,200,150', i: 0.13, par: 0.05 },
        { x: 0.90, y: 0.12, r: 0.22, c: '60,0,190', i: 0.10, par: 0.16 },
        { x: 0.20, y: 0.78, r: 0.28, c: '0,130,255', i: 0.12, par: 0.09 },
        { x: 0.62, y: 0.88, r: 0.24, c: '80,0,170', i: 0.09, par: 0.11 },
        { x: 0.50, y: 0.50, r: 0.50, c: '0,60,180', i: 0.07, par: 0.04 },
      ]
    }

    function draw() {
      frame++
      ctx.clearRect(0, 0, W, H)
      const bg = ctx.createLinearGradient(0, 0, W * 0.7, H)
      bg.addColorStop(0, '#00030f')
      bg.addColorStop(0.45, '#020520')
      bg.addColorStop(1, '#050212')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)
      const sOff = scrollY * 0.3
      nebulas.forEach(n => {
        const nx = n.x * W, ny = n.y * H - sOff * n.par * 3
        const nr = n.r * Math.min(W, H)
        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr)
        g.addColorStop(0, `rgba(${n.c},${n.i})`)
        g.addColorStop(0.4, `rgba(${n.c},${n.i * 0.35})`)
        g.addColorStop(1, `rgba(${n.c},0)`)
        ctx.fillStyle = g
        ctx.fillRect(0, 0, W, H)
      })
      stars.forEach(s => {
        const twinkle = Math.sin(frame * s.ts + s.to) * 0.3 + 0.7
        const rawY = s.y * H * 3 - sOff * s.par
        const sy = ((rawY % (H * 3)) + H * 3) % (H * 3) % H
        ctx.beginPath()
        ctx.arc(s.x * W, sy, s.r, 0, Math.PI * 2)
        ctx.fillStyle = s.col
        ctx.globalAlpha = s.a * twinkle
        ctx.fill()
        if (s.r > 1.2) {
          ctx.beginPath()
          ctx.arc(s.x * W, sy, s.r * 3.5, 0, Math.PI * 2)
          ctx.globalAlpha = s.a * twinkle * 0.18
          ctx.fill()
        }
        ctx.globalAlpha = 1
      })
      if (Math.random() < 0.012) {
        shooters.push({ x: Math.random() * W, y: Math.random() * H * 0.35, len: rnd(90, 170), spd: rnd(9, 18), a: 1, ang: rnd(0.28, 0.68) })
      }
      shooters = shooters.filter(s => s.a > 0.02)
      shooters.forEach(s => {
        ctx.save()
        ctx.globalAlpha = s.a
        const g = ctx.createLinearGradient(s.x, s.y, s.x - Math.cos(s.ang) * s.len, s.y - Math.sin(s.ang) * s.len)
        g.addColorStop(0, 'rgba(0,255,200,0.95)')
        g.addColorStop(1, 'rgba(0,255,200,0)')
        ctx.strokeStyle = g
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - Math.cos(s.ang) * s.len, s.y - Math.sin(s.ang) * s.len)
        ctx.stroke()
        ctx.restore()
        s.x += Math.cos(s.ang) * s.spd
        s.y += Math.sin(s.ang) * s.spd
        s.a *= 0.93
      })
      requestAnimationFrame(draw)
    }

    const onScroll = () => { scrollY = window.scrollY }
    const onResize = () => { init() }
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    init()
    draw()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  function scrollToSection(id) {
    const el = document.querySelector(id)
    if (!el) return
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' })
  }

  function toggleFaq(btn) {
    const item = btn.closest('.faq-item')
    const isOpen = item.classList.contains('open')
    item.closest('.faq-block').querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'))
    if (!isOpen) item.classList.add('open')
  }

  function openDashboard() { document.getElementById('dashModal').classList.add('open') }
  function closeDashboard() { document.getElementById('dashModal').classList.remove('open') }

  const faqData = {
    kimiz: [
      'EchoKush nasıl bir platform?',
      'Kimler başvurabilir?',
      'Platform ücretsiz mi?',
      'EchoKush Vakfı nedir?',
      'İletişim ve destek nasıl sağlanır?',
    ],
    yayincilar: [
      'Podcast nedir, nasıl üretilir?',
      'Sesli kitap üretmek için ne gerekli?',
      'Yayıncı olarak hangi içeriklere erişebilirim?',
      'Eser sahibiyle nasıl iletişim kurarım?',
      'Yayıncı başvurusu nasıl değerlendirilir?',
    ],
    eserler: [
      'Hangi eser türleri kabul edilir?',
      'Telif haklarım güvende mi?',
      'Eserim hangi formatlara dönüştürülür?',
      'Yayıncıyı ben mi seçiyorum?',
      'Eser başvurusu nasıl yapılır?',
    ],
    gelir: [
      'Ödemeler nasıl gerçekleşir?',
      'Gelir payı oranları nasıl belirleniyor?',
      'Minimum ödeme eşiği nedir?',
      'Vergi ve fatura süreci nasıl işler?',
      "EchoKush'un platform kesintisi ne kadar?",
    ],
    isleyis: [
      'Hakem kurulu kimlerden oluşur?',
      'Başvurum ne kadar sürede değerlendirilir?',
      'Anlaşmazlık durumunda ne olur?',
      'Sözleşme süreci nasıl işler?',
      "Dashboard'da neler takip edebilirim?",
    ],
  }

  const FaqBlock = ({ items }) => (
    <div className="faq-block">
      {items.map((q, i) => (
        <div className="faq-item" key={i}>
          <button className="faq-question" onClick={e => toggleFaq(e.currentTarget)}>
            <span className="faq-question-text">{q}</span>
            <span className="faq-icon">+</span>
          </button>
          <div className="faq-answer">
            <div className="faq-answer-inner">Cevap buraya gelecek.</div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{background:#00030f;font-family:Georgia,serif;overflow-x:hidden;color:#fff}
        #galaxy-canvas{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none}
        .page{position:relative;z-index:1}
        .navbar{position:fixed;top:0;left:0;right:0;z-index:200;backdrop-filter:blur(18px);background:rgba(0,3,15,0.55);border-bottom:1px solid rgba(0,255,180,0.07)}
        .nav-top{display:flex;align-items:center;justify-content:space-between;padding:14px 48px;border-bottom:1px solid rgba(0,255,180,0.05)}
        .nav-logo{font-size:20px;font-weight:900;letter-spacing:5px;text-transform:uppercase;color:#fff;text-shadow:0 0 20px rgba(0,180,255,0.5);cursor:pointer;text-decoration:none}
        .nav-logo span{color:#00ffb4}
        .nav-vakif{font-size:10px;letter-spacing:3px;text-transform:uppercase;font-family:sans-serif;color:rgba(0,255,180,0.5);border:1px solid rgba(0,255,180,0.15);padding:5px 14px;border-radius:20px;cursor:pointer;transition:all 0.3s;text-decoration:none}
        .nav-vakif:hover{color:#00ffb4;border-color:rgba(0,255,180,0.4);background:rgba(0,255,180,0.05)}
        .nav-actions{display:flex;gap:12px;align-items:center}
        .nav-dashboard{font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:sans-serif;font-weight:700;color:#00ffb4;border:1px solid rgba(0,255,180,0.35);padding:7px 18px;border-radius:3px;cursor:pointer;background:rgba(0,255,180,0.06);transition:all 0.3s}
        .nav-dashboard:hover{background:rgba(0,255,180,0.15);box-shadow:0 0 16px rgba(0,255,180,0.18)}
        .nav-apply{font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:sans-serif;font-weight:700;color:#00030f;background:#00ffb4;border:none;padding:8px 20px;border-radius:3px;cursor:pointer;transition:all 0.3s}
        .nav-apply:hover{background:#00e0a0;box-shadow:0 0 20px rgba(0,255,180,0.35)}
        .nav-bottom{display:flex;align-items:center;justify-content:center;padding:0 48px}
        .nav-link{font-size:10px;letter-spacing:2px;text-transform:uppercase;font-family:sans-serif;font-weight:600;color:rgba(180,210,255,0.5);padding:12px 22px;cursor:pointer;border-bottom:2px solid transparent;transition:all 0.25s;text-decoration:none;display:block;background:none;border-top:none;border-left:none;border-right:none}
        .nav-link:hover{color:#00ffb4;border-bottom-color:#00ffb4}
        #hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:140px 40px 80px}
        .hero-eyebrow{font-size:11px;letter-spacing:5px;text-transform:uppercase;color:#00ffb4;font-family:sans-serif;font-weight:600;margin-bottom:36px;opacity:0;animation:fadeUp 1s 0.4s forwards}
        .hero-sub{font-size:clamp(26px,3.8vw,46px);font-weight:700;color:#fff;letter-spacing:1px;margin-bottom:28px;opacity:0;animation:fadeUp 1s 0.6s forwards;line-height:1.25;text-shadow:0 0 60px rgba(0,150,255,0.22)}
        .hero-desc{max-width:580px;font-size:16px;line-height:1.9;color:rgba(180,205,255,0.6);font-family:sans-serif;font-weight:300;opacity:0;animation:fadeUp 1s 0.8s forwards}
        .scroll-hint{margin-top:70px;display:flex;flex-direction:column;align-items:center;gap:8px;opacity:0;animation:fadeUp 1s 1.6s forwards}
        .scroll-hint span{font-size:9px;letter-spacing:3px;color:rgba(0,255,180,0.35);font-family:sans-serif;text-transform:uppercase}
        .scroll-line{width:1px;height:44px;background:linear-gradient(to bottom,rgba(0,255,180,0.5),transparent);animation:pulse 2s infinite}
        .section{min-height:100vh;display:flex;align-items:center;padding:120px 80px;border-top:1px solid rgba(0,255,180,0.04);gap:80px}
        .section.img-left{flex-direction:row}
        .section.img-right{flex-direction:row-reverse}
        .section-text{flex:1;max-width:520px}
        .section-tag{font-size:9px;letter-spacing:4px;text-transform:uppercase;font-family:sans-serif;font-weight:700;color:#00ffb4;margin-bottom:18px;opacity:0.7}
        .section-title{font-size:clamp(28px,3.5vw,46px);font-weight:700;color:#fff;line-height:1.2;margin-bottom:24px;letter-spacing:1px}
        .section-title em{color:#00ffb4;font-style:normal}
        .section-body{font-size:15px;line-height:1.95;color:rgba(180,205,255,0.6);font-family:sans-serif;font-weight:300;margin-bottom:36px}
        .section-cta{display:inline-block;font-size:10px;letter-spacing:3px;text-transform:uppercase;font-family:sans-serif;font-weight:700;color:#00ffb4;border-bottom:1px solid rgba(0,255,180,0.3);padding-bottom:3px;cursor:pointer;transition:all 0.25s;text-decoration:none;background:none;border-top:none;border-left:none;border-right:none}
        .section-cta:hover{border-bottom-color:#00ffb4;letter-spacing:4px}
        .section-visual{flex:1;max-width:480px;aspect-ratio:4/3;border-radius:6px;border:1px solid rgba(0,255,180,0.08);background:rgba(0,10,40,0.5);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
        .section-visual::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,100,200,0.12),transparent 70%)}
        .section-visual::after{content:'';position:absolute;top:-1px;left:20%;right:20%;height:1px;background:linear-gradient(to right,transparent,rgba(0,255,180,0.3),transparent)}
        .visual-placeholder{text-align:center}
        .visual-placeholder .icon{font-size:48px;margin-bottom:14px}
        .visual-placeholder p{font-size:9px;letter-spacing:3px;text-transform:uppercase;font-family:sans-serif;color:rgba(0,255,180,0.2)}
        .gelir-list{list-style:none;margin-bottom:36px}
        .gelir-list li{display:flex;align-items:flex-start;gap:14px;padding:14px 0;border-bottom:1px solid rgba(0,255,180,0.06);font-size:14px;font-family:sans-serif;color:rgba(180,205,255,0.65);line-height:1.6}
        .gelir-list li .dot{width:6px;height:6px;border-radius:50%;background:#00ffb4;margin-top:6px;flex-shrink:0}
        .faq-block{margin:32px 0 36px;border-top:1px solid rgba(0,255,180,0.08)}
        .faq-item{border-bottom:1px solid rgba(0,255,180,0.08);overflow:hidden}
        .faq-question{width:100%;display:flex;align-items:center;justify-content:space-between;padding:16px 0;background:none;border:none;cursor:pointer;text-align:left;gap:12px}
        .faq-question-text{font-size:13px;font-family:sans-serif;font-weight:600;letter-spacing:0.5px;color:rgba(200,220,255,0.8);line-height:1.5}
        .faq-icon{width:22px;height:22px;border-radius:50%;border:1px solid rgba(0,255,180,0.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px;color:#00ffb4;font-family:sans-serif;line-height:1;transition:transform 0.3s,background 0.3s;user-select:none}
        .faq-item.open .faq-icon{transform:rotate(45deg);background:rgba(0,255,180,0.1)}
        .faq-answer{max-height:0;overflow:hidden;transition:max-height 0.4s ease}
        .faq-item.open .faq-answer{max-height:300px}
        .faq-answer-inner{font-size:13px;font-family:sans-serif;font-weight:300;color:rgba(160,190,255,0.55);line-height:1.8;padding:0 0 18px 0}
        #apply{min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:100px 40px;border-top:1px solid rgba(0,255,180,0.06)}
        .apply-tag{font-size:9px;letter-spacing:4px;color:rgba(0,255,180,0.5);font-family:sans-serif;text-transform:uppercase;margin-bottom:20px}
        .apply-title{font-size:clamp(32px,5vw,62px);font-weight:700;color:#fff;letter-spacing:3px;text-transform:uppercase;margin-bottom:18px;line-height:1.15}
        .apply-title span{color:#00ffb4}
        .apply-desc{max-width:480px;font-size:15px;line-height:1.8;color:rgba(180,205,255,0.55);font-family:sans-serif;font-weight:300;margin-bottom:48px}
        .apply-btns{display:flex;gap:20px;flex-wrap:wrap;justify-content:center}
        .apply-btn{padding:16px 48px;border-radius:3px;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:sans-serif;font-weight:700;cursor:pointer;transition:all 0.3s}
        .apply-btn.primary{background:#00ffb4;color:#00030f;border:none}
        .apply-btn.primary:hover{background:#00e0a0;box-shadow:0 0 40px rgba(0,255,180,0.3);transform:translateY(-2px)}
        .apply-btn.outline{background:transparent;color:#00ffb4;border:1px solid rgba(0,255,180,0.35)}
        .apply-btn.outline:hover{background:rgba(0,255,180,0.08);border-color:#00ffb4;transform:translateY(-2px)}
        footer{border-top:1px solid rgba(0,255,180,0.05);padding:32px 80px;display:flex;align-items:center;justify-content:space-between}
        .f-logo{font-size:14px;font-weight:900;letter-spacing:4px;text-transform:uppercase;color:rgba(255,255,255,0.3)}
        .f-logo span{color:rgba(0,255,180,0.4)}
        .f-copy{font-size:10px;letter-spacing:1px;color:rgba(180,200,255,0.2);font-family:sans-serif}
        .f-vakif{font-size:9px;letter-spacing:1px;color:rgba(0,255,180,0.15);font-family:sans-serif}
        .modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,3,15,0.85);backdrop-filter:blur(8px);z-index:500;align-items:center;justify-content:center}
        .modal-overlay.open{display:flex}
        .modal-box{background:rgba(5,8,30,0.95);border:1px solid rgba(0,255,180,0.15);border-radius:8px;padding:48px;max-width:500px;width:90%;text-align:center;position:relative}
        .modal-close{position:absolute;top:18px;right:22px;font-size:18px;color:rgba(0,255,180,0.4);cursor:pointer;background:none;border:none;transition:color 0.2s;font-family:sans-serif}
        .modal-close:hover{color:#00ffb4}
        .modal-tag{font-size:9px;letter-spacing:4px;color:#00ffb4;font-family:sans-serif;text-transform:uppercase;margin-bottom:18px;opacity:0.6}
        .modal-title{font-size:28px;font-weight:700;color:#fff;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px}
        .modal-title span{color:#00ffb4}
        .modal-desc{font-size:13px;line-height:1.8;color:rgba(180,205,255,0.5);font-family:sans-serif;margin-bottom:32px}
        .modal-btn{padding:13px 40px;background:#00ffb4;color:#00030f;border:none;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-family:sans-serif;font-weight:700;border-radius:3px;cursor:pointer;transition:all 0.3s}
        .modal-btn:hover{background:#00e0a0;box-shadow:0 0 24px rgba(0,255,180,0.3)}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:0.4}50%{opacity:1}}
      `}</style>

      <canvas id="galaxy-canvas" ref={canvasRef} />

      <div className="page">
        <nav className="navbar">
          <div className="nav-top">
            <a className="nav-logo" href="#hero">echo<span>kush</span></a>
            <a className="nav-vakif" href="#">◈ EchoKush Vakfı</a>
            <div className="nav-actions">
              <button className="nav-dashboard" onClick={openDashboard}>Dashboard</button>
              <button className="nav-apply" onClick={() => scrollToSection('#apply')}>Apply</button>
            </div>
          </div>
          <div className="nav-bottom">
            <button className="nav-link" onClick={() => scrollToSection('#kimiz')}>Biz Kimiz</button>
            <button className="nav-link" onClick={() => scrollToSection('#yayincilar')}>Yayıncılar için EchoKush</button>
            <button className="nav-link" onClick={() => scrollToSection('#eserler')}>Eser Sahipleri için EchoKush</button>
            <button className="nav-link" onClick={() => scrollToSection('#gelir')}>Gelir Paylaşımı Esasları</button>
            <button className="nav-link" onClick={() => scrollToSection('#isleyis')}>Site İşleyişi & Hakemlik</button>
          </div>
        </nav>

        <section id="hero">
          <div className="hero-eyebrow">◈ Eser · Ses · Gelir Ortaklığı</div>
          <h1 className="hero-sub">Eserini Evrenle Buluştur</h1>
          <p className="hero-desc">Kitap, şiir ve makale sahiplerini; sesli kitap, müzikli anlatım, podcast ve video içerik üreticileriyle buluşturan gelir ortaklığı platformu.</p>
          <div className="scroll-hint">
            <span>Keşfet</span>
            <div className="scroll-line" />
          </div>
        </section>

        <section className="section img-left" id="kimiz">
          <div className="section-visual"><div className="visual-placeholder"><div className="icon">🌌</div><p>Görsel eklenecek</p></div></div>
          <div className="section-text">
            <div className="section-tag">◈ Hakkımızda</div>
            <h2 className="section-title">Biz <em>Kimiz</em></h2>
            <p className="section-body">EchoKush; yazarlar, şairler ve düşünce insanlarının ürettikleri eserlerin çok daha geniş kitlelere ulaşmasını sağlamak için kurulmuş bir gelir ortaklığı ve içerik dönüşüm platformudur.<br /><br />Eser sahiplerini yaratıcı yayıncılarla buluşturur; sesli kitap, müzik destekli anlatım, podcast ve video formatlarıyla eserlerin yeniden doğmasına zemin hazırlarız.</p>
            <FaqBlock items={faqData.kimiz} />
            <button className="section-cta" onClick={() => scrollToSection('#apply')}>Bize Katıl →</button>
          </div>
        </section>

        <section className="section img-right" id="yayincilar">
          <div className="section-visual"><div className="visual-placeholder"><div className="icon">🎙️</div><p>Görsel eklenecek</p></div></div>
          <div className="section-text">
            <div className="section-tag">◈ Yayıncılar</div>
            <h2 className="section-title">Yayıncılar için <em>EchoKush</em></h2>
            <p className="section-body">Sesli kitap yapımcıları, müzik destekli anlatım sanatçıları, podcast üreticileri ve video yaratıcıları için EchoKush; lisanslı, özgün ve değerli içeriklere erişim kapısıdır.<br /><br />Eser havuzundan seçtiğin içerikleri kendi yaratıcı yorumunla dönüştür. Her dinlenme, her izlenme, her paylaşım sana ve eser sahibine adil bir gelir akışı sağlar.</p>
            <FaqBlock items={faqData.yayincilar} />
            <button className="section-cta" onClick={() => scrollToSection('#gelir')}>Gelir Modeline Bak →</button>
          </div>
        </section>

        <section className="section img-left" id="eserler">
          <div className="section-visual"><div className="visual-placeholder"><div className="icon">📖</div><p>Görsel eklenecek</p></div></div>
          <div className="section-text">
            <div className="section-tag">◈ Eser Sahipleri</div>
            <h2 className="section-title">Eser Sahipleri için <em>EchoKush</em></h2>
            <p className="section-body">Kitabın, şiirin, makalenin yalnızca raflarda ya da ekranlarda kalmak zorunda değil. EchoKush ile eserini farklı formatlarda yeniden hayat bulmaya bırak.<br /><br />Telif haklarını güvende tut, yayıncılarla şeffaf sözleşmelerle çalış. Eserinin her yeni formatı sana ek gelir kapısı açar.</p>
            <FaqBlock items={faqData.eserler} />
            <button className="section-cta" onClick={() => scrollToSection('#apply')}>Eserini Tanıt →</button>
          </div>
        </section>

        <section className="section img-right" id="gelir">
          <div className="section-visual"><div className="visual-placeholder"><div className="icon">⚖️</div><p>Görsel eklenecek</p></div></div>
          <div className="section-text">
            <div className="section-tag">◈ Gelir Modeli</div>
            <h2 className="section-title">Gelir Paylaşımı <em>Esasları</em></h2>
            <ul className="gelir-list">
              <li><span className="dot"></span>Eser sahibi ile yayıncı arasındaki gelir payı, platform hakemliğinde şeffaf sözleşmeyle belirlenir.</li>
              <li><span className="dot"></span>Her dinlenme, izlenme ve satıştan elde edilen gelir anlık olarak takip edilir.</li>
              <li><span className="dot"></span>EchoKush platform payı asgari düzeyde tutulur; asıl kazanç yaratıcılara akar.</li>
              <li><span className="dot"></span>Ödemeler aylık döngüde, minimum eşik sınırı aşıldığında otomatik olarak gerçekleşir.</li>
              <li><span className="dot"></span>Anlaşmazlık durumlarında bağımsız hakemlik süreci devreye girer.</li>
            </ul>
            <FaqBlock items={faqData.gelir} />
            <button className="section-cta" onClick={() => scrollToSection('#isleyis')}>Site İşleyişini İncele →</button>
          </div>
        </section>

        <section className="section img-left" id="isleyis">
          <div className="section-visual"><div className="visual-placeholder"><div className="icon">🏛️</div><p>Görsel eklenecek</p></div></div>
          <div className="section-text">
            <div className="section-tag">◈ Platform Yapısı</div>
            <h2 className="section-title">Site İşleyişi & <em>Hakemlik</em></h2>
            <p className="section-body">EchoKush'ta her eser başvurusu, uzman hakem kurulunun incelemesinden geçer. Nitelik güvencesi hem eser sahiplerine hem yayıncılara kaliteli bir ekosistem sunar.<br /><br />Yayıncı başvuruları da benzer şekilde değerlendirilir. Onaylanan yayıncılar eser havuzuna erişim kazanır ve platform içi iş birliği sistemiyle eser sahipleriyle doğrudan iletişime geçebilir.</p>
            <FaqBlock items={faqData.isleyis} />
            <button className="section-cta" onClick={openDashboard}>Dashboard'a Git →</button>
          </div>
        </section>

        <section id="apply">
          <div className="apply-tag">◈ Başvur</div>
          <h2 className="apply-title">EchoKush'a<br /><span>Katıl</span></h2>
          <p className="apply-desc">Eserini sesle buluşturmak ya da sesi esere dönüştürmek için başvurunu yap. Hakem kurulu değerlendirmesinin ardından seni ekosistemde bekliyoruz.</p>
          <div className="apply-btns">
            <button className="apply-btn primary">Eser Sahibi Olarak Başvur</button>
            <button className="apply-btn outline">Yayıncı Olarak Başvur</button>
          </div>
        </section>

        <footer>
          <div className="f-logo">echo<span>kush</span></div>
          <p className="f-copy">© 2025 EchoKush · Tüm hakları saklıdır.</p>
          <p className="f-vakif">EchoKush Vakfı yakında</p>
        </footer>
      </div>

      <div className="modal-overlay" id="dashModal">
        <div className="modal-box">
          <button className="modal-close" onClick={closeDashboard}>✕</button>
          <div className="modal-tag">◈ Kullanıcı Paneli</div>
          <h3 className="modal-title">Dash<span>board</span></h3>
          <p className="modal-desc">Dashboard şu an geliştirme aşamasındadır. Eser takibi, gelir raporları, sözleşme yönetimi ve yayıncı iletişimi için özel paneliniz yakında hizmetinizde olacak.</p>
          <button className="modal-btn">Bildirim Al</button>
        </div>
      </div>
    </>
  )
}
