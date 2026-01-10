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
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2574&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2576&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop",
      ];
      const randomImage = images[Math.floor(Math.random() * images.length)];
      return NextResponse.json({ url: randomImage, type: "image", resolution });
    } else {
      // HD videos (sample ones)
      const videos = [
        "https://cdn.pixabay.com/video/2023/10/22/186082-877478051_large.mp4",
        "https://cdn.pixabay.com/video/2020/09/25/51041-464166249_large.mp4",
        "https://cdn.pixabay.com/video/2022/08/01/126297-735741434_large.mp4",
      ];
      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      return NextResponse.json({ url: randomVideo, type: "video", resolution });
    }
  } catch (error) {
    console.error("Error in generation API:", error);
    return NextResponse.json({ error: "Failed to generate resource" }, { status: 500 });
  }
}
