export default function DashboardLoading() {
  return (
    <div className='flex flex-1 animate-pulse flex-col gap-6 px-5 pt-8 pb-10 md:px-10'>
      <div className='flex items-start justify-between'>
        <div>
          <div className='bg-muted h-8 w-40 rounded-lg' />
          <div className='bg-muted mt-2 h-4 w-64 rounded' />
        </div>
      </div>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {[...Array(6)].map((_, i) => (
          <div key={i} className='bg-muted h-28 rounded-xl' />
        ))}
      </div>
    </div>
  );
}
