import { useState, useEffect } from "react";
import css from "./App.module.css";
import { Toaster } from "react-hot-toast";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { fetchNotes, createNote } from "../../services/noteService";
import type { Note } from "../../types/note";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import SearchBox from "../SearchBox/SearchBox";
import Loader from "../Loader/loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import NoteForm from "../NoteForm/NoteForm";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  const perPage = 8;
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["notes", currentPage, perPage, search],
    queryFn: () => fetchNotes(currentPage, perPage, search),
    placeholderData: keepPreviousData,
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

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const hasResults = !!data?.notes?.length;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={setSearchInput} />
        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>
      <main className="notes-list">
        {isLoading && (
          <div className={css.loaderWrapper}>
            <Loader />
          </div>
        )}

        {createNoteMutation.isPending && (
          <strong className={css.loading}>Creating note...</strong>
        )}

        {isError && <ErrorMessage message="Error loading notes" />}

        {isFetching && !isLoading && (
          <div className={css.loaderInline}>
            <Loader />
            <span>Updating notes...</span>
          </div>
        )}

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
          <Modal onClose={handleCloseModal}>
            <NoteForm onSubmit={handleCreateNoteSubmit} />
          </Modal>
        )}
      </main>
    </div>
  );
}
