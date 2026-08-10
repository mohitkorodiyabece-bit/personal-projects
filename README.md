# AI Content Creator Suite

A simple AI-powered content generation tool built with Python, Streamlit, and the Gemini API.

## Features

- Generate content for 6 formats: LinkedIn Post, Instagram Caption, Twitter/X Post, Email Draft, Blog Outline, Presentation Content
- Dynamic prompts based on the selected content format
- Professional/Casual tone selection
- Emoji mode toggle
- Character count for generated content
- Built-in copy button for generated content

## Technologies

- Python
- Streamlit
- Gemini API (google-genai)
- python-dotenv

## Installation

pip install -r requirements.txt

## Environment Variable Setup

Copy .env.example to .env and add your Gemini API key:

GEMINI_API_KEY=your_api_key_here

## How to Run

streamlit run app.py

## Example Usage

1. Enter a topic, e.g. "Launching a new mobile app"
2. Select a content format, e.g. "LinkedIn Post"
3. Choose a tone and toggle emoji mode if desired
4. Click "Generate Content"
5. View the generated content and copy it using the copy icon