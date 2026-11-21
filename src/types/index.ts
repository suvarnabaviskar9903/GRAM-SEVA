export type UserRole = 'citizen' | 'admin' | 'staff';

export type ComplaintStatus =
  | 'submitted'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'rejected';

export type ComplaintPriority = 'low' | 'medium' | 'high';

export type Language = 'en' | 'mr';

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: UserRole;
  villageName: string;
  wardNumber: number;
  isActive: boolean;
  createdAt: string;
}

export interface StaffDetail {
  id: string;
  userId: string;
  departmentId: string;
  designation: string;
  designationMr: string;
  assignedWard: string;
  availability: 'available' | 'busy' | 'on_leave';
}

export interface Department {
  id: string;
  name: string;
  nameMr: string;
  headName: string;
  contactNumber: string;
  description: string;
  descriptionMr: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  nameMr: string;
  description: string;
  descriptionMr: string;
  defaultDepartmentId: string;
  isActive: boolean;
}

export interface Complaint {
  id: string;
  referenceNumber: string;
  userId: string;
  citizenName: string;
  citizenMobile: string;
  categoryId: string;
  departmentId: string | null;
  assignedTo: string | null;
  title: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  villageArea: string;
  wardNumber: number;
  landmark: string;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
  beforePhotoUrl: string | null;
  resolutionDetails: string | null;
  resolutionPhoto: string | null;
  adminRemarks: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface ComplaintUpdate {
  id: string;
  complaintId: string;
  updatedBy: string;
  updaterName: string;
  updaterRole: UserRole;
  status: ComplaintStatus;
  remarks: string;
  photoUrl?: string | null;
  createdAt: string;
}

export interface Feedback {
  id: string;
  complaintId: string;
  referenceNumber: string;
  userId: string;
  citizenName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  titleMr: string;
  message: string;
  messageMr: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  complaintId?: string;
  referenceNumber?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  titleMr: string;
  summary: string;
  summaryMr: string;
  date: string;
  category: string;
  categoryMr: string;
}
