CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`username` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
CREATE TABLE `user_invitation` (
	`id` varchar(36) NOT NULL,
	`inviter_id` varchar(36) NOT NULL,
	`invitee_email` varchar(255) NOT NULL,
	`organization_id` varchar(36) NOT NULL,
	`status` varchar(50) DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_invitation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_organization` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`organization_id` varchar(36) NOT NULL,
	`role` varchar(50) DEFAULT 'member',
	`status` varchar(50) DEFAULT 'pending',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_organization_id` PRIMARY KEY(`id`)
);
