import axios from "axios";
import type { Note, NoteId } from "../types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${
  import.meta.env.VITE_NOTEHUB_TOKEN
}`;

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  perPage: number,
  search?: string
): Promise<NotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;

  const { data } = await axios.get<NotesResponse>("/notes", { params });
  return data;
};

// Створити нотатку
export const createNote = async (
  newNote: Omit<Note, "id" | "createdAt" | "updatedAt">
) => {
  const { data } = await axios.post<Note>("/notes", newNote);
  return data;
};

// Видалити нотатку
export const deleteNote = async (noteId: NoteId) => {
  await axios.delete(`/notes/${noteId}`);
};

// Оновити нотатку
export const updateNote = async (
  noteId: NoteId,
  updatedFields: Partial<Note>
) => {
  const { data } = await axios.patch<Note>(`/notes/${noteId}`, updatedFields);
  return data;
};
