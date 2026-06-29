# Manual AWS Setup Checklist

Run these AWS CLI commands once before your first GitHub Actions deploy.
Replace `618246140803` and `us-east-1` if different.

---

## 1. Create CloudWatch Log Group (shared by all services)

```bash
aws logs create-log-group \
  --log-group-name /ecs/ecom-cluster \
  --region us-east-1
```

---

## 2. Create ECR Repositories (one per service)

```bash
for repo in ecom-auth ecom-user ecom-product ecom-order ecom-payment ecom-cart ecom-notification ecom-storefront; do
  aws ecr create-repository \
    --repository-name $repo \
    --region us-east-1
  echo "Created ECR repo: $repo"
done
```

---

## 3. Create ECS Cluster

```bash
aws ecs create-cluster \
  --cluster-name ecom-cluster \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy \
      capacityProvider=FARGATE,weight=1,base=1 \
  --settings name=containerInsights,value=enabled \
  --region us-east-1
```

---

## 4. Register Task Definitions (run from repo root)

```bash
for svc in auth-service user-service product-service order-service payment-service cart-service notification-service storefront; do
  aws ecs register-task-definition \
    --cli-input-json file://services/$svc/task-definition.json \
    --region us-east-1
  echo "Registered task def for: $svc"
done
```

---

## 5. Create ECS Services

> You need a VPC, subnets, and security group ID before running this.
> Replace `subnet-xxxx`, `subnet-yyyy`, `sg-xxxx` with your values.

```bash
SUBNETS="subnet-xxxx,subnet-yyyy"
SG="sg-xxxx"
TARGET_GROUP_ARN_PREFIX="arn:aws:elasticloadbalancing:us-east-1:618246140803:targetgroup"

declare -A SERVICES
SERVICES=(
  [ecom-auth-service]="ecom-auth"
  [ecom-user-service]="ecom-user"
  [ecom-product-service]="ecom-product"
  [ecom-order-service]="ecom-order"
  [ecom-payment-service]="ecom-payment"
  [ecom-cart-service]="ecom-cart"
  [ecom-notification-service]="ecom-notification"
  [ecom-storefront-service]="ecom-storefront"
)

for SERVICE_NAME in "${!SERVICES[@]}"; do
  TASK_FAMILY="${SERVICES[$SERVICE_NAME]}"
  aws ecs create-service \
    --cluster ecom-cluster \
    --service-name $SERVICE_NAME \
    --task-definition $TASK_FAMILY \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNETS],securityGroups=[$SG],assignPublicIp=DISABLED}" \
    --region us-east-1
  echo "Created ECS service: $SERVICE_NAME"
done
```

---

## 6. GitHub Secret to Add

| Secret Name   | Value                                         |
|---------------|-----------------------------------------------|
| `AWS_ROLE_ARN`| `arn:aws:iam::618246140803:role/YOUR_ROLE`   |

---

## Summary — What you created manually vs what GitHub Actions handles

| Step                        | Who does it     |
|-----------------------------|-----------------|
| CloudWatch log group        | You (once)      |
| ECR repositories            | You (once)      |
| ECS cluster                 | You (once)      |
| Task definition registration| You (once, then Actions takes over) |
| ECS services                | You (once)      |
| Build Docker image          | GitHub Actions  |
| Push image to ECR           | GitHub Actions  |
| Update task definition      | GitHub Actions  |
| Deploy new task to service  | GitHub Actions  |
