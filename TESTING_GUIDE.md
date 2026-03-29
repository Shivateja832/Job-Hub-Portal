# 🧪 Job Listing Portal - Manual Testing Guide

## **Prerequisites**
- Backend running on port 5000
- MongoDB running locally
- Terminal/CMD access

---

## **1️⃣ AUTHENTICATION TESTING**

### **Test 1.1: User Registration (Job Seeker)**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"John Doe\",
    \"email\": \"john@example.com\",
    \"password\": \"password123\",
    \"role\": \"jobseeker\",
    \"company\": \"\"
  }"
```
**Expected Response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "jobseeker"
  }
}
```

### **Test 1.2: User Registration (Employer)**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Jane Smith\",
    \"email\": \"jane@company.com\",
    \"password\": \"password456\",
    \"role\": \"employer\",
    \"company\": \"Tech Solutions Inc\"
  }"
```
**Expected Response:** Token + User object with company name

### **Test 1.3: User Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"john@example.com\",
    \"password\": \"password123\"
  }"
```
**Expected Response:** Token + User object

### **Test 1.4: Get Profile (Authenticated)**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
**Expected Response:** User profile with all details

### **Test 1.5: Login with Wrong Password**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"john@example.com\",
    \"password\": \"wrongpassword\"
  }"
```
**Expected Response:** Error - "Invalid credentials"

---

## **2️⃣ JOB OPERATIONS TESTING**

### **Test 2.1: Get All Jobs (No Auth Required)**
```bash
curl http://localhost:5000/api/jobs
```
**Expected Response:** Array of jobs (empty initially)
```json
[]
```

### **Test 2.2: Search Jobs by Keyword**
```bash
curl "http://localhost:5000/api/jobs?keyword=developer"
```
**Expected Response:** Filtered jobs matching "developer"

### **Test 2.3: Search Jobs by Location**
```bash
curl "http://localhost:5000/api/jobs?location=Bangalore"
```
**Expected Response:** Jobs in Bangalore location

### **Test 2.4: Search Jobs by Job Type**
```bash
curl "http://localhost:5000/api/jobs?jobType=Full-Time"
```
**Expected Response:** Only Full-Time jobs

### **Test 2.5: Create Job (Employer Only)**
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer EMPLOYER_TOKEN_HERE" \
  -d "{
    \"title\": \"Senior Developer\",
    \"description\": \"We need an experienced developer\",
    \"qualifications\": \"5+ years experience\",
    \"responsibilities\": \"Develop and maintain applications\",
    \"location\": \"Bangalore, Karnataka\",
    \"salary\": \"₹10,00,000 - ₹15,00,000\",
    \"jobType\": \"Full-Time\"
  }"
```
**Expected Response:**
```json
{
  "_id": "...",
  "title": "Senior Developer",
  "employer": "...",
  "active": true,
  "createdAt": "..."
}
```

### **Test 2.6: Get Job by ID**
```bash
curl http://localhost:5000/api/jobs/JOB_ID_HERE
```
**Expected Response:** Complete job details

### **Test 2.7: Update Job**
```bash
curl -X PUT http://localhost:5000/api/jobs/JOB_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer EMPLOYER_TOKEN_HERE" \
  -d "{
    \"title\": \"Updated Job Title\",
    \"salary\": \"₹12,00,000 - ₹18,00,000\"
  }"
```
**Expected Response:** Updated job object

### **Test 2.8: Delete Job**
```bash
curl -X DELETE http://localhost:5000/api/jobs/JOB_ID_HERE \
  -H "Authorization: Bearer EMPLOYER_TOKEN_HERE"
```
**Expected Response:** 
```json
{"message": "Job deleted successfully"}
```

---

## **3️⃣ JOB APPLICATION TESTING**

### **Test 3.1: Apply for Job (Job Seeker Only)**
```bash
curl -X POST http://localhost:5000/api/jobs/JOB_ID_HERE/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JOBSEEKER_TOKEN_HERE" \
  -d "{
    \"coverLetter\": \"I am very interested in this position...\"
  }"
```
**Expected Response:**
```json
{
  "_id": "...",
  "job": "JOB_ID",
  "applicant": "USER_ID",
  "status": "Pending",
  "createdAt": "..."
}
```

