# QR Production Management

## 1. Project Overview

**QR Production Management** is a SAP Cloud Application Programming Model (CAP) based application designed to provide a **licensed, QR-enabled framework for managing business records and processes**.

The application is designed around a simple and reusable concept:

> **Create a business record → validate the application license → store the record → consume one license → generate a QR code for the record.**

Although the current implementation uses **Student** data as an example, the same architecture can be adapted for many different business scenarios.

The project provides:

* SAP CAP backend services
* SAPUI5 frontend
* OData V4 APIs
* License validation
* License expiry management
* Record creation limits
* License usage tracking
* Remaining license calculation
* QR-code generation
* Database persistence
* SAP HANA Cloud support
* SAP BTP / Cloud Foundry deployment support

The current Student implementation should therefore be considered a **reference implementation / proof of concept** for the broader QR-enabled business application framework.

---

# 2. Business Concept

The application is designed for scenarios where an organization needs to:

1. Maintain business records.
2. Control application usage through a license.
3. Restrict the maximum number of records that can be created.
4. Prevent usage after license expiry.
5. Generate a unique QR code for each successfully created record.
6. Expose the data through standardized OData APIs.

The business entity does not have to be a Student.

The same architecture can be used for:

* Students
* Employees
* Products
* Inventory items
* Assets
* Equipment
* Documents
* Event registrations
* Memberships
* Visitors
* Packages
* Production units
* Customer records
* Training participants
* Certificates
* Service records

The entity and business fields can be changed according to the customer's requirements while retaining the core licensing and QR-generation architecture.

---

# 3. Example Business Scenarios

## 3.1 Student Management

The current implementation demonstrates the concept using student records.

Example:

```text
Student
   ↓
Roll Number
Name
Phone
Study Status
   ↓
Save
   ↓
License Validation
   ↓
Student Created
   ↓
QR Code Generated
```

The QR code can be associated with the student's information and used for identification or verification.

---

## 3.2 Asset Management

The same application can be used to manage company assets.

Example:

```text
Asset
   ↓
Asset Number
Description
Location
Department
Status
   ↓
Save
   ↓
QR Code Generated
```

The QR code can then be printed and attached to the physical asset.

Scanning the QR code could provide access to the asset's information.

---

## 3.3 Inventory Management

The application can be extended to manage inventory or stock items.

Example:

```text
Material
   ↓
Material Number
Description
Batch
Storage Location
Quantity
   ↓
QR Code
```

The QR code can be used for quick identification of inventory items.

---

## 3.4 Employee Management

The framework can also be used for employee-related identification.

Example:

```text
Employee
   ↓
Employee ID
Name
Department
Location
   ↓
QR Code
```

The QR code could be used for identification, registration, access-related workflows, or internal processes.

---

## 3.5 Event Registration

The application can be used for event participants.

Example:

```text
Participant
   ↓
Registration ID
Name
Email
Event
   ↓
QR Code
   ↓
Scan at Event Entrance
```

This can be extended into a QR-based event check-in system.

---

## 3.6 Production Management

The framework can also be extended for manufacturing and production scenarios.

For example:

```text
Production Unit
       ↓
Production Order
       ↓
Material / Batch
       ↓
Production Status
       ↓
QR Code
```

The QR code can then be associated with a production unit, batch, container, or finished product.

---

# 4. Core Application Workflow

The generic workflow is:

```text
Business Record Entry
        ↓
Validate Input
        ↓
Send OData CREATE Request
        ↓
Validate License
        ↓
Check License Expiry
        ↓
Check Record Creation Limit
        ↓
Create Business Record
        ↓
Increment License Usage
        ↓
Calculate Remaining Licenses
        ↓
Generate QR Code
        ↓
Display QR Code
```

The current implementation demonstrates this workflow using the `STUDENT` entity.

---

# 5. License Management

The application contains a license-management mechanism that controls how many records can be created and how long the application can be used.

The current license information is stored in:

```text
srv/license/license.json
```

The current structure is:

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

The `student` section represents the current example implementation.

For a different business scenario, the same concept can be adapted to the required business entity.

---

# 6. License Parameters

## Limit

The `limit` defines the maximum number of records that can be created.

Example:

```text
Limit = 100
```

This means the application can create a maximum of 100 licensed records.

---

## Used

The `used` value represents the number of licenses already consumed.

Example:

```text
Limit = 100
Used = 35
```

Therefore:

```text
Remaining = 100 - 35
          = 65
```

---

## Valid Till

The `validTill` value defines the date until which record creation is allowed.

Example:

```text
validTill = 2099-12-31
```

After the configured validity date, new records are not allowed to be created.

---

# 7. License Validation

Before creating a new record, the backend validates the license.

