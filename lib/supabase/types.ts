export type Role = "admin" | "partner" | "student";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: Role;
          partner_id: string | null;
          student_id: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      partners: {
        Row: {
          id: string;
          name: string;
          country: string | null;
          contact_name: string | null;
          email: string;
          phone: string | null;
          status: string;
          nominations: number;
          registered_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["partners"]["Row"], "id" | "registered_at">;
        Update: Partial<Database["public"]["Tables"]["partners"]["Insert"]>;
      };
      students: {
        Row: {
          id: string;
          profile_id: string | null;
          partner_id: string | null;
          name_en: string | null;
          name_ko: string | null;
          email: string;
          major: string | null;
          grade: string | null;
          status: string;
          intake: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["students"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["students"]["Insert"]>;
      };
      passport_embeddings: {
        Row: {
          id: string;
          student_id: string;
          passport_number: string | null;
          name_en: string | null;
          birth_date: string | null;
          nationality: string | null;
          expiry_date: string | null;
          gender: string | null;
          raw_text: string | null;
          embedding: number[] | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["passport_embeddings"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["passport_embeddings"]["Insert"]>;
      };
      invitations: {
        Row: {
          id: string;
          email: string;
          role: Role;
          partner_id: string | null;
          student_id: string | null;
          invited_by: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["invitations"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["invitations"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: { role: Role };
  };
}
