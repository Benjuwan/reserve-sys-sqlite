import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { todoItemType } from "@/app/components/schedule/todoItems/ts/todoItemType";

// PUT
export async function PUT(request: Request) {
    const data: todoItemType = await request.json();

    const id: string = request.url.split('/reservations/')[1];
    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const reservation = await prisma.reservation.update({
        where: {
            id: id,
        },
        data: {
            todoID: data.todoID,
            todoContent: data.todoContent,
            edit: data.edit,
            pw: data.pw,
            person: typeof data.person !== 'undefined' ? data.person : '',
            rooms: typeof data.rooms !== 'undefined' ? data.rooms : '',
            startTime: typeof data.startTime !== 'undefined' ? data.startTime : '',
            finishTime: typeof data.finishTime !== 'undefined' ? data.finishTime : '',
        },
    });

    return NextResponse.json(reservation);
}

// DELETE
export async function DELETE(request: Request) {
    const id: string = request.url.split('/reservations/')[1];
    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.reservation.delete({
        where: {
            id: id,
        },
    });

    return NextResponse.json({ message: 'Deleted successfully' });
}