Two primary checks are performed.

## 7.1 License Expiry

If the license has expired, the creation request is rejected.

Example:

```text
Current Date > Valid Till
        ↓
License Expired
        ↓
Record Creation Rejected
```

The application returns an appropriate business error to the consumer.

---

## 7.2 License Usage

The application also checks whether the maximum number of records has already been created.

Conceptually:

```text
used >= limit
```

If this condition is true:

```text
Record Creation Rejected
```

This prevents the application from exceeding the licensed usage.

---

# 8. License Usage Tracking

A license is consumed after a successful record creation.

Example:

```text
Before Creation

Limit     = 100
Used      = 35
Remaining = 65
```

After a successful creation:

```text
Limit     = 100
Used      = 36
Remaining = 64
```

The license is incremented only after the record has been successfully created.

This ensures that unsuccessful creation requests do not unnecessarily consume the license.

---

# 9. QR Code Generation

After a successful record creation, the application generates a QR code containing information associated with the created record.

The current implementation demonstrates this using Student information.

Example:

```json
{
  "Roll": "R001",
  "Name": "Student Name",
  "Phone": "9999999999",
  "IsChecked": true
}
```

The QR code can then be displayed to the user.

The same mechanism can be adapted to other business objects.

For example:

```text
Asset QR
Material QR
Employee QR
Production QR
Event QR
Document QR
Inventory QR
```

The exact QR payload can be modified according to the business requirement.

---

# 10. Technology Stack

| Technology     | Purpose                               |
| -------------- | ------------------------------------- |
| SAP CAP        | Backend application framework         |
| Node.js        | Application runtime                   |
| CDS            | Data modeling and service definitions |
| SAPUI5         | Frontend application                  |
| OData V4       | API communication                     |
| SAP HANA Cloud | Database persistence                  |
| SAP BTP        | Cloud platform                        |
| Cloud Foundry  | Application deployment                |
| JavaScript     | Application logic                     |
| Git/GitHub     | Source-code management                |

---

# 11. Project Structure

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

# 12. Database Model

The current reference implementation contains the `STUDENT` entity.

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

The Student entity is only an example.

For another business scenario, it can be replaced or extended with entities such as:

```text
ASSET
PRODUCT
INVENTORY
EMPLOYEE
PRODUCTION_UNIT
EVENT_PARTICIPANT
DOCUMENT
```

without changing the fundamental licensing concept.

---

# 13. CAP Service

The backend exposes the business data through an OData V4 service.

The current example service is:

```text
studentDataServices
```

The current Student endpoint is:

```text
http://localhost:4004/odata/v4/student-data-services/STUDENT
```

The service layer is responsible for handling requests and applying the application's business rules.

---

# 14. API Example

## Create a Record

The current Student implementation provides an example of a create request.

```http
POST http://localhost:4004/odata/v4/student-data-services/STUDENT
Content-Type: application/json
```

Example:

```json
{
  "Roll": "R001",
  "Name": "Aditya",
  "Phone": "9999999999",
  "IsChecked": true
}
```

The same API concept can be applied to other business entities.

---

# 15. How to Import the Project

## Option 1 — Clone from GitHub

Clone the repository:

```bash
git clone https://github.com/adityadevraj220/QR-Production-Management.git
```

Navigate into the project:

```bash
cd QR-Production-Management
```

---

# 16. Import into SAP Business Application Studio

1. Open SAP Business Application Studio.
2. Start the required Dev Space.
3. Open the terminal.
4. Navigate to your projects directory.

```bash
cd /home/user/projects
```

5. Clone the repository:

```bash
git clone https://github.com/adityadevraj220/QR-Production-Management.git
```

6. Open the cloned project in the BAS workspace.

---

# 17. Install Dependencies

After opening the project:

```bash
npm install
```

This installs the dependencies defined in `package.json`.

---

# 18. Run the Application Locally

## Recommended Method

For normal execution, use:

```bash
npm start
```

or:

```bash
cds run
```

The CAP server will start without the development file-watching behavior of `cds watch`.

The application is normally available at:

```text
http://localhost:4004
```

The terminal will display the available services and endpoints.

---

# 19. Why `cds run` Is Used

`cds run` starts the CAP application normally without continuously watching project files for changes.

This is useful when you want to test the application in an environment closer to the deployed application.

For example:

```text
Start Application
       ↓
cds run
       ↓
CAP Server Running
       ↓
Create Record
       ↓
License Usage Updated
       ↓
Application Continues Running
```

The application does not need to restart simply because the license file is updated.

---

# 20. Development Watch Mode

`cds watch` can still be used when active development requires automatic detection of source-code changes.

Example:

```bash
cds watch
```

