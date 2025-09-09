'use client';

import { useClientStore } from '@/providers/client-store-provider';
import { Modal, ModalContent, ModalDescription, ModalPortal, ModalTitle } from '../common/modal';
import { MovieDetailsView } from '../views/movie-details-view';

export const ChatMovieDetailsModal = () => {
  const { isActive, movieId } = useClientStore((store) => store.movieModal);
  const dispatch = useClientStore((store) => store.dispatch);

  if (!isActive || !movieId) {
    return null;
  }
  return (
    <Modal
      open={isActive}
      onOpenChange={(open) => !open && dispatch({ type: 'MOVIE_MODAL_CLOSE', payload: undefined })}
    >
      <ModalPortal>
        <ModalContent variant="wide">
          <ModalTitle className="sr-only">Movie details</ModalTitle>
          <ModalDescription className="sr-only">Movie details</ModalDescription>

          <MovieDetailsView movieId={movieId} />
        </ModalContent>
      </ModalPortal>
    </Modal>
  );
};
