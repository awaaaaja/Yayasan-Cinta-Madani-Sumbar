import { supabase } from "./supabase";

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export async function submitContactMessage(payload: ContactPayload) {
  const { data, error } = await supabase
    .from("contact_messages")
    .insert({
      name: payload.name,
      email: payload.email,
      phone: payload.phone || null,
      subject: payload.subject,
      message: payload.message,
      status: "unread",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
