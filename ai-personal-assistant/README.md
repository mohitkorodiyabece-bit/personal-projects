# AI Personal Assistant Chatbot

A simple AI chatbot built with Python, Streamlit, and the Gemini API.

## Setup

1. Install dependencies:
   pip install -r requirements.txt

2. Copy .env.example to .env and add your Gemini API key:
   GEMINI_API_KEY=your_api_key_here

3. Run the app:
   streamlit run app.py

## Features

- Chat interface using the Gemini API
- Selectable assistant modes: General Assistant, Career Guidance, Travel Planner, Interview Assistant
- Editable system prompt for custom personality
- Chat history stored in Streamlit session state
- Error handling for missing API key, failed requests, and empty input