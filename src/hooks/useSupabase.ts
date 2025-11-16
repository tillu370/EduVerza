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

