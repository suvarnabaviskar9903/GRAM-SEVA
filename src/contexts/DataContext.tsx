import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_CATEGORIES,
  INITIAL_COMPLAINTS,
  INITIAL_DEPARTMENTS,
  INITIAL_FEEDBACK,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROFILES,
  INITIAL_STAFF_DETAILS,
  INITIAL_UPDATES,
} from '../data/seedData';
import type {
  Announcement,
  AppNotification,
  Category,
  Complaint,
  ComplaintPriority,
  ComplaintStatus,
  ComplaintUpdate,
  Department,
  Feedback,
  Profile,
  StaffDetail,
} from '../types';
import { generateReferenceNumber } from '../utils/helpers';

const STORAGE_KEYS = {
  profiles: 'gram_seva_profiles_v1',
  departments: 'gram_seva_departments_v1',
  categories: 'gram_seva_categories_v1',
  staffDetails: 'gram_seva_staff_details_v1',
  complaints: 'gram_seva_complaints_v1',
  updates: 'gram_seva_updates_v1',
  feedback: 'gram_seva_feedback_v1',
  notifications: 'gram_seva_notifications_v1',
};

function loadOrSeed<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore
  }
  return fallback;
}

export interface CreateComplaintInput {
  userId: string;
  citizenName: string;
  citizenMobile: string;
  categoryId: string;
  title: string;
  description: string;
  priority: ComplaintPriority;
  villageArea: string;
  wardNumber: number;
  landmark: string;
  latitude: number;
  longitude: number;
  imageUrl: string | null;
}

