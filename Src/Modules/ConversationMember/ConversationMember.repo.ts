import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { and, desc, eq, getTableColumns, inArray, lt, or, SQL } from "drizzle-orm";
import { conversation_members } from "../../Database/schemas/conversation_members.Schema";
import { VConversationMember } from "./conversationMember.validator";
import { db } from "../../Database";
import { users } from "../../Database/schemas/users.Schema";
import { ICursor } from "../../Interfaces/ICursor";

class ConversationMember {
    public async create(tx: NodePgDatabase, data: { conversationId: string, userId: string }[]) {
        console.log(data)
        return (
            await tx
                .insert(conversation_members)
                .values(data)
                .returning()
        )[0]

    }
    public async query(data: VConversationMember.conversationId & Omit<VConversationMember.query, "cursor"> & ICursor.query) {
        const _query: SQL[] = [eq(conversation_members.conversationId, data.conversationId)]
        if (data.cursor) {
            _query.push(or(
                lt(conversation_members.joinedAt, data.cursor.createdAt),
                and(
                    eq(conversation_members.joinedAt, data.cursor.createdAt),
                    lt(conversation_members.id, data.cursor.id)
                )
            )!
            )
        }
        return await db
            .select(
                {
                    ...getTableColumns(conversation_members),
                    user: { id: users.id, name: users.fullName, profile: users.profile }
                }
            )
            .from(conversation_members)
            .innerJoin(
                users,
                eq(conversation_members.userId, users.id)
            )
            .where(
                and(..._query)
            )
            .orderBy(
                desc(conversation_members.joinedAt),
                desc(conversation_members.id)
            )
            .limit(data.limit + 1)
    }
    public async remove(data: VConversationMember.update) {
        return (
            await
                db
                    .delete(conversation_members)
                    .where(inArray(conversation_members.userId, data.participants))
                    .returning()
        )[0] ?? null;
    }
}
export default new ConversationMember()