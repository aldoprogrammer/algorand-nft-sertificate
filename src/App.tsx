import CertificateForm from './components/CertificateForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white text-center py-4 text-2xl font-bold">
        Algorand Certificate Issuer
      </header>
      <CertificateForm />
    </div>
  );
}

export default App;
