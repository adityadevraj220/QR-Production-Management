# QR Production Management

## 1. Project Overview

**QR Production Management** is a SAP Cloud Application Programming Model (CAP) based application designed to demonstrate a controlled data-entry and QR-generation workflow.

The application provides a centralized backend service for maintaining records and generating QR codes for successfully created records.

The current implementation includes:

* SAP CAP backend services
* SAPUI5 frontend
* Student data management
* License validation
* License usage tracking
* License expiry validation
* Record creation limits
* Remaining-license calculation
* QR-code generation
* OData V4 APIs
* SAP HANA Cloud deployment support

The project is structured so that the current student-based implementation can be extended into a complete QR Production Management solution.

---

# 2. Business Purpose

The main purpose of this project is to provide a controlled application where records can be created only when the configured application license is valid.

Every successful record creation consumes one available license.

This provides a simple mechanism for controlling application usage based on:

1. License validity.
2. Maximum allowed records.
3. Number of records already created.

For example:

```text
License Limit = 100
Used Licenses = 35

Remaining Licenses = 100 - 35
                  = 65
```

When the limit is reached, further record creation is blocked.

Similarly, when the license validity date has expired, record creation is blocked.

---

# 3. Current Application Workflow

The current UI starts with a **Research** landing page.

The user selects:

```text
Data Entry
```

The application then opens the Student Entry page.

The user can enter:

* Roll
* Name
* Phone
* Still Studying

After selecting **Save**, the frontend sends the data to the CAP OData service.

The backend performs license validation before allowing the record to be created.

### Successful Flow

```text
Student Entry
      ↓
Validate mandatory fields
      ↓
Send OData CREATE request
      ↓
Check license validity
      ↓
Check license usage
      ↓
Create STUDENT record
      ↓
Increment license usage
      ↓
Calculate remaining licenses
      ↓
Generate QR Code
      ↓
Display QR Code
```

---

# 4. License Management

The application contains a custom license-management mechanism.

The license information is currently stored in:

```text
srv/license/license.json
```

The license structure contains:

```json
{
  "student": {
    "limit": 5,
    "used": 0
  },
  "validity": {
    "validTill": "2099-12-31"
  }
}
```

## License Parameters

### Limit

Defines the maximum number of records that can be created.

Example:

```text
limit = 5
```

means a maximum of five student records can be created.

### Used

Tracks how many records have already consumed the license.

Example:

```text
used = 3
```

means three licenses have already been consumed.

### Valid Till

Defines the date until which record creation is allowed.

Example:

```text
validTill = 2099-12-31
```

---

# 5. License Validation

Before every `CREATE` request, the backend performs two validations.

## License Expiry Validation

If the current date is greater than the configured `validTill` date, creation is rejected.

The API returns:

```text
403 - License expired
```

## License Usage Validation

If:

```text
used >= limit
```

the application prevents another record from being created.

The API returns:

```text
409 - Student creation limit exceeded
```

This validation is implemented in the CAP service layer.

---

# 6. License Usage Tracking

After a successful student creation, the application increments the license usage count.

For example:

```text
Before Creation

Limit = 5
Used  = 2
Remaining = 3
```

After successful creation:

```text
Limit = 5
Used  = 3
Remaining = 2
```

The backend also logs the remaining license count.

Example:

```text
[LICENSE] Remaining student licenses: 2
```

The license count is incremented only after a successful `CREATE`.

---

# 7. QR Code Generation

After a student record is successfully created, the frontend generates a QR code.

The QR payload contains the student information.

For example:

```json
{
  "Roll": "R001",
  "Name": "Student Name",
  "Phone": "9999999999",
  "IsChecked": true
}
```

The application converts this information into a QR-code URL and displays the generated QR code inside a dialog.

The current implementation uses the external QR Server API for QR generation.

---

# 8. Technology Stack

| Technology     | Usage                         |
| -------------- | ----------------------------- |
| SAP CAP        | Backend application framework |
| Node.js        | Backend runtime               |
| CDS            | Data modeling and services    |
| SAPUI5         | Frontend application          |
| OData V4       | API communication             |
| SAP HANA Cloud | Cloud database                |
| SAP BTP        | Cloud deployment platform     |
| JavaScript     | Backend and frontend logic    |
| Git/GitHub     | Source-code management        |

---

# 9. Project Structure

