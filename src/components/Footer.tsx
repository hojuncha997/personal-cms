import { Container } from '@/components/layouts/Container'
import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="border-t border-gray-800">
        <Container>
          <div className="py-6">
            <p className="text-sm text-center">
              © 2024 Your Company Name. All rights reserved.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  )
} 