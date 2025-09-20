# The Governor Workflow: From Idea to Production

## 1. Why: A Structured Workflow for Predictable Results

Working with AI can sometimes feel unpredictable. The AI Governor Framework provides a development workflow designed to fix that, for both new and existing projects.

It provides a structured, sequential process that transforms your AI from a simple code generator into a reliable engineering partner. By following these five protocols, you ensure that both you and the AI are always aligned, moving from a high-level idea to a well-implemented feature with clarity, control, and consistency.

The goal is to make AI-powered development:
-   **Predictable:** Each step has a clear purpose and output.
-   **Controllable:** You are always in the loop for key decisions.
-   **Efficient:** The AI does the heavy lifting, you provide the strategic direction.

## 2. How it Works: The 5-Step Development Lifecycle

This workflow guides you through the entire development process, from initial setup to continuous improvement. Each step assigns a specific role to the AI, ensuring a structured and predictable collaboration.

### Step 0: Bootstrap Your Project (One-Time Setup)
**Role:** The AI acts as a **Project Analyst**.

First, the AI analyzes your entire codebase to build a "Context Kit"—a set of foundational `READMEs` and project-specific rules. This is a one-time protocol that turns a generic AI into a project-specific expert.

```
Apply instructions from dev-workflow/0-bootstrap-your-project.md
```
*(For best results, Cursor users should use Max Mode for this step.)*

### Step 1: Create a Product Requirements Document (PRD)
**Role:** The AI acts as a **Product Manager**.

Next, you define the "what" and "why" of your feature. The AI interviews you to create a detailed Product Requirements Document (PRD), ensuring all requirements are captured before any code is written.

```
Apply instructions from dev-workflow/1-create-prd.md

Here's the feature I want to build: [Describe your feature in detail]
```
*(For best results, Cursor users should use Max Mode for this step.)*

### Step 2: Generate Your Task List
**Role:** The AI acts as a **Tech Lead**.

The AI then transforms the PRD into a granular, step-by-step technical execution plan. This ensures that both you and the AI are aligned on the implementation strategy.

```
Apply instructions from dev-workflow/2-generate-tasks.md to @prd-my-feature.md
```
*(Note: Replace `@prd-my-feature.md` with the actual filename of your PRD.)*

*(For best results, Cursor users should use Max Mode for this step.)*

### Step 3: Execute Tasks Sequentially
**Role:** The AI acts as a **Paired Developer**.

Here, the AI implements the plan one parent task at a time, within a dedicated chat session. This gives you full control over the code while leveraging a clean, focused context for each major implementation step.

1.  **Start the first parent task in a new chat:**
    ```
    Apply instructions from dev-workflow/3-process-tasks.md to @tasks-my-feature.md. Start on task 1.
    ```
    *(Note: Replace `@tasks-my-feature.md` with the actual filename of your task list.)*

2.  **Review and Approve Sub-tasks:**
    As the AI completes each sub-task, it will present the changes for your review.
    -   If the changes are correct, reply with **"yes"** or **"continue"**.
    -   If changes are needed, provide corrective feedback.

3.  **After Each Parent Task: Quality Assurance and Learning**
    Once a parent task (e.g., Task 1 and all its sub-tasks) is complete, it is **critical** to follow this three-step process before moving on:

    1.  **Run the Quality Control Audit:** This validates the technical excellence and identifies any issues before proceeding.
        ```
        Apply instructions from dev-workflow/4-quality-control-protocol.md
        ```

    2.  **Run the Implementation Retrospective:** This captures learnings and improves the AI's context for the next steps.
        ```
        Apply instructions from dev-workflow/5-implementation-retrospective.md
        ```

    3.  **Start the next parent task in a new chat:** To ensure a clean context, clear the current session (e.g., with the `/clear` command) and start the next task.
        ```
        Apply instructions from dev-workflow/3-process-tasks.md to @tasks-my-feature.md. Start on task 2.
        ```
        *(Note: Replace `@tasks-my-feature.md` with your task list's filename and `2` with the next parent task number.)*

---

### A Note on the Learning Curve

Your first few interactions with this framework might require more corrections. **This is normal and by design.** You are actively *teaching* the AI the nuances of your codebase. The initial investment pays off exponentially as the AI's context gets richer, its proposals become more accurate, and it evolves into a true expert companion for your project.