However, this mode is primarily intended for development.

For normal application execution and testing of the deployed-style behavior, use:

```bash
npm start
```

or:

```bash
cds run
```

---

# 21. UI Application

The current UI5 application is located under:

```text
app/research
```

The UI provides the current example workflow for entering Student information and generating the corresponding QR code.

The UI can be extended or replaced according to the target business scenario.

---

# 22. Local Development Flow

The recommended setup flow is:

```text
1. Clone Repository
        ↓
2. Open Project in BAS
        ↓
3. npm install
        ↓
4. npm start / cds run
        ↓
5. Open Application
        ↓
6. Test Business Record Creation
        ↓
7. Verify License Validation
        ↓
8. Verify License Usage
        ↓
9. Verify QR Generation
        ↓
10. Test OData APIs
```

---

# 23. Cloud Foundry / SAP BTP Deployment

The project contains an `mta.yaml` file and is designed to support deployment to SAP BTP Cloud Foundry.

The general deployment flow is:

```text
Development
     ↓
Build MTA
     ↓
Deploy to Cloud Foundry
     ↓
CAP Application
     ↓
SAP HANA Cloud
     ↓
SAP BTP
```

Before deployment, make sure the required SAP BTP services, destinations, database configuration, and authentication settings are available in the target environment.

---

# 24. Cloud Foundry Application

The deployed application runs using the normal CAP application startup process.

Unlike development watch mode, the deployed application does not require:

```bash
cds watch
```

The application is started by the Cloud Foundry runtime according to the deployment configuration.

This makes `cds run` / normal CAP startup the more appropriate model when testing the application's runtime behavior locally.

---

# 25. Git Development Workflow

Check the current repository status:

```bash
git status
```

Pull the latest changes:

```bash
git pull
```

Create a feature branch:

```bash
git checkout -b feature/<feature-name>
```

Add changes:

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

# 26. Advantages

## 26.1 Reusable Business Architecture

The application is not limited to Student management.

The same architecture can be adapted to multiple business scenarios.

---

## 26.2 License-Based Control

The application can control the maximum number of records that can be created.

This makes it possible to provide different license models for different customers or business requirements.

For example:

```text
Basic License
1,000 Records

Professional License
10,000 Records

Enterprise License
Unlimited / Custom
```

The exact licensing model can be implemented according to business requirements.

---

## 26.3 License Expiry

The application can prevent new record creation after the license validity period expires.

---

## 26.4 Centralized Backend Validation

License validation happens in the backend service layer.

This is important because frontend-only validation can be bypassed by directly calling APIs.

---

## 26.5 QR-Based Identification

Each successfully created business record can be associated with a QR code.

This enables potential use cases such as:

* Identification
* Tracking
* Verification
* Check-in
* Asset lookup
* Product lookup
* Production tracking

---

## 26.6 SAP CAP Architecture

The application follows the SAP CAP programming model, making it suitable for extension and integration within the SAP ecosystem.

---

## 26.7 OData APIs

The business services are exposed through OData V4 APIs.

These APIs can be consumed by:

* SAPUI5 applications
* External applications
* Mobile applications
* Integration services
* Other business systems

---

## 26.8 SAP BTP Ready

The application can be deployed on SAP BTP Cloud Foundry and can be integrated with SAP HANA Cloud and other BTP services.

---

# 27. Limitations / Cons

## 27.1 Current Student Implementation

The current UI and database model demonstrate the concept using Student data.

The business model needs to be adapted for the final target business process.

---

## 27.2 License Stored in JSON

The current license information is stored in:

```text
srv/license/license.json
```

This is convenient for a prototype and controlled environment.

For a large-scale production application, license information should preferably be stored in a persistent database or dedicated licensing service.

---

## 27.3 File-Based License Updates

The current implementation updates the `used` value in the JSON license file.

For multiple application instances, this approach can create concurrency and synchronization concerns.

A production implementation should use transactional persistent storage.

---

## 27.4 External QR Service

The current QR generation mechanism uses an external QR service.

Therefore, QR generation may depend on:

* Network availability
* External service availability
* External service limitations

For an enterprise implementation, QR generation can be moved to an internally controlled service if required.

---

## 27.5 Authentication and Authorization

Before production use, the application should implement appropriate:

* Authentication
* Authorization
* Role-based access
* User management

---

## 27.6 Production Monitoring

A production implementation should include proper:

* Application logging
* Monitoring
* Error tracking
* Audit logging
* Alerting

---

# 28. Recommended Production Improvements

For a production-grade implementation, the following improvements are recommended.

## License Management

Move license information from the JSON file to persistent storage such as SAP HANA Cloud or a dedicated licensing service.

## Concurrency Control

