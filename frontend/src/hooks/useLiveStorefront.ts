'use client';

import { useEffect, useState, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { SiteSettings, Product, CategoryItem } from '../types';

export interface UseLiveStorefrontResult {
  isLoading: boolean;
  isError: boolean;
  siteSettings: SiteSettings;
  products: Product[];
  categories: CategoryItem[];
  refetch: () => Promise<void>;
}

/**
 * Custom React hook for dynamic client-side live storefront data synchronization.
 * Fetches settings, products, and categories from /admin/api on mount and
 * refreshes on window focus or CMS publishing events.
 */
export function useLiveStorefront(): UseLiveStorefrontResult {
  const siteSettings = useStore((state) => state.siteSettings);
  const products = useStore((state) => state.products);
  const categories = useStore((state) => state.categories);
  const fetchAllData = useStore((state) => state.fetchAllData);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      await fetchAllData();
    } catch (err) {
      console.warn('[useLiveStorefront] Background sync notice (using cached defaults):', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAllData]);

  useEffect(() => {
    // 1. Initial live fetch on component mount
    refetch();

    // 2. Automatically refetch when the user refocuses the browser tab
    const handleVisibility = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchAllData().catch(() => {});
      }
    };
    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    // 3. Instant synchronization when CMS saves sections in the same browser window
    const handleCmsUpdate = () => {
      fetchAllData().catch(() => {});
    };
    window.addEventListener('ecotex_homepage_updated', handleCmsUpdate);
    window.addEventListener('ecotex_settings_updated', handleCmsUpdate);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
      window.removeEventListener('ecotex_homepage_updated', handleCmsUpdate);
      window.removeEventListener('ecotex_settings_updated', handleCmsUpdate);
    };
  }, [fetchAllData, refetch]);

  return {
    isLoading,
    isError,
    siteSettings,
    products,
    categories,
    refetch,
  };
}

export default useLiveStorefront;
