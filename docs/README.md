# KDP Colouring Book Generator

A web application that allows users to automatically generate Amazon KDP-ready colouring books using AI-generated line art.

## Features
- **Book Setup**: Define title, theme, audience, style, pages, and trim size.
- **Prompt Generation**: Automatically generates consistent AI image prompts for coloring book pages.
- **Image Generation**: Uses Gemini API to generate high-quality black and white line art.
- **Page Layout**: Automatically formats images into KDP-ready layouts with safe margins and optional blank backsides.
- **Export**: Download a print-ready PDF and a ZIP file containing all image assets.

## Setup Instructions
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Set your `NEXT_PUBLIC_GEMINI_API_KEY` in the `.env` file.
4. Run `npm run dev` to start the development server.
