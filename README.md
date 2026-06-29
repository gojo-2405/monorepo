# Monorepo — 8 Microservices

A Node.js monorepo with 8 independent microservices, each with its own Dockerfile, deployed to AWS ECR via GitHub Actions using OIDC (no long-lived credentials).

---

## Project Structure

```
monorepo/
├── .github/
│   └── workflows/
│       ├── _reusable-build.yml       # Shared build/push logic
│       ├── deploy-all.yml            # Trigger all 8 services at once
│       ├── auth-service.yml
│       ├── user-service.yml
│       ├── product-service.yml
│       ├── order-service.yml
│       ├── payment-service.yml
│       ├── notification-service.yml
│       ├── api-gateway.yml
│       └── reporting-service.yml
├── services/
│   ├── auth-service/         # Port 3001 — JWT auth, login/register
│   ├── user-service/         # Port 3002 — User CRUD
│   ├── product-service/      # Port 3003 — Product catalog
│   ├── order-service/        # Port 3004 — Order management
│   ├── payment-service/      # Port 3005 — Payment processing
│   ├── notification-service/ # Port 3006 — Email/SMS notifications
│   ├── api-gateway/          # Port 3000 — Entry point / reverse proxy
│   └── reporting-service/    # Port 3007 — Reports & analytics
├── package.json              # Root workspace
└── .gitignore
```

---

## GitHub Secrets Required

Go to **Settings → Secrets and Variables → Actions** and add:

| Secret | Description | Example |
|---|---|---|
| `AWS_ROLE_ARN` | IAM Role ARN with OIDC trust | `arn:aws:iam::123456789012:role/github-actions-role` |
| `ECR_REGISTRY` | ECR registry URL | `123456789012.dkr.ecr.us-east-1.amazonaws.com` |

---

## AWS IAM Role Trust Policy (OIDC)

Your role must trust GitHub Actions. Attach this trust policy to your IAM role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_ORG/YOUR_REPO:*"
        }
      }
    }
  ]
}
```

## IAM Role Permissions

The role needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage",
        "ecr:DescribeRepositories",
        "ecr:CreateRepository"
      ],
      "Resource": "arn:aws:ecr:us-east-1:YOUR_ACCOUNT_ID:repository/*"
    }
  ]
}
```

---

## ECR Repositories

Create one ECR repository per service:

```bash
aws ecr create-repository --repository-name auth-service --region us-east-1
aws ecr create-repository --repository-name user-service --region us-east-1
aws ecr create-repository --repository-name product-service --region us-east-1
aws ecr create-repository --repository-name order-service --region us-east-1
aws ecr create-repository --repository-name payment-service --region us-east-1
aws ecr create-repository --repository-name notification-service --region us-east-1
aws ecr create-repository --repository-name api-gateway --region us-east-1
aws ecr create-repository --repository-name reporting-service --region us-east-1
```

---

## How Workflows Trigger

### Automatic (path-based) — per push/PR
Each service workflow triggers **only when its own files change**:

```
push to main + changes in services/auth-service/** → auth-service.yml runs
push to main + changes in services/user-service/** → user-service.yml runs
```

### Manual — individual service
Go to **Actions → [Service Name] CI/CD → Run workflow**, choose environment.

### Manual — all services at once
Go to **Actions → Deploy All Services → Run workflow**.  
Optionally specify a comma-separated list of services, e.g. `auth-service,user-service`.  
Leave blank to deploy all 8.

---

## What Each Workflow Does

1. **Test** — installs deps, runs `npm test`, runs `npm run lint`
2. **Build & Push** (on push to `main`/`develop` only, not PRs):
   - Authenticates to AWS via OIDC (no static credentials)
   - Logs in to ECR
   - Builds Docker image with Buildx + layer caching
   - Tags with `git SHA` + `latest`
   - Pushes to ECR
   - Writes job summary

---

## Local Development

```bash
# Install all workspace deps
npm install

# Run a single service
cd services/auth-service && npm run dev

# Run tests for all services
npm run test:all
```
