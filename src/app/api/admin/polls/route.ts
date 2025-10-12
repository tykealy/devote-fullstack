import { NextRequest, NextResponse } from 'next/server';
import { pollDraftSchema } from '@/lib/validations/poll';
import { pollDraftsTable } from '@/db/schema/poll-drafts';
import { eq, desc } from 'drizzle-orm';
import { db } from '@/db';
import { uploadImageServer } from '@/lib/storage-server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract poll data
    const pollData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startDate: formData.get('startDate') as string,
      startTime: formData.get('startTime') as string,
      endDate: formData.get('endDate') as string,
      endTime: formData.get('endTime') as string,
      createdBy: formData.get('createdBy') as string,
    };

    // Extract poll image
    const pollImage = formData.get('pollImage') as File | null;
    
    // Extract option data and images
    const options: any[] = [];
    let optionIndex = 0;
    
    while (formData.get(`options[${optionIndex}][label]`)) {
      const option = {
        idx: optionIndex,
        label: formData.get(`options[${optionIndex}][label]`) as string,
        description: formData.get(`options[${optionIndex}][description]`) as string,
      };
      
      options.push(option);
      optionIndex++;
    }

    // Upload poll image if present
    let pollImageUrl = null;
    if (pollImage && pollImage.size > 0) {
      pollImageUrl = await uploadImageServer(pollImage, 'polls', 'polls');
    }

    // Upload option images if present
    for (let i = 0; i < options.length; i++) {
      const optionImage = formData.get(`options[${i}][image]`) as File | null;
      if (optionImage && optionImage.size > 0) {
        options[i].mediaUri = await uploadImageServer(optionImage, 'polls', 'options');
      }
    }

    // Convert form data to poll draft format
    const { startTs, endTs } = parseDateTimeToTimestamps(
      pollData.startDate,
      pollData.startTime,
      pollData.endDate,
      pollData.endTime
    );

    const pollDraft = {
      title: pollData.title,
      description: pollData.description || undefined,
      mediaUri: pollImageUrl,
      optionsJson: options,
      startTs,
      endTs,
      createdBy: pollData.createdBy,
    };

    // Validate the poll draft
    const validatedData = pollDraftSchema.parse(pollDraft);
    
    // Insert into database
    const [newPoll] = await db
      .insert(pollDraftsTable)
      .values({
        title: validatedData.title,
        description: validatedData.description || null,
        mediaUri: validatedData.mediaUri || null,
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
    
    // Handle validation errors
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
        message: error instanceof Error ? error.message : 'Failed to create poll draft' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy');
    
    const polls = await db
      .select()
      .from(pollDraftsTable)
      .where(createdBy ? eq(pollDraftsTable.createdBy, createdBy) : undefined)
      .orderBy(desc(pollDraftsTable.createdAt));
    
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

// Helper function to parse date/time strings and convert to UTC timestamps
function parseDateTimeToTimestamps(startDate: string, startTime: string, endDate: string, endTime: string) {
  const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
  const [startHour, startMinute] = startTime.split(':').map(Number);
  
  const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startDateObj = new Date(startYear, startMonth - 1, startDay, startHour, startMinute, 0);
  const endDateObj = new Date(endYear, endMonth - 1, endDay, endHour, endMinute, 0);
  
  const startTs = Math.floor(startDateObj.getTime() / 1000);
  const endTs = Math.floor(endDateObj.getTime() / 1000);
  
  return { startTs, endTs };
}