```text
QR-Production-Management/
│
├── app/
│   └── research/
│       ├── webapp/
│       │   ├── controller/
│       │   ├── view/
│       │   ├── model/
│       │   ├── i18n/
│       │   ├── Component.js
│       │   ├── manifest.json
│       │   └── index.html
│       │
│       ├── annotations.cds
│       ├── package.json
│       └── ui5.yaml
│
├── db/
│   ├── schema.cds
│   └── undeploy.json
│
├── srv/
│   ├── license/
│   │   ├── license.json
│   │   └── licenseStore.js
│   │
│   ├── server.js
│   ├── service.cds
│   └── service.js
│
├── package.json
├── package-lock.json
├── mta.yaml
├── test.http
└── README.md
```

---

# 10. Database Model

The current database model contains the `STUDENT` entity.

```text
STUDENT
│
├── ID
├── Roll
├── Name
├── Phone
├── IsChecked
└── remaining
```

### Fields

| Field     | Purpose                                         |
| --------- | ----------------------------------------------- |
| ID        | Unique record identifier                        |
| Roll      | Student roll number                             |
| Name      | Student name                                    |
| Phone     | Student phone number                            |
| IsChecked | Indicates whether the student is still studying |
| remaining | Remaining license count                         |

The `remaining` value is populated dynamically by the service and is used to expose the current license availability.

---

# 11. CAP Service

The backend exposes the following service:

```text
studentDataServices
```

The `STUDENT` entity is exposed through an OData V4 service.

The local endpoint is:

```text
http://localhost:4004/odata/v4/student-data-services/STUDENT
```

---

# 12. API Examples

## Create Student

```http
POST http://localhost:4004/odata/v4/student-data-services/STUDENT
Content-Type: application/json
```

Example payload:

```json
{
  "Roll": "R001",
  "Name": "Aditya",
  "Phone": "9999999999",
  "IsChecked": true
}
```

---

## Read Students

```http
GET http://localhost:4004/odata/v4/student-data-services/STUDENT
```

The project also contains `test.http`, which can be used to test these APIs.

---

# 13. How to Import the Project

## Using GitHub

Clone the repository:

```bash
git clone https://github.com/adityadevraj220/QR-Production-Management.git
```

Navigate into the project:

```bash
cd QR-Production-Management
```

---

# 14. Import into SAP Business Application Studio

1. Open SAP Business Application Studio.
2. Start an appropriate Dev Space.
3. Open the terminal.
4. Navigate to the projects directory.

```bash
cd /home/user/projects
```

5. Clone the repository:

```bash
git clone https://github.com/adityadevraj220/QR-Production-Management.git
```

6. Open the cloned project in BAS.

---

# 15. Install Dependencies

After opening the project, run:

```bash
npm install
```

This installs the dependencies defined in `package.json`.

The project uses dependencies including:

* `@sap/cds`
* `@cap-js/hana`
* `@cap-js/sqlite`
* `@sap/cds-dk`
* `@sap/ux-ui5-tooling`

---

# 16. Run the Application Locally

Start the CAP development server:

```bash
cds watch
```

The CAP server should start on:

```text
http://localhost:4004
```

The terminal will display the available services and application URLs.

---

# 17. Run the UI Application

The project contains a UI5 application under:

```text
app/research
```

The project defines the following npm script:

```bash
npm run watch-research
```

This runs:

```text
cds watch --open research/index.html
```

Therefore, for UI development, you can use:

```bash
npm run watch-research
```

---

# 18. Local Development Flow

A developer setting up the project for the first time can follow:

```text
1. Clone Repository
        ↓
2. Open Project in BAS
        ↓
3. npm install
        ↓
4. cds watch
        ↓
5. Open UI
        ↓
6. Test Data Entry
        ↓
7. Test OData APIs
        ↓
8. Verify License Validation
        ↓
9. Verify QR Generation
```

---

# 19. Git Development Workflow

Before starting development:

```bash
git pull
```

Check the repository:

```bash
git status
```

Create a feature branch:

```bash
git checkout -b feature/<feature-name>
```

