# 🚀 QUICK TEST COMMANDS - Copy & Paste Ready

## **1️⃣ BASIC TESTS (No Setup Needed)**

```bash
# Check Backend Health
curl http://localhost:5000/

# Get All Jobs
curl http://localhost:5000/api/jobs

# Search by keyword
curl "http://localhost:5000/api/jobs?keyword=Developer"

# Search by location
curl "http://localhost:5000/api/jobs?location=Bangalore"

# Search by job type
curl "http://localhost:5000/api/jobs?jobType=Full-Time"
```

---

## **2️⃣ AUTHENTICATION TESTS**

### **Register Job Seeker**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"John Jobseeker\",
    \"email\": \"john@test.com\",
    \"password\": \"test123456\",
    \"role\": \"jobseeker\"
  }"
```
**💾 Save the TOKEN from response**

### **Register Employer**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Jane Employer\",
    \"email\": \"jane@test.com\",
    \"password\": \"test123456\",
    \"role\": \"employer\",
    \"company\": \"Tech Company Inc\"
  }"
```
**💾 Save this TOKEN too**

### **Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"john@test.com\",
    \"password\": \"test123456\"
  }"
```

### **Get Profile**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer PASTE_TOKEN_HERE"
```

---

## **3️⃣ JOB OPERATIONS TESTS**

### **Create Job (as Employer)**
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer EMPLOYER_TOKEN_HERE" \
  -d "{
    \"title\": \"Full Stack Developer\",
    \"description\": \"Looking for experienced developer with modern tech stack\",
    \"qualifications\": \"5+ years in web development, React, Node.js, MongoDB\",
    \"responsibilities\": \"Develop features, fix bugs, code review, mentoring\",
    \"location\": \"Bangalore, Karnataka\",
    \"salary\": \"₹12,00,000 - ₹15,00,000 per annum\",
    \"jobType\": \"Full-Time\"
  }"
```
**💾 Save the JOB_ID from response**

### **Get Single Job**
```bash
curl http://localhost:5000/api/jobs/JOB_ID_HERE
```

### **Update Job**
```bash
curl -X PUT http://localhost:5000/api/jobs/JOB_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer EMPLOYER_TOKEN_HERE" \
  -d "{
    \"title\": \"Senior Full Stack Developer\",
    \"salary\": \"₹15,00,000 - ₹20,00,000 per annum\"
  }"
```

### **Delete Job**
```bash
curl -X DELETE http://localhost:5000/api/jobs/JOB_ID_HERE \
  -H "Authorization: Bearer EMPLOYER_TOKEN_HERE"
```

---

## **4️⃣ JOB APPLICATION TESTS**

### **Apply for Job (as Job Seeker)**
```bash
curl -X POST http://localhost:5000/api/jobs/JOB_ID_HERE/apply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JOBSEEKER_TOKEN_HERE" \
  -d "{
    \"coverLetter\": \"I am very interested in this position. With 5+ years of experience in full-stack development, I believe I am a perfect fit for your team. I have worked with React, Node.js, and MongoDB extensively.\"
  }"
```
**💾 Save the APPLICATION_ID from response**

### **Get My Applications (Job Seeker)**
```bash
curl http://localhost:5000/api/dashboard/applications \
  -H "Authorization: Bearer JOBSEEKER_TOKEN_HERE"
```

### **Get My Jobs (Employer)**
```bash
curl http://localhost:5000/api/dashboard/employer-jobs \
  -H "Authorization: Bearer EMPLOYER_TOKEN_HERE"
```

### **Get Applications Received (Employer)**
```bash
curl http://localhost:5000/api/dashboard/employer-applications \
  -H "Authorization: Bearer EMPLOYER_TOKEN_HERE"
```

### **Update Application Status (Employer)**
```bash
curl -X PUT http://localhost:5000/api/dashboard/applications/APPLICATION_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer EMPLOYER_TOKEN_HERE" \
  -d "{
    \"status\": \"Shortlisted\"
  }"
```
**Valid Statuses:** Pending, Viewed, Shortlisted, Accepted, Rejected

---

## **5️⃣ PROFILE & RESUME TESTS**

### **Update Profile**
```bash
curl -X PUT http://localhost:5000/api/auth/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JOBSEEKER_TOKEN_HERE" \
  -d "{
    \"location\": \"Mumbai, Maharashtra\",
    \"bio\": \"Senior Full Stack Developer with 5+ years experience in React, Node.js, MongoDB. Passionate about building scalable applications.\"
  }"
