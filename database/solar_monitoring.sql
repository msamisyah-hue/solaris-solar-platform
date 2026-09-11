-- Solar Panels Efficiency Monitoring System Database
-- Database: solar_power_test

CREATE DATABASE IF NOT EXISTS `solar_power_test` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `solar_power_test`;

-- --------------------------------------------------------
-- Table structure for table `controller_info`
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

-- --------------------------------------------------------
-- Table structure for table `surface_info`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `surface_info` (
  `entry_id` INT NOT NULL,
  `temperature` DOUBLE NOT NULL,
  `humidity` DOUBLE NOT NULL DEFAULT 0,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Seed demo data for initial load and historical charts
-- Uses DATE_SUB(NOW(), INTERVAL ... ) for immediate chart rendering
-- --------------------------------------------------------

-- Clean existing data if any
TRUNCATE TABLE `controller_info`;
TRUNCATE TABLE `surface_info`;

-- Insert controller_info records spanning last 30 days
INSERT INTO `controller_info` (`entry_id`, `solar_voltage`, `solar_current`, `battery_voltage`, `battery_current`, `battery_state`, `solar_charged`, `timestamp`, `yield_kwh`) VALUES
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

-- Insert surface_info records matching timeline
INSERT INTO `surface_info` (`entry_id`, `temperature`, `humidity`, `timestamp`) VALUES
(1, 28.5, 45.0, DATE_SUB(NOW(), INTERVAL 28 DAY)),
(2, 29.1, 44.0, DATE_SUB(NOW(), INTERVAL 25 DAY)),
(3, 31.4, 42.5, DATE_SUB(NOW(), INTERVAL 21 DAY)),
(4, 30.2, 43.0, DATE_SUB(NOW(), INTERVAL 18 DAY)),
(5, 32.0, 41.5, DATE_SUB(NOW(), INTERVAL 14 DAY)),
(6, 29.8, 45.5, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(7, 33.5, 40.0, DATE_SUB(NOW(), INTERVAL 6 DAY)),
(8, 31.0, 42.0, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(9, 32.4, 41.0, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(10, 33.1, 40.5, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(11, 30.8, 43.5, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(12, 29.5, 46.0, DATE_SUB(NOW(), INTERVAL 30 HOUR)),
(13, 31.8, 42.0, DATE_SUB(NOW(), INTERVAL 22 HOUR)),
(14, 34.2, 39.5, DATE_SUB(NOW(), INTERVAL 18 HOUR)),
(15, 33.0, 40.5, DATE_SUB(NOW(), INTERVAL 15 HOUR)),
(16, 30.5, 44.0, DATE_SUB(NOW(), INTERVAL 11 HOUR)),
(17, 32.2, 41.5, DATE_SUB(NOW(), INTERVAL 9 HOUR)),
(18, 34.8, 38.0, DATE_SUB(NOW(), INTERVAL 7 HOUR)),
(19, 31.5, 43.0, DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(20, 32.8, 41.0, DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(21, 33.7, 39.8, DATE_SUB(NOW(), INTERVAL 150 MINUTE)),
(22, 31.9, 42.5, DATE_SUB(NOW(), INTERVAL 120 MINUTE)),
(23, 32.5, 41.8, DATE_SUB(NOW(), INTERVAL 90 MINUTE)),
(24, 33.2, 40.2, DATE_SUB(NOW(), INTERVAL 50 MINUTE)),
(25, 31.6, 43.1, DATE_SUB(NOW(), INTERVAL 40 MINUTE)),
(26, 32.9, 41.2, DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
(27, 34.5, 38.9, DATE_SUB(NOW(), INTERVAL 20 MINUTE)),
(28, 33.8, 39.6, DATE_SUB(NOW(), INTERVAL 10 MINUTE)),
(29, 34.0, 39.2, DATE_SUB(NOW(), INTERVAL 5 MINUTE)),
(30, 35.2, 38.0, DATE_SUB(NOW(), INTERVAL 1 MINUTE));
