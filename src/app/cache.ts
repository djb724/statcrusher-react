import { PokemonData, AggregateData, PathParams, UsageData } from './types';
import { Status } from './types';

type CacheKey = string;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  status: Status;
}

class DataCache {
  private cache: Map<CacheKey, CacheEntry<PokemonData | AggregateData>> = new Map();
  private pendingRequests: Map<CacheKey, Promise<PokemonData | AggregateData>> = new Map();
  private usageCache: Map<CacheKey, CacheEntry<UsageData[]>> = new Map();
  private pendingUsageRequests: Map<CacheKey, Promise<UsageData[]>> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(params: PathParams, species: string): CacheKey {
    return `${params.month}/${params.format}${params.bestOf}/${params.elo}/${species}`;
  }

  private getUsageCacheKey(params: PathParams): CacheKey {
    return `usage/${params.month}/${params.format}${params.bestOf}/${params.elo}`;
  }

  private isExpired<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > this.CACHE_TTL;
  }

  get(params: PathParams, species: string): CacheEntry<PokemonData | AggregateData> | null {
    const key = this.getCacheKey(params, species);
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }
    
    return entry;
  }

  set(params: PathParams, species: string, data: PokemonData | AggregateData, status: Status): void {
    const key = this.getCacheKey(params, species);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      status
    });
  }

  setPending(params: PathParams, species: string, promise: Promise<PokemonData | AggregateData>): void {
    const key = this.getCacheKey(params, species);
    this.pendingRequests.set(key, promise);
    
    promise
      .then((data) => {
        this.set(params, species, data, Status.complete);
      })
      .catch(() => {
        this.set(params, species, {} as PokemonData, Status.error);
      })
      .finally(() => {
        this.pendingRequests.delete(key);
      });
  }

  getPending(params: PathParams, species: string): Promise<PokemonData | AggregateData> | null {
    const key = this.getCacheKey(params, species);
    return this.pendingRequests.get(key) || null;
  }

  has(params: PathParams, species: string): boolean {
    const entry = this.get(params, species);
    return entry !== null && entry.status === Status.complete;
  }

  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
    this.usageCache.clear();
    this.pendingUsageRequests.clear();
  }

  // Usage data cache methods
  getUsage(params: PathParams): CacheEntry<UsageData[]> | null {
    const key = this.getUsageCacheKey(params);
    const entry = this.usageCache.get(key);
    
    if (!entry) return null;
    if (this.isExpired(entry)) {
      this.usageCache.delete(key);
      return null;
    }
    
    return entry;
  }

  setUsage(params: PathParams, data: UsageData[], status: Status): void {
    const key = this.getUsageCacheKey(params);
    this.usageCache.set(key, {
      data,
      timestamp: Date.now(),
      status
    });
  }

  setPendingUsage(params: PathParams, promise: Promise<UsageData[]>): void {
    const key = this.getUsageCacheKey(params);
    this.pendingUsageRequests.set(key, promise);
    
    promise
      .then((data) => {
        this.setUsage(params, data, Status.complete);
      })
      .catch(() => {
        this.setUsage(params, [], Status.error);
      })
      .finally(() => {
        this.pendingUsageRequests.delete(key);
      });
  }

  getPendingUsage(params: PathParams): Promise<UsageData[]> | null {
    const key = this.getUsageCacheKey(params);
    return this.pendingUsageRequests.get(key) || null;
  }

  hasUsage(params: PathParams): boolean {
    const entry = this.getUsage(params);
    return entry !== null && entry.status === Status.complete;
  }
}

export const dataCache = new DataCache();

