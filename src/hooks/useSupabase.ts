import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Resource } from '@/components/ResourceCard';

/**
 * Map Supabase data format to Resource interface
 */
function mapSupabaseToResource(data: any): Resource {
  return {
    id: data.id,
    title: data.title,
    subject: data.subject,
    department: data.department,
    year: data.year,
    sem: data.sem,
    type: data.type,
    views: data.views || 0,
    downloads: data.downloads || 0,
    fileSize: data.file_size || undefined,
    description: data.description || undefined,
    fileUrl: data.file_url || undefined,
  };
}

/**
 * Hook to fetch resources from Supabase
 */
export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        setError(null);
        
        // Check if Supabase is configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey || 
            supabaseUrl === 'https://placeholder.supabase.co' ||
            supabaseKey === 'placeholder-key') {
          throw new Error('Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel environment variables.');
        }

        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(`Database error: ${error.message}. Please check if the 'resources' table exists in Supabase.`);
        }
        
        const mappedResources = (data || []).map(mapSupabaseToResource);
        setResources(mappedResources);
      } catch (err: any) {
        // Handle network errors
        if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
          const errorMsg = new Error(
            'Network error: Cannot connect to Supabase. ' +
            'Please check: 1) Supabase URL is correct, 2) Supabase project is active, 3) CORS is enabled, 4) Environment variables are set correctly in Vercel.'
          );
          setError(errorMsg);
        } else {
          setError(err as Error);
        }
        console.error('Error fetching resources:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel('resources-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'resources' },
        (payload) => {
          setResources((current) => {
            const nextResource = payload.new ? mapSupabaseToResource(payload.new) : null;

            switch (payload.eventType) {
              case 'INSERT': {
                if (!nextResource) return current;
                const exists = current.some((item) => item.id === nextResource.id);
                return exists ? current : [nextResource, ...current];
              }
              case 'UPDATE': {
                if (!nextResource) return current;
                return current.map((item) => (item.id === nextResource.id ? nextResource : item));
              }
              case 'DELETE': {
                const deletedId = (payload.old as { id?: string } | null)?.id;
                if (!deletedId) return current;
                return current.filter((item) => item.id !== deletedId);
              }
              default:
                return current;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { resources, loading, error };
}

/**
 * Hook to fetch a single resource by ID
 */
export function useResource(id: string) {
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchResource() {
      try {
        setLoading(true);
        setError(null);
        
        // Check if Supabase is configured
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey || 
            supabaseUrl === 'https://placeholder.supabase.co' ||
            supabaseKey === 'placeholder-key') {
          throw new Error('Supabase not configured. Please add environment variables in Vercel.');
        }

        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Supabase error:', error);
          throw new Error(`Database error: ${error.message}`);
        }
        
        if (data) {
          setResource(mapSupabaseToResource(data));
        }
      } catch (err: any) {
        // Handle network errors
        if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
          const errorMsg = new Error(
            'Network error: Cannot connect to Supabase. Please check environment variables and Supabase project status.'
          );
          setError(errorMsg);
        } else {
          setError(err as Error);
        }
        console.error('Error fetching resource:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchResource();
    }
  }, [id]);

  useEffect(() => {
    if (!id || !isSupabaseConfigured()) return;

    const channel = supabase
      .channel(`resource-${id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'resources', filter: `id=eq.${id}` },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setResource(null);
            setError(new Error('Resource has been removed.'));
            return;
          }

          if (payload.new) {
            setResource(mapSupabaseToResource(payload.new));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  return { resource, loading, error };
}

/**
 * Interface for stats data
 */
export interface Stats {
  totalResources: number;
  totalDownloads: number;
  activeStudents: number; // Estimated based on downloads (downloads / 5)
}

/**
 * Hook to fetch real-time stats from Supabase
 */
export function useStats() {
  const [stats, setStats] = useState<Stats>({
    totalResources: 0,
    totalDownloads: 0,
    activeStudents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isInitialLoad = useRef(true);

  const fetchStats = useCallback(async () => {
    try {
      // Only show loading on initial load
      if (isInitialLoad.current) {
        setLoading(true);
        isInitialLoad.current = false;
      }
      setError(null);
      
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || 
          supabaseUrl === 'https://placeholder.supabase.co' ||
          supabaseKey === 'placeholder-key') {
        console.warn('Supabase not configured for stats');
        // Set fallback values if not configured
        setStats({
          totalResources: 0,
          totalDownloads: 0,
          activeStudents: 0,
        });
        setLoading(false);
        return;
      }
      
      console.log('Fetching stats from Supabase...');
      
      // Fetch total resources count
      const { count: resourcesCount, error: countError } = await supabase
        .from('resources')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('Error fetching resources count:', countError);
        throw countError;
      }

      console.log('Resources count:', resourcesCount);

      // Fetch all resources to calculate downloads sum
      // Fetch all columns to see what's available
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*');

      if (resourcesError) {
        console.error('Error fetching resources for downloads:', resourcesError);
        throw resourcesError;
      }

      console.log('Resources data sample (first item):', resourcesData?.[0]);
      console.log('All column names:', resourcesData?.[0] ? Object.keys(resourcesData[0]) : 'No data');

      // Try different possible column names
      const totalDownloads = resourcesData?.reduce((sum, item) => {
        // Try downloads, Downloads, download_count, etc.
        const downloads = item.downloads || item.Downloads || item.download_count || item.downloadCount || 0;
        return sum + (Number(downloads) || 0);
      }, 0) || 0;
      
      console.log('Total downloads calculated:', totalDownloads);
      
      // Estimate active students (downloads / 5, with minimum of resources count)
      // This is an approximation - in a real app, you'd track unique users
      const estimatedStudents = Math.max(
        Math.round(totalDownloads / 5),
        resourcesCount || 0
      );

      console.log('Calculated stats:', {
        totalResources: resourcesCount || 0,
        totalDownloads: totalDownloads,
        activeStudents: estimatedStudents,
      });

      setStats({
        totalResources: resourcesCount || 0,
        totalDownloads: totalDownloads,
        activeStudents: estimatedStudents,
      });
    } catch (err: any) {
      console.error('Error fetching stats:', err);
      setError(err as Error);
      // Handle network errors silently for stats (don't show error, just use fallback)
      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        console.warn('Stats fetch failed (network error), using fallback values');
      }
      // Set fallback values on error
      setStats({
        totalResources: 0,
        totalDownloads: 0,
        activeStudents: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Set up realtime subscription for live updates
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const channel = supabase
      .channel('resources-stats-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'resources' },
        (payload) => {
          // Refetch stats when resources change (INSERT, UPDATE, DELETE)
          console.log('Resources changed, updating stats:', payload.eventType);
          fetchStats();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Stats realtime subscription active');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchStats]);

  return { stats, loading, error };
}

