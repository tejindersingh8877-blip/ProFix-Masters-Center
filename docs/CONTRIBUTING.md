# Contributing to ProFix Masters Center

Thank you for your interest in contributing to ProFix Masters Center! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js v18 or higher
- MongoDB (local or Atlas)
- Git
- Code editor (VS Code recommended)

### Development Setup

1. **Fork and Clone:**
   ```bash
   git clone https://github.com/your-username/ProFix-Masters-Center.git
   cd ProFix-Masters-Center
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   npm run dev
   ```

4. **Create a Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Branch Naming Convention

- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation updates
- `refactor/component-name` - Code refactoring
- `test/test-description` - Adding or updating tests

### Commit Message Guidelines

Follow conventional commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(booking): add booking cancellation feature

fix(auth): resolve JWT token expiration issue

docs(api): update authentication endpoints documentation

refactor(services): optimize service query performance
```

## Code Style

### Backend (TypeScript/Node.js)

- Use TypeScript strict mode
- Follow ESLint configuration
- Use async/await for asynchronous operations
- Add proper error handling
- Write JSDoc comments for public functions

**Example:**
```typescript
/**
 * Creates a new service booking
 * @param customerId - The customer's user ID
 * @param serviceId - The service to book
 * @param bookingData - Booking details
 * @returns Created booking object
 */
export const createBooking = async (
  customerId: string,
  serviceId: string,
  bookingData: BookingData
): Promise<Booking> => {
  try {
    // Implementation
  } catch (error) {
    throw new Error(`Failed to create booking: ${error.message}`);
  }
};
```

### Frontend (React/Next.js)

- Use functional components with hooks
- Follow React best practices
- Use TypeScript for type safety
- Implement proper error boundaries
- Keep components small and focused

**Example:**
```typescript
interface ServiceCardProps {
  service: Service;
  onBook?: (serviceId: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  onBook 
}) => {
  // Component implementation
};
```

### CSS/Styling

- Use TailwindCSS utility classes
- Follow mobile-first approach
- Maintain consistent spacing and colors
- Use semantic class names for custom CSS

## Testing Guidelines

### Backend Tests

Create tests in `backend/src/__tests__`:

```typescript
describe('BookingController', () => {
  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      // Test implementation
    });

    it('should return error for invalid service', async () => {
      // Test implementation
    });
  });
});
```

### Frontend Tests

Create tests alongside components:

```typescript
describe('ServiceCard', () => {
  it('renders service information correctly', () => {
    // Test implementation
  });

  it('handles booking click', () => {
    // Test implementation
  });
});
```

### Running Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Pull Request Process

1. **Update Documentation:**
   - Update README if needed
   - Add/update API documentation
   - Update CHANGELOG

2. **Test Your Changes:**
   - Run existing tests
   - Add new tests for new features
   - Ensure all tests pass

3. **Lint Your Code:**
   ```bash
   # Backend
   npm run lint

   # Frontend
   npm run lint
   ```

4. **Create Pull Request:**
   - Use clear, descriptive title
   - Reference related issues
   - Provide detailed description
   - Include screenshots for UI changes

5. **PR Template:**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   How has this been tested?

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added for complex code
   - [ ] Documentation updated
   - [ ] No new warnings generated
   - [ ] Tests added/updated
   - [ ] All tests passing
   ```

## Feature Requests

Submit feature requests as GitHub issues:

1. Use "Feature Request" template
2. Provide clear description
3. Explain use case
4. Include mockups if applicable

## Bug Reports

Report bugs using GitHub issues:

1. Use "Bug Report" template
2. Describe the bug
3. Steps to reproduce
4. Expected vs actual behavior
5. Screenshots/logs if available
6. Environment details

**Bug Report Template:**
```markdown
**Describe the bug**
A clear description of the bug

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., Ubuntu 20.04]
- Node version: [e.g., 18.0.0]
- Browser: [e.g., Chrome 96]
```

## Database Changes

When modifying database schemas:

1. Create migration scripts
2. Document schema changes
3. Update seed data if needed
4. Test with existing data

## API Changes

When modifying API endpoints:

1. Update API documentation
2. Maintain backward compatibility
3. Version breaking changes
4. Update Postman collection

## Security

- Never commit sensitive data
- Use environment variables
- Follow OWASP guidelines
- Report security issues privately

**Reporting Security Issues:**
Email: security@profixmasters.com

## Code Review Guidelines

### For Reviewers

- Be respectful and constructive
- Focus on code quality
- Check for security issues
- Verify test coverage
- Ensure documentation is updated

### For Authors

- Respond to feedback promptly
- Be open to suggestions
- Explain your approach
- Make requested changes

## Project Structure

```
ProFix-Masters-Center/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Helper functions
│   │   ├── config/         # Configuration files
│   │   └── server.ts       # Entry point
│   ├── tests/              # Test files
│   └── package.json
│
├── frontend/
│   ├── app/                # Next.js pages
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── lib/                # Utilities
│   ├── types/              # TypeScript types
│   └── package.json
│
├── docs/                   # Documentation
└── README.md
```

## Environment Variables

### Backend (.env)
```env
# Required
PORT=5000
MONGODB_URI=mongodb://localhost:27017/profix-masters
JWT_SECRET=your-secret-key

# Optional
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email
EMAIL_PASSWORD=your-password
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Common Tasks

### Adding a New API Endpoint

1. Create/update model (if needed)
2. Add controller function
3. Create route
4. Update API documentation
5. Add tests

### Adding a New Page

1. Create page component in `app/`
2. Add route configuration
3. Update navigation (if needed)
4. Add to sitemap
5. Test responsive design

### Database Model Changes

1. Update model file
2. Create migration (if needed)
3. Update seed data
4. Update TypeScript types
5. Test thoroughly

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

## Questions?

- Check existing issues and PRs
- Review documentation
- Ask in discussions
- Email: dev@profixmasters.com

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

## Acknowledgments

Thank you to all contributors who help make ProFix Masters Center better!
