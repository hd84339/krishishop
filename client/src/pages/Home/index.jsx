import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productAPI } from '../../services/api';
import ProductCard from '../../components/ProductCard';
import { heroAnimation, scrollRevealStagger, scrollReveal } from '../../animations/gsapAnimations';
import { getCategoryIcon, CATEGORIES } from '../../utils/helpers';
import { FiArrowRight, FiStar, FiTruck, FiShield, FiAward } from 'react-icons/fi';

const BENEFITS = [
  { icon: FiTruck, title: 'Free Delivery', desc: 'On orders above ₹500. Fast delivery across India.' },
  { icon: FiShield, title: '100% Authentic', desc: 'All products certified and quality verified.' },
  { icon: FiStar, title: 'Expert Support', desc: '24/7 agri-expert support for farmers.' },
  { icon: FiAward, title: 'Best Prices', desc: 'Guaranteed lowest prices on all products.' },
];

const TESTIMONIALS = [
  { name: 'Ramesh Patel', location: 'Gujarat', text: 'VindhyaKrishi has transformed my farming. Quality seeds and fast delivery made all the difference this season.', rating: 5 },
  { name: 'Sukhwinder Singh', location: 'Punjab', text: 'Best fertilizers at unbeatable prices. My crop yield increased by 40% after using their Khad products.', rating: 5 },
  { name: 'Lakshmi Devi', location: 'Andhra Pradesh', text: 'Very easy to use and trusted platform. Got genuine Kitnashak on time before the monsoon.', rating: 5 },
];

const Home = () => {
  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const featuredRef = useRef(null);
  const testimonialsRef = useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ['all-products'],
    queryFn: () => productAPI.getAll({ limit: 100 }),
    select: (res) => res.data.products,
  });

  useEffect(() => {
    const heroEls = heroRef.current?.querySelectorAll('.hero-item');
    if (heroEls) heroAnimation([...heroEls]);
  }, []);

  useEffect(() => {
    if (benefitsRef.current) {
      scrollRevealStagger(benefitsRef.current, '.benefit-card', 0.1);
    }
  }, []);

  useEffect(() => {
    if (featuredRef.current) {
      scrollRevealStagger(featuredRef.current, '.product-item', 0.1);
    }
  }, [data]);

  useEffect(() => {
    if (testimonialsRef.current) {
      scrollRevealStagger(testimonialsRef.current, '.testimonial-card', 0.12);
    }
  }, []);

  return (
    <div className="bg-mesh min-h-screen">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      >
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/images/hero-bg.png" 
            alt="Indian Farmland" 
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/80 to-dark" />
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-earth-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          {/* Floating elements */}
          <div className="absolute top-1/3 right-1/5 text-6xl opacity-10 animate-float">🌾</div>
          <div className="absolute bottom-1/3 left-1/6 text-5xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>🌿</div>
          <div className="absolute top-2/3 right-1/3 text-4xl opacity-8 animate-float" style={{ animationDelay: '4s' }}>🌱</div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="hero-item opacity-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-500/30 bg-primary-500/10 mb-8">
            <span className="text-primary-400 text-xs font-medium font-body tracking-wide uppercase">🌱 India's #1 Agriculture E-Commerce</span>
          </div>

          {/* Headline */}
          <h1 className="hero-item opacity-0 font-display font-bold leading-tight mb-6">
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white">
              Grow More.
            </span>
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-gradient">
              Spend Less.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-item opacity-0 font-body text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Premium quality Khad, Beej, Kitnashak and Farming Tools — delivered directly to Indian farmers at the best prices.
          </p>

          {/* CTA Buttons */}
          <div className="hero-item opacity-0 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/products" className="btn-primary px-8 py-4 text-base flex items-center gap-2">
              Shop Now <FiArrowRight size={18} />
            </Link>
            <Link to="/products?category=Beej" className="btn-outline px-8 py-4 text-base">
              Explore Seeds
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="hero-item opacity-0 grid grid-cols-3 gap-6 max-w-md mx-auto">
            {[
              { num: '50K+', label: 'Farmers Served' },
              { num: '500+', label: 'Products' },
              { num: '4.9★', label: 'Rating' },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="font-display font-bold text-2xl text-primary-400">{num}</div>
                <div className="font-body text-xs text-white/40 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-bounce">
          <div className="w-0.5 h-12 bg-gradient-to-b from-transparent to-primary-500 rounded-full" />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Find exactly what your farm needs</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.filter(c => c !== 'All').map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${cat}`}
              className="group card p-6 text-center hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {getCategoryIcon(cat)}
              </div>
              <div className="font-display font-semibold text-white text-sm">{cat}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* All Products */}
      <section ref={featuredRef} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="section-title">Our Products</h2>
            <p className="section-subtitle">Quality products for your farm</p>
          </div>
          <Link to="/products" className="btn-outline text-sm hidden md:flex items-center gap-2">
            View All <FiArrowRight size={15} />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductCard key={i} skeleton />
            ))}
          </div>
        ) : data?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((product) => (
              <div key={product._id} className="product-item opacity-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌱</div>
            <p className="font-body text-white/40">No featured products yet. Add products via the Admin Dashboard.</p>
          </div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link to="/products" className="btn-outline">View All Products</Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-black/20">
        <div ref={benefitsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Why VindhyaKrishi?</h2>
            <p className="section-subtitle">Built with farmers in mind</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="benefit-card opacity-0 card p-6 text-center group hover:-translate-y-1 transition-transform duration-300">
                <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500/20 transition-colors">
                  <Icon size={22} className="text-primary-400" />
                </div>
                <h3 className="font-display font-semibold text-white mb-2">{title}</h3>
                <p className="font-body text-white/50 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title">Farmer Voices</h2>
          <p className="section-subtitle">What our farmers say</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, location, text, rating }) => (
            <div key={name} className="testimonial-card opacity-0 card p-6">
              <div className="flex gap-0.5 mb-4">
                {[...Array(rating)].map((_, i) => (
                  <FiStar key={i} size={14} className="text-earth-400 fill-earth-400" />
                ))}
              </div>
              <p className="font-body text-white/70 text-sm leading-relaxed mb-5 italic">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
                  <span className="text-primary-400 font-semibold text-sm">{name[0]}</span>
                </div>
                <div>
                  <div className="font-display font-semibold text-white text-sm">{name}</div>
                  <div className="font-body text-white/40 text-xs">{location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-primary-900/40 to-earth-900/20 border border-primary-500/20 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-earth-500/10 rounded-full blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Ready to <span className="text-gradient">Grow?</span>
            </h2>
            <p className="font-body text-white/60 text-lg mb-8 max-w-2xl mx-auto">
              Join over 50,000 Indian farmers who trust VindhyaKrishi for quality agricultural inputs.
            </p>
            <Link to="/products" className="btn-primary px-10 py-4 text-base">
              Start Shopping 🌾
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
