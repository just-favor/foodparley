'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const INTRO_KEY = 'fp_intro_seen';

const slides = [
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&q=80',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&q=80',
  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1600&q=80',
  'https://images.unsplash.com/photo-1550547660-d9450f859349?w=1600&q=80',
];

const categories = [
  { icon: '🍔', name: 'Burgers' }, { icon: '🍕', name: 'Pizza' },
  { icon: '🥗', name: 'Salads' }, { icon: '🍟', name: 'Snacks' },
  { icon: '🥤', name: 'Drinks' }, { icon: '🍰', name: 'Desserts' },
  { icon: '🌯', name: 'Wraps' },  { icon: '🍜', name: 'Soups' },
];

const featured = [
  { icon: '🍔', name: 'Classic Smash Burger', desc: 'Double smashed patty, aged cheddar, house smoky sauce', price: '₦3,500' },
  { icon: '🍕', name: 'Pepperoni Slice',       desc: 'Thin crust, mozzarella pull, spicy pepperoni',           price: '₦2,800' },
  { icon: '🥤', name: 'Tropical Smoothie',     desc: 'Mango, pineapple & coconut cold blend',                  price: '₦1,500' },
  { icon: '🍟', name: 'Loaded Fries',           desc: 'Seasoned crinkle fries, cheese sauce, fresh jalapeño',  price: '₦1,800' },
];

