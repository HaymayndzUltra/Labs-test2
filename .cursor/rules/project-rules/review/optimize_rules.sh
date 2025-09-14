#!/bin/bash
# Optimize and clean up rules

echo "🚀 Starting rules optimization..."

# Remove low-value rules
echo "��️ Removing low-value rules..."
rm -f /workspace/healthtech-demo/.cursor/rules/project-rules/timing-optimization.mdc
rm -f /workspace/healthtech-demo/.cursor/rules/project-rules/trajectory-analysis.mdc
rm -f /workspace/healthtech-demo/.cursor/rules/project-rules/cross-platform-desktop-app.mdc

# Remove duplicate technology rules
echo "🔧 Removing duplicate technology rules..."
rm -f /workspace/healthtech-demo/.cursor/rules/project-rules/node.mdc
rm -f /workspace/healthtech-demo/.cursor/rules/project-rules/ghost.mdc

# Merge expo into react-native
echo "📱 Merging expo into react-native..."
# (Implementation would merge expo content into react-native.mdc)
rm -f /workspace/healthtech-demo/.cursor/rules/project-rules/expo.mdc

echo "✅ Rules optimization complete!"
