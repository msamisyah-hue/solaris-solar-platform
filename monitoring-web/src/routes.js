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
  {
    path: "/dashboard",
    name: "Tableau de bord",
    icon: "pe-7s-graph",
    component: Dashboard,
    layout: "/admin",
    section: null
  },
  // ÉNERGIE
  {
    path: "/energy",
    name: "Surveillance Énergie",
    icon: "pe-7s-lightning",
    component: EnergyMonitoring,
    layout: "/admin",
    section: "ÉNERGIE"
  },
  {
    path: "/analytics",
    name: "Analytiques",
    icon: "pe-7s-signal",
    component: Analytics,
    layout: "/admin",
    section: null
  },
  // ACTIFS
  {
    path: "/installations",
    name: "Installations",
    icon: "pe-7s-map-marker",
    component: Installations,
    layout: "/admin",
    section: "ACTIFS"
  },
  {
    path: "/installations/:id",
    name: "Détail Installation",
    icon: "pe-7s-map-marker",
    component: InstallationDetail,
    layout: "/admin",
    section: null,
    hidden: true
  },
  {
    path: "/panels",
    name: "Panneaux Solaires",
    icon: "pe-7s-sun",
    component: SolarPanels,
    layout: "/admin",
    section: null
  },
  // OPÉRATIONS
  {
    path: "/alerts",
    name: "Alertes",
    icon: "pe-7s-bell",
    component: Alerts,
    layout: "/admin",
    section: "OPÉRATIONS",
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
  // RAPPORTS
  {
    path: "/reports",
    name: "Rapports",
    icon: "pe-7s-news-paper",
    component: Reports,
    layout: "/admin",
    section: "RAPPORTS"
  },
  // SYSTÈME
  {
    path: "/settings",
    name: "Paramètres",
    icon: "pe-7s-config",
    component: Settings,
    layout: "/admin",
    section: "SYSTÈME"
  }
];

export default dashboardRoutes;
