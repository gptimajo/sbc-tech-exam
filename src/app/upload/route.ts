import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
    const data = await request.formData();
    const file: File | null = data.get("file") as File;

    if(!file) {
        return NextResponse.json({ status: 400, statusText: "No file provided" });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    const filePath = join(process.cwd(), "public", "uploads", fileName);
    // File system module already imported at the top
    fs.writeFile(filePath, buffer, (err: NodeJS.ErrnoException | null) => {
        if (err) {
            console.error(err);
            return NextResponse.json({ status: 500, statusText: "Error writing file" });
        }
    });

    return NextResponse.json({ status: 200, statusText: "File uploaded successfully", data: `/uploads/${fileName}` });
}