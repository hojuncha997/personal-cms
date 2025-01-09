import { Container } from '@/components/layouts/Container'          

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            <Container>
                <section className="py-12 bg-white">
                    <h1 className="text-gray-600 text-3xl font-bold mb-8">About</h1>
                    <p className="text-gray-600 text-lg">This is the about page</p>
                </section>
            </Container>
        </div>
    )
}
