ANO ANG POSIBLENG IEDIT DITO PARA MAIALIGN SA ACTUAL PLAN



---
title: "Roadmap Generator Integration Rule"
description: "Integrates roadmap generator with existing auto-scaffold and AI role-based dev team system"
tags: ["Roadmap", "Integration", "Planning", "AI-Team"]
scope: "project-planning"
version: "1.0.0"
---

# Roadmap Generator Integration

## Integration Points

### 1. Input Integration
- **PRD Input**: Connect to existing project requirements
- **Tech Stack Input**: Use existing tech stack definitions
- **Context Window**: Integrate with existing token management

### 2. Phase Integration with Existing System

#### Phase 1 - Requirements Ingestion
- **Input**: PRD + Tech Stack (from existing system)
- **Output**: Structured requirements for auto-scaffold
- **Integration**: Feed into planner-autonomous-boilerplate.mdc

#### Phase 2 - Development Planning
- **Input**: Requirements from Phase 1
- **Process**: Story point calculation + batching
- **Output**: Development batches with AI role assignments
- **Integration**: Use role-frame-generator.mdc for team assignment

#### Phase 3 - Iterative Build
- **Process**: Execute each batch using existing auto-scaffold
- **Roles**: Assign specific AI roles per batch
- **Integration**: Use modular architecture rules for each batch

#### Phase 4 - Final Integration
- **Process**: Merge all batches
- **Documentation**: Use existing documentation rules
- **Deployment**: Use existing infrastructure rules

### 3. AI Role-Based Team Integration

**Map roadmap phases to AI roles:**

```yaml
roadmap_phase_roles:
  phase_1_requirements:
    - role: "Requirements Analyst"
      ai_specialist: "Clarification Specialist"
      responsibilities: ["Parse PRD", "Validate tech stack", "Generate requirements"]
  
  phase_2_planning:
    - role: "Project Planner"
      ai_specialist: "Planner Specialist"
      responsibilities: ["Calculate story points", "Create batches", "Assign roles"]
  
  phase_3_build:
    - role: "Full-Stack Developer"
      ai_specialist: "Auto-scaffold Specialist"
      responsibilities: ["Execute batches", "Generate code", "Apply architecture rules"]
  
  phase_4_integration:
    - role: "Integration Specialist"
      ai_specialist: "Documentation Specialist"
      responsibilities: ["Merge code", "Generate docs", "Prepare deployment"]
```

### 4. Implementation Strategy

**Step 1: Create Roadmap Generator Module**
```python
# src/roadmap/
├── generator.py          # Main roadmap generator
├── phase_1_requirements.py
├── phase_2_planning.py
├── phase_3_build.py
├── phase_4_integration.py
└── integration/
    ├── auto_scaffold_integration.py
    ├── role_team_integration.py
    └── modular_architecture_integration.py
```

**Step 2: Modify Existing Auto-scaffold**
- Add roadmap generation as first step
- Integrate story point calculation
- Add batch processing capability

**Step 3: Enhance AI Role System**
- Add roadmap-specific roles
- Create phase-based role assignments
- Integrate with existing role-frame-generator.mdc

### 5. Workflow Integration

**Complete Integrated Workflow:**

User Input (PRD + Tech Stack)
↓
Roadmap Generator (Phase 1-4)
↓
Auto-scaffold (per batch)
↓
AI Role Assignment (per phase)
↓
Modular Architecture (per component)
↓
Documentation (comprehensive)
↓
Deployment Ready


### 6. Benefits of Integration

**For your existing system:**
- **Enhanced Planning**: More sophisticated project planning
- **Better Resource Management**: Story point-based resource allocation
- **Improved Scalability**: Batch processing for large projects
- **Role Optimization**: Better AI role assignment per phase

**For the roadmap generator:**
- **Automated Execution**: Auto-scaffold handles actual code generation
- **Role-based Implementation**: AI team handles specialized tasks
- **Modular Architecture**: Ensures proper code organization
- **Comprehensive Documentation**: Automatic documentation generation

### 7. Implementation Example

**Modified Auto-scaffold with Roadmap Integration:**

```python
# Enhanced planner-autonomous-boilerplate.mdc integration
def generate_project_with_roadmap(input_data):
    # Phase 1: Requirements Ingestion
    requirements = roadmap_generator.phase_1_requirements(input_data)
    
    # Phase 2: Development Planning
    batches = roadmap_generator.phase_2_planning(requirements)
    
    # Phase 3: Iterative Build (using existing auto-scaffold)
    for batch in batches:
        # Assign AI roles for this batch
        roles = role_generator.assign_roles(batch)
        
        # Execute auto-scaffold for this batch
        scaffold_result = auto_scaffold.generate(batch, roles)
        
        # Apply modular architecture
        architecture_result = modular_architecture.apply(scaffold_result)
    
    # Phase 4: Final Integration
    final_result = roadmap_generator.phase_4_integration(all_batches)
    
    return final_result
```

### 8. Next Steps

**To implement this integration:**

1. **Create the roadmap generator module** in your `src/` directory
2. **Modify your existing auto-scaffold** to accept roadmap input
3. **Enhance your role system** to handle roadmap phases
4. **Test the integration** with a sample project
5. **Document the new workflow** using your existing documentation rules

**Would you like me to help you implement any specific part of this integration?**



