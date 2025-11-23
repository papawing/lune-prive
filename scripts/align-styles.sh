#!/bin/bash

# Style Alignment Script
# Standardizes card, button, and form styles across the application

echo "🎨 Starting comprehensive style alignment..."

# Phase 2: Card Standardization
echo ""
echo "📦 Phase 2: Standardizing card components..."

# Admin Casts Page
sed -i '' 's/rounded-lg p-4 border border-gray-200/rounded-airbnb-md p-4 shadow-airbnb-md border border-gray-100/g' app/\[locale\]/admin/casts/page.tsx
sed -i '' 's/rounded-lg p-6 border-2 border-yellow-200 hover:shadow-md/rounded-airbnb-xl p-6 shadow-airbnb-md border border-yellow-100 hover:shadow-airbnb/g' app/\[locale\]/admin/casts/page.tsx
sed -i '' 's/rounded-lg border border-gray-200 overflow-hidden/rounded-airbnb-md border border-gray-100 overflow-hidden/g' app/\[locale\]/admin/casts/page.tsx

# Admin Members Page
sed -i '' 's/rounded-lg p-4 border border-gray-200/rounded-airbnb-md p-4 shadow-airbnb-md border border-gray-100/g' app/\[locale\]/admin/members/page.tsx
sed -i '' 's/rounded-lg p-6 border-2 border-yellow-200 hover:shadow-md/rounded-airbnb-xl p-6 shadow-airbnb-md border border-yellow-100 hover:shadow-airbnb/g' app/\[locale\]/admin/members/page.tsx
sed -i '' 's/rounded-lg border border-gray-200 overflow-hidden/rounded-airbnb-md border border-gray-100 overflow-hidden/g' app/\[locale\]/admin/members/page.tsx

# Admin Meeting Requests
sed -i '' 's/rounded-lg p-4 border border-gray-200/rounded-airbnb-md p-4 shadow-airbnb-md border border-gray-100/g' app/\[locale\]/admin/meeting-requests/page.tsx
sed -i '' 's/rounded-lg p-6 border-2 border-yellow-200 hover:shadow-md/rounded-airbnb-xl p-6 shadow-airbnb-md border border-yellow-100 hover:shadow-airbnb/g' app/\[locale\]/admin/meeting-requests/page.tsx

# Cast Dashboard
sed -i '' 's/rounded-lg shadow-sm border border-gray-200/rounded-airbnb-md shadow-airbnb-md border border-gray-100/g' app/\[locale\]/cast/dashboard/page.tsx

echo "✅ Card standardization complete"

# Phase 1: Button Standardization
echo ""
echo "🔘 Phase 1: Standardizing button components..."

# Secondary buttons - change border and text color
for file in app/\[locale\]/admin/members/\[id\]/edit/page.tsx \
            app/\[locale\]/admin/members/new/page.tsx \
            app/\[locale\]/admin/casts/\[id\]/edit/page.tsx \
            app/\[locale\]/admin/casts/new/page.tsx; do
  sed -i '' 's/border border-gray-300 rounded-lg font-semibold text-gray-700/border-2 border-deep rounded-lg font-semibold text-deep/g' "$file"
done

# Action buttons - add shadows
sed -i '' 's/bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors/bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-sm hover:shadow-md/g' app/\[locale\]/admin/casts/page.tsx
sed -i '' 's/bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors/bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all shadow-sm hover:shadow-md/g' app/\[locale\]/admin/casts/page.tsx

sed -i '' 's/bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors/bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-sm hover:shadow-md/g' app/\[locale\]/admin/members/page.tsx
sed -i '' 's/bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors/bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all shadow-sm hover:shadow-md/g' app/\[locale\]/admin/members/page.tsx

sed -i '' 's/bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors/bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all shadow-sm hover:shadow-md/g' app/\[locale\]/admin/meeting-requests/page.tsx
sed -i '' 's/bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors/bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all shadow-sm hover:shadow-md/g' app/\[locale\]/admin/meeting-requests/page.tsx

echo "✅ Button standardization complete"

echo ""
echo "🎉 Style alignment complete!"
echo "Please review the changes and test the application."
