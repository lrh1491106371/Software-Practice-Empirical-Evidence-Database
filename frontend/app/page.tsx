import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Software Practice Empirical Evidence Database
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          A searchable platform that makes academic research findings on SE practices 
          easily accessible and analyzable for students, researchers, and practitioners.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/search"
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            Search Articles
          </Link>
          <Link
            href="/submit"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Submit Article
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Search</h2>
          <p className="text-gray-600">
            Search through a comprehensive database of empirical evidence on 
            Software Engineering practices.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Submit</h2>
          <p className="text-gray-600">
            Contribute to the database by submitting articles with their 
            bibliographic information.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Analyze</h2>
          <p className="text-gray-600">
            Extract and document empirical evidence from approved articles 
            for better accessibility.
          </p>
        </div>
      </div>
    </div>
  )
}

