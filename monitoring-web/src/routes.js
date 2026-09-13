import Dashboard from "views/Dashboard.jsx";
import EnergyMonitoring from "views/EnergyMonitoring.jsx";
import Analytics from "views/Analytics.jsx";
import Installations from "views/Installations.jsx";
import InstallationDetail from "views/InstallationDetail.jsx";
import SolarPanels from "views/SolarPanels.jsx";
import Alerts from "views/Alerts.jsx";
import Maintenance from "views/Maintenance.jsx";
import Reports from "views/Reports.jsx";
import Settings from "views/Settings.jsx";

const dashboardRoutes = [
  // MAIN
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin",
    section: null
  },
  // ENERGY
  {
    path: "/energy",
    name: "Energy Monitoring",
    icon: "pe-7s-lightning",
    component: EnergyMonitoring,
    layout: "/admin",
    section: "ENERGY"
  },
  {
    path: "/analytics",
    name: "Analytics",
    icon: "pe-7s-signal",
    component: Analytics,
    layout: "/admin",
    section: null
  },
  // ASSETS
  {
    path: "/installations",
    name: "Installations",
    icon: "pe-7s-map-marker",
    component: Installations,
    layout: "/admin",
    section: "ASSETS"
  },
  {
    path: "/installations/:id",
    name: "Installation Detail",
    icon: "pe-7s-map-marker",
    component: InstallationDetail,
    layout: "/admin",
    section: null,
    hidden: true
  },
  {
    path: "/panels",
    name: "Solar Panels",
    icon: "pe-7s-sun",
    component: SolarPanels,
    layout: "/admin",
    section: null
  },
  // OPERATIONS
  {
    path: "/alerts",
    name: "Alerts",
    icon: "pe-7s-bell",
    component: Alerts,
    layout: "/admin",
    section: "OPERATIONS",
    badge: "active"
  },
  {
    path: "/maintenance",
    name: "Maintenance",
    icon: "pe-7s-tools",
    component: Maintenance,
    layout: "/admin",
    section: null
  },
  // REPORTING
  {
    path: "/reports",
    name: "Reports",
    icon: "pe-7s-news-paper",
    component: Reports,
    layout: "/admin",
    section: "REPORTING"
  },
  // SYSTEM
  {
    path: "/settings",
    name: "Settings",
    icon: "pe-7s-config",
    component: Settings,
    layout: "/admin",
    section: "SYSTEM"
  }
];

export default dashboardRoutes;