```

### **Upload Resume**
```bash
curl -X PUT http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer JOBSEEKER_TOKEN_HERE" \
  -F "resume=@C:\\path\\to\\resume.pdf"
```
**Supported:** PDF, DOC, DOCX (Max 5MB)

### **Download Resume**
```bash
curl -L http://localhost:5000/uploads/resume_filename.pdf -o my_resume.pdf
```

---

## **6️⃣ ERROR TESTING**

### **Duplicate Email**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Duplicate\",
    \"email\": \"john@test.com\",
    \"password\": \"test123456\",
    \"role\": \"jobseeker\"
  }"
```
**Expected:** Email already registered error

### **Unauthorized (No Token)**
```bash
curl http://localhost:5000/api/dashboard/applications
```
**Expected:** Access denied error

### **Job Seeker Trying to Create Job**
```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JOBSEEKER_TOKEN_HERE" \
  -d "{\"title\": \"Test\"}"
```
**Expected:** Only employers can create jobs error

### **Wrong Password**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"john@test.com\",
    \"password\": \"wrongpassword\"
  }"
```
**Expected:** Invalid credentials error

---

## **7️⃣ FULL WORKFLOW TEST (Complete Journey)**

### **Step 1: Create Both Users**
```bash
# Job Seeker
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\": \"Alice\", \"email\": \"alice@test.com\", \"password\": \"test123456\", \"role\": \"jobseeker\"}" > /tmp/seeker.json

# Employer
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"name\": \"Bob\", \"email\": \"bob@test.com\", \"password\": \"test123456\", \"role\": \"employer\", \"company\": \"TechCorp\"}" > /tmp/employer.json
```

### **Step 2: Extract Tokens (Windows PowerShell)**
```powershell
$seeker = Get-Content /tmp/seeker.json | ConvertFrom-Json
$employer = Get-Content /tmp/employer.json | ConvertFrom-Json
$SEEKER_TOKEN = $seeker.token
$EMPLOYER_TOKEN = $employer.token
```

### **Step 3: Create Job**
```bash
curl -X POST http://localhost:5000/api/jobs -H "Content-Type: application/json" -H "Authorization: Bearer EMPLOYER_TOKEN_HERE" -d "{\"title\": \"Test Job\", \"description\": \"Test\", \"qualifications\": \"Test\", \"responsibilities\": \"Test\", \"location\": \"Test\", \"salary\": \"₹5,00,000\", \"jobType\": \"Full-Time\"}"
```

### **Step 4: Job Seeker Applies**
```bash
curl -X POST http://localhost:5000/api/jobs/JOB_ID_HERE/apply -H "Content-Type: application/json" -H "Authorization: Bearer JOBSEEKER_TOKEN_HERE" -d "{\"coverLetter\": \"I am interested\"}"
```

### **Step 5: Verify Application in Both Dashboards**
```bash
# Job Seeker sees their application
curl http://localhost:5000/api/dashboard/applications -H "Authorization: Bearer JOBSEEKER_TOKEN_HERE"

# Employer sees the application
curl http://localhost:5000/api/dashboard/employer-applications -H "Authorization: Bearer EMPLOYER_TOKEN_HERE"
```

### **Step 6: Update Status**
```bash
curl -X PUT http://localhost:5000/api/dashboard/applications/APP_ID_HERE -H "Content-Type: application/json" -H "Authorization: Bearer EMPLOYER_TOKEN_HERE" -d "{\"status\": \"Shortlisted\"}"
```

### **Step 7: Verify Updated Status**
```bash
curl http://localhost:5000/api/dashboard/applications -H "Authorization: Bearer JOBSEEKER_TOKEN_HERE"
```

✅ **Full workflow complete!**

---

## **💡 Tips for Testing**

1. **Use a REST Client:** Postman, Insomnia, or VS Code REST Client for easier testing
2. **Save Tokens:** Always save tokens from registration/login responses
3. **Format JSON:** Use online JSON formatters if commands get complex
4. **Test Errors:** Try accessing endpoints without tokens to see error handling
5. **Check Responses:** Look for proper HTTP status codes (200, 201, 400, 401, etc.)
6. **Frontend Testing:** Open premium.html in browser and test UI alongside API tests

---

## **🎯 Success Checklist**

- [ ] Backend health check returns message
- [ ] Can register job seeker
- [ ] Can register employer
- [ ] Can create job as employer
- [ ] Can see all jobs
- [ ] Can apply as job seeker
- [ ] Can update application status as employer
- [ ] Dashboard shows correct data for both roles
- [ ] Error messages are descriptive
- [ ] Can search jobs by keyword/location/type

**All ✅ = System fully functional!**

