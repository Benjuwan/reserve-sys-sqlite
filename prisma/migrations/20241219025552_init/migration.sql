-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "todoID" TEXT NOT NULL,
    "todoContent" TEXT NOT NULL,
    "edit" BOOLEAN NOT NULL DEFAULT false,
    "pw" TEXT NOT NULL,
    "rooms" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "finishTime" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
