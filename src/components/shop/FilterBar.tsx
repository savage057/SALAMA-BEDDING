'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { STYLE_CATEGORIES, BED_SIZES } from '@/lib/constants';

interface FilterBarProps {
  colorways: string[];
}

export default function FilterBar({ colorways }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current filter states from query params
  const activeStyle = searchParams.get('style') || '';
  const activeSize = searchParams.get('size') || '';
  const activeColorway = searchParams.get('colorway') || '';
  const searchQuery = searchParams.get('search') || '';
  const viewMode = (searchParams.get('view') as 'flat' | 'room') || 'flat';

  const [searchInput, setSearchInput] = useState(searchQuery);

  // Sync state with URL parameter if it changes externally
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Update query params helper
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (name: string, value: string) => {
    const queryString = createQueryString(name, value);
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange('search', searchInput);
  };

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
    setSearchInput('');
  };

  const hasActiveFilters = activeStyle || activeSize || activeColorway || searchQuery;

  return (
    <div className="w-full bg-white border-b border-border/40 py-6 sticky top-20 lg:top-24 z-30 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col gap-6">
        
        {/* Top Controls: Search, View Mode, Clear filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full py-2.5 pl-10 pr-4 bg-surface text-charcoal placeholder-charcoal/40 rounded-full border border-transparent focus:bg-white focus:border-charcoal/30 focus:outline-none transition-all duration-300 font-sans text-sm"
            />
            <button type="submit" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal transition-colors duration-300">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          {/* Right side controls: view toggle, clear filters */}
          <div className="flex items-center justify-between sm:justify-end gap-6">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-sans font-medium uppercase tracking-wider text-gold hover:text-charcoal transition-colors duration-300 flex items-center gap-1.5"
              >
                Clear Filters
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-surface p-1 rounded-xl">
              <button
                onClick={() => handleFilterChange('view', 'flat')}
                className={`p-2 rounded-lg font-sans text-xs font-medium tracking-wide flex items-center gap-1.5 transition-all duration-300 ${
                  viewMode === 'flat'
                    ? 'bg-white text-charcoal shadow-sm'
                    : 'text-charcoal/50 hover:text-charcoal'
                }`}
                title="Product Only view"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span className="hidden md:inline">Product Only</span>
              </button>

              <button
                onClick={() => handleFilterChange('view', 'room')}
                className={`p-2 rounded-lg font-sans text-xs font-medium tracking-wide flex items-center gap-1.5 transition-all duration-300 ${
                  viewMode === 'room'
                    ? 'bg-white text-charcoal shadow-sm'
                    : 'text-charcoal/50 hover:text-charcoal'
                }`}
                title="Styled In-Room view"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span className="hidden md:inline">In-Room</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters Grid */}
        <div className="flex flex-col gap-4 border-t border-border/40 pt-4">
          {/* Style Category Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-sans uppercase tracking-wider text-muted font-semibold">
              Filter by Style
            </span>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => handleFilterChange('style', '')}
                className={`px-4 py-1.5 rounded-full font-sans text-xs font-medium tracking-wide transition-all duration-300 ${
                  activeStyle === ''
                    ? 'bg-charcoal text-white'
                    : 'bg-surface text-charcoal/70 border border-transparent hover:border-charcoal/20'
                }`}
              >
                All Styles
              </button>
              {STYLE_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleFilterChange('style', cat.value)}
                  className={`px-4 py-1.5 rounded-full font-sans text-xs font-medium tracking-wide transition-all duration-300 whitespace-nowrap ${
                    activeStyle === cat.value
                      ? 'bg-charcoal text-white'
                      : 'bg-surface text-charcoal/70 border border-transparent hover:border-charcoal/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-sans uppercase tracking-wider text-muted font-semibold">
              Filter by Bed Size
            </span>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => handleFilterChange('size', '')}
                className={`px-4 py-1.5 rounded-full font-sans text-xs font-medium tracking-wide transition-all duration-300 ${
                  activeSize === ''
                    ? 'bg-charcoal text-white'
                    : 'bg-surface text-charcoal/70 border border-transparent hover:border-charcoal/20'
                }`}
              >
                All Sizes
              </button>
              {BED_SIZES.map((size) => (
                <button
                  key={size.value}
                  onClick={() => handleFilterChange('size', size.value)}
                  className={`px-4 py-1.5 rounded-full font-sans text-xs font-medium tracking-wide transition-all duration-300 whitespace-nowrap ${
                    activeSize === size.value
                      ? 'bg-charcoal text-white'
                      : 'bg-surface text-charcoal/70 border border-transparent hover:border-charcoal/20'
                  }`}
                >
                  {size.label} <span className="text-[9px] text-muted">({size.dimensions})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Colorway Dropdown */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-sans uppercase tracking-wider text-muted font-semibold">
              Filter by Colorway
            </span>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => handleFilterChange('colorway', '')}
                className={`px-4 py-1.5 rounded-full font-sans text-xs font-medium tracking-wide transition-all duration-300 ${
                  activeColorway === ''
                    ? 'bg-charcoal text-white'
                    : 'bg-surface text-charcoal/70 border border-transparent hover:border-charcoal/20'
                }`}
              >
                All Colors
              </button>
              {colorways.map((color) => (
                <button
                  key={color}
                  onClick={() => handleFilterChange('colorway', color)}
                  className={`px-4 py-1.5 rounded-full font-sans text-xs font-medium tracking-wide transition-all duration-300 whitespace-nowrap ${
                    activeColorway === color
                      ? 'bg-charcoal text-white'
                      : 'bg-surface text-charcoal/70 border border-transparent hover:border-charcoal/20'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
