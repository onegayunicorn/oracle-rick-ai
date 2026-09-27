import { getDB } from '../db';
export async function saveConversation(conv: any) { return getDB().put('conversations', conv); }
export async function listConversations() { return getDB().getAll('conversations'); }
