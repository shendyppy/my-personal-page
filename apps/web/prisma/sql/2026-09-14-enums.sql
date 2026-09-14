-- Converts Skill.category and Experience.employmentType from text to Postgres enums
-- in place. `prisma db push` would drop and re-add both columns (losing data), so
-- cast with USING instead. One transaction: any value outside the enum rolls it all back.
-- Run once: npx prisma db execute --file prisma/sql/2026-09-14-enums.sql

BEGIN;

CREATE TYPE "EmploymentType" AS ENUM ('Full Time', 'Part Time', 'Contract', 'Freelance', 'Internship');
CREATE TYPE "SkillCategory" AS ENUM ('Frontend', 'Backend', 'Database', 'DevOps', 'AI', 'Project Management');

ALTER TABLE "Experience"
  ALTER COLUMN "employmentType" DROP DEFAULT,
  ALTER COLUMN "employmentType" TYPE "EmploymentType" USING "employmentType"::"EmploymentType",
  ALTER COLUMN "employmentType" SET DEFAULT 'Full Time';

ALTER TABLE "Skill"
  ALTER COLUMN "category" TYPE "SkillCategory" USING "category"::"SkillCategory";

COMMIT;
