-- SOLARIS: Solar Energy Management & Monitoring Platform Database
-- Database: solar_power_test

CREATE DATABASE IF NOT EXISTS `solar_power_test` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `solar_power_test`;

-- --------------------------------------------------------
-- Core Telemetry Tables (Preserved from Original System)
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `controller_info` (
  `entry_id` INT NOT NULL PRIMARY KEY,
  `solar_voltage` DOUBLE NOT NULL,
  `solar_current` DOUBLE NOT NULL,
  `battery_voltage` DOUBLE NOT NULL,
  `battery_current` DOUBLE NOT NULL,
  `battery_state` VARCHAR(50) NOT NULL DEFAULT 'bulk',
  `solar_charged` DOUBLE NOT NULL,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `yield_kwh` DOUBLE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `surface_info` (
  `entry_id` INT NOT NULL,
  `temperature` DOUBLE NOT NULL,
  `humidity` DOUBLE NOT NULL DEFAULT 0,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- SOLARIS Asset & Operations Management Tables
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `installations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `location` VARCHAR(100) NOT NULL,
  `region` VARCHAR(50) NOT NULL,
  `capacity_kw` DOUBLE NOT NULL,
  `panels_count` INT NOT NULL,
  `current_power_kw` DOUBLE NOT NULL,
  `daily_yield_kwh` DOUBLE NOT NULL,
  `efficiency` DOUBLE NOT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'Operational',
  `commissioned_date` DATE NOT NULL,
  `inverter_model` VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `solar_panels` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `panel_code` VARCHAR(30) NOT NULL UNIQUE,
  `installation_id` INT NOT NULL,
  `string_id` VARCHAR(20) NOT NULL,
  `model` VARCHAR(80) NOT NULL,
  `voltage` DOUBLE NOT NULL,
  `current` DOUBLE NOT NULL,
  `power_w` DOUBLE NOT NULL,
  `temperature_c` DOUBLE NOT NULL,
  `efficiency` DOUBLE NOT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'Optimal'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `system_alerts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `installation_id` INT NOT NULL,
  `installation_name` VARCHAR(100) NOT NULL,
  `severity` VARCHAR(20) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'active',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `maintenance_tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `installation_id` INT NOT NULL,
  `installation_name` VARCHAR(100) NOT NULL,
  `task_type` VARCHAR(80) NOT NULL,
  `technician` VARCHAR(80) NOT NULL,
  `scheduled_date` DATE NOT NULL,
  `status` VARCHAR(30) NOT NULL DEFAULT 'Scheduled',
  `notes` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Seed Telemetry Data (Preserved 30-Day Historical Range)
-- --------------------------------------------------------
INSERT IGNORE INTO `controller_info` (`entry_id`, `solar_voltage`, `solar_current`, `battery_voltage`, `battery_current`, `battery_state`, `solar_charged`, `timestamp`, `yield_kwh`) VALUES
(1, 4.85, 2.75, 13.60, 11.20, 'bulk', 2.85, DATE_SUB(NOW(), INTERVAL 28 DAY), 345.20),
(2, 4.60, 2.60, 13.50, 11.10, 'bulk', 2.70, DATE_SUB(NOW(), INTERVAL 25 DAY), 347.80),
(3, 4.90, 2.80, 13.70, 11.35, 'bulk', 2.90, DATE_SUB(NOW(), INTERVAL 21 DAY), 350.10),
(4, 4.75, 2.65, 13.55, 11.15, 'bulk', 2.75, DATE_SUB(NOW(), INTERVAL 18 DAY), 352.40),
(5, 4.80, 2.70, 13.65, 11.25, 'bulk', 2.80, DATE_SUB(NOW(), INTERVAL 14 DAY), 354.60),
(6, 4.65, 2.55, 13.48, 11.05, 'bulk', 2.65, DATE_SUB(NOW(), INTERVAL 10 DAY), 356.30),
(7, 4.95, 2.85, 13.75, 11.40, 'bulk', 2.95, DATE_SUB(NOW(), INTERVAL 6 DAY), 358.50),
(8, 4.70, 2.60, 13.52, 11.10, 'bulk', 2.70, DATE_SUB(NOW(), INTERVAL 5 DAY), 360.20),
(9, 4.82, 2.72, 13.62, 11.22, 'bulk', 2.82, DATE_SUB(NOW(), INTERVAL 4 DAY), 361.90),
(10, 4.88, 2.78, 13.68, 11.30, 'bulk', 2.88, DATE_SUB(NOW(), INTERVAL 3 DAY), 363.40),
(11, 4.72, 2.62, 13.54, 11.12, 'bulk', 2.72, DATE_SUB(NOW(), INTERVAL 2 DAY), 364.80),
(12, 4.65, 2.50, 13.45, 11.00, 'bulk', 2.60, DATE_SUB(NOW(), INTERVAL 30 HOUR), 365.90),
(13, 4.78, 2.68, 13.58, 11.18, 'bulk', 2.75, DATE_SUB(NOW(), INTERVAL 22 HOUR), 367.10),
(14, 4.92, 2.82, 13.72, 11.35, 'bulk', 2.90, DATE_SUB(NOW(), INTERVAL 18 HOUR), 368.30),
(15, 4.85, 2.75, 13.65, 11.25, 'bulk', 2.82, DATE_SUB(NOW(), INTERVAL 15 HOUR), 369.20),
(16, 4.68, 2.58, 13.50, 11.08, 'bulk', 2.65, DATE_SUB(NOW(), INTERVAL 11 HOUR), 370.10),
(17, 4.80, 2.70, 13.60, 11.20, 'bulk', 2.78, DATE_SUB(NOW(), INTERVAL 9 HOUR), 370.90),
(18, 4.95, 2.86, 13.75, 11.38, 'bulk', 2.92, DATE_SUB(NOW(), INTERVAL 7 HOUR), 371.80),
(19, 4.74, 2.64, 13.55, 11.14, 'bulk', 2.72, DATE_SUB(NOW(), INTERVAL 5 HOUR), 372.50),
(20, 4.86, 2.76, 13.66, 11.26, 'bulk', 2.84, DATE_SUB(NOW(), INTERVAL 4 HOUR), 373.20),
(21, 4.91, 2.81, 13.70, 11.32, 'bulk', 2.88, DATE_SUB(NOW(), INTERVAL 150 MINUTE), 373.90),
(22, 4.77, 2.67, 13.58, 11.17, 'bulk', 2.75, DATE_SUB(NOW(), INTERVAL 120 MINUTE), 374.40),
(23, 4.83, 2.73, 13.63, 11.23, 'bulk', 2.81, DATE_SUB(NOW(), INTERVAL 90 MINUTE), 374.90),
(24, 4.89, 2.79, 13.69, 11.29, 'bulk', 2.87, DATE_SUB(NOW(), INTERVAL 50 MINUTE), 375.40),
(25, 4.75, 2.65, 13.56, 11.15, 'bulk', 2.74, DATE_SUB(NOW(), INTERVAL 40 MINUTE), 375.80),
(26, 4.82, 2.72, 13.62, 11.22, 'bulk', 2.80, DATE_SUB(NOW(), INTERVAL 30 MINUTE), 376.10),
(27, 4.94, 2.84, 13.74, 11.36, 'bulk', 2.91, DATE_SUB(NOW(), INTERVAL 20 MINUTE), 376.40),
(28, 4.87, 2.77, 13.67, 11.28, 'bulk', 2.85, DATE_SUB(NOW(), INTERVAL 10 MINUTE), 376.70),
(29, 4.90, 2.80, 13.70, 11.30, 'bulk', 2.88, DATE_SUB(NOW(), INTERVAL 5 MINUTE), 377.00),
(30, 4.98, 2.88, 13.78, 11.42, 'bulk', 2.96, DATE_SUB(NOW(), INTERVAL 1 MINUTE), 377.30);

-- --------------------------------------------------------
-- Seed Moroccan Installations Demo Portfolio
-- --------------------------------------------------------
TRUNCATE TABLE `installations`;
INSERT INTO `installations` (`id`, `name`, `code`, `location`, `region`, `capacity_kw`, `panels_count`, `current_power_kw`, `daily_yield_kwh`, `efficiency`, `status`, `commissioned_date`, `inverter_model`) VALUES
(1, 'Casablanca Green Tech Park Array', 'CAS-GTP-01', 'Casablanca Finance City', 'Casablanca-Settat', 450.0, 1125, 388.4, 2140.5, 94.2, 'Operational', '2022-03-15', 'SMA Sunny Tripower CORE2 110kW'),
(2, 'Marrakech Solar Oasis Station', 'RAK-OAS-02', 'Route de Fes, Marrakech', 'Marrakech-Safi', 620.0, 1550, 542.8, 3120.0, 93.8, 'Operational', '2021-08-10', 'Huawei SUN2000-100KTL-M1'),
(3, 'Agadir Agri-PV Innovation Field', 'AGA-AGR-03', 'Souss-Massa Plain, Agadir', 'Souss-Massa', 320.0, 800, 268.1, 1580.4, 91.5, 'Operational', '2023-01-20', 'Fronius Eco 27.0-3-S'),
(4, 'Rabat University Energy Campus', 'RAB-UNI-04', 'Madinat Al Irfane, Rabat', 'Rabat-Sale-Kenitra', 280.0, 700, 212.6, 1260.2, 88.9, 'Warning', '2022-11-05', 'SolarEdge SE100K'),
(5, 'Oujda Desert PV Pilot Array', 'OUJ-DES-05', 'Technopole d\'Oujda', 'Oriental', 850.0, 2125, 782.0, 4480.6, 95.1, 'Operational', '2020-05-18', 'Schneider Conext CL-60A'),
(6, 'Tangier Coastal Wind-Solar Hybrid', 'TNG-CST-06', 'Tanger Automotive City', 'Tanger-Tetouan-Al Hoceima', 390.0, 975, 298.5, 1790.3, 90.4, 'Maintenance', '2023-06-12', 'ABB PVS-100/120-TL');

-- --------------------------------------------------------
-- Seed Solar Panels Asset Telemetry
-- --------------------------------------------------------
TRUNCATE TABLE `solar_panels`;
INSERT INTO `solar_panels` (`panel_code`, `installation_id`, `string_id`, `model`, `voltage`, `current`, `power_w`, `temperature_c`, `efficiency`, `status`) VALUES
('CAS-PV-001', 1, 'STR-A1', 'Longi Hi-MO 5 540W Mono', 41.8, 12.8, 535.0, 32.4, 21.4, 'Optimal'),
('CAS-PV-002', 1, 'STR-A1', 'Longi Hi-MO 5 540W Mono', 41.6, 12.7, 528.3, 33.1, 21.1, 'Optimal'),
('CAS-PV-003', 1, 'STR-A2', 'Longi Hi-MO 5 540W Mono', 40.9, 12.5, 511.2, 34.8, 20.4, 'Optimal'),
('CAS-PV-004', 1, 'STR-A2', 'Longi Hi-MO 5 540W Mono', 39.2, 11.8, 462.5, 39.2, 18.5, 'Sub-optimal'),
('RAK-PV-101', 2, 'STR-B1', 'JinkoSolar Tiger Neo 580W', 43.2, 13.2, 570.2, 36.5, 22.1, 'Optimal'),
('RAK-PV-102', 2, 'STR-B1', 'JinkoSolar Tiger Neo 580W', 43.0, 13.1, 563.3, 37.0, 21.8, 'Optimal'),
('RAK-PV-103', 2, 'STR-B2', 'JinkoSolar Tiger Neo 580W', 42.8, 13.0, 556.4, 38.2, 21.5, 'Optimal'),
('AGA-PV-201', 3, 'STR-C1', 'Canadian Solar BiHiKu7 650W', 45.1, 14.1, 635.9, 31.0, 21.6, 'Optimal'),
('AGA-PV-202', 3, 'STR-C1', 'Canadian Solar BiHiKu7 650W', 44.8, 14.0, 627.2, 31.5, 21.3, 'Optimal'),
('RAB-PV-301', 4, 'STR-D1', 'Trina Vertex S+ 440W', 38.0, 10.2, 387.6, 48.5, 17.6, 'Degraded'),
('RAB-PV-302', 4, 'STR-D1', 'Trina Vertex S+ 440W', 39.5, 10.8, 426.6, 42.1, 19.4, 'Sub-optimal'),
('OUJ-PV-401', 5, 'STR-E1', 'JA Solar DeepBlue 4.0 570W', 43.5, 13.0, 565.5, 34.0, 22.0, 'Optimal'),
('OUJ-PV-402', 5, 'STR-E1', 'JA Solar DeepBlue 4.0 570W', 43.4, 12.9, 559.8, 34.5, 21.8, 'Optimal'),
('TNG-PV-501', 6, 'STR-F1', 'Boviet Solar Vega Series 540W', 40.2, 11.5, 462.3, 29.8, 18.5, 'Sub-optimal');

-- --------------------------------------------------------
-- Seed Operational System Alerts
-- --------------------------------------------------------
TRUNCATE TABLE `system_alerts`;
INSERT INTO `system_alerts` (`installation_id`, `installation_name`, `severity`, `title`, `message`, `status`, `created_at`) VALUES
(4, 'Rabat University Energy Campus', 'warning', 'Thermal Hotspot on String D1', 'Panel RAB-PV-301 operating temperature reached 48.5°C (>15°C above ambient). Inspection recommended.', 'active', DATE_SUB(NOW(), INTERVAL 45 MINUTE)),
(6, 'Tangier Coastal Wind-Solar Hybrid', 'info', 'Scheduled Inverter Firmware Update', 'Routine maintenance window scheduled for ABB PVS-100 firmware upgrade v3.4.', 'active', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(3, 'Agadir Agri-PV Innovation Field', 'info', 'Grid Export Limit Reached', 'Agadir site operating at max export capacity 320 kWp under peak solar irradiance.', 'acknowledged', DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(4, 'Rabat University Energy Campus', 'critical', 'Efficiency Deviation Detected', 'Array efficiency dropped to 88.9% below SLA baseline threshold (90.0%).', 'active', DATE_SUB(NOW(), INTERVAL 6 HOUR)),
(2, 'Marrakech Solar Oasis Station', 'info', 'Automatic Dust Cleaning Completed', 'Robotic dry wiper cycle completed across 1,550 modules in zones A & B.', 'acknowledged', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- --------------------------------------------------------
-- Seed Maintenance Schedule & Logs
-- --------------------------------------------------------
TRUNCATE TABLE `maintenance_tasks`;
INSERT INTO `maintenance_tasks` (`installation_id`, `installation_name`, `task_type`, `technician`, `scheduled_date`, `status`, `notes`) VALUES
(4, 'Rabat University Energy Campus', 'Thermal Infrared Inspection', 'Youssef El Amrani', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'Scheduled', 'Investigate thermal hotspot reported on string D1 / module RAB-PV-301.'),
(6, 'Tangier Coastal Wind-Solar Hybrid', 'Inverter Calibration & Diagnostics', 'Kenza Berrada', CURDATE(), 'In Progress', 'Annual calibration of ABB PVS-100 inverter and junction box string sensors.'),
(1, 'Casablanca Green Tech Park Array', 'Preventive Module Cleaning', 'Samir Benali', DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'Completed', 'Semi-annual demineralized water cleaning across all 1,125 mono-PERC panels.'),
(2, 'Marrakech Solar Oasis Station', 'Tracker Lubrication & Calibration', 'Hassan Mansouri', DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'Scheduled', 'Inspect dual-axis tracker motors and align azimuth tilt sensors.'),
(5, 'Oujda Desert PV Pilot Array', 'High-Voltage Wiring & Grounding Audit', 'Fatima Zahra Tazi', DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'Completed', 'Complete insulation resistance test and surge protection device check.');
