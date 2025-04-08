#!/bin/bash

# This script updates imports from the old model files to the new @/types import

# Update imports from @/types/models/task
find src -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/import { \([^}]*\) } from "@\/types\/models\/task"/import { \1 } from "@\/types"/g'

# Update imports from @/types/models/activity
find src -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/import { \([^}]*\) } from "@\/types\/models\/activity"/import { \1 } from "@\/types"/g'

# Update imports from @/types/models/project
find src -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/import { \([^}]*\) } from "@\/types\/models\/project"/import { \1 } from "@\/types"/g'

# Update imports from @/types/models/user
find src -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/import { \([^}]*\) } from "@\/types\/models\/user"/import { \1 } from "@\/types"/g'

# Update imports from @/types/enums
find src -type f -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/import { \([^}]*\) } from "@\/types\/enums"/import { \1 } from "@\/types"/g'

echo "Import paths updated successfully!" 