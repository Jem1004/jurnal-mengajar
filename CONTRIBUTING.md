# Contributing Guide - Jurnal Mengajar Modern

Terima kasih atas kontribusi Anda! Dokumen ini berisi panduan untuk berkontribusi pada project ini.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Git Workflow](#git-workflow)
5. [Testing Guidelines](#testing-guidelines)
6. [Pull Request Process](#pull-request-process)

---

## Getting Started

### Prerequisites

Pastikan Anda sudah install:
- Node.js 18+
- npm atau yarn
- Docker dan Docker Compose
- Git
- Code editor (VS Code recommended)

### Setup Development Environment

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd jurnal-mengajar-modern
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start database**
   ```bash
   npm run db:up
   ```

5. **Setup database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

6. **Run development server**
   ```bash
   npm run dev
   ```

---

## Development Workflow

### Project Structure

```
jurnal-mengajar-modern/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login)
│   ├── (guru)/            # Guru features
│   ├── (admin)/           # Admin features
│   ├── actions/           # Server Actions
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── forms/            # Form components
│   ├── dashboard/        # Dashboard components
│   └── analytics/        # Analytics components
├── lib/                   # Utilities & services
│   ├── services/         # Business logic
│   ├── validations/      # Zod schemas
│   ├── auth.ts           # NextAuth config
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/               # Database
│   ├── schema.prisma     # Database schema
│   ├── migrations/       # Migration files
│   └── seed.ts           # Seed data
└── types/                # TypeScript types
```

### Adding New Features

1. **Create feature branch**
   ```bash
   git checkout -b feature/nama-fitur
   ```

2. **Implement feature**
   - Follow code standards (see below)
   - Write clean, readable code
   - Add comments for complex logic

3. **Test locally**
   - Test all functionality
   - Check for errors in console
   - Verify database operations

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add nama fitur"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/nama-fitur
   ```

---

## Code Standards

### TypeScript

- **Use TypeScript** untuk semua files
- **Define types** untuk props, parameters, dan return values
- **Avoid `any`** - use proper types
- **Use interfaces** untuk object shapes

Example:
```typescript
interface JurnalFormProps {
  jadwalId: string;
  onSubmit: (data: JurnalData) => Promise<void>;
  onCancel: () => void;
}

export function JurnalForm({ jadwalId, onSubmit, onCancel }: JurnalFormProps) {
  // component code
}
```

### React Components

- **Use functional components** dengan hooks
- **Server Components by default** - use 'use client' only when needed
- **Separate concerns** - split large components
- **Use descriptive names** - `JurnalForm` not `Form1`

Example:
```typescript
// Server Component (default)
export default async function DashboardPage() {
  const jadwal = await getJadwalHariIni();
  return <JadwalList jadwal={jadwal} />;
}

// Client Component (when needed)
'use client'
export function JurnalForm() {
  const [data, setData] = useState({});
  // interactive logic
}
```

### Server Actions

- **Use 'use server'** directive
- **Validate input** dengan Zod
- **Handle errors** gracefully
- **Return consistent format** `{ success, data?, error? }`

Example:
```typescript
'use server'

export async function createJurnal(formData: FormData) {
  try {
    // Validate
    const validated = jurnalSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: 'Invalid data' };
    }
    
    // Process
    const result = await jurnalService.create(validated.data);
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error creating jurnal:', error);
    return { success: false, error: 'Failed to create jurnal' };
  }
}
```

### Styling

- **Use Tailwind CSS** untuk styling
- **Use utility classes** - avoid custom CSS when possible
- **Responsive design** - mobile-first approach
- **Consistent spacing** - use Tailwind spacing scale

Example:
```tsx
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900">Title</h2>
  <p className="text-sm text-gray-600">Description</p>
</div>
```

### Database

- **Use Prisma** untuk database operations
- **Use transactions** untuk related operations
- **Add indexes** untuk frequently queried fields
- **Validate data** before database operations

Example:
```typescript
// Use transaction for related operations
await prisma.$transaction(async (tx) => {
  const jurnal = await tx.jurnal.create({ data: jurnalData });
  await tx.absensi.createMany({ data: absensiData });
  await tx.tagSiswaRecord.createMany({ data: tagData });
});
```

### Error Handling

- **Try-catch** untuk async operations
- **Meaningful error messages** untuk users
- **Log errors** untuk debugging
- **Don't expose sensitive info** in error messages

Example:
```typescript
try {
  const result = await someOperation();
  return { success: true, data: result };
} catch (error) {
  console.error('Operation failed:', error);
  return { 
    success: false, 
    error: 'Terjadi kesalahan. Silakan coba lagi.' 
  };
}
```

---

## Git Workflow

### Branch Naming

- `feature/nama-fitur` - New features
- `fix/nama-bug` - Bug fixes
- `refactor/nama-refactor` - Code refactoring
- `docs/nama-doc` - Documentation updates

### Commit Messages

Follow conventional commits format:

- `feat: add new feature` - New feature
- `fix: resolve bug` - Bug fix
- `refactor: improve code` - Code refactoring
- `docs: update documentation` - Documentation
- `style: format code` - Code formatting
- `test: add tests` - Testing
- `chore: update dependencies` - Maintenance

Examples:
```bash
git commit -m "feat: add jurnal form validation"
git commit -m "fix: resolve absensi calculation error"
git commit -m "docs: update API documentation"
```

### Commit Best Practices

- **Small, focused commits** - one logical change per commit
- **Descriptive messages** - explain what and why
- **Test before commit** - ensure code works
- **Don't commit secrets** - check .gitignore

---

## Testing Guidelines

### Manual Testing

Before submitting PR, test:

1. **Functionality**
   - Feature works as expected
   - Edge cases handled
   - Error states work

2. **UI/UX**
   - Responsive on mobile, tablet, desktop
   - Loading states shown
   - Error messages clear

3. **Database**
   - Data saved correctly
   - Relationships maintained
   - No orphaned records

4. **Authentication**
   - Protected routes work
   - Role-based access enforced
   - Session handling correct

### Automated Testing (Future)

When tests are added:
- Write unit tests untuk services
- Write integration tests untuk Server Actions
- Write E2E tests untuk critical flows

---

## Pull Request Process

### Before Creating PR

1. **Update from main**
   ```bash
   git checkout main
   git pull origin main
   git checkout feature/nama-fitur
   git merge main
   ```

2. **Resolve conflicts** if any

3. **Test thoroughly** - all features work

4. **Run linter**
   ```bash
   npm run lint
   ```

5. **Build successfully**
   ```bash
   npm run build
   ```

### Creating PR

1. **Push branch**
   ```bash
   git push origin feature/nama-fitur
   ```

2. **Create PR on GitHub**
   - Clear title describing change
   - Detailed description of what changed
   - Link related issues
   - Add screenshots if UI changes

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] New feature
   - [ ] Bug fix
   - [ ] Refactoring
   - [ ] Documentation
   
   ## Testing
   - [ ] Tested locally
   - [ ] All features work
   - [ ] No console errors
   - [ ] Responsive design verified
   
   ## Screenshots (if applicable)
   Add screenshots here
   
   ## Related Issues
   Closes #123
   ```

### PR Review Process

1. **Code review** by team member
2. **Address feedback** - make requested changes
3. **Re-test** after changes
4. **Approval** from reviewer
5. **Merge** to main branch

### After Merge

1. **Delete feature branch**
   ```bash
   git branch -d feature/nama-fitur
   git push origin --delete feature/nama-fitur
   ```

2. **Update local main**
   ```bash
   git checkout main
   git pull origin main
   ```

---

## Database Migrations

### Creating Migration

When changing database schema:

1. **Update Prisma schema**
   ```prisma
   // prisma/schema.prisma
   model NewModel {
     id String @id @default(cuid())
     // fields
   }
   ```

2. **Create migration**
   ```bash
   npx prisma migrate dev --name add_new_model
   ```

3. **Test migration**
   - Verify schema changes
   - Test affected features
   - Check data integrity

4. **Commit migration files**
   ```bash
   git add prisma/
   git commit -m "feat: add new model migration"
   ```

### Migration Best Practices

- **Descriptive names** - `add_user_profile`, not `migration1`
- **Test rollback** - ensure migration can be reverted
- **Backup data** - before running in production
- **Document changes** - explain why schema changed

---

## Code Review Guidelines

### As Reviewer

- **Be constructive** - suggest improvements, don't just criticize
- **Check functionality** - does it work as intended?
- **Check code quality** - is it readable and maintainable?
- **Check standards** - follows project conventions?
- **Test locally** - pull branch and test

### As Author

- **Respond to feedback** - address all comments
- **Explain decisions** - why you chose this approach
- **Be open to changes** - consider suggestions
- **Update PR** - push changes based on feedback

---

## Common Issues & Solutions

### Database Connection Error

```bash
# Reset database
npm run db:down
npm run db:up
npx prisma migrate reset
```

### Prisma Client Out of Sync

```bash
npx prisma generate
```

### Build Errors

```bash
# Clear cache
rm -rf .next
npm run build
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

## Questions?

Jika ada pertanyaan:
- Check existing documentation
- Ask in team chat
- Create issue on GitHub
- Contact project maintainer

---

**Thank you for contributing! 🎉**
