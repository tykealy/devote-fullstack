import { NextRequest, NextResponse } from 'next/server';
import { pollDraftSchema } from '@/lib/validations/poll';
import { db } from '@/db';
import { pollDraftsTable } from '@/db/schema/poll-drafts';
import { eq, desc } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body using Zod schema
    const validatedData = pollDraftSchema.parse(body);
    
    // Insert into database
    const [newPoll] = await db
      .insert(pollDraftsTable)
      .values({
        title: validatedData.title,
        description: validatedData.description || null,
        optionsJson: validatedData.optionsJson,
        startTs: validatedData.startTs,
        endTs: validatedData.endTs,
        status: 0, // Draft status
        createdBy: validatedData.createdBy,
      })
      .returning();

    return NextResponse.json(
      { 
        success: true, 
        poll: newPoll,
        message: 'Poll draft created successfully' 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating poll draft:', error);
    
    // Handle Zod validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.message 
        },
        { status: 400 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'Failed to create poll draft' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy');
    
    let query = db.select().from(pollDraftsTable);
    
    if (createdBy) {
      query = query.where(eq(pollDraftsTable.createdBy, createdBy));
    }
    
    const polls = await query.orderBy(desc(pollDraftsTable.createdAt));
    
    return NextResponse.json({ 
      success: true, 
      polls 
    });
    
  } catch (error) {
    console.error('Error fetching polls:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'Failed to fetch polls' 
      },
      { status: 500 }
    );
  }
}
