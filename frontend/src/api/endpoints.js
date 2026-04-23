// Centralised endpoint catalogue for the BMS REST API.
export const EP = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    refresh: "/auth/refresh",
    forgot: "/auth/forgot-password",
    reset: "/auth/reset-password",
    verifyEmail: "/auth/verify-email",
    me: "/auth/me",
    changePassword: "/auth/change-password",
  },
  buildings: {
    list: "/buildings",
    detail: (id) => `/buildings/${id}`,
    wings: (id) => `/buildings/${id}/wings`,
    units: (id) => `/buildings/${id}/units`,
  },
  users: {
    list: "/users",
    detail: (id) => `/users/${id}`,
  },
  billing: {
    summary: "/billing/summary",
    list: "/billing",
    detail: (id) => `/billing/${id}`,
    pay: (id) => `/billing/${id}/pay`,
  },
  parking: {
    slots: "/parking/slots",
    bookings: "/parking/bookings",
    book: "/parking/book",
    cancel: (id) => `/parking/bookings/${id}/cancel`,
  },
  visitors: {
    list: "/visitors",
    report: "/visitors/report",
    checkin: (id) => `/visitors/${id}/checkin`,
    checkout: (id) => `/visitors/${id}/checkout`,
  },
  canteen: {
    menu: "/canteen/menu",
    menuItem: (id) => `/canteen/menu/${id}`,
    orders: "/canteen/orders",
    orderStatus: (id) => `/canteen/orders/${id}/status`,
  },
  complaints: {
    list: "/complaints",
    assign: (id) => `/complaints/${id}/assign`,
    status: (id) => `/complaints/${id}/status`,
    feedback: (id) => `/complaints/${id}/feedback`,
  },
  voting: {
    list: "/voting",
    detail: (id) => `/voting/${id}`,
    vote: (id) => `/voting/${id}/vote`,
    close: (id) => `/voting/${id}/close`,
  },
  notices: {
    list: "/notices",
    detail: (id) => `/notices/${id}`,
  },
  dashboard: {
    superAdmin: "/dashboard/super-admin",
    buildingAdmin: "/dashboard/building-admin",
    resident: "/dashboard/resident",
  },
};
