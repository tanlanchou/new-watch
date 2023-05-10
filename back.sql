-- social_watch.history definition

CREATE TABLE `history` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `index` int NOT NULL DEFAULT '0' COMMENT '索引',
  `user_id` varchar(50) NOT NULL COMMENT '用户ID',
  `task_type` int NOT NULL COMMENT '任务类型',
  `content` text COMMENT '内容',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='历史记录表';


-- social_watch.task_queue definition

CREATE TABLE `task_queue` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `task_type` int NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `other_params` varchar(255) DEFAULT NULL,
  `create_time` datetime NOT NULL,
  `execute_time` datetime DEFAULT NULL,
  `execute_status` int NOT NULL DEFAULT '0',
  `execute_result` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- social_watch.user_info definition

CREATE TABLE `user_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL COMMENT '邮箱',
  `password` varchar(32) NOT NULL COMMENT '密码（MD5）',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '状态：1.正常，2.禁用，3.删除',
  `user_type` tinyint NOT NULL DEFAULT '1' COMMENT '用户类型：1.普通用户，2.VIP，3.特殊用户',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户信息表';


-- social_watch.user_monitor definition

CREATE TABLE `user_monitor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) NOT NULL,
  `local_user_id` int NOT NULL,
  `task_type` int NOT NULL,
  `last_executed` datetime DEFAULT NULL,
  `interval_time` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;