# Contributing to Fullstack Docs

First off, thank you for considering contributing to **Fullstack Docs**! It's people like you that make open-source platforms such a great learning tool. 

## How Can You Contribute?

You can contribute in several ways:
- **Writing Documentation:** Add new tutorials, guides, or correct existing ones.
- **Reporting Bugs:** Find a typo or a bug? Open an issue!
- **Code Examples:** Add new code snippets to existing documentation.
- **UI Improvements:** Enhance the design or add new components.

## Development Setup

To work on this project locally, follow these steps:

1. **Fork the repository** to your own GitHub account.
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/Farhodoff/js-docs.git
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Adding Content

All documentation is written in **MDX** and stored in the `docs/` directory.
To add a new article:
1. Create a new `.mdx` file inside `docs/` (or in a specific sub-folder).
2. Add the required frontmatter at the top of the file:
   ```yaml
   ---
   title: "Your Topic Title"
   description: "A short description of what this is about."
   category: "Category Name"
   order: 5
   tags: ["tag1", "tag2"]
   ---
   ```
3. Write your content below using Markdown and our custom components (`<Callout>`, `<CodeBlock>`, etc.).

## Making a Pull Request (PR)

1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m "Add short description of your changes"`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Submit a Pull Request on GitHub.

We will review your PR as soon as possible. Thank you!