### **Test 3.2: Get Applications (Job Seeker Dashboard)**
```bash
curl -X GET http://localhost:5000/api/dashboard/applications \
  -H "Authorization: Bearer JOBSEEKER_TOKEN_HERE"
```
**Expected Response:** Array of applications submitted by job seeker
```json
[
  {
    "_id": "...",
    "job": {...},
    "status": "Pending",
    "createdAt": "..."
  }
]
```

### **Test 3.3: Get Applicants for Job (Employer View)**
```bash
curl -X GET http://localhost:5000/api/jobs/JOB_ID_HERE/applicants \
  -H "Authorization: Bearer EMPLOYER_TOKEN_HERE"
```
**Expected Response:** Array of applicants for that job

---

## **4️⃣ DASHBOARD TESTING**

### **Test 4.1: Get Employer's Jobs**
```bash
curl -X GET http://localhost:5000/api/dashboard/employer-jobs \
  -H "Authorization: Bearer EMPLOYER_TOKEN_HERE"
```
**Expected Response:** Array of jobs posted by employer

### **Test 4.2: Get Employer Applications**
```bash
curl -X GET http://localhost:5000/api/dashboard/employer-applications \
  -H "Authorization: Bearer EMPLOYER_TOKEN_HERE"
```
**Expected Response:** Array of applications received for employer's jobs

### **Test 4.3: Update Application Status**
```bash
curl -X PUT http://localhost:5000/api/dashboard/applications/APPLICATION_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer EMPLOYER_TOKEN_HERE" \
  -d "{
    \"status\": \"Shortlisted\"
  }"
```
**Statuses:** Pending, Viewed, Shortlisted, Accepted, Rejected

**Expected Response:**
```json
{
  "_id": "...",
  "status": "Shortlisted",
  "updatedAt": "..."
}
```

---

## **5️⃣ PROFILE & RESUME TESTING**

### **Test 5.1: Update Profile**
```bash
curl -X PUT http://localhost:5000/api/auth/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JOBSEEKER_TOKEN_HERE" \
  -d "{
    \"location\": \"Mumbai, Maharashtra\",
    \"bio\": \"Full Stack Developer with 5+ years experience\"
  }"
```
**Expected Response:** Updated user profile

### **Test 5.2: Upload Resume (Multipart Form)**
```bash
curl -X PUT http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer JOBSEEKER_TOKEN_HERE" \
  -F "resume=@/path/to/resume.pdf"
```
**Files Supported:** PDF, DOC, DOCX (Max 5MB)

**Expected Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "resume": "resume_filename.pdf"
  }
}
```

### **Test 5.3: Download Resume**
```bash
curl -L http://localhost:5000/uploads/resume_filename.pdf -o resume.pdf
```

---

## **6️⃣ ERROR TESTING**

### **Test 6.1: Request Without Authentication**
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d "{\"title\": \"Test\"}"
```
**Expected Response:** 
```json
{"message": "No auth token, authorization denied"}
```

### **Test 6.2: Invalid Token**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer invalid_token_here"
```
**Expected Response:**
```json
{"message": "Token is not valid"}
```

### **Test 6.3: Duplicate Email Registration**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Another User\",
    \"email\": \"john@example.com\",
    \"password\": \"password123\",
    \"role\": \"jobseeker\"
  }"
```
**Expected Response:**
```json
{"message": "Email already exists"}
```

### **Test 6.4: Invalid Job Type in Search**
```bash
curl "http://localhost:5000/api/jobs?jobType=InvalidType"
```
**Expected Response:** Empty array (no matches)

---

## **7️⃣ AUTHORIZATION TESTING**

