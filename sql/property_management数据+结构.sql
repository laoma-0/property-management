/*
 Navicat MySQL Dump SQL

 Source Server         : SSM
 Source Server Type    : MySQL
 Source Server Version : 90001 (9.0.1)
 Source Host           : localhost:3306
 Source Schema         : property_management

 Target Server Type    : MySQL
 Target Server Version : 90001 (9.0.1)
 File Encoding         : 65001

 Date: 29/06/2025 16:22:53
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for bill
-- ----------------------------
DROP TABLE IF EXISTS `bill`;
CREATE TABLE `bill`  (
  `bill_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `amount` decimal(10, 2) NOT NULL,
  `type` enum('物业费','水费','电费','燃气费') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '物业费',
  `status` enum('未缴','已缴') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '未缴',
  `deadline` date NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`bill_id`) USING BTREE,
  INDEX `property_id`(`property_id` ASC) USING BTREE,
  CONSTRAINT `bill_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `property` (`property_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of bill
-- ----------------------------
INSERT INTO `bill` VALUES (1, 1, 500.00, '物业费', '未缴', '2025-07-31', '2025-06-25 19:38:10');
INSERT INTO `bill` VALUES (2, 1, 120.00, '水费', '未缴', '2025-07-20', '2025-06-25 19:38:10');
INSERT INTO `bill` VALUES (3, 2, 480.00, '物业费', '未缴', '2025-07-31', '2025-06-25 19:38:10');

-- ----------------------------
-- Table structure for notice
-- ----------------------------
DROP TABLE IF EXISTS `notice`;
CREATE TABLE `notice`  (
  `notice_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `publish_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notice_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of notice
-- ----------------------------
INSERT INTO `notice` VALUES (1, '系统上线通知', '物业管理系统正式上线运行，欢迎使用！', '2025-06-25 19:38:10');
INSERT INTO `notice` VALUES (2, '停水通知', '6月30日9:00-17:00进行水管维护，请提前储水', '2025-06-25 19:38:10');

-- ----------------------------
-- Table structure for property
-- ----------------------------
DROP TABLE IF EXISTS `property`;
CREATE TABLE `property`  (
  `property_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `building_no` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `room_no` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `area` decimal(6, 2) NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`property_id`) USING BTREE,
  INDEX `user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `property_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of property
-- ----------------------------
INSERT INTO `property` VALUES (1, 2, 'A', '101', 89.50, '2025-06-25 19:38:10');
INSERT INTO `property` VALUES (2, 2, 'A', '102', 75.00, '2025-06-25 19:38:10');

-- ----------------------------
-- Table structure for repair
-- ----------------------------
DROP TABLE IF EXISTS `repair`;
CREATE TABLE `repair`  (
  `repair_id` int NOT NULL AUTO_INCREMENT,
  `property_id` int NOT NULL,
  `type` enum('水电','设施','安全','其他') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '其他',
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `image_path` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '本地存储路径',
  `status` enum('待受理','处理中','已完成') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '待受理',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`repair_id`) USING BTREE,
  INDEX `property_id`(`property_id` ASC) USING BTREE,
  CONSTRAINT `repair_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `property` (`property_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of repair
-- ----------------------------
INSERT INTO `repair` VALUES (1, 1, '水电', '卫生间水管漏水', '/uploads/repair1.jpg', '待受理', '2025-06-25 19:38:10', '2025-06-25 19:38:10');
INSERT INTO `repair` VALUES (2, 2, '设施', '电梯故障', NULL, '处理中', '2025-06-25 19:38:10', '2025-06-25 19:38:10');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'BCrypt加密存储',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `role` enum('owner','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'owner',
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '0-禁用, 1-启用',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', '$2a$10$a.GSbtkfFOPSZdwOYmyb6.zgU/hd.7KmsKF1NM0ON5CsK89DFEBYS', '13800138000', 'admin@example.com', 'owner', 1, '2025-06-25 19:38:10');
INSERT INTO `user` VALUES (2, 'user1', '$2a$10$r7vPZ1e7s7J0K0d5V4s0Ee3z7d0kZ5W8cL9x8g3b2d1v5j6h7n8m9', '13900139000', 'user1@example.com', 'admin', 1, '2025-06-25 19:38:10');
INSERT INTO `user` VALUES (3, 'laoli', '$2a$10$a3mAFCCYKkvyAo36Kl/gWuj.EPnYRbLVzT.o7HF2Y8lJpSa.JWo/i', '1234567890', 'test@example.com', 'admin', 0, '2025-06-27 14:14:26');
INSERT INTO `user` VALUES (4, 'laosan', '$2a$10$EYzPoAK7ZrPfn4r1Cb68leEErqztflml2pnJgGm1BNMMOi7vfL3xW', '18777893243', '1111@qq.com', 'owner', 1, '2025-06-28 06:42:23');

SET FOREIGN_KEY_CHECKS = 1;
