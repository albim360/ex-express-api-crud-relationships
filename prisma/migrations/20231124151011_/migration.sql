-- AlterTable
ALTER TABLE `category` ADD COLUMN `published` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `tag` ADD COLUMN `published` BOOLEAN NOT NULL DEFAULT false;
