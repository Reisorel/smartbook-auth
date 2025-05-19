import type { ReactNode } from 'react';
import { Header, Footer, Container } from '../IndexComponents';
import './Layout.scss'; // Ajoutez cette ligne pour importer les styles

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        <Container>
          {children}
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