interface DataContextValue {
  profiles: Profile[];
  departments: Department[];
  categories: Category[];
  staffDetails: StaffDetail[];
  complaints: Complaint[];
  updates: ComplaintUpdate[];
  feedback: Feedback[];
  notifications: AppNotification[];
  announcements: Announcement[];
  createComplaint: (input: CreateComplaintInput) => Complaint;
  adminUpdateComplaint: (params: {
    complaintId: string;
    adminUser: Profile;
    departmentId: string | null;
    assignedTo: string | null;
    status: ComplaintStatus;
    adminRemarks: string;
    rejectionReason?: string;
  }) => void;
  staffUpdateComplaint: (params: {
    complaintId: string;
    staffUser: Profile;
    status: ComplaintStatus;
    remarks: string;
    beforePhotoUrl?: string | null;
    resolutionPhoto?: string | null;
    resolutionDetails?: string | null;
  }) => void;
  submitFeedback: (params: {
    complaintId: string;
    referenceNumber: string;
    userId: string;
    citizenName: string;
    rating: number;
    comment: string;
  }) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  addStaffMember: (params: {
    fullName: string;
    email: string;
    mobile: string;
    departmentId: string;
    designation: string;
    designationMr: string;
    assignedWard: string;
  }) => void;
  toggleUserActive: (userId: string) => void;
  saveDepartment: (dept: Omit<Department, 'id'> & { id?: string }) => void;
  saveCategory: (cat: Omit<Category, 'id'> & { id?: string }) => void;
  resetDemoData: () => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>(() =>
    loadOrSeed(STORAGE_KEYS.profiles, INITIAL_PROFILES)
  );
  const [departments, setDepartments] = useState<Department[]>(() =>
    loadOrSeed(STORAGE_KEYS.departments, INITIAL_DEPARTMENTS)
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    loadOrSeed(STORAGE_KEYS.categories, INITIAL_CATEGORIES)
  );
  const [staffDetails, setStaffDetails] = useState<StaffDetail[]>(() =>
    loadOrSeed(STORAGE_KEYS.staffDetails, INITIAL_STAFF_DETAILS)
  );
  const [complaints, setComplaints] = useState<Complaint[]>(() =>
    loadOrSeed(STORAGE_KEYS.complaints, INITIAL_COMPLAINTS)
  );
  const [updates, setUpdates] = useState<ComplaintUpdate[]>(() =>
    loadOrSeed(STORAGE_KEYS.updates, INITIAL_UPDATES)
  );
  const [feedback, setFeedback] = useState<Feedback[]>(() =>
    loadOrSeed(STORAGE_KEYS.feedback, INITIAL_FEEDBACK)
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    loadOrSeed(STORAGE_KEYS.notifications, INITIAL_NOTIFICATIONS)
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.profiles, JSON.stringify(profiles));
      localStorage.setItem(STORAGE_KEYS.departments, JSON.stringify(departments));
      localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
      localStorage.setItem(STORAGE_KEYS.staffDetails, JSON.stringify(staffDetails));
      localStorage.setItem(STORAGE_KEYS.complaints, JSON.stringify(complaints));
      localStorage.setItem(STORAGE_KEYS.updates, JSON.stringify(updates));
      localStorage.setItem(STORAGE_KEYS.feedback, JSON.stringify(feedback));
      localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifications));
    } catch {
      // ignore storage quota errors
    }
  }, [
    profiles,
    departments,
    categories,
    staffDetails,
    complaints,
    updates,
    feedback,
    notifications,
  ]);

  const pushNotification = (notif: Omit<AppNotification, 'id' | 'isRead' | 'createdAt'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const createComplaint = (input: CreateComplaintInput): Complaint => {
    const now = new Date().toISOString();
    const ref = generateReferenceNumber(complaints.length);
    const category = categories.find((c) => c.id === input.categoryId);

    const newComplaint: Complaint = {
      id: `cmp-${Date.now()}`,
      referenceNumber: ref,
      userId: input.userId,
      citizenName: input.citizenName,
      citizenMobile: input.citizenMobile,
      categoryId: input.categoryId,
      departmentId: category?.defaultDepartmentId || null,
      assignedTo: null,
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: 'submitted',
      villageArea: input.villageArea,
      wardNumber: input.wardNumber,
      landmark: input.landmark,
      latitude: input.latitude,
      longitude: input.longitude,
      imageUrl: input.imageUrl,
      beforePhotoUrl: null,
      resolutionDetails: null,
      resolutionPhoto: null,
      adminRemarks: null,
      rejectionReason: null,
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    setUpdates((prev) => [
      {
        id: `upd-${Date.now()}`,
        complaintId: newComplaint.id,
        updatedBy: input.userId,
        updaterName: input.citizenName,
        updaterRole: 'citizen',
        status: 'submitted',
        remarks: 'Complaint registered by citizen.',
        photoUrl: input.imageUrl,
        createdAt: now,
      },
      ...prev,
    ]);

    pushNotification({
      userId: input.userId,
      title: `Complaint Registered: ${ref}`,
      titleMr: `तक्रार नोंदवली: ${ref}`,
      message: `Your complaint "${input.title}" has been received by the Gram Panchayat.`,
      messageMr: `तुमची "${input.title}" ही तक्रार ग्रामपंचायतीकडे प्राप्त झाली आहे.`,
      type: 'success',
      complaintId: newComplaint.id,
      referenceNumber: ref,
    });

    profiles
      .filter((p) => p.role === 'admin')
      .forEach((admin) => {
        pushNotification({
          userId: admin.id,
          title: `New Complaint: ${ref}`,
          titleMr: `नवीन तक्रार: ${ref}`,
          message: `${input.citizenName} reported "${input.title}" in Ward ${input.wardNumber}.`,
          messageMr: `${input.citizenName} यांनी प्रभाग ${input.wardNumber} मध्ये "${input.title}" ची तक्रार नोंदवली.`,
          type: 'info',
          complaintId: newComplaint.id,
          referenceNumber: ref,
        });
      });

    return newComplaint;
  };

  const adminUpdateComplaint: DataContextValue['adminUpdateComplaint'] = ({
    complaintId,
    adminUser,
    departmentId,
    assignedTo,
    status,
    adminRemarks,
    rejectionReason,
  }) => {
    const now = new Date().toISOString();
    const target = complaints.find((c) => c.id === complaintId);
    if (!target) return;

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              departmentId,
              assignedTo,
              status,
              adminRemarks: adminRemarks || c.adminRemarks,
              rejectionReason: status === 'rejected' ? rejectionReason || c.rejectionReason : null,
              updatedAt: now,
              resolvedAt: status === 'resolved' ? now : c.resolvedAt,
            }
          : c
      )
    );

    setUpdates((prev) => [
      {
        id: `upd-${Date.now()}`,
        complaintId,
        updatedBy: adminUser.id,
        updaterName: adminUser.fullName,
        updaterRole: 'admin',
        status,
        remarks:
          status === 'rejected' && rejectionReason
            ? rejectionReason
            : adminRemarks || `Status updated to ${status}.`,
        createdAt: now,
      },
      ...prev,
    ]);

    pushNotification({
      userId: target.userId,
      title: `Update on ${target.referenceNumber}`,
      titleMr: `${target.referenceNumber} वर नवीन अपडेट`,
      message:
        status === 'rejected'
          ? `Your complaint was rejected: ${rejectionReason || 'See Panchayat remarks.'}`
          : `Status changed to ${status.replace('_', ' ')}. ${adminRemarks || ''}`,
      messageMr:
        status === 'rejected'
          ? `तुमची तक्रार नाकारली आहे: ${rejectionReason || 'ग्रामपंचायत शेरा पहा.'}`
          : `तक्रारीची स्थिती आता "${status}" झाली आहे.`,
      type: status === 'rejected' ? 'danger' : status === 'resolved' ? 'success' : 'info',
      complaintId,
      referenceNumber: target.referenceNumber,
    });

    if (assignedTo && assignedTo !== target.assignedTo) {
      pushNotification({
        userId: assignedTo,
        title: `New Task Assigned: ${target.referenceNumber}`,
        titleMr: `नवीन काम नियुक्त: ${target.referenceNumber}`,
        message: `You have been assigned "${target.title}" in Ward ${target.wardNumber}.`,
        messageMr: `प्रभाग ${target.wardNumber} मधील "${target.title}" हे काम तुम्हाला नियुक्त केले आहे.`,
        type: 'warning',
        complaintId,
        referenceNumber: target.referenceNumber,
      });
    }
  };

  const staffUpdateComplaint: DataContextValue['staffUpdateComplaint'] = ({
    complaintId,
    staffUser,
    status,
    remarks,
    beforePhotoUrl,
    resolutionPhoto,
    resolutionDetails,
  }) => {
    const now = new Date().toISOString();
    const target = complaints.find((c) => c.id === complaintId);
    if (!target) return;

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status,
              beforePhotoUrl: beforePhotoUrl || c.beforePhotoUrl,
              resolutionPhoto: resolutionPhoto || c.resolutionPhoto,
              resolutionDetails: resolutionDetails || (status === 'resolved' ? remarks : c.resolutionDetails),
              updatedAt: now,
              resolvedAt: status === 'resolved' ? now : c.resolvedAt,
            }
          : c
      )
    );

    setUpdates((prev) => [
      {
        id: `upd-${Date.now()}`,
        complaintId,
        updatedBy: staffUser.id,
        updaterName: staffUser.fullName,
        updaterRole: 'staff',
        status,
        remarks,
        photoUrl: resolutionPhoto || beforePhotoUrl || null,
        createdAt: now,
      },
      ...prev,
    ]);

    pushNotification({
      userId: target.userId,
      title:
        status === 'resolved'
          ? `Complaint Resolved: ${target.referenceNumber}`
          : `Field Work Update: ${target.referenceNumber}`,
      titleMr:
        status === 'resolved'
          ? `तक्रार निकाली: ${target.referenceNumber}`
          : `कामाची प्रगती: ${target.referenceNumber}`,
      message: `${staffUser.fullName}: ${remarks}`,
      messageMr: `${staffUser.fullName}: ${remarks}`,
      type: status === 'resolved' ? 'success' : 'info',
      complaintId,
      referenceNumber: target.referenceNumber,
    });
  };

  const submitFeedback: DataContextValue['submitFeedback'] = ({
    complaintId,
    referenceNumber,
    userId,
    citizenName,
    rating,
    comment,
  }) => {
    const entry: Feedback = {
      id: `fb-${Date.now()}`,
      complaintId,
      referenceNumber,
      userId,
      citizenName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };
    setFeedback((prev) => [entry, ...prev.filter((f) => f.complaintId !== complaintId)]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = (userId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === userId ? { ...n, isRead: true } : n))
    );
  };

  const addStaffMember: DataContextValue['addStaffMember'] = ({
    fullName,
    email,
    mobile,
    departmentId,
    designation,
    designationMr,
    assignedWard,
  }) => {
    const userId = `usr-staff-${Date.now()}`;
    const newStaff: Profile = {
      id: userId,
      fullName,
      email: email.toLowerCase(),
      mobile,
      role: 'staff',
      villageName: 'Shrirampur',
      wardNumber: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    const detail: StaffDetail = {
      id: `sd-${Date.now()}`,
      userId,
      departmentId,
      designation,
      designationMr: designationMr || designation,
      assignedWard,
      availability: 'available',
    };
    setProfiles((prev) => [...prev, newStaff]);
    setStaffDetails((prev) => [...prev, detail]);
  };

  const toggleUserActive = (userId: string) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const saveDepartment: DataContextValue['saveDepartment'] = (dept) => {
    if (dept.id) {
      setDepartments((prev) =>
        prev.map((d) => (d.id === dept.id ? ({ ...d, ...dept } as Department) : d))
      );
    } else {
      setDepartments((prev) => [
        ...prev,
        { ...dept, id: `dept-${Date.now()}` } as Department,
      ]);
    }
  };

  const saveCategory: DataContextValue['saveCategory'] = (cat) => {
    if (cat.id) {
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? ({ ...c, ...cat } as Category) : c))
      );
    } else {
      setCategories((prev) => [
        ...prev,
        { ...cat, id: `cat-${Date.now()}` } as Category,
      ]);
    }
  };

  const resetDemoData = () => {
    setProfiles(INITIAL_PROFILES);
    setDepartments(INITIAL_DEPARTMENTS);
    setCategories(INITIAL_CATEGORIES);
    setStaffDetails(INITIAL_STAFF_DETAILS);
    setComplaints(INITIAL_COMPLAINTS);
    setUpdates(INITIAL_UPDATES);
    setFeedback(INITIAL_FEEDBACK);
    setNotifications(INITIAL_NOTIFICATIONS);
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  };

  return (
    <DataContext.Provider
      value={{
        profiles,
        departments,
        categories,
        staffDetails,
        complaints,
        updates,
        feedback,
        notifications,
        announcements: INITIAL_ANNOUNCEMENTS,
        createComplaint,
        adminUpdateComplaint,
        staffUpdateComplaint,
        submitFeedback,
        markNotificationRead,
        markAllNotificationsRead,
        addStaffMember,
        toggleUserActive,
        saveDepartment,
        saveCategory,
        resetDemoData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
