import { Search, User, ShoppingCart, Gamepad2, Star } from 'lucide-react'

function App() {
  const featuredGame = {
    title: "Cyberpunk Adventures",
    price: "$59.99",
    discount: "-30%",
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=400&fit=crop"
  }

  const games = [
    { id: 1, title: "Space Explorer", price: "$49.99", rating: 4.8 },
    { id: 2, title: "Medieval Quest", price: "$39.99", rating: 4.5 },
    { id: 3, title: "Racing Legends", price: "$29.99", rating: 4.7 },
    { id: 4, title: "Puzzle Master", price: "$19.99", rating: 4.3 },
    { id: 5, title: "Battle Royale", price: "$0.00", rating: 4.6 },
    { id: 6, title: "City Builder", price: "$44.99", rating: 4.9 },
  ]

  return (
    <div className="min-h-screen bg-[#1b2838]">
      {/* Header */}
      <header className="bg-[#171a21] border-b border-[#2a475e]">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Gamepad2 className="text-white" size={32} />
                <span className="text-white text-2xl font-bold">Steam Clone</span>
              </div>
              <nav className="hidden md:flex gap-6 text-gray-300">
                <a href="#" className="hover:text-white transition">Tienda</a>
                <a href="#" className="hover:text-white transition">Comunidad</a>
                <a href="#" className="hover:text-white transition">Biblioteca</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-[#316282] rounded px-3 py-2">
                <Search className="text-gray-300" size={20} />
                <input 
                  type="text" 
                  placeholder="Buscar juegos..." 
                  className="bg-transparent border-none outline-none text-white ml-2 w-48"
                />
              </div>
              <ShoppingCart className="text-white cursor-pointer hover:text-blue-400 transition" size={24} />
              <User className="text-white cursor-pointer hover:text-blue-400 transition" size={24} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Featured Game */}
        <div className="mb-12 relative rounded-lg overflow-hidden group cursor-pointer">
          <img 
            src={featuredGame.image} 
            alt={featuredGame.title}
            className="w-full h-[400px] object-cover brightness-75 group-hover:brightness-90 transition"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8">
            <h2 className="text-white text-4xl font-bold mb-2">{featuredGame.title}</h2>
            <div className="flex items-center gap-4">
              <span className="bg-green-600 text-white px-3 py-1 rounded font-bold text-lg">
                {featuredGame.discount}
              </span>
              <span className="text-white text-2xl font-bold">{featuredGame.price}</span>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div>
          <h3 className="text-white text-2xl font-bold mb-6">Juegos Destacados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <div 
                key={game.id}
                className="bg-[#16202d] rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
              >
                <div className="h-48 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                  <Gamepad2 className="text-white/30" size={64} />
                </div>
                <div className="p-4">
                  <h4 className="text-white font-bold text-lg mb-2">{game.title}</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star size={16} fill="currentColor" />
                      <span className="text-sm">{game.rating}</span>
                    </div>
                    <span className="text-green-400 font-bold">
                      {game.price === "$0.00" ? "Gratis" : game.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#171a21] mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© 2026 Steam Clone - Proyecto de ejemplo</p>
        </div>
      </footer>
    </div>
  )
}

export default App
