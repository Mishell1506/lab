import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import supabase from '@/lib/supabase';

export async function POST(request) {
  try {
    const { username, password, passwordConfirm } = await request.json();

    if (!username || !password || !passwordConfirm) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    if (password !== passwordConfirm) {
      return NextResponse.json(
        { error: 'Las contraseñas no coinciden' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('username', username.trim())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'El nombre de usuario ya está registrado' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { error: insertError } = await supabase
      .from('users')
      .insert({ username: username.trim(), password: hashedPassword });

    if (insertError) {
      console.error('Register insert error:', insertError);
      return NextResponse.json(
        { error: 'Error en el servidor al registrar usuario' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json(
      { error: 'Error en el servidor al registrar usuario' },
      { status: 500 }
    );
  }
}
