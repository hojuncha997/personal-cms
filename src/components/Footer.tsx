import { Container } from '@/components/layouts/Container'
import Link from 'next/link';
import { theme } from '@/constants/styles/theme';

export default function Footer() {
  return (
    // <footer className="bg-black text-white">
    <footer className={`${theme.button.primary.bg} ${theme.button.primary.text}`}>
      <div className="border-t border-gray-800">
        <Container>
          <div className="py-6">
            <p className="text-sm text-center">
              notesandnodes.com
            </p>
          </div>
        </Container>
      </div>
    </footer>
  )
} 