import os
import streamlit as st
from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai import errors

load_dotenv()

st.set_page_config(page_title="AI Content Creator Suite", page_icon="✍️", layout="centered")

MODEL_NAME = "gemini-3.6-flash"

FORMAT_PROMPTS = {
    "LinkedIn Post": "Write a professional, engaging LinkedIn post about the following topic. Include a strong hook in the first line, valuable insights or a short story, clear formatting with line breaks, and 3 to 5 relevant hashtags at the end.",
    "Instagram Caption": "Write an engaging, relatable Instagram caption about the following topic. Keep it catchy, include a call to action, and add 5 to 10 relevant hashtags at the end.",
    "Twitter/X Post": "Write a short, punchy post suitable for Twitter/X about the following topic. Keep the entire post under 280 characters and make it attention-grabbing.",
    "Email Draft": "Write a professional email draft about the following topic. Include a clear subject line, a greeting, a well-structured body, and a polite closing with a signature placeholder.",
    "Blog Outline": "Create a well-structured blog outline about the following topic. Include a compelling title, an introduction, 3 to 5 main sections with bullet point subpoints, and a conclusion.",
    "Presentation Content": "Create presentation content about the following topic. Organize it as a slide by slide outline with a slide title and 3 to 5 concise bullet points per slide, including a title slide and a closing slide.",
}

TONE_INSTRUCTIONS = {
    "Professional": "Use a professional, polished tone.",
    "Casual": "Use a casual, friendly, conversational tone.",
}

if "generated_content" not in st.session_state:
    st.session_state.generated_content = ""

st.title("✍️ AI Content Creator Suite")
st.caption("Generate ready-to-use content for different platforms with Gemini AI.")

api_key = os.environ.get("GEMINI_API_KEY")

if not api_key:
    st.error("GEMINI_API_KEY is missing. Please set it in your .env file before running this app.")
    st.stop()

try:
    client = genai.Client(api_key=api_key)
except Exception as e:
    st.error(f"Failed to initialize Gemini client: {e}")
    st.stop()

topic = st.text_input("Enter a topic")

content_format = st.selectbox("Content Format", options=list(FORMAT_PROMPTS.keys()))

col1, col2 = st.columns(2)
with col1:
    tone = st.selectbox("Tone", options=list(TONE_INSTRUCTIONS.keys()))
with col2:
    emoji_mode = st.checkbox("Emoji Mode")

generate_clicked = st.button("Generate Content", use_container_width=True)

if generate_clicked:
    if not topic or not topic.strip():
        st.warning("Please enter a topic before generating content.")
    else:
        emoji_instruction = "Include relevant emojis naturally throughout the content." if emoji_mode else "Do not include any emojis."
        prompt = (
            f"{FORMAT_PROMPTS[content_format]}\n"
            f"{TONE_INSTRUCTIONS[tone]}\n"
            f"{emoji_instruction}\n\n"
            f"Topic: {topic.strip()}"
        )
        try:
            with st.spinner("Generating content..."):
                response = client.models.generate_content(
                    model=MODEL_NAME,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        system_instruction="You are an expert content creation assistant that writes high quality, ready to use content for different platforms and formats.",
                    ),
                )
            st.session_state.generated_content = response.text if response and response.text else "No content was generated. Please try again."
        except errors.APIError as e:
            st.error(f"API request failed: {e.message}")
        except Exception as e:
            st.error(f"An unexpected error occurred: {e}")

if st.session_state.generated_content:
    st.subheader("Generated Content")
    st.code(st.session_state.generated_content, language=None)
    st.caption(f"Character count: {len(st.session_state.generated_content)}")