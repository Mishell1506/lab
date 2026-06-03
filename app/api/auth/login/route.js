import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import supabase from '@/lib/supabase';
import { setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Por favor ingresa usuario y contraseña' },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username.trim())
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return NextResponse.json(
        { error: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    await setAuthCookie(user.id);

    return NextResponse.json({ success: true, user: { id: user.id, username: user.username } });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Error en el servidor al iniciar sesión' },
      { status: 500 }
    );
  }
}
