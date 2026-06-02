export function generateMetadata({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}