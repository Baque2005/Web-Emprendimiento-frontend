import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { categories } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products } = useApp();
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category')
  );
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, search, selectedCategory, priceRange]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory(null);
    setPriceRange([0, 50]);
    setSearchParams({});
  };

  const activeFiltersCount = [
    selectedCategory,
    priceRange[0] > 0 || priceRange[1] < 50,
  ].filter(Boolean).length;

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-muted/30 py-8">
          <div className="container">
            <h1 className="font-display text-3xl font-bold mb-2">
              Catálogo de Productos
            </h1>
            <p className="text-muted-foreground">
              Descubre productos únicos de emprendedores universitarios
            </p>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtros
                    {activeFiltersCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-primary">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Price Range */}
                    <div>
                      <h4 className="font-medium mb-4">Rango de Precio</h4>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={50}
                        step={1}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>

                    {/* Categories in filter */}
                    <div>
                      <h4 className="font-medium mb-4">Categorías</h4>
                      <div className="space-y-2">
                        {categories.map(category => (
                          <button
                            key={category.id}
                            onClick={() => handleCategorySelect(
                              selectedCategory === category.id ? null : category.id
                            )}
                            className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                              selectedCategory === category.id
                                ? 'bg-primary text-primary-foreground'
                                : 'hover:bg-muted'
                            }`}
                          >
                            <category.icon className="h-4 w-4" aria-hidden="true" />
                            <span className="text-sm">{category.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" className="w-full" onClick={clearFilters}>
                      Limpiar Filtros
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="container py-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategorySelect(null)}
            >
              Todos
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategorySelect(category.id)}
                className="whitespace-nowrap"
              >
                <category.icon className="h-4 w-4" aria-hidden="true" />
                {category.name}
              </Button>
            ))}
          </div>

          {/* Active Filters Display */}
          {(selectedCategory || search) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1">
                  {categories.find(c => c.id === selectedCategory)?.name}
                  <button onClick={() => handleCategorySelect(null)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {search && (
                <Badge variant="secondary" className="gap-1">
                  Búsqueda: {search}
                  <button onClick={() => setSearch('')}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="container pb-16">
          {filteredProducts.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {filteredProducts.length} productos encontrados
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="font-display text-xl font-bold mb-2">
                No se encontraron productos
              </h3>
              <p className="text-muted-foreground mb-6">
                Intenta con otros términos de búsqueda o filtros
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Limpiar Filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Catalog;