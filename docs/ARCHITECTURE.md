# Architecture

## Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useReducer)
- **Animations**: Framer Motion

## Backend / API
- **Image Generation**: Google Gemini API (`gemini-3.1-flash-image-preview`)
- **Text Generation**: Google Gemini API (`gemini-3-flash-preview` for prompts)

## Core Modules
- `lib/promptBuilder.ts`: Converts user inputs into a list of specific image prompts.
- `lib/imageGenerator.ts`: Interfaces with the Gemini API to generate images from prompts.
- `lib/layoutEngine.ts`: Calculates dimensions and positions for images on PDF pages.
- `lib/pdfExporter.ts`: Uses `jspdf` to generate the final print-ready PDF.
- `lib/zipExporter.ts`: Uses `jszip` to bundle images and PDF into a single download.
