CREATE TABLE `domains` (
	`id` varchar(128) NOT NULL,
	`domain` varchar(255),
	`isVerified` boolean NOT NULL DEFAULT false,
	`tenantId` varchar(128),
	CONSTRAINT `domains_id` PRIMARY KEY(`id`),
	CONSTRAINT `domainIdx` UNIQUE(`domain`)
);
--> statement-breakpoint
ALTER TABLE `blocks` DROP FOREIGN KEY `blocks_pageId_pages_id_fk`;
--> statement-breakpoint
ALTER TABLE `blocks` DROP FOREIGN KEY `blocks_parentId_blocks_id_fk`;
--> statement-breakpoint
ALTER TABLE `blocks` DROP FOREIGN KEY `blocks_blockId_blocks_id_fk`;
--> statement-breakpoint
ALTER TABLE `localizations` DROP FOREIGN KEY `localizations_blockId_blocks_id_fk`;
--> statement-breakpoint
ALTER TABLE `pages` DROP FOREIGN KEY `pages_tenantId_tenants_id_fk`;
--> statement-breakpoint
DROP INDEX `tenantIdIndex` ON `pages`;--> statement-breakpoint
CREATE INDEX `tenantIdIndex` ON `domains` (`tenantId`);--> statement-breakpoint
CREATE INDEX `sortIdx` ON `blocks` (`sort`);--> statement-breakpoint
CREATE INDEX `tenantIdIndex` ON `pages` (`tenantId`);