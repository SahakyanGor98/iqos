import next from 'eslint-config-next/core-web-vitals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default tseslint.config(
  {
    ignores: ['node_modules', '.next', 'dist', 'build', 'public', 'supabase'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      next, // Next.js rules
      ...tseslint.configs.recommended,
      prettier, // Prettier overrides
    ],
    plugins: {
      prettier: prettierPlugin, // Only include Prettier plugin
    },
    rules: {
      // React hooks rules (no need to add plugin manually)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Prettier formatting
      'prettier/prettier': 'error',

      // Optional: sort imports
      'sort-imports': [
        'warn',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
        },
      ],
    },
  },
);
