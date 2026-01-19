import { getProducts } from '@/actions/products'
import { AddToCartButton } from '@/components/add-to-cart-button'
import Link from 'next/link'

export default async function Home() {
  const products = await getProducts()
  const activeProducts = products?.filter(p => p.status === 'active') || []

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/optica_hero_premium_1767975564680.png"
            alt="Premium Optics Showroom"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/40 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-start text-white">
          <span className="text-accent font-bold tracking-[0.4em] uppercase mb-4">Exclusividad en tu mirada</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight mb-6 max-w-2xl uppercase">
            El arte de <br /> <span className="text-accent italic">ver bien</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-sm mb-10 font-medium">
            Colecciones seleccionadas con los más altos estándares de calidad internacional.
            Diseño cosmopolita para personalidades únicas.
          </p>
          <div className="flex gap-4">
            <a href="#catalogo" className="px-8 py-4 bg-accent text-primary font-bold rounded-full hover:bg-white transition-all transform hover:scale-105 active:scale-95">
              EXPLORAR COLECCIÓN
            </a>
            <Link href="/auth/login" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold rounded-full hover:bg-white/20 transition-all">
              REGISTRARSE
            </Link>
          </div>
        </div>
      </div>

      <div id="catalogo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-accent font-bold tracking-widest uppercase text-xs">Colección 2026</span>
            <h2 className="text-5xl font-black text-primary tracking-tighter uppercase mt-2">Nuestras Piezas</h2>
          </div>
          <div className="flex gap-4">
            {['Solar', 'Recetados', 'Accesorios'].map((cat) => (
              <button key={cat} className="px-6 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-500 hover:border-accent hover:text-accent transition-all uppercase tracking-widest">
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {activeProducts.map((product) => (
            <div key={product.id} className="group relative premium-card p-4 flex flex-col h-full bg-white shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-6">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400 font-medium italic text-xs">
                    Sin imagen
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-primary uppercase shadow-sm">
                  Nuevo
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">Optica Premium</p>
                  <h3 className="text-lg font-bold text-primary leading-tight group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1">{product.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <p className="text-xl font-black text-primary">${product.price}</p>
                  <div className="w-32">
                    <AddToCartButton productId={product.id} stock={product.stock || 0} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeProducts.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-medium italic">No hay productos disponibles en esta colección.</p>
          </div>
        )}
      </div>

      {/* Newsletter section */}
      <div className="bg-primary py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 -skew-x-12 translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="text-accent font-bold tracking-[0.3em] uppercase mb-4 block">Newsletter</span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-6">Únete al Círculo Exclusivo</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-10">Recibe acceso anticipado a nuevas colecciones y eventos privados de la marca.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-4 text-white focus:outline-none focus:border-accent transition-all"
            />
            <button className="px-10 py-4 bg-accent text-primary font-black rounded-full hover:bg-white transition-all uppercase tracking-widest text-xs">
              Suscribirse
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
