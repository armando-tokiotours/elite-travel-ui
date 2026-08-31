import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create videos directory if it doesn't exist
    const videosDir = join(process.cwd(), "public", "videos");
    if (!existsSync(videosDir)) {
      await mkdir(videosDir, { recursive: true });
    }

    // Save file with timestamp to avoid conflicts
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = join(videosDir, fileName);

    await writeFile(filePath, buffer);

    // Return the public path
    const publicPath = `/videos/${fileName}`;

    return Response.json({
      success: true,
      fileName: file.name,
      savedAs: fileName,
      location: `/public/videos/${fileName}`,
      publicPath: publicPath,
      message: `Video saved successfully to /public/videos/`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}
