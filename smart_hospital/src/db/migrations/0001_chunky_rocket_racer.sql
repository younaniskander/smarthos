CREATE TABLE `analysisResults` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` int NOT NULL,
	`doctorId` int NOT NULL,
	`analysisType` enum('brain_tumor','chest_disease','bone_fracture','lung_cancer') NOT NULL,
	`diagnosis` text NOT NULL,
	`confidenceScore` decimal(5,4) NOT NULL,
	`imageUrl` text,
	`riskFactors` text,
	`modelOutput` text,
	`notes` text,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `analysisResults_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `boneFractureAnalysis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`analysisResultId` int NOT NULL,
	`boneType` varchar(255),
	`fractureType` varchar(255),
	`fractureLocation` varchar(255),
	`complexity` enum('simple','compound','comminuted'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `boneFractureAnalysis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `brainTumorAnalysis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`analysisResultId` int NOT NULL,
	`tumorType` varchar(255),
	`tumorLocation` varchar(255),
	`tumorSize` varchar(100),
	`malignancyScore` decimal(5,4),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `brainTumorAnalysis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chestDiseaseAnalysis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`analysisResultId` int NOT NULL,
	`diseaseType` varchar(255),
	`affectedArea` varchar(255),
	`severity` enum('mild','moderate','severe'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chestDiseaseAnalysis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lungCancerAnalysis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`analysisResultId` int NOT NULL,
	`smokingStatus` enum('never','former','current'),
	`packYears` int,
	`age` int,
	`familyHistory` boolean DEFAULT false,
	`exposureHistory` text,
	`riskScore` decimal(5,4),
	`cancerProbability` decimal(5,4),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lungCancerAnalysis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`patientId` varchar(64) NOT NULL,
	`firstName` varchar(255) NOT NULL,
	`lastName` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`dateOfBirth` timestamp,
	`gender` enum('male','female','other'),
	`medicalHistory` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patients_id` PRIMARY KEY(`id`),
	CONSTRAINT `patients_patientId_unique` UNIQUE(`patientId`)
);
