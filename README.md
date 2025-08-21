# GitHub AI Agent 🤖

A powerful AI-driven code analysis and visualization tool that provides interactive code structure visualization and intelligent code conversation capabilities.

## ✨ Features

- **🔍 Repository Analysis**: Automatically analyze GitHub repositories and extract code structure
- **📊 Interactive Visualization**: Beautiful, interactive visual representation of your codebase structure
- **💬 Intelligent Code Chat**: Have natural conversations with your codebase using AI
- **🔄 Real-time Processing**: Background workers handle large repository processing efficiently
- **🧠 Smart Routing**: AI-powered routing system for optimal query handling
- **📈 Vector Search**: Advanced semantic search through your codebase using embeddings

## 🚀 Tech Stack

### Frontend & Backend
- **[Next.js](https://nextjs.org/)** - Full-stack React framework with TypeScript
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript development

### Database & Storage
- **[MongoDB](https://www.mongodb.com/)** with **[Mongoose](https://mongoosejs.com/)** - Primary database for storing repository metadata and chat history
- **[Pinecone](https://www.pinecone.io/)** - Vector database for semantic search and embeddings storage

### AI & ML
- **[LangGraph](https://langchain-ai.github.io/langgraph/)** - Advanced AI workflow orchestration and LLM routing
- **[LangChain](https://langchain.com/)** - Vector embedding generation and AI chain management

### Background Processing
- **[Inngest](https://www.inngest.com/)** - Reliable background job processing and workflow automation

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- MongoDB instance
- Pinecone account and API key
- OpenAI API key (or other LLM provider)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/github-ai-agent
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/github-ai-agent

# Pinecone
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX=github-code-embeddings

# OpenAI
GEMINI_API_KEY=your_gemini_api_key

# GitHub (optional, for private repos)
GITHUB_TOKEN=your_github_personal_access_token

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_public
CLERK_SECRET_KEY=your_clerk_secret
```

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/SadiwalSachin/git-repo-ai-visualizer
   cd github-ai-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up Pinecone Index**
   ```bash
   # Create a new index in Pinecone dashboard or via CLI
   # Dimension: 1536 (for OpenAI embeddings)
   # Metric: cosine
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Start Inngest Dev Server** (in a separate terminal)
   ```bash
   npx inngest-cli@latest dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Usage

### Analyzing a Repository

1. **Input Repository URL**: Enter a GitHub repository URL in the input field
2. **Processing**: The system will:
   - Clone/fetch the repository structure
   - Extract and analyze code files
   - Generate vector embeddings for semantic search
   - Create interactive visualization
3. **Explore**: Use the visual interface to explore your codebase structure
4. **Chat**: Ask questions about your code using natural language

### Example Queries

- "What are the main components in this React application?"
- "Show me all the API endpoints in this project"
- "How does the authentication system work?"
- "Find all functions that handle user data"
- "Explain the database schema structure"

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App  │    │   MongoDB       │    │   Pinecone DB   │
│                 │    │                 │    │                 │
│ • Frontend UI   │◄──►│ • Repo metadata │    │ • Vector store  │
│ • API Routes    │    │ • Chat history  │    │ • Embeddings    │
│ • Server Actions│    │ • User data     │    │ • Semantic search│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   LangGraph     │    │   LangChain     │    │   Inngest       │
│                 │    │                 │    │                 │
│ • AI Routing    │    │ • Embeddings    │    │ • Background    │
│ • Workflow Mgmt │    │ • Vector ops    │    │   processing    │
│ • Agent chains  │    │ • LLM chains    │    │ • Job queues    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Configuration

### LangGraph Configuration
The AI routing system can be customized in `src/lib/langgraph/config.ts`:

```typescript
export const graphConfig = {
  models: {
    primary: "gpt-4-turbo-preview",
    embedding: "text-embedding-3-small"
  },
  routing: {
    codeAnalysis: "code_analyzer",
    visualization: "viz_generator", 
    general: "general_assistant"
  }
};
```

### Inngest Jobs
Background jobs are defined in `src/inngest/functions/`:
- Repository processing
- Embedding generation
- Large file analysis
- Periodic cleanup tasks

## 📖 API Routes

### Repository Analysis
- `POST /api/analyze` - Submit repository for analysis

### Chat Interface  
- `POST /api/chat` - Send chat message to AI

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing full-stack framework
- [LangChain](https://langchain.com/) for powerful AI tooling
- [Pinecone](https://www.pinecone.io/) for vector database infrastructure
- [Inngest](https://www.inngest.com/) for reliable background processing
- Open source community for inspiration and contributions

## 📞 Support

If you have any questions or need help:

- 📧 Email: sachindeveloper.ch@gmail.com

---

<div align="center">
  Made with ❤️ by [Your Name]
  <br>
  <a href="https://github.com/yourusername/github-ai-agent">⭐ Star this repo</a> if you find it helpful!
</div>