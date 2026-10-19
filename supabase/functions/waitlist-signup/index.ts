import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3.23.8';

const BodySchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  source: z.string().trim().max(80).optional().default('unknown'),
});

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const raw = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(raw);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Neispravan email.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { email, source } = parsed.data;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    // Upsert on email — if exists, keep original source
    const { error: insertErr } = await supabase
      .from('waitlist_signups')
      .insert({ email, source });

    let alreadyExisted = false;
    if (insertErr) {
      // Postgres unique violation
      if ((insertErr as any).code === '23505') {
        alreadyExisted = true;
      } else {
        console.error('waitlist insert failed', insertErr);
        return new Response(JSON.stringify({ error: 'Ne mogu spremiti email trenutno.' }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const { count } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true });

    return new Response(JSON.stringify({ ok: true, alreadyExisted, total: count ?? null }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('waitlist-signup error', err);
    return new Response(JSON.stringify({ error: 'Neočekivana greška.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