### **Test 7.1: Job Seeker Trying to Create Job**
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JOBSEEKER_TOKEN_HERE" \
  -d "{\"title\": \"Test Job\"}"
```
**Expected Response:**
```json
{"message": "Only employers can create jobs"}
```

### **Test 7.2: Job Seeker Trying to Delete Another's Job**
```bash
curl -X DELETE http://localhost:5000/api/jobs/JOB_ID_HERE \
  -H "Authorization: Bearer DIFFERENT_USER_TOKEN"
```
**Expected Response:**
```json
{"message": "Not authorized to delete this job"}
```

### **Test 7.3: Employer Trying to Apply for Job**
```bash
curl -X POST http://localhost:5000/api/jobs/JOB_ID_HERE/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer EMPLOYER_TOKEN_HERE" \
  -d "{\"coverLetter\": \"test\"}"
```
**Expected Response:**
```json
{"message": "Only job seekers can apply for jobs"}
```

---

## **8️⃣ DATABASE TESTING**

### **Test 8.1: Check MongoDB Connection**
```bash
mongosh localhost:27017/job_portal
```
**Then in mongo shell:**
```javascript
db.users.countDocuments()
db.jobs.countDocuments()
db.applications.countDocuments()
```
**Expected:** Document counts increase with testing

### **Test 8.2: View Sample Users**
```javascript
db.users.find().pretty()
```

### **Test 8.3: View Sample Jobs**
```javascript
db.jobs.find().pretty()
```

---

## **9️⃣ FRONTEND TESTING CHECKLIST**

### **Test 9.1: Home Page**
- [ ] Hero section loads with gradient background
- [ ] Statistics cards display correctly
- [ ] Search bar is functional
- [ ] "Explore Jobs" button routes to jobs page

### **Test 9.2: Jobs Page**
- [ ] 8 sample jobs display
- [ ] Search by keyword works
- [ ] Search by location works
- [ ] Filter by job type works
- [ ] Clicking job card opens modal
- [ ] Job details modal shows all sections

### **Test 9.3: Authentication**
- [ ] Register form submits correctly
- [ ] Login form submits correctly
- [ ] Error messages display for invalid inputs
- [ ] Tokens save to localStorage
- [ ] Logout clears tokens

### **Test 9.4: Dashboard**
- [ ] Job Seeker sees their applications
- [ ] Job Seeker sees application status
- [ ] Employer sees their jobs
- [ ] Employer can create new job
- [ ] Employer can delete job
- [ ] Employer can update application status

### **Test 9.5: Profile**
- [ ] Profile page displays user info
- [ ] Resume upload button works
- [ ] Resume file validates (size, type)
- [ ] Resume download link works
- [ ] Profile information reads correctly

### **Test 9.6: Responsive Design**
- [ ] Works on desktop (1920px)
- [ ] Works on tablet (768px)
- [ ] Works on mobile (360px)
- [ ] Navigation collapses on mobile
- [ ] Forms are readable on all sizes

---

## **🔟 QUICK TEST SEQUENCE (5 minutes)**

**Step 1: Register Job Seeker**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Test User\", \"email\": \"test@test.com\", \"password\": \"test123\", \"role\": \"jobseeker\"}"
```
Save the token from response.

**Step 2: Register Employer**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Employer\", \"email\": \"emp@test.com\", \"password\": \"test123\", \"role\": \"employer\", \"company\": \"Test Co\"}"
```
Save the employer token.

**Step 3: Create Job (as Employer)**
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer EMPLOYER_TOKEN" \
  -d "{\"title\": \"Test Job\", \"description\": \"Test\", \"qualifications\": \"Test\", \"responsibilities\": \"Test\", \"location\": \"Test\", \"salary\": \"Test\", \"jobType\": \"Full-Time\"}"
```
Save the job ID.

**Step 4: Get All Jobs**
```bash
curl http://localhost:5000/api/jobs
```

**Step 5: Apply for Job (as Job Seeker)**
```bash
curl -X POST http://localhost:5000/api/jobs/JOB_ID/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JOBSEEKER_TOKEN" \
  -d "{\"coverLetter\": \"Interested\"}"
```

**Step 6: Get Applications (as Job Seeker)**
```bash
curl http://localhost:5000/api/dashboard/applications \
  -H "Authorization: Bearer JOBSEEKER_TOKEN"
```

**Step 7: View Profile (as Job Seeker)**
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer JOBSEEKER_TOKEN"
```

✅ **All tests passed = System working perfectly!**

---

## **📝 Notes**

- Replace `YOUR_TOKEN_HERE` with actual tokens from registration/login
- Replace path `/path/to/resume.pdf` with actual file path for upload test
- Ensure backend is running: `node server.js`
- Ensure MongoDB is running
- All timestamps are in UTC format
- Password must be at least 6 characters
- Email format must be valid

---

## **🎯 Success Indicators**

✅ All auth endpoints return proper tokens
✅ Job CRUD operations work correctly
✅ Application system functioning
✅ Dashboard shows accurate data
✅ Error messages are descriptive
✅ Authorization checks working
✅ No console errors in browser

