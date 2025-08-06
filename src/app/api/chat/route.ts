import { chat } from '@/server/operations/chat';

export const maxDuration = 30;
// export const runtime = 'edge';
// export const dynamic = 'force-dynamic';

export const POST = async (request: Request) => chat(request);
