# AI Assistant Quick Reference Guide

## 🚀 Quick Start Checklist

### Before Starting a Session
- [ ] Provide project overview and current state
- [ ] Share relevant documentation and code structure
- [ ] Establish communication patterns
- [ ] Set up progress tracking with `todo_write`

### During Session
- [ ] Use structured prompts for complex requests
- [ ] Maintain working memory documents
- [ ] Create regular checkpoints
- [ ] Validate progress at logical intervals

### Session End
- [ ] Create comprehensive handoff document
- [ ] Save current state and decisions
- [ ] Document next steps and dependencies
- [ ] Commit work with descriptive messages

## 📋 Capability Quick Reference

| Task Type | Accuracy | Speed | Best For |
|-----------|----------|-------|----------|
| **Code Writing** | ⭐⭐⭐⭐⭐ | ⚡⚡⚡ | TypeScript, Python, SQL |
| **Code Review** | ⭐⭐⭐⭐⭐ | ⚡⚡ | Security, performance, patterns |
| **Documentation** | ⭐⭐⭐⭐⭐ | ⚡⚡⚡ | README, API docs, guides |
| **Testing** | ⭐⭐⭐⭐⭐ | ⚡⚡ | Unit, integration, e2e tests |
| **Debugging** | ⭐⭐⭐⭐⭐ | ⚡⚡ | Error analysis, troubleshooting |
| **Architecture** | ⭐⭐⭐ | ⚡⚡ | System design, patterns |
| **Configuration** | ⭐⭐⭐ | ⚡⚡⚡ | Build, deploy, environment setup |
| **Business Logic** | ⭐⭐ | ⚡⚡ | Domain requirements interpretation |

## 🎯 Optimal Prompt Patterns

### For Code Development
```
Context: [Project description]
Goal: [Specific objective]
Constraints: [Technical limitations]
Expected Output: [Format and scope]
```

### For Problem Solving
```
Problem: [Clear description with examples]
Current State: [Relevant code/errors]
Expected Behavior: [What should happen]
Approach: [Step-by-step solution preferred]
```

### For Analysis
```
Analyze: [Specific component/system]
Focus: [Security/performance/architecture]
Scope: [Files/directories to examine]
Output: [Report format preferred]
```

## 🔧 Tool Usage Guide

### File Operations
```bash
# Read file
read_file("path/to/file")

# Write new file
write("path/to/file", content)

# Edit existing file
search_replace("path/to/file", old_text, new_text)

# Multi-edit file
MultiEdit("path/to/file", [edits])
```

### Code Analysis
```bash
# Semantic search
codebase_search("query", ["target_directories"])

# Pattern search
grep("pattern", "path")

# File discovery
glob_file_search("pattern", "directory")
```

### Task Management
```bash
# Create todos
todo_write(merge=False, todos=[...])

# Update progress
todo_write(merge=True, todos=[...])
```

## 📊 Context Management

### Working Memory Template
```markdown
# Session Working Memory

## Current Goals
- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

## Key Decisions
- Decision 1: Rationale
- Decision 2: Rationale

## Current State
- Component A: ✅ Complete
- Component B: 🔄 In Progress
- Component C: ⏳ Pending

## Next Session Priorities
1. Priority 1
2. Priority 2
3. Priority 3
```

### Handoff Document Template
```markdown
# Session Handoff - [Date]

## Completed This Session
- [ ] Task 1
- [ ] Task 2

## In Progress
- [ ] Task 3 (60% complete)

## Next Steps
1. Complete Task 3
2. Begin Task 4
3. Test integration

## Dependencies
- External dependency 1
- External dependency 2

## Important Decisions
- Decision 1: Rationale and impact
- Decision 2: Rationale and impact

## Files Modified
- file1.py: Added authentication
- file2.tsx: Updated component
- README.md: Updated documentation
```

## ⚠️ Common Pitfalls & Solutions

### Context Loss
**Problem**: Information from previous session is lost
**Solution**: 
- Read recent file modifications
- Check git history
- Review todo lists
- Reconstruct from documentation

### Miscommunication
**Problem**: Requirements unclear or misunderstood
**Solution**:
- Ask for specific examples
- Use structured formats
- Validate understanding
- Provide feedback on output

### Task Complexity
**Problem**: Task too large for single session
**Solution**:
- Break into smaller pieces
- Use incremental approach
- Maintain working state
- Create clear handoff points

## 🎨 Best Practices

### Code Quality
- Write clean, readable code
- Use meaningful names
- Add comprehensive comments
- Follow project conventions

### Documentation
- Keep docs current
- Use clear structure
- Include examples
- Update as you work

### Testing
- Write tests alongside code
- Test edge cases
- Maintain good coverage
- Use descriptive test names

### Git Workflow
- Commit frequently
- Use descriptive messages
- Create feature branches
- Review before merging

## 📈 Success Indicators

### Green Flags ✅
- Tasks completed on time
- Code quality maintained
- Documentation current
- Smooth handoffs
- Few context resets

### Red Flags ❌
- Repeated information requests
- Inconsistent approaches
- Missing documentation
- Context confusion
- Incomplete handoffs

## 🆘 Emergency Recovery

### When Context is Lost
1. **Assess**: Read recent files and git history
2. **Identify**: Determine what was in progress
3. **Reconstruct**: Use available information
4. **Continue**: Pick up where you left off

### When Stuck
1. **Clarify**: Ask for more specific requirements
2. **Decompose**: Break task into smaller pieces
3. **Research**: Use web search for current information
4. **Validate**: Check understanding before proceeding

## 📞 Communication Tips

### Efficient Requests
- Reference files by path, not content
- Use specific line numbers
- Provide context and constraints
- Specify expected output format

### Progress Updates
- Use todo system for tracking
- Create regular checkpoints
- Document decisions and rationale
- Maintain working memory docs

This quick reference provides immediate access to the most important aspects of working effectively with the AI assistant. Keep it handy for reference during development sessions.
