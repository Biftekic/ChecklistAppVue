# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Yes            |
| < 1.0   | ❌ No             |

## Reporting a Vulnerability

We take the security of ChecklistAppVue seriously. If you have discovered a security vulnerability, please follow these steps:

### 1. Do NOT Create a Public Issue

Security vulnerabilities should NOT be reported through public GitHub issues.

### 2. Email the Security Team

Send details to: [security@checklistapp.example.com]

Include the following information:
- Type of vulnerability (e.g., XSS, CSRF, SQL Injection)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker could exploit it

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 5 business days
- **Resolution Target**: 
  - Critical: 7 days
  - High: 14 days
  - Medium: 30 days
  - Low: 90 days

## Security Best Practices for Contributors

### Dependencies
- Regularly update dependencies
- Review security advisories from npm audit
- Use exact versions in production

### Code Review
- All code must be reviewed before merging
- Pay special attention to:
  - Input validation
  - Authentication/authorization logic
  - Data sanitization
  - Cryptographic implementations

### Sensitive Data
- Never commit secrets, API keys, or passwords
- Use environment variables for configuration
- Review `.gitignore` to ensure sensitive files are excluded

### Client-Side Security
- Sanitize all user inputs
- Use Content Security Policy (CSP) headers
- Implement proper CORS policies
- Avoid using `eval()` or `innerHTML` with user data
- Use HTTPS in production

## Security Features

### Current Implementation
- ✅ Input sanitization for all user-provided data
- ✅ XSS protection through Vue's template compilation
- ✅ No server-side components (reduces attack surface)
- ✅ Local storage encryption for sensitive data
- ✅ Secure random ID generation

### Planned Improvements
- [ ] Content Security Policy headers
- [ ] Subresource Integrity (SRI) for CDN resources
- [ ] Regular security audits
- [ ] Automated vulnerability scanning in CI/CD

## Disclosure Policy

When we receive a security report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find similar problems
3. Prepare fixes for all supported versions
4. Release new security fix versions
5. Publicly disclose the vulnerability after patches are available

## Security Advisories

Security advisories will be published through:
- GitHub Security Advisories
- Release notes
- Security mailing list (coming soon)

## Recognition

We appreciate the security research community's efforts in helping keep ChecklistAppVue secure. Contributors who report valid security issues will be acknowledged in:
- Security advisories
- Release notes
- Hall of Fame (coming soon)

## Contact

For any security-related questions, contact:
- Email: security@checklistapp.example.com
- PGP Key: [Coming Soon]

---

*Last Updated: January 2025*