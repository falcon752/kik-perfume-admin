// import CategoryItem from "../components/CategoryItem";

const Page500 = () => {
	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-red-500 mb-4'>
					Houston, we have a problem
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					500 - You are not authorized to view this page or something went wrong.
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{Array(6).fill(null).map((_, idx) => (
						<div key={idx} className='h-40 bg-gray-800 rounded-xl animate-pulse'></div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Page500;
