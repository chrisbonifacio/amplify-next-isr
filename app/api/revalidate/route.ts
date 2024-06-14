import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
	const tag = request.nextUrl.searchParams.get('tag');
	const path = request.nextUrl.searchParams.get('path');
	if (!tag && !path) {
		return NextResponse.json({ message: 'Missing tag or path param' }, { status: 400 });
	}

	if (tag) {
		revalidateTag(tag);
	}
	if (path) {
		revalidatePath(path, 'page');
	}

	return NextResponse.json({ revalidated: true, now: Date.now() });
}
