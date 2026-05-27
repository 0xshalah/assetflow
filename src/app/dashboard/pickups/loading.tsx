export default function PickupsLoading() {
  return (
    <div className='flex flex-1 animate-pulse flex-col gap-6 px-5 pt-8 pb-10 md:px-10'>
      <div>
        <div className='bg-muted h-8 w-44 rounded-lg' />
        <div className='bg-muted mt-2 h-4 w-72 rounded' />
      </div>
      <div className='bg-muted h-10 w-72 rounded-lg' />
      <div className='bg-muted h-64 rounded-lg' />
    </div>
  );
}
