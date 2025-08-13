import css from "./App.module.css";
import { Toaster } from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote } from "../../services/noteService";
import type { Note, NotesResponse } from "../../types/note";
import NoteList from "../NoteList/NoteList";
import { useState } from "react";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const perPage = 8;
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<NotesResponse>({
    queryKey: ["notes", currentPage, perPage, search],
    queryFn: () => fetchNotes(currentPage, perPage, search),
    keepPreviousData: true,
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreateNoteSubmit = (newNoteData: {
    title: string;
    content: string;
    tag: Note["tag"];
  }) => {
    createNoteMutation.mutate(newNoteData);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newSearch = (formData.get("search") as string) || "";
    setSearch(newSearch);
    setCurrentPage(1);
  };

  const hasResults = !!data?.notes?.length;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <form onSubmit={handleSearchSubmit} className={css.searchForm}>
          <input
            type="text"
            name="search"
            placeholder="Search notes..."
            defaultValue={search}
          />
          <button type="submit">Search</button>
        </form>
        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>

      {isLoading && <strong className={css.loading}>Loading notes...</strong>}
      {createNoteMutation.isPending && (
        <strong className={css.loading}>Creating note...</strong>
      )}
      {isError && <strong className={css.error}>Error loading notes</strong>}

      {hasResults && (
        <Pagination
          pageCount={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}

      <Toaster position="top-right" />

      {data && !isLoading && <NoteList notes={data.notes ?? []} />}

      {isModalOpen && (
        <Modal onClose={handleCloseModal} onSubmit={handleCreateNoteSubmit} />
      )}
    </div>
  );
}
