import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import supabase from '@/lib/supabase';

// GET /api/tickets/search?q=query — Search tickets by title or description
export async function GET(request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query) {
    return NextResponse.json({ tickets: [] });
  }

  const likePattern = `%${query}%`;

  const { data: tickets, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('user_id', user.id)
    .or(`title.ilike.${likePattern},description.ilike.${likePattern}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching tickets:', error);
    return NextResponse.json({ error: 'Error al buscar tickets' }, { status: 500 });
  }

  return NextResponse.json({ tickets: tickets || [] });
}
