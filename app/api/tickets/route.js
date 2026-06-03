import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import supabase from '@/lib/supabase';

// GET /api/tickets — List all tickets for the authenticated user
export async function GET() {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: tickets, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ error: 'Error al obtener tickets' }, { status: 500 });
  }

  return NextResponse.json({ tickets });
}

// POST /api/tickets — Create a new ticket
export async function POST(request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, category, priority, description } = await request.json();

    if (!title || !category || !priority) {
      return NextResponse.json(
        { error: 'Título, categoría y prioridad son obligatorios' },
        { status: 400 }
      );
    }

    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert({
        title: title.trim(),
        category: category.trim(),
        priority: priority.trim(),
        description: description ? description.trim() : '',
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating ticket:', error);
      return NextResponse.json(
        { error: 'Error en el servidor al registrar el ticket' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, ticket }, { status: 201 });
  } catch (err) {
    console.error('Ticket creation error:', err);
    return NextResponse.json(
      { error: 'Error en el servidor al registrar el ticket' },
      { status: 500 }
    );
  }
}
