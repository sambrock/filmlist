import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/lists/$filmId')({
  component: RouteComponent,
  loader: ({ params }) => {
    console.log(params);
  },
});

const { useParams } = Route;

function RouteComponent() {
  const params = useParams();
  return <div>Hello {params.filmId}</div>;
}