Use transactional operations so simultaneous requests cannot exceed the licensed record limit.

## Security

Implement proper authentication and authorization using the organization's identity and security architecture.

## QR Generation

Consider an enterprise-controlled QR generation service instead of depending on an external public QR service.

## Monitoring

Implement centralized logging and monitoring.

## Automated Testing

Add:

* Unit tests
* Service tests
* Integration tests
* UI tests

## CI/CD

Implement an automated pipeline:

```text
Code
 ↓
Build
 ↓
Test
 ↓
Package
 ↓
Deploy
 ↓
Validate
```

---

# 29. Potential Business Applications

The framework can be adapted to many industries and processes.

| Business Area    | Example Record            | Possible QR Usage               |
| ---------------- | ------------------------- | ------------------------------- |
| Education        | Student                   | Student identification          |
| Manufacturing    | Production Unit           | Production tracking             |
| Inventory        | Material / Batch          | Stock identification            |
| Asset Management | Company Asset             | Asset lookup                    |
| HR               | Employee                  | Employee identification         |
| Events           | Participant               | Event check-in                  |
| Logistics        | Package                   | Package tracking                |
| Retail           | Product                   | Product identification          |
| Healthcare       | Patient / Appointment     | Identification and verification |
| Documents        | Document                  | Document lookup                 |
| Warehousing      | Container / Pallet        | Warehouse tracking              |
| Training         | Participant / Certificate | Certificate verification        |

The QR code and business fields can be customized according to each use case.

---

# 30. Future Scope

Potential enhancements include:

* Generic business-entity configuration
* Dynamic QR payload configuration
* QR scanning
* QR verification
* License administration UI
* License activation
* License renewal
* License deactivation
* Customer-specific licensing
* Subscription-based licensing
* HANA-based license persistence
* Role-based access control
* Audit logging
* Production tracking
* Inventory integration
* Asset management
* SAP S/4HANA integration
* Mobile application support
* Dashboards and analytics
* Automated notifications
* CI/CD deployment
* Centralized monitoring

---

# 31. Security Guidelines

Never commit sensitive information to GitHub.

Do not store:

```text
Passwords
API Keys
Client Secrets
Private Keys
Database Credentials
BTP Credentials
Authentication Tokens
```

in the repository.

Use secure configuration mechanisms such as environment variables, service bindings, destinations, and appropriate SAP BTP security services.

---

# 32. Troubleshooting

## Application does not start

Install dependencies:

```bash
npm install
```

Then run:

```bash
npm start
```

or:

```bash
cds run
```

Check the terminal for errors.

---

## License Expired

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

## License Limit Reached

Check the configured:

```json
"limit": 5,
"used": 5
```

When the used count reaches the configured limit, additional record creation is rejected.

---

## QR Code Not Generated

Check:

1. Browser console.
2. Network connectivity.
3. QR service availability.
4. QR payload.
5. API response from the backend.

---

# 33. Project Status

**Current Status: Proof of Concept / Reference Implementation**

The current version demonstrates:

* SAP CAP backend
* SAPUI5 frontend
* OData V4 services
* Business record creation
* License validation
* License usage tracking
* License expiry validation
* Remaining license calculation
* QR-code generation
* SAP HANA Cloud configuration
* SAP BTP / Cloud Foundry deployment support

The current Student implementation is a **demonstration of the framework and is not intended to limit the solution to student management**.

The architecture can be adapted to multiple business processes and industries.

---

# 34. Project Vision

The vision of QR Production Management is to provide a reusable platform for building **licensed, QR-enabled business applications** on SAP BTP.

The fundamental concept is:

```text
Business Data
     +
License Control
     +
Backend Validation
     +
QR Generation
     +
OData APIs
     +
SAP BTP
     ↓
Reusable QR Business Platform
```

The Student implementation demonstrates the concept, while the same architecture can be extended to production, inventory, assets, employees, products, events, logistics, documents, and many other business scenarios.

---

# 35. Repository

GitHub Repository:

https://github.com/adityadevraj220/QR-Production-Management

---

# 36. Conclusion

QR Production Management provides a foundation for developing controlled and QR-enabled business applications using SAP CAP, SAPUI5, SAP HANA Cloud, and SAP BTP.

The current implementation demonstrates how a business record can be created, validated against a license, stored through CAP services, counted against the licensed usage, and associated with a QR code.

**Student management is only the current example.**

The core architecture is designed to be reusable across different business scenarios where organizations need controlled record creation, QR-based identification, standardized APIs, and SAP BTP integration.

The solution can evolve into a complete enterprise platform by adding persistent license management, authentication and authorization, QR scanning, business-specific workflows, analytics, monitoring, and integrations with SAP and external systems.