After making changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Add <feature-description>"
```

Push:

```bash
git push -u origin feature/<feature-name>
```

---

# 20. Advantages

## License Controlled Usage

The application can control the number of records created based on a configured license.

## Expiry Protection

The application automatically prevents new records after the license validity period.

## Centralized Business Logic

License validation is implemented in the backend rather than relying only on frontend validation.

## CAP Architecture

The project follows the SAP CAP architecture, making it suitable for extension and SAP BTP deployment.

## OData V4

The application exposes standardized OData APIs that can be consumed by UI5 applications and other clients.

## QR Generation

Successfully created records can be represented using QR codes.

## HANA Ready

The project contains HANA configuration and an MTA descriptor for deployment to SAP BTP with SAP HANA Cloud.

## Easy Extension

The current student entity can be replaced or extended with production-related entities without changing the overall CAP architecture.

---

# 21. Limitations / Cons

## Current Business Model Is a Prototype

The current implementation is based on a `STUDENT` entity.

For a complete QR Production Management solution, the student model should eventually be replaced or extended with actual production-related entities.

## License Storage

The current license information is stored in a JSON file:

```text
srv/license/license.json
```

This is suitable for a prototype or controlled environment but is not ideal for a highly scalable production architecture.

A production implementation should consider a proper persistent license-management mechanism.

## File-Based License Updates

The `used` count is updated directly in the license JSON file.

This can create concurrency concerns when multiple application instances or users attempt to create records simultaneously.

## QR Service Dependency

QR codes are currently generated using an external QR Server API.

Therefore, QR generation depends on the availability of that external service and network connectivity.

## Limited Error Handling

The current implementation provides basic business-error handling.

A production version should include more comprehensive:

* Logging
* Error classification
* Monitoring
* User-friendly error messages
* Technical error tracking

## Authentication and Authorization

The current project should be further enhanced with proper authentication and role-based authorization before being used as a production application.

---

# 22. Production Recommendations

Before using the application in a production environment, the following improvements are recommended:

### License Management

Move license information from the local JSON file to a persistent and controlled storage mechanism.

### Concurrency Control

Ensure license consumption is atomic so that simultaneous requests cannot exceed the configured license limit.

### Security

Implement:

* Authentication
* Authorization
* Role-based access
* Secure configuration
* Secret management

### QR Generation

Consider generating QR codes internally or through a controlled enterprise service rather than depending on an external public QR API.

### Monitoring

Introduce application logging and monitoring through SAP BTP capabilities.

### Testing

Add:

* Unit tests
* Service tests
* Integration tests
* UI tests

### CI/CD

Introduce automated:

```text
Build
 ↓
Test
 ↓
Package
 ↓
Deploy
```

pipelines.

---

# 23. Future Scope

The current project provides the foundation for a broader QR Production Management application.

Potential future enhancements include:

* Production order management
* QR generation for production units
* QR scanning
* Production status tracking
* Batch management
* Material tracking
* Production history
* Dashboard and analytics
* User and role management
* License administration UI
* License renewal
* License activation/deactivation
* Audit logging
* SAP S/4HANA integration
* Automated notifications
* HANA-based license persistence
* Enterprise QR-code generation
* BTP CI/CD deployment

---

# 24. Project Benefits

The application can provide the following business benefits after the production-management functionality is implemented:

```text
Centralized Data
       +
Controlled Application Usage
       +
QR-based Identification
       +
Standardized APIs
       +
SAP BTP Integration
       +
Scalable CAP Architecture
       =
Maintainable QR Production Platform
```

---

# 25. Troubleshooting

## Application does not start

Run:

```bash
npm install
```

and then:

```bash
cds watch
```

Check the terminal for dependency or configuration errors.

---

## License expired

Check:

```text
srv/license/license.json
```

and verify:

```json
"validity": {
    "validTill": "YYYY-MM-DD"
}
```

---

## Student creation limit exceeded

Check:

```json
"student": {
    "limit": 5,
    "used": 5
}
```

When `used` reaches `limit`, new records are rejected.

---

## QR Code is not displayed

Check whether the application has network access to the external QR-code service.

Also verify the browser console for frontend errors.

---

# 26. Important Security Notes

Do not commit the following information to GitHub:

```text
Passwords
API keys
Client secrets
Private keys
Database credentials
BTP credentials
Authentication tokens
```

Environment-specific and sensitive configuration should be stored using appropriate secure mechanisms.

---

# 27. Repository

GitHub Repository:

https://github.com/adityadevraj220/QR-Production-Management

---

# 28. Project Status

**Current Status: Prototype / Proof of Concept**

The current version demonstrates:

* SAP CAP service
* SAPUI5 frontend
* Student data creation
* License validation
* License usage tracking
* License expiry validation
* QR-code generation
* OData APIs
* HANA deployment configuration

The architecture is intended to be extended into a complete QR Production Management solution.

---

# 29. Conclusion

QR Production Management provides a foundation for building a controlled, QR-enabled business application using SAP CAP and SAP BTP.

The current implementation demonstrates how application licensing, backend validation, data persistence, OData services, SAPUI5 UI, and QR-code generation can work together in a single application.

The project can be further enhanced to support real-world production management requirements, enterprise authentication, persistent license management, QR scanning, analytics, SAP integrations, and production monitoring.
