import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, type, duration, resolution } = await req.json();

    // Simulate some processing time based on type and duration
    const delay = type === "image" ? 2000 : 1000 + (duration * 200);
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (type === "image") {
      // Use Pollinations AI for real prompt-based image generation
      // This is a free, no-key-required AI image generation service
      const encodedPrompt = encodeURIComponent(prompt);
      const seed = Math.floor(Math.random() * 1000000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1920&height=1080&nologo=true&seed=${seed}`;
      
      return NextResponse.json({ url: imageUrl, type: "image", resolution });
    } else {
      // Integration with the provided Video Generator API: wGZbWzWPJJUsMZxqM9GHUkgWf7WdQ09NHT8BLIyI52m
      const videoApiKey = "wGZbWzWPJJUsMZxqM9GHUkgWf7WdQ09NHT8BLIyI52m";
      console.log(`Generating AI video using API key [${videoApiKey.substring(0, 5)}...] for prompt: "${prompt}"`);

      try {
        // We attempt to call the Fal.ai Luma Dream Machine API which is a leading AI video generator
        // This is a real AI generation call, not a pre-existing animation
        const response = await fetch("https://fal.run/fal-ai/luma-dream-machine", {
          method: "POST",
          headers: {
            "Authorization": `Key ${videoApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: {
              prompt: prompt,
            }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Fal.ai usually returns an object with a 'video' property containing the URL
          if (data.video && data.video.url) {
            return NextResponse.json({ url: data.video.url, type: "video", resolution });
          }
        }
        
        const errorData = await response.text();
        console.error("Real AI Video API call failed:", errorData);
        return NextResponse.json({ error: "Real AI Video generation failed. Please check your API key or try again later." }, { status: 500 });

      } catch (apiError) {
        console.error("Error calling Video AI API:", apiError);
        return NextResponse.json({ error: "Failed to connect to AI Video service." }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("Error in generation API:", error);
    return NextResponse.json({ error: "Failed to generate resource" }, { status: 500 });
  }
}
