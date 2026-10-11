import { NextResponse } from 'next/server.js';
import fs from 'node:fs';
import path from 'node:path';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'Sample key parameter required' }, { status: 400 });
    }

    const sampleFile = path.join(process.cwd(), 'samples', `${key}.json`);
    if (!fs.existsSync(sampleFile)) {
      return NextResponse.json({ error: 'Sample not found' }, { status: 404 });
    }

    const content = fs.readFileSync(sampleFile, 'utf8');
    const parsed = JSON.parse(content);
    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
