import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, type, duration, resolution } = await req.json();

    if (type === "image") {
      // Use Pollinations AI for real prompt-based image generation
      // This is a free, no-key-required AI image generation service
      const encodedPrompt = encodeURIComponent(prompt);
      const seed = Math.floor(Math.random() * 1000000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1920&height=1080&nologo=true&seed=${seed}`;
      
      // Simulate processing time for image
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      return NextResponse.json({ url: imageUrl, type: "image", resolution });
    } else {
      // Real AI Video Generation using the provided API key
      const videoApiKey = "wGZbWzWPJJUsMZxqM9GHUkgWf7WdQ09NHT8BLIyI52m";
      console.log(`Generating AI video for prompt: "${prompt}"`);

      try {
        // Calling Fal.ai Luma Dream Machine - A true AI video generator
        const response = await fetch("https://fal.run/fal-ai/luma-dream-machine", {
          method: "POST",
          headers: {
            "Authorization": `Key ${videoApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: {
              prompt: prompt,
              aspect_ratio: "16:9"
            }
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Fal.ai returns the generated video URL in the data.video.url field
          if (data.video && data.video.url) {
            return NextResponse.json({ url: data.video.url, type: "video", resolution });
          }
        }
        
        const errorText = await response.text();
        console.error("AI Video API Error:", errorText);
        return NextResponse.json({ 
          error: "AI Video generation failed. This could be due to an invalid API key or service rate limits." 
        }, { status: 500 });

      } catch (apiError) {
        console.error("Connection Error:", apiError);
        return NextResponse.json({ error: "Failed to connect to the AI Video generation service." }, { status: 500 });
      }
    }
  } catch (error) {
    console.error("Unexpected Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred during generation." }, { status: 500 });
  }
}
