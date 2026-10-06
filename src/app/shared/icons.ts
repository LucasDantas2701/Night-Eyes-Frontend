import {
  House, Users, Car, Activity, Menu, TriangleAlert, LogOut, ChevronLeft, ChevronRight, TrendingUp, Plus,
  CircleAlert, Calendar, Clock, MapPin, User, Search, RefreshCw, Hash, ArrowLeft, Route, Eye, EyeOff,
  Phone, ArrowUp, ArrowDown, Pencil, Trash2, X,
} from 'lucide-angular';

export const ICONS = {
  home: House, users: Users, car: Car, activity: Activity, menu: Menu, alert: TriangleAlert, logOut: LogOut,
  chevronLeft: ChevronLeft, chevronRight: ChevronRight, trendingUp: TrendingUp, plus: Plus, alertCircle: CircleAlert,
  calendar: Calendar, clock: Clock, mapPin: MapPin, user: User, search: Search, refresh: RefreshCw, hash: Hash,
  arrowLeft: ArrowLeft, route: Route, eye: Eye, eyeOff: EyeOff, phone: Phone, arrowUp: ArrowUp, arrowDown: ArrowDown,
  pencil: Pencil, trash: Trash2, close: X,
} as const;

export type IconName = keyof typeof ICONS;
