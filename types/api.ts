export interface ApiModule {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  sortOrder: number;
  totalLessons: number;
  completedLessons: number;
  imageUrl: string | null;
  isOwned: boolean;
}

export interface ApiCourse {
  id: number;
  title: string;
  description: string | null;
  totalLessons: number;
  completedLessons: number;
  modules: ApiModule[];
}

export interface CoursesListResponse {
  courses: ApiCourse[];
}

export type LessonProgressStatus = 'NotStarted' | 'Active' | 'Done';

export interface ApiLesson {
  id: number;
  moduleId: number;
  title: string;
  description: string | null;
  status: string;
  sortOrder: number;
  progressStatus: LessonProgressStatus;
  isFreePreview: boolean;
  isLocked: boolean;
}

export interface ApiModuleHook {
  question: string | null;
  answer: string | null;
}

export interface ApiModuleOutcome {
  title: string;
  subtitle: string;
}

export interface ApiModuleReview {
  name: string;
  meta: string;
  text: string;
}

export interface ApiModuleDetail {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  descriptionExtended: string | null;
  imageUrl: string | null;
  sortOrder: number;
  totalLessons: number;
  completedLessons: number;
  completedCount: number;
  hook: ApiModuleHook | null;
  outcomes: ApiModuleOutcome[];
  reviews: ApiModuleReview[];
  keyStatements: string[] | null;
  lessons: ApiLesson[];
  priceRub: number;
  discountPercent: number | null;
  effectivePriceRub: number;
  isOwned: boolean;
}

export interface ApiProgress {
  id: number;
  userId: number;
  lessonId: number;
  status: 'Active' | 'Done';
  body: unknown;
}

export interface ApiLessonDetail {
  id: number;
  moduleId: number;
  title: string;
  description: string | null;
  status: string;
  sortOrder: number;
  body: unknown;
  progress: ApiProgress | null;
}

export interface ApiLessonListResponse {
  moduleId: number;
  moduleTitle: string;
  lessons: ApiLesson[];
}

export interface StreakDay {
  date: string;        // YYYY-MM-DD
  hasActivity: boolean;
}

export interface StreakResponse {
  streakDays: number;
  currentWeek: StreakDay[]; // always 7 items Mon–Sun
}

export interface ActivityResponse {
  days: StreakDay[];
}

export interface BundleModuleSummary {
  id: number;
  title: string;
  imageUrl: string | null;
  priceRub: number;
  isOwned: boolean;
}

export interface BundleListItem {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  discountPercent: number;
  originalPriceRub: number;
  effectivePriceRub: number;
  allOwned: boolean;
  effectivelyEmpty: boolean;
  modules: BundleModuleSummary[];
}

export interface PaymentPreview {
  alreadyOwned: boolean;
  originalAmountRub: number;
  amountRub: number;
  grantedModules: {
    id: number;
    title: string;
    priceRub: number;
    discountPercent: number | null;
    effectivePriceRub: number;
  }[];
}

export interface PaymentInitiation {
  paymentId: number;
  redirectUrl: string | null;
  alreadySucceeded: boolean;
}

export type PaymentStatus = 'Pending' | 'Succeeded' | 'Canceled' | 'Refunded';

export interface PaymentStatusInfo {
  paymentId: number;
  status: PaymentStatus;
  kind: 'Module' | 'Bundle';
  amountRub: number;
  paidAt: string | null;
  failureReason: string | null;
}
