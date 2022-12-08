// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openAi = new OpenAIApi(configuration);

type responseType = {
    success?: boolean;
    data?: string;
    error?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<responseType>) {
    if (req.method != 'POST') { 
        res.status(404).json({
          success: false,
          error: "Invalid route!",
        });
        return;
    }
  console.log(req.body)
      if (!req.body || !req.body.prompt || !req.body.size) {
        res.status(401).json({
          success: false,
          error: "Invalid request data!",
        });
        return;
      }
  const { prompt, size } = req.body;
  const imageSize = size === "small" ? "256x256" : size === "medium" ? "512x512" : "1024x1024";
  try {
    const response = await openAi.createImage({
      prompt,
      n: 1,
      size: imageSize,
    });
    const imageUrl = response.data.data[0].url;
    res.status(200).json({
      success: true,
      data: imageUrl,
    });
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    res.status(400).json({
      success: false,
      error: "Image could not be generated!",
    });
  }
}
