# ⚖️ The Tiebreaker

**The Tiebreaker** is an AI-powered decision-making assistant designed to help you navigate complex choices with clarity and confidence. By leveraging the power of Google's Gemini 3 Flash model, it provides structured, objective analyses for any dilemma you face.

## 🚀 Features

- **AI-Driven Insights**: Get instant breakdowns of your decisions using state-of-the-art language models.
- **Three Analysis Modes**:
  - **Pros & Cons**: A balanced list of advantages and disadvantages to help you see both sides.
  - **Comparison Table**: A structured, side-by-side comparison of different options or paths.
  - **SWOT Analysis**: A strategic deep dive into Strengths, Weaknesses, Opportunities, and Threats.
- **Decision History**: Keep track of your recent queries and revisit your past analyses with ease.
- **Clean & Modern UI**: A responsive, intuitive interface built with Tailwind CSS and smooth animations.
- **Markdown Support**: Beautifully formatted results with clear headings, lists, and tables.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **AI Integration**: Google GenAI SDK (Gemini 3 Flash)
- **Content Rendering**: React Markdown

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- A Google Gemini API Key (available via [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/the-tiebreaker.git
   cd the-tiebreaker
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 📖 Usage

1. **Describe your dilemma**: Type your decision or problem into the input area.
2. **Choose your analysis**: Select between Pros & Cons, Comparison, or SWOT Analysis.
3. **Analyze**: Click "Get AI Breakdown" and let the AI weigh the options for you.
4. **Review History**: Use the history icon in the header to switch between your recent decisions.

## 📄 License

This project is licensed under the Apache-2.0 License. See the [LICENSE](LICENSE) file for details.

---