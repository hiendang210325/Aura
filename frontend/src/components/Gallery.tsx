const Gallery = () => {
  return (
    <section id="gallery" className="py-24 bg-charcoal">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-cream italic mb-4">
            Không Gian Nhà Hàng
          </h2>
          <p className="text-cream/60 font-light">
            Trải nghiệm không gian sang trọng và đẳng cấp
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px]">
          <div className="col-span-2 row-span-2 relative group overflow-hidden rounded-sm">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
              alt="Main Dining Hall"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
              <span className="text-cream font-serif text-xl">
                Sảnh Tiệc Chính
              </span>
            </div>
          </div>
          <div className="relative group overflow-hidden rounded-sm">
            <img
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop"
              alt="VIP Private Room"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="relative group overflow-hidden rounded-sm row-span-2">
            <img
              src="https://images.unsplash.com/photo-1766393195987-912865cbb81b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8RXZlbnQlMjBBcmVhfGVufDB8fDB8fHww"
              alt="Event Area"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="relative group overflow-hidden rounded-sm">
            <img
              src="https://images.unsplash.com/photo-1502301103665-0b95cc738daf?q=80&w=1964&auto=format&fit=crop"
              alt="Fine Dining Setup"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
