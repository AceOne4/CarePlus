# CarePlus App 🚀

**CarePlus** is a modern, user-friendly platform designed for patients and administrators to manage healthcare appointments efficiently. Patients can register, provide detailed information, and schedule or track appointments, while administrators can manage appointment requests, including scheduling and cancellations.

---

## 📂 Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [User Roles](#user-roles)
5. [Routes Overview](#routes-overview)
6. [Technologies Used](#technologies-used)

---

## 🌟 Features

### For Patients:

- **Sign-Up:** Create an account by filling in personal details.
- **Profile Management:** Update personal and medical information.
- **Book Appointment:** Schedule appointments with available doctors.
- **Track Appointments:** View upcoming and past appointments.

### For Admins:

- **Manage Appointments:** View all appointment requests.
- **Schedule Appointments:** Confirm and set appointment times.
- **Cancel Appointments:** Decline or remove appointments as necessary.

---

## ⚙️ Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/careplus.git
   cd careplus
   ```
2. **Install Dependencies:**

   ```bash
   npm install

   ```

3. **Environment Variables:**

```bash
DATABASE_URL=<YourDatabaseConnectionString>
JWT_SECRET=<YourSecretKey>

```

4. **Start the Application:**

```bash
npm run dev

```

## 🚀 Usage

### Running Locally:

1. Open your browser and go to `http://localhost:3000`.
2. Register as a patient or log in as an admin.

### Access as Patient:

- Navigate to the **Sign-Up** page to create an account.
- Complete the profile and book an appointment.
- Use the **Dashboard** to view or reschedule appointments.

### Access as Admin:

- Log in with admin credentials.
- Navigate to the **Admin Panel** to manage appointment requests.
- Approve, schedule, or cancel appointments.

---

## 👥 User Roles

### 🧑‍⚕️ Patient:

- Sign up and manage personal information.
- Book and track appointments.
- Cancel or reschedule appointments.

### 👩‍💻 Admin:

- View all appointment requests.
- Confirm, reschedule, or cancel appointments.

---

## 🛠️ Technologies Used

- **Frontend:** React.js / Next.js
- **Backend:** Next.js/ appwrite
- **Database:** appwrite /
- **Authentication:** Auth.js
- **Styling:** Tailwind CSS
