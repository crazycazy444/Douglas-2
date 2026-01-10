import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, type, duration, resolution } = await req.json();

    // Simulate some processing time based on type and duration
    const delay = type === "image" ? 2000 : 1000 + (duration * 200);
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (type === "image") {
      // HD images from Unsplash (curated high-quality ones)
      const images = [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920",
        "https://images.unsplash.com/photo-1604871000636-074fa5117945?auto=format&fit=crop&q=80&w=1920",
        "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&q=80&w=1920",
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1920",
      ];
      const randomImage = images[Math.floor(Math.random() * images.length)];
      return NextResponse.json({ url: randomImage, type: "image", resolution });
    } else {
      // Reliable HD sample videos
      const videos = [
        "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      ];
      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      return NextResponse.json({ url: randomVideo, type: "video", resolution });
    }
  } catch (error) {
    console.error("Error in generation API:", error);
    return NextResponse.json({ error: "Failed to generate resource" }, { status: 500 });
  }
}
