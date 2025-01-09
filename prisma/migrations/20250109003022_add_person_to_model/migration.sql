/*
  Warnings:

  - Added the required column `person` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "todoID" TEXT NOT NULL,
    "todoContent" TEXT NOT NULL,
    "edit" BOOLEAN NOT NULL DEFAULT false,
    "pw" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "rooms" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "finishTime" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Reservation" ("createdAt", "edit", "finishTime", "id", "pw", "rooms", "startTime", "todoContent", "todoID", "updatedAt") SELECT "createdAt", "edit", "finishTime", "id", "pw", "rooms", "startTime", "todoContent", "todoID", "updatedAt" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