export default function HomePage() {
  const [showIntro, setShowIntro]   = useState(false);
  const [exitIntro, setExitIntro]   = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const router = useRouter();

  // ── Intro: only fires once per browser session ──
  useEffect(() => {
    if (sessionStorage.getItem(INTRO_KEY)) return;
    sessionStorage.setItem(INTRO_KEY, '1');
    setShowIntro(true);
    const t1 = setTimeout(() => setExitIntro(true), 2500);
    const t2 = setTimeout(() => setShowIntro(false), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // ── Hero slideshow: every 6s ──
  useEffect(() => {
    intervalRef.current = setInterval(
      () => setActiveSlide(s => (s + 1) % slides.length),
      6000
    );
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const goSlide = (n: number) => {
    setActiveSlide(n);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(
      () => setActiveSlide(s => (s + 1) % slides.length),
      6000
    );
  };

  return (
    <div className="bg-[#0E0A06] text-white min-h-screen font-sans overflow-x-hidden">

      {/* ── INTRO OVERLAY ── */}
      {showIntro && (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#0E0A06]
          transition-all duration-700 ${exitIntro ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'}`}>
          <div className="text-center px-6">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-br
              from-white to-orange-400 bg-clip-text text-transparent animate-[fadeUp_0.8s_ease_0.2s_both]">
              🍔 FoodParley
            </h1>
            <p className="text-sm tracking-[3px] uppercase text-white/40 font-light mt-3
              animate-[fadeUp_0.8s_ease_0.6s_both]">
              Fresh · Fast · Delicious
            </p>
            <div className="h-0.5 bg-orange-600 mx-auto mt-7 animate-[barGrow_1.2s_ease_0.8s_forwards] w-0" />
          </div>
        </div>
      )}


      {/* ── HERO ── */}
      <section className="relative h-[96vh] min-h-[580px] flex items-end overflow-hidden">

        {/* Slides */}
        {slides.map((src, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1400ms] ease-in-out
              ${i === activeSlide ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t
          from-[rgba(14,10,6,0.92)] via-[rgba(14,10,6,0.55)] to-[rgba(14,10,6,0.25)]" />

        {/* Content */}
        <div className="relative z-10 max-w-2xl px-10 pb-[72px] animate-[heroIn_0.9s_ease_both]">
          <div className="inline-flex items-center gap-2 bg-orange-600/[0.18] border border-orange-500/40
            text-orange-300 text-xs font-medium tracking-wide px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Free delivery on first order
          </div>

          <h1 className="font-serif text-[clamp(36px,6vw,62px)] font-black leading-[1.05]
            tracking-[-2px] mb-5">
            Good food,<br />
            <span className="text-orange-400">at your door</span><br />
            in 30 minutes.
          </h1>

          <p className="text-[15px] font-light text-white/60 leading-relaxed max-w-[440px] mb-9">
            Burgers, pizza, snacks, cold drinks — freshly made and delivered fast anywhere in Benin City.
          </p>

          <div className="flex gap-3 flex-wrap mb-12">
            <button
              onClick={() => router.push('/menu')}
              className="bg-orange-600 hover:bg-orange-500 text-white font-medium text-[14px]
              px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 cursor-pointer">
              Browse menu →
            </button>
            <button
              onClick={() => router.push('/menu')}
              className="border border-white/25 hover:border-white/60 hover:bg-white/[0.07]
              text-white/75 hover:text-white text-[14px] font-light px-7 py-3.5 rounded-xl transition-all cursor-pointer">
              View today's deals
            </button>
          </div>

          <div className="flex gap-10">
            {[['500+', 'Menu items'], ['28 min', 'Avg. delivery'], ['4.9 ★', 'Rating']].map(([n, l]) => (
              <div key={l}>
                <div className="font-serif text-2xl font-bold">{n}</div>
                <div className="text-[10px] uppercase tracking-widest text-white/35 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-9 right-10 z-20 flex gap-2 items-center">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goSlide(i)}
              className={`h-[3px] rounded-full transition-all duration-300 cursor-pointer
                ${i === activeSlide ? 'w-10 bg-orange-500' : 'w-6 bg-white/25'}`}
            />
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="px-10 py-20">
        <p className="text-[11px] tracking-[3px] uppercase text-orange-500 font-medium mb-2">Explore</p>
        <h2 className="font-serif text-3xl font-bold mb-1">Browse by category</h2>
        <p className="text-sm text-white/40 font-light mb-10">What are you craving right now?</p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none py-5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map(({ icon, name }) => (
            <div
              key={name}
              onClick={() => router.push('/menu')}
              className="flex-none w-[126px] bg-white/[0.04] hover:bg-orange-600/10
              border border-white/[0.08] hover:border-orange-500/50 rounded-2xl p-5 text-center
              cursor-pointer transition-all hover:-translate-y-1">
              <span className="text-3xl block mb-2.5">{icon}</span>
              <span className="text-xs font-medium text-white/70">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="px-10 py-20 bg-white/[0.02] border-y border-white/[0.06]">
        <p className="text-[11px] tracking-[3px] uppercase text-orange-500 font-medium mb-2">Popular</p>
        <h2 className="font-serif text-3xl font-bold mb-1">Featured items</h2>
        <p className="text-sm text-white/40 font-light mb-10">Crowd favourites this week</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map(({ icon, name, desc, price }) => (
            <div
              key={name}
              onClick={() => router.push('/menu')}
              className="bg-white/[0.04] hover:border-orange-500/40 border border-white/[0.07]
              rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 group">
              <div className="h-[150px] bg-gradient-to-br from-[#1a1006] to-[#2e1a0a]
                flex items-center justify-center text-5xl">
                {icon}
              </div>
              <div className="p-2">
                <div className="font-serif text-sm font-bold mb-1">{name}</div>
                <div className="text-xs text-white/40 font-light leading-relaxed">{desc}</div>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-serif text-lg font-bold text-orange-400">{price}</span>
                  <button
                    onClick={() => router.push('/menu')}
                    className="w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-500
                    text-white text-xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer">
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-10 py-20">
        <p className="text-[11px] tracking-[3px] uppercase text-orange-500 font-medium mb-2">Simple process</p>
        <h2 className="font-serif text-3xl font-bold mb-1">How it works</h2>
        <p className="text-sm text-white/40 font-light mb-10">From craving to doorstep in three steps</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            ['01', 'Pick your meal',     'Browse our menu, build your order, add extras you love.'],
            ['02', 'Checkout securely',  'Pay via card, bank transfer, or cash on delivery.'],
            ['03', 'We deliver fast',    'Fresh, hot, and at your door — average 28 minutes.'],
          ].map(([num, title, desc]) => (
            <div key={num} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7">
              <div className="font-serif text-5xl font-black text-orange-600 mb-4">{num}</div>
              <div className="text-[15px] font-medium mb-2">{title}</div>
              <div className="text-[13px] text-white/40 font-light leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-10 py-20 text-center border-t border-white/[0.06]
        bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(232,80,10,0.18),transparent)]">
        <h2 className="font-serif text-4xl md:text-5xl font-black tracking-tight mb-3">
          Hungry? Let's fix<br />
          <span className="text-orange-400">that right now.</span>
        </h2>
        <p className="text-sm text-white/45 font-light mb-8">First order ships free. No promo code needed.</p>
        <button
          onClick={() => router.push('/menu')}
          className="bg-orange-600 hover:bg-orange-500 text-white font-medium text-[15px]
          px-10 py-4 rounded-xl transition-all hover:-translate-y-0.5 cursor-pointer">
          Start your order →
        </button>
      </section>

      {/* ── FOOTER ── */}
      <footer className="px-10 py-7 border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-3">
        <span className="font-serif text-base text-white/35 font-bold">🍔 FoodParley</span>
        <span className="text-xs text-white/20">© 2026 FoodParley · Benin City, Nigeria</span>
      </footer>

    </div>
  );
}