# Gram Seva – Smart Village Complaint Management System

**Tagline (EN):** Your Village, Your Voice, Our Responsibility.  
**Tagline (MR):** आपले गाव, आपला आवाज, आपली जबाबदारी.

## Features Implemented (Frontend)

- **Bilingual (English & Marathi) Architecture**: Centralized translation dictionaries (`src/translations/en.ts`, `src/translations/mr.ts`) with persistent language selection.
- **Light & Dark Mode**: Tailwind CSS v4 `@custom-variant dark` theme switching persisted in `localStorage`.
- **Public Gram Panchayat Portal**: Hero showcase, 8 civic complaint categories, 4-step workflow, village development highlights, announcements, FAQ accordion, and contact form.
- **Role-Based Portals & Protected Routing**:
  - **Citizen**: Dashboard KPIs, Complaint Submission (with Leaflet OpenStreetMap pin selector, GPS detection, image preview/validation), Complaint Tracking timeline, and 1–5 star post-resolution feedback.
  - **Gram Panchayat Admin**: Overview & Analytics (Recharts charts), Complaint Assignment & Status Management, Staff & Citizen Management, Department & Category CRUD, Feedback Review, and CSV/Print exports.
  - **Field Staff**: Assigned-only task queue, site location map, Before & After photo uploaders, work progress remarks, and completion notifications.
- **Interactive Village Map**: OpenStreetMap + Leaflet visualization with status-colored markers and category/ward/status filters.
