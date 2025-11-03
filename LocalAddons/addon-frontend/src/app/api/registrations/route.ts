import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '@/lib/db';

// Define the shape of the incoming data
interface RegistrationData {
    name: string;
    email: string;
    mobile: string;
    course: string;
    year: string;
    workshopSlug?: string; // workshopSlug is optional
}

/**
 * Validates the incoming registration data.
 */
function validateRegistrationData(data: unknown): data is RegistrationData {
    if (!data || typeof data !== 'object') return false;

    const { name, email, mobile, course, year } = data as Record<string, unknown>;

    if (!name || typeof name !== 'string' || name.trim().length < 2) return false;
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    if (!mobile || typeof mobile !== 'string' || !/^\d{10,}$/.test(mobile.trim())) return false;
    if (!course || typeof course !== 'string' || course.trim().length < 2) return false;
    if (!year || typeof year !== 'string' || year.trim().length < 1) return false;

    return true;
}

/**
 * Sanitizes the registration data.
 */
function sanitizeData(data: RegistrationData): RegistrationData {
    return {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        mobile: data.mobile.trim(),
        course: data.course.trim(),
        year: data.year.trim(),
        workshopSlug: data.workshopSlug ? data.workshopSlug.trim() : undefined,
    };
}

/**
 * A custom type guard to check for database error objects.
 */
function isMysqlError(error: unknown): error is { code: string; message: string } {
    return typeof error === 'object' && error !== null && 'code' in error && 'message' in error;
}


/**
 * Handles POST requests to register a new user.
 */
export async function POST(request: NextRequest) {
    let connection;
    try {
        const body: unknown = await request.json();

        if (!validateRegistrationData(body)) {
            return NextResponse.json({ error: 'Invalid input data. Please check all fields.' }, { status: 400 });
        }

        const sanitizedData = sanitizeData(body);
        connection = await pool.getConnection();

        // Check if the user is already registered for this specific workshop slug.
        if (sanitizedData.workshopSlug) {
            const [existingRegistration] = await connection.execute<RowDataPacket[]>(
                'SELECT id FROM registrations WHERE email = ? AND workshop_slug = ?',
                [sanitizedData.email, sanitizedData.workshopSlug]
            );

            if (existingRegistration.length > 0) {
                return NextResponse.json({ error: 'You are already registered for this workshop.' }, { status: 409 });
            }
        }

        const sql = 'INSERT INTO registrations (name, email, mobile, course, year, workshop_slug) VALUES (?, ?, ?, ?, ?, ?)';
        const params = [
            sanitizedData.name,
            sanitizedData.email,
            sanitizedData.mobile,
            sanitizedData.course,
            sanitizedData.year,
            sanitizedData.workshopSlug || null,
        ];

        const [result] = await connection.execute<ResultSetHeader>(sql, params);

        return NextResponse.json({
            success: true,
            message: 'Registration submitted successfully!',
            id: result.insertId,
        });

    } catch (error) { // 'error' is of type 'unknown' by default
        console.error('API POST Error:', error);

        // Type-safe check for JSON parsing errors
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: 'Invalid JSON format in request body.' }, { status: 400 });
        }

        // Type-safe check for MySQL duplicate entry error
        if (isMysqlError(error) && error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: 'This email is already registered.' }, { status: 409 });
        }

        return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });

    } finally {
        if (connection) {
            connection.release();
        }
    }
}

/**
 * Handles GET requests to fetch all registrations.
 */
export async function GET() {
    let connection;
    try {
        connection = await pool.getConnection();

        const [registrations] = await connection.execute<RowDataPacket[]>(
            'SELECT id, name, email, mobile, course, year, workshop_slug, created_at FROM registrations ORDER BY created_at DESC'
        );

        return NextResponse.json({
            success: true,
            data: registrations,
            count: registrations.length,
        });

    } catch (error) { // 'error' is of type 'unknown'
        console.error('API GET Error:', error);
        return NextResponse.json({ error: 'Failed to fetch registrations.' }, { status: 500 });

    } finally {
        if (connection) {
            connection.release();
        }
    }
}