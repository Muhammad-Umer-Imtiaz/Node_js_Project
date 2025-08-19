import ToolDetailClient from "./newToolDetailClient";

export default async function ProductDetail(props: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  console.log("the id is ", id)
  console.log('the saerch params is ', id)
  return (
    <ToolDetailClient 
      slug={id} 
      searchParams={searchParams}
    />
  );
}