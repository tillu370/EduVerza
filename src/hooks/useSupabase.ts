import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        const mappedResources = (data || []).map(mapSupabaseToResource);
        setResources(mappedResources);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching resources:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
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
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) {
          setResource(mapSupabaseToResource(data));
        }
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching resource:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchResource();
    }
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

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        
        // Fetch total resources count
        const { count: resourcesCount, error: countError } = await supabase
          .from('resources')
          .select('*', { count: 'exact', head: true });

        if (countError) throw countError;

        // Fetch total downloads sum
        const { data: downloadsData, error: downloadsError } = await supabase
          .from('resources')
          .select('downloads');

        if (downloadsError) throw downloadsError;

        const totalDownloads = downloadsData?.reduce((sum, item) => sum + (item.downloads || 0), 0) || 0;
        
        // Estimate active students (downloads / 5, with minimum of resources count)
        // This is an approximation - in a real app, you'd track unique users
        const estimatedStudents = Math.max(
          Math.round(totalDownloads / 5),
          resourcesCount || 0
        );

        setStats({
          totalResources: resourcesCount || 0,
          totalDownloads: totalDownloads,
          activeStudents: estimatedStudents,
        });
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching stats:', err);
        // Set fallback values on error
        setStats({
          totalResources: 0,
          totalDownloads: 0,
          activeStudents: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error };
}

