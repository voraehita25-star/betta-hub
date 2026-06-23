import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import pluginSecurity from "eslint-plugin-security";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Security baseline — gat patterns ที่เป็น vector จริง (eval, RegExp จาก input, regex backtracking)
  pluginSecurity.configs.recommended,
  {
    rules: {
      // กัน dangerouslySetInnerHTML หลุดออกจากจุดที่ตั้งใจ (json-ld) ไปไฟล์อื่น
      "react/no-danger": "error",
      // ปิด detect-object-injection: ทั้งโปรเจกต์ไม่มี user input → no untrusted object key
      // (false positive ทุกจุด: index ในการ์ดรูป, calculator, ทะเบียน affiliate)
      "security/detect-object-injection": "off",
    },
  },
  {
    // JSON-LD ต้องใช้ dangerouslySetInnerHTML ตามคำแนะนำ Next 16 docs (มี `<` escape แล้ว)
    files: ["src/components/json-ld.tsx"],
    rules: { "react/no-danger": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
