import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { categories } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { Search, Star, MapPin, Users } from 'lucide-react';

const Businesses = () => {
  const navigate = useNavigate();
  const { businesses } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(search.toLowerCase()) ||
      business.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || business.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-primary py-16 text-white">
          <div className="container text-center">
            <h1 className="font-display text-4xl font-bold mb-4">
              Negocios Universitarios
            </h1>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Conoce a los emprendedores de la Universidad de Guayaquil y apoya sus negocios
            </p>

            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar negocios..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 bg-white text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="container py-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Todos
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                <category.icon className="h-4 w-4" aria-hidden="true" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Business Grid */}
        <div className="container pb-16">
          <p className="text-sm text-muted-foreground mb-6">
            {filteredBusinesses.length} negocios encontrados
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business, index) => {
              const category = categories.find(c => c.id === business.category);
              
              return (
                <div
                  key={business.id}
                  onClick={() => navigate(`/business/${business.id}`)}
                  className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 cursor-pointer animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Banner */}
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={business.banner}
                      alt={business.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Logo */}
                    <div className="absolute -bottom-6 left-4">
                      <img
                        src={business.logo}
                        alt={business.name}
                        className="h-16 w-16 rounded-xl border-4 border-card object-cover shadow-lg"
                      />
                    </div>

                    {category && (
                      <Badge className="absolute top-3 right-3 bg-card/90 text-foreground gap-1">
                        <category.icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {category.name}
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 pt-8 space-y-3">
                    <div>
                      <h3 className="font-display text-xl font-bold group-hover:text-primary transition-colors">
                        {business.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {business.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-semibold">{business.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{business.totalSales} ventas</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{business.faculty}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredBusinesses.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏪</div>
              <h3 className="font-display text-xl font-bold mb-2">
                No se encontraron negocios
              </h3>
              <p className="text-muted-foreground">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Businesses;