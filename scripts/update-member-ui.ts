import fs from 'fs';
import path from 'path';

const files = {
  editPage: 'app/[locale]/admin/members/[id]/edit/page.tsx',
  newPage: 'app/[locale]/admin/members/new/page.tsx',
  listPage: 'app/[locale]/admin/members/page.tsx',
};

// Update member edit page
const editPagePath = path.join(process.cwd(), files.editPage);
let editContent = fs.readFileSync(editPagePath, 'utf8');

// Add fields to interface
editContent = editContent.replace(
  /tier: string\n  isPaid: boolean/,
  `tier: string\n  isPaid: boolean\n  isActive: boolean\n  annualIncome?: number\n  incomeCurrency?: string`
);

// Add fields to formData state
editContent = editContent.replace(
  /tier: "STANDARD" as "STANDARD" \| "GOLD" \| "VIP",\n    isPaid: false,/,
  `tier: "STANDARD" as "STANDARD" | "GOLD" | "VIP",\n    isPaid: false,\n    isActive: true,\n    annualIncome: "" as number | "",\n    incomeCurrency: "USD" as "USD" | "JPY",`
);

// Add fields to data loading
editContent = editContent.replace(
  /tier: member\.tier as "STANDARD" \| "GOLD" \| "VIP",\n        isPaid: member\.isPaid,/,
  `tier: member.tier as "STANDARD" | "GOLD" | "VIP",\n        isPaid: member.isPaid,\n        isActive: member.isActive,\n        annualIncome: member.annualIncome || "",\n        incomeCurrency: (member.incomeCurrency || "USD") as "USD" | "JPY",`
);

// Add income section before Bio section
const incomeSection = `
          {/* Financial Information */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={formData.annualIncome}
                onChange={(e) => setFormData(prev => ({ ...prev, annualIncome: e.target.value ? parseInt(e.target.value) : "" }))}
                placeholder="Enter annual income"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              />
              <select
                value={formData.incomeCurrency}
                onChange={(e) => setFormData(prev => ({ ...prev, incomeCurrency: e.target.value as "USD" | "JPY" }))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
              >
                <option value="USD">USD</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
          </div>
`;

editContent = editContent.replace(
  /(\s+)<\/div>\s+<\/section>\s+{\/\* Bio \*\/}/,
  `${incomeSection}$1</div>\n      </section>\n\n      {/* Bio */}`
);

// Add isActive checkbox to Admin Settings
editContent = editContent.replace(
  /(Payment Received[\s\S]*?<\/label>\s+<\/div>)/,
  `$1
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#FF385C] rounded border-gray-300 focus:ring-[#FF385C]"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active Member
                </label>
              </div>`
);

fs.writeFileSync(editPagePath, editContent);
console.log('✅ Updated member edit page');

// Update member new page similarly
const newPagePath = path.join(process.cwd(), files.newPage);
let newContent = fs.readFileSync(newPagePath, 'utf8');

newContent = newContent.replace(
  /tier: "STANDARD" as "STANDARD" \| "GOLD" \| "VIP",\n    isPaid: false,/,
  `tier: "STANDARD" as "STANDARD" | "GOLD" | "VIP",\n    isPaid: false,\n    isActive: true,\n    annualIncome: "" as number | "",\n    incomeCurrency: "USD" as "USD" | "JPY",`
);

newContent = newContent.replace(
  /(\s+)<\/div>\s+<\/div>\s+{\/\* Bio - Multilingual \*\/}/,
  `          <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.annualIncome}
                    onChange={(e) => setFormData(prev => ({ ...prev, annualIncome: e.target.value ? parseInt(e.target.value) : "" }))}
                    placeholder="Enter annual income"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                  />
                  <select
                    value={formData.incomeCurrency}
                    onChange={(e) => setFormData(prev => ({ ...prev, incomeCurrency: e.target.value as "USD" | "JPY" }))}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF385C] focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>
              </div>
$1</div>\n          </div>\n\n          {/* Bio - Multilingual */}`
);

newContent = newContent.replace(
  /(Payment Received[\s\S]*?<\/label>\s+<\/div>)/,
  `$1
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-[#FF385C] border-gray-300 rounded focus:ring-[#FF385C]"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active Member
                </label>
              </div>`
);

fs.writeFileSync(newPagePath, newContent);
console.log('✅ Updated member new page');

console.log('\n🎉 All member UI pages updated successfully!');
