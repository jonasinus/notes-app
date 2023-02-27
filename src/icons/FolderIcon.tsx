export function FolderIcon({ open }: { open: boolean }) {
  if (open)
    return (
      <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
        <path d="M7 40q-1.15 0-2.075-.925Q4 38.15 4 37V11q0-1.15.925-2.075Q5.85 8 7 8h14.05l3 3H41q1.15 0 2.075.925Q44 12.85 44 14H22.75l-3-3H7v26l5.1-20H47l-5.35 20.7q-.3 1.2-1.1 1.75T38.5 40Zm3.15-3h28.6l4.2-17h-28.6Zm0 0 4.2-17-4.2 17ZM7 14v-3 3Z" />
      </svg>
    );
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="48"
      viewBox="0 96 960 960"
      width="48"
    >
      <path d="M141 896q-24 0-42-18.5T81 836V316q0-23 18-41.5t42-18.5h280l60 60h340q23 0 41.5 18.5T881 376v460q0 23-18.5 41.5T821 896H141Zm0-580v520h680V376H456l-60-60H141Zm0 0v520-520Z" />
    </svg>
  );
}
