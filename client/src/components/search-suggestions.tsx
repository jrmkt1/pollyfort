import { useState, useEffect, useRef } from "react";
import { Search, Clock, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchSkeleton } from "./skeleton-loader";

type SuggestionType = 'recent' | 'suggestion' | 'product';

interface SearchSuggestion {
  id: string;
  text: string;
  type: SuggestionType;
  productId?: number;
}

interface SearchSuggestionsProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  value?: string;
}

export default function SearchSuggestions({ onSearch, placeholder = "Buscar produtos...", value = "" }: SearchSuggestionsProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const saveToHistory = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const newHistory = [searchTerm, ...searchHistory.filter(h => h !== searchTerm)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const fetchSuggestions = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/products/search-suggestions?q=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        const productSuggestions: SearchSuggestion[] = data.map((product: any) => ({
          id: `product-${product.id}`,
          text: product.name,
          type: 'product' as const,
          productId: product.id
        }));

        // Add fuzzy search suggestions
        const fuzzySuggestions: SearchSuggestion[] = [];
        const fuzzyOptions = [
          `Rodas ${searchTerm}`,
          `${searchTerm} poliuretano`,
          `Empilhadeira ${searchTerm}`
        ];
        
        fuzzyOptions.forEach((text, index) => {
          if (!productSuggestions.some(p => p.text.toLowerCase().includes(text.toLowerCase()))) {
            fuzzySuggestions.push({
              id: `fuzzy-${index}`,
              text,
              type: 'suggestion'
            });
          }
        });

        setSuggestions([...productSuggestions.slice(0, 5), ...fuzzySuggestions.slice(0, 3)]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.length > 1) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSearch = (searchTerm: string) => {
    saveToHistory(searchTerm);
    onSearch(searchTerm);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const historySuggestions: SearchSuggestion[] = searchHistory.map((term, index) => ({
    id: `history-${index}`,
    text: term,
    type: 'recent'
  }));

  const allSuggestions = query.length > 1 ? suggestions : historySuggestions;

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-4"
        />
      </div>

      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-80 overflow-y-auto"
        >
          {loading ? (
            <div className="p-4">
              <SearchSkeleton />
            </div>
          ) : allSuggestions.length > 0 ? (
            <div className="py-2">
              {query.length <= 1 && searchHistory.length > 0 && (
                <div className="px-4 py-2 flex items-center justify-between border-b">
                  <span className="text-sm font-medium text-gray-700">Buscas recentes</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              {allSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                  onClick={() => handleSearch(suggestion.text)}
                >
                  {suggestion.type === 'recent' ? (
                    <Clock className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Search className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm">{suggestion.text}</span>
                  {suggestion.type === 'product' && (
                    <span className="text-xs text-blue-600 ml-auto">Produto</span>
                  )}
                </button>
              ))}
            </div>
          ) : query.length > 1 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              Nenhuma sugestão encontrada
            </div>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              Digite para buscar produtos
            </div>
          )}
        </div>
      )}
    </div>
  );
}