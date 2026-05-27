export default function InventoryLoading() {
  return (
    <div className='flex flex-1 animate-pulse flex-col gap-6 px-5 pt-8 pb-10 md:px-10'>
      <div className='flex items-start justify-between'>
        <div>
          <div className='bg-muted h-8 w-32 rounded-lg' />
          <div className='bg-muted mt-2 h-4 w-56 rounded' />
        </div>
        <div className='bg-muted h-9 w-32 rounded-full' />
      </div>
      <div className='bg-muted h-64 rounded-lg' />
    </div>
  );
}
